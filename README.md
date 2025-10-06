# Aplikasi Web Coffee Shop

Aplikasi web modern dan responsif untuk coffee shop, dibangun menggunakan **React**, **Tailwind CSS**, dan **React Router**, dengan fitur autentikasi pengguna, manajemen produk, riwayat pesanan, dan panel admin.

---

## Fitur

- Registrasi, login, dan manajemen password pengguna  
- Profil pengguna (ubah data, unggah foto, ganti password)  
- Daftar produk dan halaman detail produk  
- Riwayat pesanan dengan detail lengkap  
- Panel admin untuk mengelola pengguna, produk, dan pesanan  
- Antarmuka responsif menggunakan **Tailwind CSS**  
- Notifikasi aksi (sukses/error)  

---

## Teknologi

- **React** – Library frontend  
- **React Router** – Routing sisi klien  
- **Tailwind CSS** – Framework CSS utility-first  
- **Lucide React** – Ikon  
- **LocalStorage** – Penyimpanan data sementara  

---

## Instalasi

1. Clone repository:

```bash
git clone https://github.com/username/coffee-shop-app.git
cd coffee-shop-app
```

## Cara Penggunaan

- **Registrasi/Login:** Buat akun baru atau login dengan akun yang sudah ada

- **Profil:** Perbarui informasi profil atau ganti password

- **Produk:** Lihat daftar produk dan detail masing-masing produk

- **Pesanan**: Cek riwayat pesanan dan detailnya

- **Panel Admin:** Kelola pengguna, produk, dan pesanan (akses terbatas)


## Autentikasi

- Menggunakan localStorage untuk menyimpan data pengguna dan sesi

- Protected route mengarahkan pengguna yang belum login ke halaman login

- Fitur lupa password memberikan notifikasi simulasi reset password

## Panel Admin

Hanya dapat diakses oleh pengguna dengan hak admin

Mengelola pengguna: tambah, ubah, hapus

Mengelola produk dan pesanan


## Display

**Home**
![Home](/public/result/home1.png)
![Home](/public/result/home-about.png)
![Home](/public/result/home-favorite.png)
![Home](/public/result/home-map.png)
![Home](/public/result/home-testimoni.png)

<br>

**Login**
![Login](/public/result/login.png)

**Navbar Setelah Login**
![Navbar](/public/result/navbar-login.png)

**Register**
![Register](/public/result/register.png)

**Forgot Password**
![Forgot Password](/public/result/forgot-password.png)

<br>

**Product**
![Product](/public/result/product-promo.png)
![Product](/public/result/product.png)
![Product](/public/result/product2.png)

**Detail Product**
![Detail Product](/public/result/detail-product.png)

**Payment Detail**
![Payment Detail](/public/result/payment-detail.png)

**History Order**
![History Order](/public/result/history-order.png)

**Detail Order**
![Detail Order](/public/result/detail-order.png)

<br>

**Profile**
![Profile](/public/result/profile.png)

**Dashboard**
![Dashboard](/public/result/dashboard.png)

**Product List**
![Product Admin](/public/result/product-admin.png)
![Sidebar product](/public/result/add-product-admin.png)
![Edit Product](/public/result/edit-product-admin.png)
![Search](/public/result/search-product-admin.png)

**Order List Admin**
![Order List Admin](/public/result/order-list-admin.png)

**List User**
![List User](/public/result/user-list-admin.png)