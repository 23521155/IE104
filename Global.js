import {API_CONFIG,FE_URL} from "./apiConfig.js";


export const showToast = async (message, type = "success") => {
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
    const storedLang = localStorage.getItem("selectedLang");
    const lang = storedLang ? JSON.parse(storedLang).lang.toLowerCase() : "en";
    if(message === 'LOGGED OUT!' && lang === 'vi') {
       message = 'Đã đăng xuất';
    } else message = await translateText(message,lang);

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
export  const translateText = async (text, targetLanguage = 'vi') => {
    const cacheKey = `trans_${targetLanguage}_${text}`;
    const cached = localStorage.getItem(cacheKey);
    if(cached) return cached;

    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await res.json();
    const translated = data[0][0][0];

    localStorage.setItem(cacheKey, translated);
    return translated;
}

document.addEventListener("DOMContentLoaded", async (event) => {
    // Open and close modal
    const logicMenuModal = async ()=>{
        const menuBtn = document.getElementById('menu-button');
        const menuModal = document.getElementById('menu-modal');
        const menuModalRight = document.querySelector('.menu-modal-right');
        const closeBtn = document.getElementById('menu-modal-close');
        const content = document.querySelector('.content');
        const body = document.body;

        const storedLang = localStorage.getItem("selectedLang");
        const lang = storedLang ? JSON.parse(storedLang).lang.toLowerCase() : "en";
        const accessToken = localStorage.getItem("accessToken");
        const res = await fetch(`${API_CONFIG.DEPLOY_URL}/productType/`)
        const data = await res.json();

        const products = data.filter(product => product._isBestSeller);


        menuModalRight.innerHTML =
            `
            <div class="menu-modal-right-title">
            ${lang === 'vi' ? 'SẢN PHẨM BÁN CHẠY' : 'BEST SELLERS'}
            </div>
        <div class="menu-modal-right-content">
        ${products.map((product) => 
            `
             <div class="menu-modal-img" data-id="${product._id}">
                                <img class="menu-modal-img1" src="${product.images[0].url}" alt="">
                                <img class="menu-modal-img2" src="${product.images[1].url}" alt="">
            </div>
            `
            ).join('')}
        </div>
            `
        const productElements = document.querySelectorAll('.menu-modal-img');

        productElements.forEach(el => {
            el.addEventListener('click', () => {
                const id = el.dataset.id;
                const product = products.filter(product => product._id === id);
                sessionStorage.setItem('product', JSON.stringify(...product));
                window.location.href = `${FE_URL}/Production/Production.html?id=${id}`;
            });
        });

        const menuModalList = document.querySelector('.menu-modal-list')

        menuModalList.innerHTML = `
            <div><a href="${FE_URL}/Productions/Productions.html" class="menu-modal-content">NEW ARRIVALS</a></div>
            <div><a href="${FE_URL}/Productions/Productions.html?type=dresses&page=1" class="menu-modal-content">DRESSES</a></div>
            <div><a href="${FE_URL}/Productions/Productions.html?type=tops&page=1" class="menu-modal-content">CLOTHING</a></div>
            <div><a href="${FE_URL}/Productions/Productions.html?type=happylunar&page=1" class="menu-modal-content">HAPPY LUNAR YEAR</a></div>
            <div><a href="https://www.gucci.com/us/en/" class="menu-modal-content">BRANDS WE LOVE</a></div>
            <div><a href="${FE_URL}/Productions/Productions.html?type=shoes&page=1" class="menu-modal-content">SHOES</a></div>
            <div><a href="${FE_URL}/Productions/Productions.html?type=jewelry&page=1" class="menu-modal-content">ACCESSORIES</a></div>
            <div><a href="${FE_URL}/Productions/Productions.html?type=sale&page=1" class="menu-modal-content">SALE</a></div>
          ${accessToken ? `<div><a href="${FE_URL}/User/User.html" class="menu-modal-content">
                <i class="fa-regular fa-user"></i>ACCOUNT</a></div>` : ''}
                      <div><a href="${FE_URL}/Cart/Cart.html" class="menu-modal-content">
            <i class="fa-solid fa-cart-shopping"></i>
            CART</a></div>
            <div><a href="${FE_URL}/WishList/WishList.html" class="menu-modal-content">
                <i class="fa-regular fa-heart"></i>
                WISHLIST</a></div>

        `
        const items = document.querySelectorAll('.menu-modal-content');

        const texts = Array.from(items).map(el => el.textContent.trim());


        const textTranslateds = await Promise.all(
            texts.map(text => translateText(text, lang))
        );

        if(lang === 'vi' && textTranslateds.length === 11)
        {
            textTranslateds[3] = 'CHÚC MỪNG NĂM MỚI'
            textTranslateds[4] = 'NHÃN HIỆU YÊU THÍCH';
            textTranslateds[9] = 'GIỎ HÀNG';
            textTranslateds[10] = 'DANH SÁCH YÊU THÍCH';
        }
        else if (lang === 'vi' && textTranslateds.length === 10)
        {
            textTranslateds[3] = 'CHÚC MỪNG NĂM MỚI'
            textTranslateds[4] = 'NHÃN HIỆU YÊU THÍCH';
            textTranslateds[8] = 'GIỎ HÀNG';
            textTranslateds[9] = 'DANH SÁCH YÊU THÍCH';
        }
        items.forEach((el, index) => {
            const icon = el.querySelector('i');
            el.textContent = textTranslateds[index];
            if (icon) el.prepend(icon); // thêm lại icon vào đầu nếu có
        });

        menuBtn.addEventListener('click', () => {
            // reset nếu đang đóng

            if(window.innerWidth > 740) {
                menuModal.classList.remove('closing');
                // menuModal.style.display = 'block';
                setTimeout(() => {
                    menuModal.classList.add('active');
                    content.classList.add('shift-right');
                    body.classList.add('modal-open');
                }, 10);
                setTimeout(() => {
                    content.classList.remove('shift-right');
                    content.classList.add('shift-down');
                }, 1000);
            } else {
                menuModal.classList.remove('closing');
                menuModal.classList.add('active');
            }
        });

        closeBtn.addEventListener('click', () => {
              if(window.innerWidth > 740) {
                  // gỡ shift-right để content về vị trí cũ
                  content.classList.remove('shift-right');
                  // gỡ class active để không bị translateX
                  menuModal.classList.remove('active');
                  menuModal.classList.add('closing');



                  setTimeout(() => {
                      content.classList.remove('shift-down');
                  }, 0);

                  // sau khi animation xong thì ẩn
                  menuModal.addEventListener('animationend', () => {
                      menuModal.classList.remove('closing');
                      body.classList.remove('modal-open');
                  }, { once: true });
              }
              else {
                  menuModal.classList.add('closing');
                  setTimeout(()=>{
                      menuModal.classList.remove('active');
                  },500)
                  setTimeout(() => {
                      menuModal.classList.remove('closing');
                  },1000)
              }
        });
    }

// User modal
    const logicUserModal = ()=>{
        const userBtn = document.getElementById('user-button');
        const userModal = document.getElementById('user-modal');
        const userCloseBtn = document.getElementById('user-close-modal');
        const userCLoseRegisterBtn = document.getElementById('user-close-register');
        const userCloseForgotPasswordBtn = document.getElementById('user-close-forgot-password');
        const registerBtn = document.getElementById('register');
        const loginBtn = document.getElementById('login');
        const forgotPasswordBtn = document.getElementById('password-forgot');
        const backRegBtn = document.getElementById('back-arrow-register');
        const backForgotBtn = document.getElementById('back-arrow-forgot-password');
        const userModalLogin = document.getElementById('user-modal-login');
        const userModalRegister = document.getElementById('user-modal-register');
        const userModalForgotPassword = document.getElementById('user-modal-forgot-password')
        const inputLoginRegister = document.getElementsByClassName('input-login-register');
        const allInputs = []; // mảng chứa tất cả input con

        for (const el of inputLoginRegister) {
            const inputs = el.getElementsByTagName('input'); // lấy các input con
            allInputs.push(...inputs); // nối vào mảng allInputs
        }
        userBtn.addEventListener('click', () => {
            userModal.style.opacity ='1';
            userModal.style.visibility = 'visible';
            userModalLogin.style.transform = 'scaleY(1)'

            const token = localStorage.getItem('accessToken');
            const loginForm = document.getElementById('user-modal-login-form');
            const loginIcon = document.getElementById('login-icon');
            const loggedInDiv = document.getElementById('user-logged-in');
            const logoutBtn = document.getElementById('btnLogout');
            if (token) {
                // Ẩn form login, hiện nút đăng xuất
                loginForm.style.display = 'none';
                loginIcon.style.display = 'none';
                loggedInDiv.style.display = 'block';
            } else {
                // Ngược lại
                loginForm.style.display = 'block';
                loginIcon.style.display = 'flex';
                loggedInDiv.style.display = 'none';
            }

// 🔥 Xử lý nút đăng xuất
            logoutBtn.addEventListener('click', async () => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                await fetch(`${API_CONFIG.DEPLOY_URL}/users/logout`, {
                    method: 'DELETE',
                })
                showToast('LOGGED OUT!', 'success');
                setTimeout(() => location.reload(), 800); // reload lại trang
            });
        })
        userCloseBtn.addEventListener('click', () => {
            allInputs.forEach(input => {
                input.value = ""; // xóa chữ
                input.focus(); // đưa con trỏ lại input
                input.dispatchEvent(new Event("input")); // để CSS label tự cập nhật
            })
            const oldError = document.querySelector(".error-message");
            if (oldError) oldError.remove();
            userModalLogin.style.transform ='scaleY(0)'
            setTimeout(()=>{
                userModal.style.opacity = '0';
                userModal.style.visibility = 'hidden';
            },400)
        })
        userCLoseRegisterBtn.addEventListener('click', () => {

            allInputs.forEach(input => {
                input.value = ""; // xóa chữ
                input.focus(); // đưa con trỏ lại input
                input.dispatchEvent(new Event("input")); // để CSS label tự cập nhật
            })
            const oldError = document.querySelector(".error-message");
            if (oldError) oldError.remove();
            userModalRegister.style.transform = 'scaleY(0)';
            setTimeout(()=>{
                userModalLogin.style.removeProperty('display');
                userModalRegister.style.display = 'none';
                userModal.style.opacity = '0';
                userModal.style.visibility = 'hidden';
            },400)
        })
        userCloseForgotPasswordBtn.addEventListener('click', () => {
            allInputs.forEach(input => {
                input.value = ""; // xóa chữ
                input.focus(); // đưa con trỏ lại input
                input.dispatchEvent(new Event("input")); // để CSS label tự cập nhật
            })
            const oldError = document.querySelector(".error-message");
            if (oldError) oldError.remove();
            userModalForgotPassword.style.transform = 'scaleY(0)';
            setTimeout(()=>{
                userModalLogin.style.removeProperty('display');
                userModalForgotPassword.style.display = 'none';
                userModal.style.opacity = '0';
                userModal.style.visibility = 'hidden';
            },400)
        })
        registerBtn.addEventListener('click', () => {
            userModalLogin.style.transform = 'scaleY(0)'
            setTimeout(() => {
                userModalLogin.style.display = 'none';
                setTimeout(() => {
                    userModalRegister.style.display = 'block';
                    setTimeout(() => {
                        userModalRegister.style.transform = 'scaleY(1)';
                    },100)
                },100)
            },300)
        })
        forgotPasswordBtn.addEventListener('click', () => {
            userModalLogin.style.transform = 'scaleY(0)'
            setTimeout(() => {
                userModalLogin.style.display = 'none';
                setTimeout(() => {
                    userModalForgotPassword.style.display = 'block';
                    setTimeout(() => {
                        userModalForgotPassword.style.transform = 'scaleY(1)';
                    },100)
                },100)
            },300)
        })
        loginBtn.addEventListener('click', () => {
            allInputs.forEach(input => {
                input.value = ""; // xóa chữ
                input.focus(); // đưa con trỏ lại input
                input.dispatchEvent(new Event("input")); // để CSS label tự cập nhật
            })
            const oldError = document.querySelector(".error-message");
            if (oldError) oldError.remove();
            userModalRegister.style.transform = 'scaleY(0)'
            setTimeout(() => {
                userModalRegister.style.display = 'none';
                setTimeout(() => {
                    userModalLogin.style.display = 'block';
                    setTimeout(() => {
                        userModalLogin.style.transform = 'scaleY(1)';
                        userModalLogin.style.removeProperty('display');
                        setTimeout(() => {
                        },100)
                    },100)
                },100)
            },300)
        })
        backRegBtn.addEventListener('click', () => {
            allInputs.forEach(input => {
                input.value = ""; // xóa chữ
                input.focus(); // đưa con trỏ lại input
                input.dispatchEvent(new Event("input")); // để CSS label tự cập nhật
            })
            const oldError = document.querySelector(".error-message");
            if (oldError) oldError.remove();
            userModalRegister.style.transform = 'scaleY(0)'
            setTimeout(() => {
                userModalRegister.style.display = 'none';
                setTimeout(() => {
                    userModalLogin.style.display = 'block';
                    setTimeout(() => {
                        userModalLogin.style.transform = 'scaleY(1)';
                        userModalLogin.style.removeProperty('display');
                        setTimeout(() => {
                        },100)
                    },100)
                },100)
            },300)
        })
        backForgotBtn.addEventListener('click', () => {
            userModalForgotPassword.style.transform = 'scaleY(0)'
            setTimeout(() => {
                userModalForgotPassword.style.display = 'none';
                setTimeout(() => {
                    userModalLogin.style.display = 'block';
                    setTimeout(() => {
                        userModalLogin.style.transform = 'scaleY(1)';
                        userModalLogin.style.removeProperty('display');
                        setTimeout(() => {
                        },100)
                    },100)
                },100)
            },300)
        })

    }

// Search Input
    const searchInput = ()=>{
        const searchRoots = document.querySelectorAll('.autocomplete-search, .autocomplete-search-responsive');
        searchRoots.forEach((root)=>{
            const search = root.querySelector('.search');
            const input = root.querySelector('.search-input');
            if(!search || !input) return;
            input.addEventListener('input', () => {
                if (input.value.trim() !== '') {
                    search.classList.add('active');
                } else {
                    search.classList.remove('active');
                }
            });
        })
    }

// Delete input in user modal
    const deleteInputUserModal = () =>{
        document.querySelectorAll(".input-close").forEach(closeBtn => {
            closeBtn.addEventListener("click", () => {
                const wrapper = closeBtn.closest(".input-login-register"); // tìm khối cha
                const input = wrapper.querySelector("input"); // chọn input bên trong khối đó
                input.value = ""; // xóa chữ
                input.focus(); // đưa con trỏ lại input
                input.dispatchEvent(new Event("input")); // để CSS label tự cập nhật
            });
        });
    }

// User register form api
    const registerForm = ()=>{
        document.getElementById("btnRegister").addEventListener("click", async (e) => {
            e.preventDefault(); // Ngăn form reload trang

            // Xóa thông báo lỗi cũ (nếu có)
            const oldError = document.querySelector(".error-message");
            if (oldError) oldError.remove();


            // Lấy dữ liệu từ input
            const firstName = document.getElementById("firstNameRegister").value.trim();
            const lastName = document.getElementById("lastNameRegister").value.trim();
            const email = document.getElementById("emailRegister").value.trim();
            const password = document.getElementById("passwordRegister").value.trim();
            const confirmPassword = document.getElementById("confirmPasswordRegister").value.trim();
            const inputLoginRegister = document.getElementsByClassName('input-login-register');
            const allInputs = []; // mảng chứa tất cả input con

            for (const el of inputLoginRegister) {
                const inputs = el.getElementsByTagName('input'); // lấy các input con
                allInputs.push(...inputs); // nối vào mảng allInputs
            }
            // Kiểm tra đơn giản
            if (password !== confirmPassword) {
                const wrapper = document.getElementById("confirmPasswordWrapper");
                const error = document.createElement("div");
                const userRegisterForm = document.getElementById('user-modal-register');
                error.className = "error-message";
                error.textContent = "Passwords do not match!";
                wrapper.appendChild(error);
                userRegisterForm.classList.add("error-show");
                // Xóa lỗi khi user sửa lại
                const confirmInput = document.getElementById("confirmPasswordRegister");
                confirmInput.addEventListener(
                    "input",
                    () => {
                        if (confirmInput.value === password && error) error.remove();
                    },
                    { once: true }
                );
                return;
            }

            // Gửi dữ liệu lên backend
            try {
                const res = await fetch(`${API_CONFIG.DEPLOY_URL}/users/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        email,
                        password
                    })
                });

                const data = await res.json();

                if (res.ok) {
                    showToast("Register success!", "success");
                    allInputs.forEach(input => {
                        input.value = ""; // xóa chữ
                        input.focus(); // đưa con trỏ lại input
                        input.dispatchEvent(new Event("input")); // để CSS label tự cập nhật
                    })
                } else {
                    showToast(data.message || "Register failed!", "error");
                }
            } catch (err) {
                alert("Cannot connect to server.");
            }
        });
    }

// User login form api
    const  loginForm = ()=>{
        document.getElementById("btnLogin").addEventListener("click", async (e) => {
            e.preventDefault();

            const email = document.getElementById("emailLogin").value.trim();
            const password = document.getElementById("passwordLogin").value.trim();
            // Gửi dữ liệu lên backend

            try{
                const res = await fetch(`${API_CONFIG.DEPLOY_URL}/users/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    }),
                    credentials: "include" // 🔥 quan trọng
                });
                const data = await res.json();
                if(res.ok) {
                    localStorage.setItem("accessToken", data.accessToken);
                    localStorage.setItem("refreshToken", data.refreshToken);
                    showToast('Login success', "success");
                    setTimeout(() => location.reload(), 500); // đợi 0.3s rồi reload
                }else {
                    showToast(data.message, "error");
                }
            }
            catch (error) {
                console.log(error);
            }
        })
    }



