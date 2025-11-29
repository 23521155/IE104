import {showToast, translateText} from "../Global.js";
import {API_CONFIG} from "../apiConfig.js";

document.addEventListener("DOMContentLoaded", async () => {
    // Animation loading
    const loadingOverlay = document.getElementById("loading-overlay");
    loadingOverlay.classList.remove("hidden");

    await lottie.loadAnimation({
        container: document.getElementById("loading-animation"),
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "../animations/Sale.json",
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
    const res = await fetch(`${API_CONFIG.DEPLOY_URL}/cart/get-cartt`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const cart = await res.json();

    // Stop loading animation after call api
    loadingOverlay.classList.add("hidden");

    // Get status of language from localStorage
    const storedLang = localStorage.getItem("selectedLang");
    const lang = storedLang ? JSON.parse(storedLang).lang.toLowerCase() : "en";
    const EXCHANGE_USD_TO_VND = 26328;

    // Title + breadcrumb
    const p = lang === "vi" ? "Giỏ hàng" : "Cart";
    const home = await translateText("Home", lang);
    cartTitle.innerHTML = `<i class="fa-solid fa-cart-shopping"></i><p>${p}</p>`;
    homeCart.innerHTML = `
      <a href="../Home/Home.html">${home}</a>
      <p>/</p>
      <a href="">${p}</a>
  `;

    // Render productions
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
                product.length + "″" }</div>
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

    //  Update cart the first time
    updateCartTotal();

    cartProducts.addEventListener("click", handleCartInteraction);
    cartProducts.addEventListener("input", handleCartInteraction);
    cartProducts.addEventListener("blur", handleCartBlur, true);

    // Handles all interactions within the cart
    function handleCartInteraction(e) {
        const productEl = e.target.closest(".cart-product");
        if (!productEl) return;

        const qtyInput = productEl.querySelector(".qty-input");
        const productId = productEl.dataset.id;
        const basePrice = parseFloat(productEl.dataset.price); // Original USD price
        let currentQty = parseInt(qtyInput.value) || 1;

        // Handle delete button click
        if (e.target.closest(".trash")) return deleteProduct(productId);

        // Increase/decrease quantity
        if (e.target.closest(".qty-decrease")) currentQty = Math.max(1, currentQty - 1);
        if (e.target.closest(".qty-increase")) currentQty = Math.min(100, currentQty + 1);

        // Update quantity input and save productId to localStorage
        if(currentQty > 100) currentQty = 100
        qtyInput.value = currentQty;
        localStorage.setItem(`qty_${productId}`, currentQty);

        // Recalculate item and cart totals
        updateItemTotal(productEl, basePrice, currentQty);
        updateCartTotal();

        // Click image -> view product details
        if (e.target.tagName === "IMG") {
            const product = products.find((p) => p._id === productId);
            sessionStorage.setItem("product", JSON.stringify(product));
            window.location.href = `../Production/Production.html?id=${product._id}`;
        }
    }

    // Handles blur event on quantity input to validate and update quantity
    function handleCartBlur(e) {
        if (e.target.classList.contains("qty-input")) {
            const productEl = e.target.closest(".cart-product");
            const productId = productEl.dataset.id;
            const basePrice = parseFloat(productEl.dataset.price);
            let qty = parseInt(e.target.value);

            // Validate quantity (minimum 1) (maximum 100)
            if (isNaN(qty) || qty < 1) qty = 1;
            if (qty > 100) qty = 100;

            // Update input value and localStorage
            e.target.value = qty;
            localStorage.setItem(`qty_${productId}`, qty);

            // Update input value and localStorage
            updateItemTotal(productEl, basePrice, qty);
            updateCartTotal();
        }
    }

    // Updates the total price display for a single cart item
    function updateItemTotal(productEl, basePrice, qty) {
        const productTotalEl = productEl.querySelector(".product-total-price");
        const totalUSD = basePrice * qty;

        // Display price in Vietnamese Dong or USD based on language setting
        if (lang === "vi") {
            productTotalEl.textContent = `${(totalUSD * EXCHANGE_USD_TO_VND).toLocaleString(
                "vi-VN"
            )} ₫`;
        } else {
            productTotalEl.textContent = `$${totalUSD.toFixed(2)}`;
        }
    }

    // Deletes a product from the cart via API call
    async function deleteProduct(productId) {
        const res = await fetch(
            `${API_CONFIG.DEPLOY_URL}/cart/delete-cartProduct/${productId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        );

        // If deletion successful, remove from localStorage and reload page
        if (res.ok) {
            localStorage.removeItem(`qty_${productId}`);
            window.location.reload();
        }
    }

    // Calculates and updates the total cart price including shipping and voucher
    async function updateCartTotal() {
        const productEls = document.querySelectorAll(".cart-product");
        let totalUSD = 0;

        // Calculate subtotal from all cart items
        productEls.forEach((el) => {
            const price = parseFloat(el.dataset.price);
            const qty = parseInt(el.querySelector(".qty-input").value) || 1;
            totalUSD += price * qty;
        });

        // Set shipping and voucher fees
        let shippingUSD = 3;
        let voucherUSD = 1;

        // If cart is empty, no shipping or voucher
        if( cart.cartItems.length === 0) {
            shippingUSD = 0
            voucherUSD = 0
        }

        // Calculate VND equivalents
        const shippingVN = shippingUSD * EXCHANGE_USD_TO_VND;
        const voucherVN = voucherUSD * EXCHANGE_USD_TO_VND

        // Calculate final totals in both currencies
        const finalTotalUSD = '$' + (totalUSD + shippingUSD - voucherUSD).toLocaleString(
            "en-US",{ minimumFractionDigits: 2 });
        const finalTotalVN = ((totalUSD + shippingUSD - voucherUSD) * EXCHANGE_USD_TO_VND).toLocaleString("vi-VN") + '₫';

        // Format shipping and voucher based on language
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

        // Format cart subtotal
        let formattedCartTotal;
        if (lang === "vi") {
            formattedCartTotal = `${(totalUSD * EXCHANGE_USD_TO_VND).toLocaleString("vi-VN")} ₫`;
        } else {
            formattedCartTotal = `$${totalUSD.toFixed(2)}`;
        }

        // Update cart total HTML display
        cartTotal.innerHTML = `
      <p class="total">${lang === "vi" ? "Tổng cộng" : "Total"}</p>
      <p class="total-price">${formattedCartTotal}</p>
      <p class="total-ship">${lang === "vi" ? "Phí ship" : "Shipping"}: ${finalShipping}</p>
      <p class="total-voucher">Voucher: ${finalVoucher}</p>
      <div class="checkout-button">
       ${lang === 'vi' ? `Thanh Toán` : 'CheckOut'} ${finalTotal}
      </div>
    `;
        const totalCartUpdate = totalUSD + shippingUSD - voucherUSD;

        // Update cart total on backend
        await fetch(`${API_CONFIG.DEPLOY_URL}/cart/update`,{
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cartId: cart._id,
                updateData :{ totalPrice: totalCartUpdate }
    }),
        })
    }

    // Handles checkout button click event
    cartTotal.addEventListener("click", async (e) => {
        if (e.target.closest(".checkout-button")) {

            const checkoutBtn = e.target.closest(".checkout-button");

            // Prevent multiple clicks during processing
            if (checkoutBtn.disabled) return;
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = '0.6';
            checkoutBtn.style.cursor = 'not-allowed';

            // Fetch current cart data
            const res = await fetch(`${API_CONFIG.DEPLOY_URL}/cart/get-cartt`, {
                method: "GET",
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const cart = await res.json();

            // Fetch user information
            const result = await fetch(`${API_CONFIG.DEPLOY_URL}/users/`, {
                method: "GET",
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const user = await result.json();

            // Validate user has required information (address and phone)
            if(!user.address || !user.phoneNumber) {
                showToast('You need your information','error');
                setTimeout(() => { window.location.href = "../User/User.html" }, 1000);
                return;
            }

            // Process order if cart has items
            if(cart.cartItems.length)
            {
                const result =  await fetch(`${API_CONFIG.DEPLOY_URL}/order/`, {
                    method: "POST",

                    headers:{ Authorization: `Bearer ${accessToken}`,"Content-Type": "application/json"},
                    body: JSON.stringify({
                        userId: cart.userId,
                        totalPrice: cart.totalPrice,
                        orderItems: cart.cartItems,
                    })
                })

                if(result.ok){
                    const noti = await translateText('You have successfully paid',lang)
                    const result = await fetch(`${API_CONFIG.DEPLOY_URL}/cart/update`, {
                        method: "PATCH",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            cartId: cart._id,
                            updateData :{ totalPrice: 0 , cartItems: [] }
                        }),
                    })
                    showToast(noti,"success")
                    // Redirect to user page after successful checkout
                    if(result.ok){
                        setTimeout(()=>{
                            window.location.href = '../User/User.html'
                        },1000)
                    }
                }
            }
            else
            {
                // Show error if cart is empty
                const noti = await translateText('You don\'t have any products in cart',lang)
                showToast(noti,"error")
            }

        }
    });
});
