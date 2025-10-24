const showToastt = (message, type = "success") => {
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

document.addEventListener('DOMContentLoaded',  async function () {
    const params = new URLSearchParams(window.location.search);
    let page = parseInt(params.get('page')) || 1;
    const productType = params.get('type');
    const limit = 24;

    const response = await fetch(`http://localhost:1234/v1/product/${productType}?page=${page}&limit=${limit}`);

    const {products,totalProducts} = await response.json();
    const productGrid = document.getElementById('product-grid');
    const productsQuantity = document.getElementById('products-quantity');
    productsQuantity.textContent = totalProducts;
    const totalPages = Math.ceil(totalProducts / limit);
    const firstPageNumber = document.getElementById('first-page-number');
    const secondPageNumber = document.getElementById('second-page-number');
    const ellipsis = document.getElementById('ellipsis');
    const lastPageNumber = document.getElementById('last-page-number');

    firstPageNumber.textContent = page;
    secondPageNumber.textContent = page+1;
    lastPageNumber.textContent = totalPages;
    if(totalPages - page + 1 < 4)
    {
        ellipsis.style.display = 'none';
    }
    if(page + 1 === totalPages){
        secondPageNumber.style.display = 'none';
    }
    if (page === totalPages){
        secondPageNumber.style.display = 'none';
        lastPageNumber.style.display = 'none';
    }
    document.getElementById("nextPage").addEventListener("click", () => {
        if(page < totalPages) {
            page++;
            window.location.href = `../Productions/Productions.html?type=${productType}&page=${page}`;
        }
    });
    firstPageNumber.addEventListener('click', () => {
        window.location.href=`../Productions/Productions.html?type=${productType}&page=${firstPageNumber.textContent}`;
    })
    secondPageNumber.addEventListener('click', () => {
        window.location.href=`../Productions/Productions.html?type=${productType}&page=${secondPageNumber.textContent}`;
    })
    lastPageNumber.addEventListener('click', () => {
        window.location.href=`../Productions/Productions.html?type=${productType}&page=${lastPageNumber.textContent}`;
    })
    document.getElementById("prevPage").addEventListener("click", () => {
        if (page > 1) {
            page--;
            window.location.href = `../Productions/Productions.html?type=${productType}&page=${page}`;
        }
    });
    sessionStorage.setItem('products', JSON.stringify(products));
    products.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col xxl-3 xl-3 l-4 m-6 c-12 no-gutters';

        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        productCard.innerHTML = `
            <div class="product-image-container">
            <div>
            <img src="${product?.images[0].url}" alt="${product.name}" class="product-image">
            <img src="${product?.images[1].url}" alt="${product.name}" class="product-image">
            </div>   
                <i class="fa-regular fa-heart wishlist-icon"></i>
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">
                <p>
                 $${product.price}
                </p>
                </div>
            </div>
            <button class="add-cart-btn">Add Cart</button>
        `;

        col.appendChild(productCard);
        productGrid.appendChild(col);

        productCard.addEventListener('click', event => {
            sessionStorage.setItem('product', JSON.stringify(product));

            window.location.href = `../Production/Production.html?id=${product._id}`;
        })
        const addCartBtn = productCard.querySelector('.add-cart-btn');
        addCartBtn.addEventListener('click', async event => {
            event.stopPropagation();
            const token = localStorage.getItem('accessToken');
            if(!token){
                showToastt('You need to Login!', 'error');
            }
            else{
                const res = await fetch('http://localhost:1234/v1/cart/add-cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Nếu API cần token (JWT, v.v.), thêm dòng này:
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        product
                    })
                });
                const response = await res.json();
                showToast(response, 'success');
            }
        });
    });
});
