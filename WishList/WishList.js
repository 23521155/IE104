import {showToast} from '../Global.js';
import {API_CONFIG} from "../apiConfig.js";

document.addEventListener('DOMContentLoaded', async () => {
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

    const rowWishList = document.querySelector('.row-wishlist');
    const accessToken = localStorage.getItem('accessToken');
    const res = await fetch(`${API_CONFIG.DEPLOY_URL}/wishlist/get-wishList`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    });

    // Stop animation after call api
    loadingOverlay.classList.add('hidden');

    const wishList = await res.json();
    const products = wishList.wishListItems;

    const storedLang = localStorage.getItem("selectedLang");
    const lang = storedLang ? JSON.parse(storedLang).lang.toLowerCase() : "en";
    const EXCHANGE_USD_TO_VND = 26328;

    /**
     * TRANSLATE UI TEXT
     * Set text labels based on selected language (Vietnamese or English)
     */
    const wishlistTitle = document.querySelector('.title-wishlist');
    let p,home,a,addCartBtn;
    if(lang === "vi") {
        p = 'Yêu thích';
        home = 'Trang chủ';
        a = 'Yêu thích';
        addCartBtn = 'Thêm vào giỏ hàng';
    } else if(lang === 'en'){
        p = 'Wish List';
        home = 'Home';
        a = 'Wish list';
        addCartBtn = 'Add to cart';
    }

    /**
     * UPDATE WISHLIST TITLE
     * Display heart icon and translated title
     */
    wishlistTitle.innerHTML = `
           <i class="fa-regular fa-heart"></i>
           <p class="p">${p}</p>
    `;

    /**
     * UPDATE BREADCRUMB NAVIGATION
     * Display home and wishlist links with translations
     */
    const homeButton = document.querySelector('.home-wishlist');
    homeButton.innerHTML = `
            <a href="../Home/Home.html">${home}</a>
            <p>/</p>
            <a href="">${a}</a>
    `

    /**
     * RENDER WISHLIST PRODUCTS
     * Build HTML for each product in the wishlist
     * Includes product image, name, price, delete button, and add to cart button
     */
    rowWishList.innerHTML = `
                       ${products.map((product) => {
                           let formattedPrice;
                                   if(lang ==='vi'){
                                       formattedPrice = (product.price * EXCHANGE_USD_TO_VND).toLocaleString('vi-VN') + '₫'
                                   }
                                   else if (lang ==='en'){
                                       formattedPrice = '$' + product.price.toLocaleString('en-US',{ minimumFractionDigits: 2 });
                                   }
                           return (
                               `
                                <div class="col xxl-3 xl-3 l-4 m-6 c-12">
                               <div class="production" data-id='${product._id}' >
                               <img src="${product.images[0].url}" alt="">
                               <div class="info">
                                   <div class="name">${product.name}</div>
                                   <div class="price-trash">
                                    <div class="price">${formattedPrice}</div>
                                    <div class="trash"><i class="fa-solid fa-trash"></i></div>
                                   </div>
                               </div>
                               <div class="addCart-button">${addCartBtn}</div>
                                </div>
                               </div>`
                           )
    }).join('')}             
    `;

    /**
     * WISHLIST INTERACTION HANDLER
     * Handles three types of clicks:
     * 1. Delete button - removes product from wishlist
     * 2. Add to cart button - adds product to shopping cart
     * 3. Product area - navigates to product detail page
     */
    rowWishList.addEventListener('click', async (e) => {
        const trashBtn = e.target.closest('.trash');
        const addBtn = e.target.closest('.addCart-button');
        const productEl = e.target.closest('.production'); //

        // Exit if click was outside any product element
        if (!productEl) return;

        // Get product ID and full product data
        const productId = productEl.dataset.id;
        const product = products.find(product => product._id === productId);

        // Remove product from wishlist via API and reload page
        if (trashBtn) {
            const res = await fetch(`${API_CONFIG.DEPLOY_URL}/wishlist/delete-wishlistProduct/${productId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            // Reload page if deletion successful
            if (res.ok) window.location.reload();
            return; // Stop execution to prevent running code below
        }

        // Add product to shopping cart via API
        if (addBtn) {
            const res = await fetch(`${API_CONFIG.DEPLOY_URL}/cart/add-cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({ product })
            });
            const response = await res.json();
            showToast(response, 'success');
            return;
        }

        // Navigate to product detail page when clicking anywhere else on product
        sessionStorage.setItem('product', JSON.stringify(product));
        window.location.href = `../Production/Production.html?id=${product._id}`;
    });


})