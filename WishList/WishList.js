const showToastttt = (message, type = "success") => {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    // Icon tùy loại
    const icons = {
        success: "✅",
        error: "❌",
        info: "ℹ️",
        warning: "⚠️"
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || ""}</span>
        <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    // Hiện
    setTimeout(() => toast.classList.add("show"), 10);

    // Tự ẩn sau 3 giây
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

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

    const rowWishList = document.querySelector('.row-wishlist');
    const accessToken = localStorage.getItem('accessToken');
    const res = await fetch(`http://localhost:1234/v1/wishlist/get-wishList`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    });
    setTimeout(()=> {loadingOverlay.classList.add('hidden');},1000)

    const wishList = await res.json();
    const products = wishList.wishListItems;
    rowWishList.innerHTML = `
                       ${products.map((product) => {
                           return (
                               `
                                <div class="col xxl-3 xl-3 l-3 m-6 c-12">
                               <div class="production" data-id='${product._id}' >
                               <img src="${product.images[0].url}" alt="">
                               <div class="info">
                                   <div class="name">${product.name}</div>
                                   <div class="price-trash">
                                    <div class="price">$${product.price}</div>
                                    <div class="trash"><i class="fa-solid fa-trash"></i></div>
                                   </div>
                               </div>
                               <div class="addCart-button"> Add Cart</div>
                                </div>
                               </div>`
                           )
    }).join('')}             
    `;
    rowWishList.addEventListener('click', async (e) => {
        const trashBtn = e.target.closest('.trash');
        const addBtn = e.target.closest('.addCart-button');
        const productEl = e.target.closest('.production'); //

        if (!productEl) return;
        const productId = productEl.dataset.id;
        const product = products.find(product => product._id === productId);

        // --- Xử lý xoá sản phẩm ---
        if (trashBtn) {
            const res = await fetch(`http://localhost:1234/v1/wishlist/delete-wishlistProduct/${productId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (res.ok) window.location.reload();
            return; // dừng luôn, tránh chạy phần dưới
        }

        // --- Xử lý thêm vào giỏ ---
        if (addBtn) {
            const res = await fetch('http://localhost:1234/v1/cart/add-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({ product })
            });
            const response = await res.json();
            showToastttt(response, 'success');
            return;
        }

        // --- Click chỗ khác (hiển thị chi tiết sản phẩm) ---
        sessionStorage.setItem('product', JSON.stringify(product));
        window.location.href = `../Production/Production.html?id=${product._id}`;
    });


})