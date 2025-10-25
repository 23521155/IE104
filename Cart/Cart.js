document.addEventListener('DOMContentLoaded', async () => {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.remove('hidden');

    await lottie.loadAnimation({
        container: document.getElementById('loading-animation'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '../animations/Grocery.json' // ✅ đường dẫn đúng
    });
    await lottie.loadAnimation({
        container: document.getElementById('loading-animation-ellipsis'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '../animations/Loading.json'
    });

    const cartProducts = document.querySelector('.cart-products');
    const cartTotal = document.querySelector('.cart-total');
    const accessToken = localStorage.getItem('accessToken');

    const res = await fetch(`http://localhost:1234/v1/cart/get-cartt`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    });

    setTimeout(()=> {loadingOverlay.classList.add('hidden');},1000)

    const cart = await res.json();
    const products = cart.cartItems;
    cart.totalPrice = 0;

    cartProducts.innerHTML = `
        <div class="cart-products-header">
            <p>Product</p>
            <p>Quantity</p>
            <p>Total</p>
        </div>
        ${products.map((product) => {
        const savedQty = localStorage.getItem(`qty_${product._id}`) || 1;
        const totalPrice = product.price * savedQty;
        cart.totalPrice += totalPrice;
        return `
                <div class="cart-product" data-id='${product._id}'>
                    <div class="cart-product-details">
                        <img src="${product.images[0].url}" alt="">
                        <div class="info">
                            <div class="product-price">${'$' + product.price}</div>
                            <div class="name">${product.name}</div>
                            <div class="length">Length: ${product.length + '″'}</div>
                            <div class="trash"><i class="fa-solid fa-trash"></i></div>
                        </div>
                    </div>
                    <div class="quantity-control">
                        <button class="qty-decrease">-</button>
                        <input type="number" class="qty-input" min="1" value="${savedQty}">
                        <button class="qty-increase">+</button>
                    </div>
                    <div class="product-total-price">${'$' + totalPrice.toFixed(2)}</div>
                </div>
            `;
    }).join('')}
    `;

    cartTotal.innerHTML = `
        <p class="total">Total</p>
        <p class="total-price">${'$' + cart.totalPrice.toFixed(2)}</p>
        <p class="total-ship">Shipping:+$3</p>
        <p class="total-voucher">Voucher -$1</p>
        <div class="checkout-button">
            CheckOut ${'$' + (cart.totalPrice + 3 - 1).toFixed(2)}
        </div>
    `;

    // Lắng nghe click và input
    cartProducts.addEventListener('click', handleCartInteraction);
    cartProducts.addEventListener('input', handleCartInteraction);
    cartProducts.addEventListener('blur', handleCartBlur, true);

    function handleCartInteraction(e) {
        const productEl = e.target.closest('.cart-product');
        if (!productEl) return;

        const qtyInput = productEl.querySelector('.qty-input');
        const productPrice = parseFloat(productEl.querySelector('.product-price').textContent.replace('$', ''));
        const productTotalEl = productEl.querySelector('.product-total-price');
        const productId = productEl.dataset.id;

        // Xóa sản phẩm
        if (e.target.closest('.trash')) {
            deleteProduct(productId);
            return;
        }

        // Tăng giảm số lượng
        if (e.target.closest('.qty-decrease')) {
            let currentQty = parseInt(qtyInput.value);
            if (currentQty > 1) currentQty--;
            qtyInput.value = currentQty;
        } else if (e.target.closest('.qty-increase')) {
            let currentQty = parseInt(qtyInput.value);
            qtyInput.value = currentQty + 1;
        }

        // Khi người dùng nhập trực tiếp
        if (e.target.classList.contains('qty-input')) {
            let currentQty = parseInt(qtyInput.value);
            // Cho phép xóa trắng tạm thời (sẽ xử lý khi blur)
            if (qtyInput.value === '') return;
            if (isNaN(currentQty) || currentQty < 1) currentQty = 1;
            qtyInput.value = currentQty;
        }

        updateItemTotal(qtyInput, productPrice, productTotalEl, productId);
        if(e.target.tagName === 'IMG') {
            const product = products.find(product => product._id === productId);
            sessionStorage.setItem('product', JSON.stringify(product));
            window.location.href = `../Production/Production.html?id=${product._id}`;
        }
    }

    // Khi người dùng rời khỏi ô input (blur event)
    function handleCartBlur(e) {
        if (e.target.classList.contains('qty-input')) {
            const qtyInput = e.target;
            const productEl = qtyInput.closest('.cart-product');
            const productPrice = parseFloat(productEl.querySelector('.product-price').textContent.replace('$', ''));
            const productTotalEl = productEl.querySelector('.product-total-price');
            const productId = productEl.dataset.id;

            // Nếu để trống -> trả lại 1
            if (qtyInput.value === '' || parseInt(qtyInput.value) < 1) {
                qtyInput.value = 1;
            }

            updateItemTotal(qtyInput, productPrice, productTotalEl, productId);
        }
    }

    function updateItemTotal(qtyInput, price, productTotalEl, productId) {
        const newQty = parseInt(qtyInput.value);
        localStorage.setItem(`qty_${productId}`, newQty);

        const newProductTotal = price * newQty;
        productTotalEl.textContent = '$' + newProductTotal.toFixed(2);

        updateCartTotal();
    }

    async function deleteProduct(productId) {
        const res = await fetch(`http://localhost:1234/v1/cart/delete-cartProduct/${productId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        if (res.ok) {
            localStorage.removeItem(`qty_${productId}`);
            window.location.reload();
        }
    }

    function updateCartTotal() {
        const productTotals = document.querySelectorAll('.product-total-price');
        let total = 0;
        productTotals.forEach(el => {
            total += parseFloat(el.textContent.replace('$', ''));
        });

        const shipping = 3;
        const voucher = 1;
        const finalTotal = total + shipping - voucher;

        const totalPriceEl = document.querySelector('.total-price');
        const checkoutButton = document.querySelector('.checkout-button');

        totalPriceEl.textContent = '$' + total.toFixed(2);
        checkoutButton.textContent = `CheckOut $${finalTotal.toFixed(2)}`;
    }
});
