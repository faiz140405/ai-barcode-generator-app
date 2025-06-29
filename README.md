# AI Code Generator (Barcode & QR Code)

Aplikasi mobile cross-platform (iOS & Android) yang dibangun menggunakan React Native untuk membuat Barcode dan QR Code secara dinamis. Aplikasi ini dirancang dengan antarmuka yang bersih dan modern, serta ditenagai oleh kecerdasan buatan (AI) untuk memberikan pengalaman pengguna yang lebih intuitif.

![Tangkapan Layar Aplikasi](./assets/screenshot-aplikasi.jpg)


---

## 🚀 Fitur Utama

-   **Generator Barcode**: Membuat barcode standar format `CODE128` dari input teks atau angka.
-   **Generator QR Code**: Membuat QR Code untuk berbagai jenis data seperti URL, teks, nomor telepon, dan lainnya.
-   **Generator Cerdas (AI)**: Ditenagai oleh **Google Gemini**, fitur ini memungkinkan pengguna memberikan perintah dalam bahasa natural (contoh: "buatkan qrcode untuk website lampungprov.go.id") dan aplikasi akan secara otomatis mendeteksi tipe dan data yang harus dibuat.
-   **Simpan ke Galeri**: Pengguna dapat menyimpan barcode atau QR code yang telah dibuat langsung ke galeri foto perangkat sebagai gambar PNG berkualitas tinggi.
-   **Antarmuka Modern**: UI/UX yang bersih dengan mode gelap, dirancang untuk kemudahan penggunaan.

---

## 🛠️ Teknologi yang Digunakan

-   **Framework**: React Native (Expo)
-   **Bahasa**: TypeScript
-   **Generator Kode**: 
    -   `react-native-svg-barcode`
    -   `react-native-qrcode-svg`
-   **Kecerdasan Buatan**: Google Gemini API via `axios`
-   **Fitur Native**:
    -   `react-native-view-shot` untuk menangkap gambar komponen.
    -   `expo-media-library` untuk menyimpan gambar ke galeri.

---

## 🏁 Memulai Proyek

Untuk menjalankan proyek ini di lingkungan pengembangan lokal Anda, ikuti langkah-langkah berikut.

### Prasyarat

-   [Node.js](https://nodejs.org/en/) (versi LTS direkomendasikan)
-   `npm` atau `yarn`
-   Aplikasi **Expo Go** di ponsel iOS atau Android Anda

### Instalasi & Konfigurasi

1.  **Clone repositori ini:**
    ```bash
    git clone [https://github.com/faiz140405/ai-barcode-generator-app.git](https://github.com/faiz140405/ai-barcode-generator-app.git)
    ```

2.  **Masuk ke direktori proyek:**
    ```bash
    cd ai-barcode-generator-app
    ```

3.  **Instal semua dependensi:**
    ```bash
    npm install
    ```

4.  **Konfigurasi Environment Variable (API Key):**
    -   Buat salinan dari file `.env.example` dan beri nama `.env`.
        ```bash
        cp .env.example .env
        ```
    -   Buka file `.env` yang baru dibuat.
    -   Dapatkan API Key Anda dari [Google AI Studio](https://aistudio.google.com/).
    -   Masukkan API Key Anda ke dalam file `.env`:
        ```
        EXPO_PUBLIC_GEMINI_API_KEY=MASUKKAN_API_KEY_ANDA_DI_SINI
        ```

5.  **Jalankan server development Metro:**
    ```bash
    npx expo start
    ```

6.  Pindai (scan) QR code yang muncul di terminal menggunakan aplikasi Expo Go di ponsel Anda.

---

## 📖 Cara Menggunakan Aplikasi

1.  **Pilih Tipe Kode**: Gunakan tombol pilihan di bagian atas untuk memilih antara `Barcode` atau `QR Code`.
2.  **Masukkan Input**:
    -   **Mode Manual**: Ketik data (angka, teks, URL) yang ingin Anda buatkan kodenya, lalu tekan tombol **"Generate"**.
    -   **Mode AI**: Ketik sebuah perintah dalam bahasa natural (contoh: "buatkan barcode untuk nomor 1234567890"), lalu tekan tombol **"Generate with AI"**.
3.  **Lihat Hasil**: Kode akan langsung muncul di area tampilan di bawah.
4.  **Simpan Gambar**: Jika kode sudah muncul, tekan tombol **"Simpan ke Galeri"** untuk menyimpannya ke perangkat Anda. Saat pertama kali digunakan, aplikasi akan meminta izin akses ke galeri.

---

## ✍️ Penulis & Apresiasi

Dibuat dengan semangat dan secangkir kopi di Bandar Lampung oleh **Faiz** ([@faiz140405](https://github.com/faiz140405)).

Proyek ini dibimbing dan dibangun bersama dengan **Google Gemini** sebagai partner dalam proses coding, debugging, dan dokumentasi.
