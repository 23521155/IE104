import { translateText } from "../Global.js";

document.addEventListener("DOMContentLoaded", async () => {
    const loadingOverlay = document.getElementById("loading-overlay");
    loadingOverlay.classList.remove("hidden");

    // Animation loading
    await lottie.loadAnimation({
        container: document.getElementById("loading-animation"),
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "../animations/Grocery.json",
    });
    await lottie.loadAnimation({
        container: document.getElementById("loading-animation-ellipsis"),
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "../animations/Loading.json",
    });

    // DOM elements
    const cartProducts = document.querySelector(".cart-products");
    const cartTitle = document.querySelector(".title-cart");
    const homeCart = document.querySelector(".home-cart");
    const cartTotal = document.querySelector(".cart-total");
    const accessToken = localStorage.getItem("accessToken");

    // Fetch cart
    const res = await fetch(`http://localhost:1234/v1/cart/get-cartt`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const cart = await res.json();

    setTimeout(() => {
        loadingOverlay.classList.add("hidden");
    }, 1000);

    // Ngôn ngữ
    const storedLang = localStorage.getItem("selectedLang");
    const lang = storedLang ? JSON.parse(storedLang).lang.toLowerCase() : "en";
    const EXCHANGE_USD_TO_VND = 26328;

    // Title + breadcrumb
    const p = lang === "vi" ? "Giỏ hàng" : "Cart";
    const home = await translateText("Home", lang);
    cartTitle.innerHTML = `<i class="fa-solid fa-cart-shopping"></i><p>${p}</p>`;
    homeCart.innerHTML = `
      <a href="../../IE104/Home/Home.html">${home}</a>
      <p>/</p>
      <a href="">${p}</a>
  `;

    // Render sản phẩm
    const products = cart.cartItems || [];
    cartProducts.innerHTML = `
    <div class="cart-products-header">
      <p>${lang === "vi" ? "Sản phẩm" : "Product"}</p>
      <p>${lang === "vi" ? "Số lượng" : "Quantity"}</p>
      <p>${lang === "vi" ? "Tổng" : "Total"}</p>
    </div>
    ${products
        .map((product) => {
            const savedQty = parseInt(localStorage.getItem(`qty_${product._id}`)) || 1;
            const totalUSD = product.price * savedQty;

            const displayPrice =
                lang === "vi"
                    ? `${(product.price * EXCHANGE_USD_TO_VND).toLocaleString("vi-VN")} ₫`
                    : `$${product.price.toFixed(2)}`;

            const displayTotal =
                lang === "vi"
                    ? `${(totalUSD * EXCHANGE_USD_TO_VND).toLocaleString("vi-VN")} ₫`
                    : `$${totalUSD.toFixed(2)}`;

            return `
          <div class="cart-product" data-id="${product._id}" data-price="${product.price}">
            <div class="cart-product-details">
              <img src="${product?.images?.[0]?.url}" alt="">
              <div class="info">
                <div class="product-price">${displayPrice}</div>
                <div class="name">${product.name}</div>
                <div class="length">${lang === "vi" ? "Chiều dài" : "Length"}: ${
                product.length + "″"
            }</div>
                <div class="trash"><i class="fa-solid fa-trash"></i></div>
              </div>
            </div>
            <div class="quantity-control">
              <button class="qty-decrease">-</button>
              <input type="number" class="qty-input" min="1" value="${savedQty}">
              <button class="qty-increase">+</button>
            </div>
            <div class="product-total-price">${displayTotal}</div>
          </div>
        `;
        })
        .join("")}
  `;

    // === Cập nhật tổng giỏ hàng ban đầu ===
    updateCartTotal();

    // Lắng nghe sự kiện click và input
    cartProducts.addEventListener("click", handleCartInteraction);
    cartProducts.addEventListener("input", handleCartInteraction);
    cartProducts.addEventListener("blur", handleCartBlur, true);

    function handleCartInteraction(e) {
        const productEl = e.target.closest(".cart-product");
        if (!productEl) return;

        const qtyInput = productEl.querySelector(".qty-input");
        const productId = productEl.dataset.id;
        const basePrice = parseFloat(productEl.dataset.price); // giá USD gốc
        let currentQty = parseInt(qtyInput.value) || 1;

        // Xử lý nút xóa
        if (e.target.closest(".trash")) return deleteProduct(productId);

        // Tăng/giảm số lượng
        if (e.target.closest(".qty-decrease")) currentQty = Math.max(1, currentQty - 1);
        if (e.target.closest(".qty-increase")) currentQty += 1;

        qtyInput.value = currentQty;
        localStorage.setItem(`qty_${productId}`, currentQty);

        updateItemTotal(productEl, basePrice, currentQty);
        updateCartTotal();

        // Click ảnh -> xem sản phẩm
        if (e.target.tagName === "IMG") {
            const product = products.find((p) => p._id === productId);
            sessionStorage.setItem("product", JSON.stringify(product));
            window.location.href = `../Production/Production.html?id=${product._id}`;
        }
    }

    function handleCartBlur(e) {
        if (e.target.classList.contains("qty-input")) {
            const productEl = e.target.closest(".cart-product");
            const productId = productEl.dataset.id;
            const basePrice = parseFloat(productEl.dataset.price);
            let qty = parseInt(e.target.value);
            if (isNaN(qty) || qty < 1) qty = 1;
            e.target.value = qty;
            localStorage.setItem(`qty_${productId}`, qty);
            updateItemTotal(productEl, basePrice, qty);
            updateCartTotal();
        }
    }

    function updateItemTotal(productEl, basePrice, qty) {
        const productTotalEl = productEl.querySelector(".product-total-price");
        const totalUSD = basePrice * qty;

        if (lang === "vi") {
            productTotalEl.textContent = `${(totalUSD * EXCHANGE_USD_TO_VND).toLocaleString(
                "vi-VN"
            )} ₫`;
        } else {
            productTotalEl.textContent = `$${totalUSD.toFixed(2)}`;
        }
    }

    async function deleteProduct(productId) {
        const res = await fetch(
            `http://localhost:1234/v1/cart/delete-cartProduct/${productId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        );
        if (res.ok) {
            localStorage.removeItem(`qty_${productId}`);
            window.location.reload();
        }
    }

    function updateCartTotal() {
        const productEls = document.querySelectorAll(".cart-product");
        let totalUSD = 0;

        productEls.forEach((el) => {
            const price = parseFloat(el.dataset.price);
            const qty = parseInt(el.querySelector(".qty-input").value) || 1;
            totalUSD += price * qty;
        });

        const shippingUSD = 3;
        const voucherUSD = 1;
        const shippingVN = shippingUSD * EXCHANGE_USD_TO_VND;
        const voucherVN = voucherUSD * EXCHANGE_USD_TO_VND
        const finalTotalUSD = '$' + (totalUSD + shippingUSD - voucherUSD).toLocaleString(
            "en-US",{ minimumFractionDigits: 2 });
        const finalTotalVN = ((totalUSD + shippingUSD - voucherUSD) * EXCHANGE_USD_TO_VND).toLocaleString("vi-VN") + '₫';
        let finalShipping;
        let finalVoucher;
        let finalTotal
        if(lang ==='vi'){
            finalTotal = finalTotalVN
            finalShipping = '+' + shippingVN.toLocaleString("vi-VN") + '₫';
            finalVoucher = '-' + voucherVN.toLocaleString("vi-VN") + '₫';
        }
        else if (lang ==='en'){
            finalTotal = finalTotalUSD
            finalShipping = '+$' + shippingUSD.toLocaleString("en-US",{ minimumFractionDigits: 2 });
            finalVoucher = '-$' + voucherUSD.toLocaleString("en-US",{ minimumFractionDigits: 2 });
        }
        let formattedCartTotal;
        if (lang === "vi") {
            formattedCartTotal = `${(totalUSD * EXCHANGE_USD_TO_VND).toLocaleString("vi-VN")} ₫`;
        } else {
            formattedCartTotal = `$${totalUSD.toFixed(2)}`;
        }

        cartTotal.innerHTML = `
      <p class="total">${lang === "vi" ? "Tổng cộng" : "Total"}</p>
      <p class="total-price">${formattedCartTotal}</p>
      <p class="total-ship">${lang === "vi" ? "Phí ship" : "Shipping"}: ${finalShipping}</p>
      <p class="total-voucher">Voucher: ${finalVoucher}</p>
      <div class="checkout-button">
       ${lang === 'vi' ? `Thanh Toán` : 'CheckOut'} ${finalTotal}
      </div>
    `;
    }
});
