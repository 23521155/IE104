// fallback.js
import {FE_URL} from "./apiConfig";
(function () {
    const validPaths = [
        '/',
        '/index.html',
        '/Home/Home.html',
        '/Cart/Cart.html',
        '/Productions/Productions.html',
        '/ResetPassword/index.html',
        '/WishList/WishList.html',
        '/User/User.html',
        '/404/404.html'
    ];

    const current = window.location.pathname;
    console.log(current)

    if (!validPaths.includes(current)) {
        window.location.href = `/404/404.html`;
    }
})();
