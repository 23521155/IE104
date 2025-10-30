document.addEventListener('DOMContentLoaded', async () => {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.remove('hidden');
    await lottie.loadAnimation({
        container: document.getElementById('loading-animation'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '../animations/Grocery.json' // ✅ đường dẫn đúng
    });
    await lottie.loadAnimation({
        container: document.getElementById('loading-animation-ellipsis'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '../animations/Loading.json'
    });
    setTimeout(()=> {loadingOverlay.classList.add('hidden');},1000)
    let currentSlide = 0;
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    const slidesContainer = document.querySelector(".slides");

    function showSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        currentSlide = index;
        slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot) => dot.classList.remove("active"));
        dots[currentSlide].classList.add("active");
    }

    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 4000);

    dots.forEach((dot, idx) => {
        dot.addEventListener("click", () => showSlide(idx));
    });

    const storedLang = localStorage.getItem("selectedLang");
    const lang = storedLang ? JSON.parse(storedLang).lang.toLowerCase() : "en";

    const information = document.querySelector('.information');
    const knowMoreBtn = document.querySelector('.knowMore-button');
    let informationText
    let knowMoreText
    if(lang === 'vi'){
        informationText = 'Trang phục thời trang 2025 nêu bật sự cân bằng hài hòa giữa sự tối giản, bền vững,\n' +
            '                                Và\n' +
            '                                sang trọng hiện đại. Các nhà thiết kế ưa chuộng những hình bóng sạch sẽ, kết cấu mềm mại và thân thiện với môi trường\n' +
            '                                các loại vải tăng cường sự thoải mái trong khi vẫn duy trì sự tinh tế. Xu hướng nhấn mạnh\n' +
            '                                vượt thời gian\n' +
            '                                hình dạng được mô phỏng lại với các chi tiết táo bạo, đường may sáng tạo và thiết kế linh hoạt\n' +
            '                                thích hợp\n' +
            '                                cho cả bối cảnh thông thường và trang trọng.'
        knowMoreText = 'XEM THÊM'
    }
    else if(lang === 'en'){
        informationText = 'Fashion dress 2025 highlights a harmonious balance between minimalism, sustainability,\n                                and\n                                modern elegance. Designers embrace clean silhouettes, soft textures, and eco-friendly\n                                fabrics that enhance comfort while maintaining sophistication. The trend emphasizes\n                                timeless\n                                shapes reimagined with bold details, innovative tailoring, and versatile designs\n                                suitable\n                                for both casual and formal settings.'
        knowMoreText = 'KNOW MORE'
    }
    information.innerHTML = `${informationText}`
    knowMoreBtn.innerHTML = `${knowMoreText}`
})




