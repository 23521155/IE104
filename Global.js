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
    userBtn.addEventListener('click', () => {
        userModal.style.opacity ='1';
        userModal.style.visibility = 'visible';
        userModalLogin.style.transform = 'scaleY(1)'
    })
    userCloseBtn.addEventListener('click', () => {
        userModalLogin.style.transform ='scaleY(0)'
        setTimeout(()=>{
            userModal.style.opacity = '0';
            userModal.style.visibility = 'hidden';
        },400)
    })
    userCLoseRegisterBtn.addEventListener('click', () => {
        userModalRegister.style.transform = 'scaleY(0)';
        setTimeout(()=>{
            userModalLogin.style.removeProperty('display');
            userModalRegister.style.display = 'none';
            userModal.style.opacity = '0';
            userModal.style.visibility = 'hidden';
        },400)
    })
    userCloseForgotPasswordBtn.addEventListener('click', () => {
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

logicMenuModal()
logicUserModal()