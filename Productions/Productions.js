import {showToast, translateText} from "../Global.js";
import {API_CONFIG} from "../apiConfig.js";

document.addEventListener('DOMContentLoaded',  async function () {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.remove('hidden');

   await lottie.loadAnimation({
        container: document.getElementById('loading-animation'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '../animations/Sale.json'
    });
    await lottie.loadAnimation({
        container: document.getElementById('loading-animation-ellipsis'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '../animations/Loading.json'
    });




    const params = new URLSearchParams(window.location.search);
    let page = parseInt(params.get('page')) || 1;
    const productType = params.get('type');
    const limit = 24;
    let products = [];
    let totalProducts = 0;
    if(productType){
        const response = await fetch(`${API_CONFIG.DEPLOY_URL}/product/${productType}?page=${page}&limit=${limit}`);
        const data = await response.json();
        products = data.products;
        totalProducts = data.totalProducts;
    }
    else {
        // new arrival
        const res = await fetch(`${API_CONFIG.DEPLOY_URL}/productType/`)
        const data = await res.json();
        const sorted = data.sort((a, b) => b.createdAt - a.createdAt);
        products = sorted.slice(0, 24);
        totalProducts = products.length;
    }




    setTimeout(()=> {loadingOverlay.classList.add('hidden');},1000)

    if(products.length === 0){
        const storedLang = localStorage.getItem("selectedLang");
        const lang = storedLang ? JSON.parse(storedLang).lang.toLowerCase() : "en";
        const productGrid = document.getElementById('product-grid');
        const homeBtn = document.querySelector('.home-button');
        if(lang === 'vi'){
            productGrid.innerHTML = 'Bây giờ chúng tôi chưa có sản phẩm';
            homeBtn.innerHTML = `Trang chủ`
        }else if(lang === 'en'){
            productGrid.innerHTML = 'Now we don\'t have products';
            homeBtn.innerHTML = 'Home'
        }

        productGrid.style.height = '100px';
        productGrid.style.fontSize = '3rem';

        const pagination = document.querySelector('.pagination');
        pagination.remove();
        return;
    }


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
    localStorage.setItem('products', JSON.stringify(products));

    const storedLang = localStorage.getItem("selectedLang");
    const lang = storedLang ? JSON.parse(storedLang).lang.toLowerCase() : "en";

    let addCartBtnValue
    if (lang === "vi") {
        addCartBtnValue = "Thêm vào giỏ hàng";
    } else if(lang === "en") {
        addCartBtnValue = "Add to cart";
    }
    const homeButton = document.querySelector('.home-button');
    const originalText = homeButton.innerText;
    const translatedText = await translateText(originalText, lang);
    homeButton.innerText = translatedText;
    products.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col xxl-3 xl-3 l-4 m-6 c-12 no-gutters';

        let displayPrice = product.price;
        let formattedPrice = "";
        if (lang === "vi") {
            displayPrice = Math.round(product.price * 26328);
            formattedPrice = `${displayPrice.toLocaleString("vi-VN")} ₫`;
        }
        else if (lang === "en") {
            formattedPrice = `$${displayPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
        }

        const productCard = document.createElement('div');
        productCard.className = 'product-card';

            productCard.innerHTML = `
                <div class="product-image-container">
                <div>
                <img src="${product?.images[0]?.url}" alt="${product.name}" class="product-image">
                <img src="${product?.images[1]?.url}" alt="${product.name}" class="product-image">
                </div>
                   <i class="fa-regular fa-heart wishlist-icon add-wishlist-btn"></i>   
                </div>
                <div class="product-info">
                    <div class="product-name">${product.name.toUpperCase()}</div>
                    <div class="product-price">
                    <p>
                     ${formattedPrice}
                    </p>
                    </div>
                </div>
                <button class="add-cart-btn">${addCartBtnValue}</button>
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
                    showToast('You need to Login!', 'error');
                }
                else{
                    const res = await fetch(`${API_CONFIG.DEPLOY_URL}/cart/add-cart`, {
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

            const wishlistBtn = productCard.querySelector('.add-wishlist-btn');
            wishlistBtn.addEventListener('click', async event => {
                event.stopPropagation();
                const token = localStorage.getItem('accessToken');
                if(!token){
                    showToast('You need to Login!', 'error');
                }
                else{
                    const res = await fetch(`${API_CONFIG.DEPLOY_URL}/wishlist/add-wishlist`, {
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
            })
        });
    });
