// Open and close modal
const logicMenuModal =()=>{
    const menuBtn = document.getElementById('menu-button');
    const menuModal = document.getElementById('menu-modal');
    const closeBtn = document.getElementById('menu-modal-close');
    const content = document.querySelector('.content');
    const body = document.body;

    menuBtn.addEventListener('click', () => {
        // reset nếu đang đóng

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
    });

    closeBtn.addEventListener('click', () => {
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
    const search = document.querySelector(".search");
    const input = document.querySelector(".search-input");

    input.addEventListener("input", () => {
        if (input.value.trim() !== "") {
            // Khi có chữ
            search.classList.add("active");
        } else {
            // Khi trống
            search.classList.remove("active");
        }
    });
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
            const res = await fetch("http://localhost:1234/v1/users/register", {
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

            function showToast(message, type = "success") {
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
            console.error("Error:", err);
            alert("Cannot connect to server.");
        }
    });
}
logicMenuModal()
logicUserModal()
searchInput()
deleteInputUserModal()
registerForm()


