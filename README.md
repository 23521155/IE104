# README

## Tên dự án

**ANDIFI — Website bán hàng thời trang (HTML • CSS • JavaScript)**

## Mô tả ngắn

ANDIFI là một website bán hàng thời trang đơn giản được xây dựng bằng **HTML**, **CSS**, và **vanilla JavaScript**. Mục tiêu của project là làm demo giao diện mua sắm (catalog, trang sản phẩm, giỏ hàng) và luồng UX cơ bản (thêm/xóa sản phẩm, cập nhật số lượng), phù hợp cho học tập, portfolio hoặc làm template khởi đầu.

## Tính năng chính

* Trang chủ hiển thị danh sách sản phẩm.
* Trang chi tiết sản phẩm với hình ảnh, mô tả và nút thêm vào giỏ hàng.
* Giỏ hàng: xem sản phẩm, thay đổi số lượng, xóa mục, tính tổng tiền.
* Responsive: hiển thị tốt trên desktop và mobile.
* Form liên hệ / đăng ký nhận tin.

## Công nghệ sử dụng

* HTML5
* CSS3 (Flexbox / Grid, media queries)
* JavaScript (ES6+; DOM manipulation, localStorage để lưu giỏ hàng)

## Cấu trúc thư mục (gợi ý)

```
IE104/
├─ animations
├─ Cart/
│  ├─ Cart.css
|  ├─ Cart.html
|  └─ Cart.js
├─ Home/
|  ├─ Home.css
|  ├─ Home.html
|  └─ Home.js
├─ Production/
|  ├─ Production.css
|  ├─ Production.html
|  └─ Production.js
├─ Productions/
|  ├─ Productions.css
|  ├─ Productions.html
|  └─ Productions.js
├─ public/
│  └─ images/
├─ ResetPassword/
|  ├─ ResetPassword.css
|  ├─ ResetPassword.html
|  └─ ResetPassword.js
├─ User/
|  ├─ User.css
|  ├─ User.html
|  └─ User.js
├─ WishList/
|  ├─ WishList.css
|  ├─ WishList.html
|  └─ WishList.js
├─ .gitignore
├─ 404.html
├─ Global.css
├─ Global.js
└─ render.yaml
```

## Hướng dẫn cài đặt & chạy (Local)

1. Clone repo hoặc tải mã nguồn về máy:

2. Mở file `index.html` bằng trình duyệt (double-click) hoặc dùng server tĩnh:

## Cách dùng (quickstart)

* Vào trang chủ, duyệt sản phẩm.
* Ở trang sản phẩm, nhấn **Thêm vào giỏ** để thêm sản phẩm.
* Truy cập trang **Giỏ hàng** để chỉnh số lượng hoặc xóa sản phẩm; tổng tiền sẽ được tính tự động.
* Dữ liệu giỏ hàng lưu trên `Backend`, nên vẫn giữ khi tải lại trang.

## Cải tiến & mở rộng (gợi ý)

* Tối ưu performance: lazy-load ảnh, nén asset.
* Viết tests cho logic giỏ hàng.
* Tích AI để phát hiện hành vi người dùng làm hệ thống gợi ý.

## Lưu ý kỹ thuật

* Việc reset password nhóm vẫn chưa thể gửi gmail trực tiếp về người dùng trên môi trường deploy.
* Nhóm vẫn chưa thể xử lý cookie khi hết hạn.
* Load hơi lâu vì Backend tụi mình chưa tối ưu.

## Liên hệ

Nếu bạn cần mình chỉnh README này sang tiếng Anh, xuất thành file README.md, hoặc có thắc mắc gì có thể gửi mail cho mình nguyenletuanphi12c1.2022@gmail.com