// Forgot password
    const forgotPassword = () => {
        document.getElementById("forgotPasswordBtn").addEventListener("click", async (e) => {
            e.preventDefault();
            const email = document.getElementById("emailForgotPassword").value.trim();

            try{
                const res = await fetch(`${API_CONFIG.DEPLOY_URL}/users/forgot-password`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: email,
                    }),
                    credentials: "include" // 🔥 quan trọng
                });

                const data = await res.json();
                if(res.ok) {

                    showToast('Check Your Email', "success");
                }else {
                    showToast(data.message, "error");
                }
            }
            catch (error) {
                console.log(error);
            }
        })
    }


// Search Logic
    const searchLogic = () => {
        const searchRoots = document.querySelectorAll('.autocomplete-search, .autocomplete-search-responsive');
        searchRoots.forEach((root)=>{
            const input = root.querySelector('.search-input');
            const resultsBox = root.querySelector('.search-results');
            const searchWrapper = root.querySelector('.search');
            if(!input || !resultsBox || !searchWrapper) return;

            let timeout = null;

            // Ẩn gợi ý khi click ra ngoài
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.search')) {
                    resultsBox.classList.remove('show');
                }
            });

            input.addEventListener('input', () => {
                const query = input.value.trim();
                clearTimeout(timeout);

                if (query === '') {
                    resultsBox.innerHTML = '';
                    resultsBox.classList.remove('show');
                    return;
                }

                // Đợi người dùng ngừng gõ 300ms mới gọi API
                timeout = setTimeout(async () => {
                    try {
                        const res = await fetch(`${API_CONFIG.DEPLOY_URL}/productType?q=${encodeURIComponent(query)}`);
                        const data = await res.json();

                        if (res.ok && data.length > 0) {
                            renderResults(data);
                        } else {
                            resultsBox.innerHTML = `<div class='no-result'>No products found</div>`;
                            resultsBox.classList.add('show');
                        }
                    } catch (error) {
                        console.error('Search error:', error);
                        resultsBox.innerHTML = `<div class='no-result'>Error connecting to server</div>`;
                        resultsBox.classList.add('show');
                    }
                }, 300);
            });

            function renderResults(products) {
                const html = products
                    .slice(0, 6)
                    .map((p) => `
                      <div class="search-item" data-id='${p._id}'>
                         <img src="${p.images[0].url}" alt="">
                         <div class="search-info">
                               <p class="search-name">${p.name}</p>
                               <p class="search-see-more">See more</p>
                          </div>
                       </div>
                `)
                    .join('');

                resultsBox.innerHTML = html;
                resultsBox.classList.add('show');

                //Sự kiện click vào từng sản phẩm
                resultsBox.querySelectorAll('.search-item').forEach((item) => {
                    item.addEventListener('click', () => {
                        const id = item.getAttribute('data-id');
                        const product = products.find(p => p._id === id)
                        sessionStorage.setItem('product', JSON.stringify(product));
                        window.location.href = `../Production/Production.html?id=${id}`;
                    });
                });
            }
        })
    };

    const chooseLanguageLogic = () => {
        const languageBtn = document.querySelector(".language-button");
        const dropdown = document.querySelector(".language-dropdown");


        const storedLang = localStorage.getItem("selectedLang");
        let currentLang = null;

        try {
            currentLang = storedLang ? JSON.parse(storedLang) : null;
        } catch (err) {
            console.error("Invalid JSON in localStorage:", err);
            localStorage.removeItem("selectedLang");
        }

        if (!currentLang) {
            currentLang = {
                flag: `${FE_URL}/public/images/united-states.png`,
                lang: "EN",
            };

            localStorage.setItem("selectedLang", JSON.stringify(currentLang));
        }

        languageBtn.innerHTML = `
    <img src="${currentLang.flag}" alt="">
    <p>${currentLang.lang}</p>
  `;


        languageBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.classList.toggle("hidden");
        });


        document.addEventListener("click", () => {
            dropdown.classList.add("hidden");
        });


        dropdown.querySelectorAll("li").forEach((li) => {
            li.addEventListener("click", () => {
                const lang = li.dataset.lang;
                const flag = li.querySelector("img").src;

                const selectedLang = {
                    flag,
                    lang: lang.toUpperCase(),
                };


                localStorage.setItem("selectedLang", JSON.stringify(selectedLang));


                languageBtn.innerHTML = `
        <img src="${selectedLang.flag}" alt="">
        <p>${selectedLang.lang}</p>
      `;

                window.location.reload();
            });
        });
    };


    logicMenuModal()
    logicUserModal()
    searchInput()
    deleteInputUserModal()
    registerForm()
    loginForm()
    forgotPassword()
    searchLogic()
    chooseLanguageLogic()

})


