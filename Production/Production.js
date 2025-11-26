import {showToast, translateText} from "../Global.js";
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

    // Stop animation after 1s
    setTimeout(()=> {loadingOverlay.classList.add('hidden');},500)
    const product = JSON.parse(sessionStorage.getItem('product'));
    const products = JSON.parse(localStorage.getItem('products'));
    const randomProducts = products.sort(() => Math.random() - 0.5).slice(0, 4);
    const storedLang = localStorage.getItem("selectedLang");
    const lang = storedLang ? JSON.parse(storedLang).lang.toLowerCase() : "en";

    let addCartBtnValue
    let addWishListBtnValue
    let displayPrice = product.price;
    let formattedPrice = "";
    if (lang === "vi") {
        addCartBtnValue = "Thêm vào giỏ hàng";
        addWishListBtnValue = "Thêm vào mục yêu thích";
        displayPrice = Math.round(product.price * 26328);
        formattedPrice = `${displayPrice.toLocaleString("vi-VN")} ₫`;
    } else if(lang === "en") {
        addCartBtnValue = "Add to cart";
        addWishListBtnValue = "Add to wishlist";
        formattedPrice = `$${displayPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
    }
    const homeButton = document.querySelector('.home-button');

    const originalText = homeButton.innerText;
    const translatedText = await translateText(originalText, lang);
    const brand = await translateText("Brand", lang);

    homeButton.innerText = translatedText;

    product.description = await translateText(product.description,lang);
    product.careIntroduction =await translateText(product.careIntroduction,lang);
    product.origin = await  translateText(product.origin, lang);
    const length = await translateText("Length", lang);


    if (!product) return;

    const container = document.querySelector('.production-img-container');
    if (!container) return;

    const html = `
    <div class="production-img grid">
      <div class="row">
        <div class="col xxl-2 xl-2 l-2">
          <div class="production-thumbnails">
                 ${product.images.map(img => `<img src="${img.url}" alt="" class="production-thumbnail"/>`).join('')}
          </div>
        </div>
        <div class="col xxl-9 xl-9 l-9 m-12 c-12">
          <img src="${product.images[0].url}" alt="${product.name}" class="production-main-img">
        </div>
      </div>
    </div>
  `;

    container.innerHTML = html;



    const thumbnails = container.querySelectorAll('.production-thumbnail');
    const mainImg = container.querySelector('.production-main-img');
    thumbnails.forEach((thumb) => {
        thumb.addEventListener('click', () => {
            mainImg.src = thumb.src;
        });
    });

    const productionInfo = document.querySelector('.production-info');
    productionInfo.innerHTML =
        `
    <h2 class="product-name">${product.name}</h2>
          <p class="product-brand">${brand}: <span>${product.brand}</span></p>
          <p class="product-price">${formattedPrice}</p>

          <div class="product-size">
            <button class="size-btn">S</button>
            <button class="size-btn">M</button>
            <button class="size-btn">L</button>
            <button class="size-btn">XL</button>
          </div>

          <div class="product-action">
            <button class="btn add-cart-btn">${addCartBtnValue}</button>
            <button class="btn add-wishlist-btn">${addWishListBtnValue} ${' (' + product.wishlistCount + ')'}</button>
          </div>

          <div class="product-info">
            <p class="product-description">
            ${product.description}
            </p>
     ${(product.careIntroduction || product.length || product.origin || product.material)
            ? `
    <ul>
      ${product.careIntroduction ? `<li>${product.careIntroduction}</li>` : ""}
      ${product.length ? `<li>${length}: ${product.length}″</li>` : ""}
      ${product.origin ? `<li>${product.origin}</li>` : ""}
      ${product.material ? `<li>${product.material}</li>` : ""}
    </ul>
  `
            : ""
        }
        
        ${lang === 'en' ?  `<p class="size-info">
            Fit information: True to Size <br>
            <a href="https://maydongphuc24h.vn/wp-content/uploads/2021/08/bang-size-ao-T-shirt-nam-Chau-Au.png">SIZE CHART</a><br>
            All measurements are in inches & are approximations.
        </p>
        </div>` : `<p class="size-info"> 
            Thông tin phù hợp: Đúng với kích thước <br>
            <a href="https://maydongphuc24h.vn/wp-content/uploads/2021/08/bang-size-ao-T-shirt-nam-Chau-Au.png">BẢNG KÍCH THƯỚC</a><br>
            Tất cả các phép đo được tính bằng inch và gần đúng.
        </p>
        </div>`}
           
        ` ;

    const addCartBtn = document.querySelector('.add-cart-btn');
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
    const addWishlistBtn = document.querySelector('.add-wishlist-btn');
    addWishlistBtn.addEventListener('click', async event => {
        event.stopPropagation();
        const token = localStorage.getItem('accessToken');
        if(!token){
            showToast('You need to Login!', 'error');
        } else{
            const res = await fetch(`${API_CONFIG.DEPLOY_URL}/wishlist/add-wishlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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

    const p = await translateText("You may also like",lang)
    const suggestProducts = document.querySelector('.suggest-productions');
    suggestProducts.innerHTML =
        `
         <p style="margin-left: 10px">${p}</p>
         
         <div class="grid wide">
              <div class="row">
       
         ${
            randomProducts.map((product) => {
                let formattedSuggestPrice;
                let displaySuggestPrice = product.price;
                if(lang === 'vi')
                {
                    displaySuggestPrice = displaySuggestPrice * 26328;
                    formattedSuggestPrice = displaySuggestPrice.toLocaleString("vi-VN") + '₫'
                }else if(lang === 'en')
                {
                    formattedSuggestPrice = '$' + displaySuggestPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })
                }
                return `
    <div class="col xxl-3 xl-3 l-4 m-6 c-12 no-gutters">
     <div class="suggest-production" data-id="${product._id}">
        <img src="${product.images[0].url}" alt="">  
        <div class="suggest-production-name">${product.name}</div>
        <div class="suggest-production-price">${formattedSuggestPrice}</div>
      </div>
    </div>
   
     
  `;
            }).join('')
        } 
        </div>
         </div>
        
        `
    const suggestItems = document.querySelectorAll('.suggest-production');

    suggestItems.forEach(item => {
        item.addEventListener('click', () => {
            const productId = item.dataset.id;

            const product = randomProducts.filter((product) => product._id === productId);
            sessionStorage.setItem('product', JSON.stringify(...product));
            window.location.href = `../Production/Production.html?id=${productId}`;
        });
    });
});
