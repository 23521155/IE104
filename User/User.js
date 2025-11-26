import {API_CONFIG,FE_URL} from "../apiConfig.js";

const translateText = async (text, targetLanguage = 'vi') => {
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
const showToast = async (message, type = "success") => {
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
    message = await translateText(message,lang);
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

document.addEventListener("DOMContentLoaded", async () => {
    // Editable fields (added address)
    const fields = ["firstName", "lastName", "username", "phoneNumber", "address","avatar"];

    let originalValues = {};

    const accessToken = localStorage.getItem("accessToken");
    const storedLang = localStorage.getItem("selectedLang");
    const lang = storedLang ? JSON.parse(storedLang).lang.toLowerCase() : "en";
    const res = await fetch(`${API_CONFIG.DEPLOY_URL}/users/`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const user = await res.json();

    const profileHeader = document.querySelector('.profile-header');
    profileHeader.innerHTML = `
    <h1>${user.username}</h1>
            <div class="actions">
                <a href="#" id="editBtn">${lang === 'vi' ? 'Chỉnh sửa' : 'Edit'}</a>
                <a href="#" id="saveBtn" style="display:none;">${lang === 'vi' ? 'Lưu' : 'Save'}</a>
                <a href="#" id="cancelBtn" style="display:none;">${lang === 'vi' ? 'Hủy' : 'Cancel'}</a>
                <a href="#" id="logoutBtn" class="logout-btn">${lang === 'vi' ? 'Đăng xuất' : 'Logout'}</a>
            </div>
    `
    const editBtn = document.getElementById("editBtn");
    const saveBtn = document.getElementById("saveBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    const profileLeft = document.querySelector('.profile-left');
    profileLeft.innerHTML =`
      <img src="${user.avatar || 'https://i.pinimg.com/236x/a8/9c/62/a89c6278fd539a81da3a32534648608a.jpg'}" alt="User photo" class="avatar" id="user-avatar">
      <input type="file" id="avatarInput" accept="image/*" style="display:none;">        

                <p><strong>${lang === 'vi' ? 'Họ' : 'First Name'}:</strong> <span id="firstName">${user.firstName}</span></p>
                <p><strong>${lang ==='vi' ? 'Tên' : 'Last Name'}:</strong> <span id="lastName">${user.lastName}</span></p>
                <p><strong>Email:</strong> <span id="email">${user.email}</span></p>
                <p><strong>${lang === 'vi' ? 'Tên người dùng' : 'Username'}:</strong> <span id="username">${user.username}</span></p>
                <p><strong>${lang === 'vi' ? 'Vai trò' : 'Role'}:</strong> <span>${user.role}</span></p>
               <div class="home-button-container">
                <a href="../Home/Home.html" class="home-button"><i class="fa-solid fa-house"></i></a>
               </div>
               
    `

    const avatar = document.getElementById("user-avatar");
    const avatarInput = document.getElementById("avatarInput");

    avatar.addEventListener("click", () => {
        // Only allows photo selection while in edit mode
        if (saveBtn.style.display !== "inline") return;
        avatarInput.click();
    });

    avatarInput.addEventListener("change",async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            avatar.src = reader.result; // Preview image
            avatar.dataset.newFile = "true"; // Make as new photo
            avatar.file = file; // Save file into DOM element
        };
        reader.readAsDataURL(file);
    });

    // Fetch orders
    const result = await fetch(`${API_CONFIG.DEPLOY_URL}/order/`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const orders = await result.json();

    const profileRight = document.querySelector('.profile-right');
    profileRight.innerHTML =`
     <h3>${lang === 'vi' ? 'Thông tin người dùng' : 'User info'}</h3>
                <p><strong>${lang === 'vi' ? 'Sđt' : 'Phone'}:</strong> <span id="phoneNumber">${user.phoneNumber}</span></p>
                <p><strong>${lang === 'vi' ? 'Địa chỉ' : 'Address'}:</strong> <span id="address">${user.address}</span></p>
                <h3>${lang === 'vi' ? 'Các đơn hàng' : 'Orders'}</h3>
                <table class="orders">
                    <thead>
                    <tr>
                        <th>${lang === 'vi' ? 'ID đơn hàng' : 'Order ID'}</th>
                        <th>${lang === 'vi' ? 'Ngày' : 'Date'}</th>
                        <th>${lang === 'vi' ? 'Trạng thái' : 'Status'}</th>
                        <th>${lang === 'vi' ? 'Tổng tiền' : 'Total'}</th>
                    </tr>
                    </thead>
                    <tbody>
                    ${orders.map((order) => {
                       const EXCHANGE_USD_TO_VND = 26328
                       let displayTotalPrice = order.totalPrice;
                       let formattedPrice;
                       if(lang === 'vi'){
                           formattedPrice = `${(displayTotalPrice * EXCHANGE_USD_TO_VND).toLocaleString("vi-VN")} ₫`;
                       }else if(lang === 'en'){
                           formattedPrice = `$${displayTotalPrice.toFixed(2)}`
                       }
                        return `
                     <tr>
                        <td>#${order._id}</td>
                        <td>${new Date(order.createdAt).toLocaleString()}</td>
                        <td><span class="status ${order.status}">${order.status}</span></td>
                        <td>${formattedPrice}</td>
                    </tr>
                    `
    }).join('')}
                    </tbody>
                </table>
    `

    // Edit button
    editBtn.addEventListener("click", (e) => {
        e.preventDefault();

        originalValues = {};
        originalValues.avatar = user.avatar || "";

        fields.forEach(id => {
            const span = document.getElementById(id);
            if (!span) return;
            originalValues[id] = span.innerText;


            const input = document.createElement("input");
            input.type = id === "email" ? "email" : "text";
            input.value = span.innerText;
            input.classList.add("edit-input");
            span.replaceWith(input);
            input.id = id;
        });

        document.getElementById("user-avatar").classList.add("editable");
        editBtn.style.display = "none";
        saveBtn.style.display = "inline";
        cancelBtn.style.display = "inline";
    });

    // Save button
    saveBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const updatedData = {};
        fields.forEach(id => {
            const input = document.getElementById(id);
            if (!input) return;
            if (input && input.value !== originalValues[id]) {
                updatedData[id] = input.value; // Just get the changed value
            }
        });

        if (avatar.dataset.newFile === "true" && avatar.file) updatedData['avatar'] = avatar.file;

        if (Object.keys(updatedData).length > 0 ) {
            const formData = new FormData();
            for (const key in updatedData) {
                formData.append(key, updatedData[key]);
            }

            // Fetch update user
            const res = await fetch(`${API_CONFIG.DEPLOY_URL}/users/update`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: formData,
            });

            if (!res.ok) showToast('user update error','error');

            // Convert input fields back to read-only spans with updated values
            // Replace editable inputs with static text display
            fields.forEach((id) => {
                const input = document.getElementById(id);
                if (!input) return;
                const newSpan = document.createElement("span");
                newSpan.id = id;
                newSpan.innerText = input.value;
                input.replaceWith(newSpan);
            });
            showToast('User information updated successfully!','success');
        } else {

            // No changes were made - revert all inputs back to original values
            // Convert inputs back to spans displaying original data
            fields.forEach((id) => {
                const input = document.getElementById(id);
                if (!input) return;
                const newSpan = document.createElement("span");
                newSpan.id = id;
                newSpan.innerText = originalValues[id];
                input.replaceWith(newSpan);
            });
        }

        document.getElementById("user-avatar").classList.remove("editable");
        editBtn.style.display = "inline";
        saveBtn.style.display = "none";
        cancelBtn.style.display = "none";
    });

    // Cancel button
    cancelBtn.addEventListener("click", (e) => {
        e.preventDefault();

        fields.forEach(id => {
            const input = document.getElementById(id);
            if (!input) return;
            const newSpan = document.createElement("span");
            newSpan.id = id;
            newSpan.innerText = originalValues[id];
            input.replaceWith(newSpan);
        });

        document.getElementById("user-avatar").classList.remove("editable");
        editBtn.style.display = "inline";
        saveBtn.style.display = "none";
        cancelBtn.style.display = "none";
    });

    // Logout button
    logoutBtn.addEventListener("click", async (e) => {

            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            await fetch(`${API_CONFIG.DEPLOY_URL}/users/logout`, {
                method: 'DELETE',
            })
            window.location.href = `${FE_URL}/Home/Home.html` // Go home page after logout
    })
});