window.addEventListener("load", (event) => {
    // GOOGLE SOCIAL LOGIN
    const loginGoogle = () => {

        // Khởi tạo popup Google OAuth2 (hiển thị chọn tài khoản)
        const client = google.accounts.oauth2.initCodeClient({
            client_id: "989333640465-booovcfjq5mo389qn4ptd0h1oojhpvb2.apps.googleusercontent.com",
            scope: "email profile openid",
            ux_mode: "popup",
            callback: handleGoogleResponse,
        });

        //  Khi click nút google icon => mở popup
        const googleLoginBtn = document.getElementById("googleLoginBtn");
        googleLoginBtn.addEventListener("click", () => {
            client.requestCode(); // hiện popup chọn tài khoản
        });

        // 3⃣ Callback khi user đăng nhập xong
        async function handleGoogleResponse(response) {

            const code = response.code; // Đây là mã xác thực bạn gửi cho backend

            console.log("code", code)
            try {
                const res = await fetch(`${API_CONFIG.DEPLOY_URL}/users/google-login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code }), //
                    credentials: "include",
                });

                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem("accessToken", data.accessToken);
                    localStorage.setItem("refreshToken", data.refreshToken);
                    showToast("Login with Google success", "success");
                    setTimeout(() => location.reload(), 500);
                } else {
                    showToast(data.message || "Login failed", "error");
                }
            } catch (err) {
                console.error("Google login error:", err);
            }
        }
    };
    const loginFaceBook = () =>{
        const facebookLoginBtn = document.getElementById("facebookLoginBtn");
        facebookLoginBtn.addEventListener("click", (e) => {
            showToast(`Facebook login is currently unavailable. Please log in with Google or your account.`,'error');
        })
    }

    const loginApple = () =>{
        const appleLoginBtn = document.getElementById("appleLoginBtn");
        appleLoginBtn.addEventListener("click", (e) => {
            showToast(`Apple login is currently unavailable. Please log in with Google or your account.`,'error');
        })
    }
    loginGoogle()
    loginFaceBook()
    loginApple()
})