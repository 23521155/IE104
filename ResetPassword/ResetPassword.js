import {API_CONFIG} from "../apiConfig.js";

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
const deleteInput = () =>{
    const inputClose = document.getElementById('input-close');
    inputClose.addEventListener('click', (event)=>{
        const wrapper = inputClose.closest(".input-reset-password");
        const input = wrapper.querySelector("input");
        input.value = "";
        input.focus();
        input.dispatchEvent(new Event("input"));
    })
}

const resetPassword = () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');


    document.getElementById('resetForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPassword = document.getElementById('newPassword').value;
        const res = await fetch(`${API_CONFIG.DEPLOY_URL}/users/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, newPassword }),
        });

        const data = await res.json();
        if(res.ok)
        {
            showToast('Password was changed', "success")
            setTimeout(() => {
                window.location.href = '../Home/Home.html';
            }, 1500);
        }
        else{
            showToast(data.message, "error");
        }
    });
}
deleteInput()
resetPassword()