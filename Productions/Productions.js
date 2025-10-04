document.addEventListener('DOMContentLoaded', function() {
    const products = [
        { name: 'Festival Floral Dress', price: '$10' },
        { name: 'Festival Floral Dress', price: '$10' },
        { name: 'Festival Floral Dress', price: '$10' },
        { name: 'Festival Floral Dress', price: '$10' },
        { name: 'Festival Floral Dress', price: '$10' },
        { name: 'Festival Floral Dress', price: '$10' },
        { name: 'Festival Floral Dress', price: '$10' },
        { name: 'Festival Floral Dress', price: '$10' },
    ];

    const productGrid = document.getElementById('product-grid');

    products.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col xxl-3 xl-3 l-4 m-6 c-12 no-gutters';

        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        productCard.innerHTML = `
            <div class="product-image-container">
                <img src="" alt="${product.name}" class="product-image">
                <i class="fa-regular fa-heart wishlist-icon"></i>
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">${product.price}</div>
            </div>
            <button class="add-cart-btn">Add Cart</button>
        `;
        
        col.appendChild(productCard);
        productGrid.appendChild(col);
    });
});
