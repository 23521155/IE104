const showToast = (message, type = "success") => {
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
document.addEventListener('DOMContentLoaded', () => {
    const product = JSON.parse(sessionStorage.getItem('product'));
    const products = JSON.parse(sessionStorage.getItem('products'));
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
          <p class="product-brand">Brand: <span>${product.brand}</span></p>
          <p class="product-price">${'$' + product.price}</p>

          <div class="product-size">
            <button class="size-btn">S</button>
            <button class="size-btn">M</button>
            <button class="size-btn">L</button>
            <button class="size-btn">XL</button>
          </div>

          <div class="product-action">
            <button class="btn add-cart-btn">Add to cart</button>
            <button class="btn add-wishlist">Add to wishlist ${' (' + product.wishlistCount + ')'}</button>
          </div>

          <div class="product-description">
            <p>
            ${product.description}
            </p>
            <ul>
              ${product.careIntroduction && `<li>${product.careIntroduction}</li>`}
              ${product.length && `<li>${'Length: ' + product.length + '″'}</li>`}
              ${product.origin && `<li>${product.origin}</li>`}
              ${product.material && `<li>${product.material}</li>`}
              
            </ul>

            <p class="size-info">
              Fit information: True to Size <br>
              <a href="#">SIZE CHART</a><br>
              All measurements are in inches & are approximations.
            </p>
          </div>
        ` ;
    const addCartBtn = document.querySelector('.add-cart-btn');
    addCartBtn.addEventListener('click', async event => {
        event.stopPropagation();
        const token = localStorage.getItem('accessToken');
        if(!token){
            showToast('You need to Login!', 'error');
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
            console.log('ho')
            const response = await res.json();
            showToast(response, 'success');
        }
    })
    const suggestProducts = document.querySelector('.suggest-productions');
    suggestProducts.innerHTML =
        `
         <p>You may also like</p>
        <div class="row">
     
          
          <div class="col xxl-3 xl-3 l-4 m-6 c-12">
            <div class="suggest-production">
              <img src="https://modcloth.com/cdn/shop/files/4093_31b45046-e439-4470-86a5-c85609e6c1b1.jpg?crop=center&height=720&v=1754604355&width=480"
                   alt="">
              <div class="suggest-production-name">Instant Energy Faux-Wrap Long Sleeve Knit Dress</div>
              <div class="suggest-production-price">$79.00</div>
            </div>
          </div>
          <div class="col xxl-3 xl-3 l-4 m-6 c-12">
            <div class="suggest-production">
              <img src="https://modcloth.com/cdn/shop/files/4093_31b45046-e439-4470-86a5-c85609e6c1b1.jpg?crop=center&height=720&v=1754604355&width=480"
                   alt="">
              <div class="suggest-production-name">Bomb shell dress in red</div>
            </div>
          </div>
          <div class="col xxl-3 xl-3 l-4 m-6 c-12">
            <div class="suggest-production">
              <img src="https://modcloth.com/cdn/shop/files/4093_31b45046-e439-4470-86a5-c85609e6c1b1.jpg?crop=center&height=720&v=1754604355&width=480"
                   alt="">
              <div class="suggest-production-name">Bomb shell dress in red</div>
            </div>
          </div>
          <div class="col xxl-3 xl-3 l-4 m-6 c-12">
            <div class="suggest-production">
              <img src="https://modcloth.com/cdn/shop/files/4093_31b45046-e439-4470-86a5-c85609e6c1b1.jpg?crop=center&height=720&v=1754604355&width=480"
                   alt="">
              <div class="suggest-production-name">Bomb shell dress in red</div>
            </div>
          </div>
        </div>
        `
});
