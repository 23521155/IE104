import {showToast, translateText} from "../Global.js";
import {API_CONFIG} from "../apiConfig.js";

document.addEventListener('DOMContentLoaded',  async function () {
    // Animation loading
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
        // New arrival
        const res = await fetch(`${API_CONFIG.DEPLOY_URL}/productType/`)
        const data = await res.json();
        const sorted = data.sort((a, b) => b.createdAt - a.createdAt);
        products = sorted.slice(0, 24);
        totalProducts = products.length;
    }

    // No have products
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

    // DOM
    const productGrid = document.getElementById('product-grid');
    const productsQuantity = document.getElementById('products-quantity');
    productsQuantity.textContent = totalProducts;

    document.querySelector('.product-type').textContent = productType.toUpperCase();

    const totalPages = Math.ceil(totalProducts / limit);
    const firstPageNumber = document.getElementById('first-page-number');
    const secondPageNumber = document.getElementById('second-page-number');
    const ellipsis = document.getElementById('ellipsis');
    const lastPageNumber = document.getElementById('last-page-number');

    // Display current page number in first position
    firstPageNumber.textContent = page;

    // Display next page number in second position
    secondPageNumber.textContent = page+1;

    // Display last page number in final position
    lastPageNumber.textContent = totalPages;

    // Hide ellipsis if there are fewer than 4 pages remaining
    if(totalPages - page + 1 < 4)
    {
        ellipsis.style.display = 'none';
    }

    // Hide second page number if current page is second-to-last
    if(page + 1 === totalPages){
        secondPageNumber.style.display = 'none';
    }

    // Hide both second and last page numbers when on the last page
    if (page === totalPages){
        secondPageNumber.style.display = 'none';
        lastPageNumber.style.display = 'none';
    }

    // Next page button
    document.getElementById("nextPage").addEventListener("click", () => {
        if(page < totalPages) {
            page++;
            window.location.href = `../Productions/Productions.html?type=${productType}&page=${page}`;
        }
    });

    // First page number button
    firstPageNumber.addEventListener('click', () => {
        window.location.href=`../Productions/Productions.html?type=${productType}&page=${firstPageNumber.textContent}`;
    })

    // Second page number button
    secondPageNumber.addEventListener('click', () => {
        window.location.href=`../Productions/Productions.html?type=${productType}&page=${secondPageNumber.textContent}`;
    })

    // Last page number button
    lastPageNumber.addEventListener('click', () => {
        window.location.href=`../Productions/Productions.html?type=${productType}&page=${lastPageNumber.textContent}`;
    })

    // Previous page button
    document.getElementById("prevPage").addEventListener("click", () => {
        if (page > 1) {
            page--;
            window.location.href = `../Productions/Productions.html?type=${productType}&page=${page}`;
        }
    });

    // Save products into localStorage
    localStorage.setItem('products', JSON.stringify(products));

    // Get status of language
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

    // Get accessToken from localStorage
    const accessToken = localStorage.getItem('accessToken');

    // This function to get wishList productions
    const getWishListProducts = async () => {
        const result = await fetch(`${API_CONFIG.DEPLOY_URL}/wishList/get-wishList`, {
            METHOD: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
        })
        const wishList = await result.json();
        return  wishList.wishListItems
    }
    const wishListProducts = await getWishListProducts();

    // Render all productions
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

        // Create DOM productCard
        const productCard = document.createElement('div');
        productCard.className = 'product-card';


        productCard.innerHTML = `
                <div class="product-image-container">
                <div>
                <img src="${product?.images[0]?.url}" alt="${product.name}" class="product-image" loading="lazy">
                <img src="${product?.images[1]?.url}" alt="${product.name}" class="product-image" loading="lazy">
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

        if(wishListProducts?.length > 0)
        {
            wishListProducts.forEach(wishListProduct => {
                if(wishListProduct._id == product._id) {
                    productCard.innerHTML = `
                          <div class="product-image-container">
                <div>
                <img src="${product?.images[0]?.url}" alt="${product.name}" class="product-image" loading="lazy">
                <img src="${product?.images[1]?.url}" alt="${product.name}" class="product-image" loading="lazy">
                </div>
                   <i class="fa-solid fa-heart wishlist-icon add-wishlist-btn" style="color: red"></i>   
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
                         `
                }
            })
        }

        col.appendChild(productCard);
        productGrid.appendChild(col);

        // Click productCard
        productCard.addEventListener('click', event => {
                sessionStorage.setItem('product', JSON.stringify(product));
                window.location.href = `../Production/Production.html?id=${product._id}`;
        })

        // AddCart button
        const addCartBtn = productCard.querySelector('.add-cart-btn');
        addCartBtn.addEventListener('click', async event => {
            event.stopPropagation();

            if(!accessToken){
                showToast('You need to Login!', 'error');
            }
            else{
                const res = await fetch(`${API_CONFIG.DEPLOY_URL}/cart/add-cart`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({
                        product
                    })
                });
                const response = await res.json();
                showToast(response, 'success');
            }
        });

        // WishList button
        const wishlistBtn = productCard.querySelector('.add-wishlist-btn');
        wishlistBtn.addEventListener('click', async event => {
            event.stopPropagation();

            if(!accessToken){
                showToast('You need to Login!', 'error');
            }
            else{
                const res = await fetch(`${API_CONFIG.DEPLOY_URL}/wishlist/add-wishlist`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({
                        product
                    })
                });
                const response = await res.json();
                showToast(response, 'success');

                // Get wishList productions after add wishList
                const wishListProducts = await getWishListProducts();

                wishListProducts.forEach(wishListProduct => {
                    if(wishListProduct._id === product._id) productCard.innerHTML = `
                          <div class="product-image-container">
                <div>
                <img src="${product?.images[0]?.url}" alt="${product.name}" class="product-image" loading="lazy">
                <img src="${product?.images[1]?.url}" alt="${product.name}" class="product-image" loading="lazy">
                </div>
                   <i class="fa-solid fa-heart wishlist-icon add-wishlist-btn" style="color: red"></i>
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
                         `
                })
            }

            })
        });

    // Stop animation loading after call api
    loadingOverlay.classList.add('hidden');
    });
