# Dorayaki-Factory-Server
Backend Pabrik, REST + NodeJS

## Deskripsi Web Service
Dorayaki-Factory-Server merupakan web service yang berguna sebagai backend dari Dorayaki-Factory-Client (client Pabrik). Dorayaki-Factory-Server merupakan kumpulan endpoint yang menerima request dan memberikan response terkait operasi kepada basis data pabrik, melakukan autentikasi dengan JSON Web Token, dan memberikan notifikasi email kepada admin ketika menerima request perubahan stok dari toko.

## Skema Basis Data
```
bahan(bahan_id,bahan_name,bahan_qty)
dora(dora_id,dora_name)
resep(bahan_id,dora_id,resep_qty)
users(username,email,password)
request(request_id,dora_id,req_qty,status)
request_log(log_id,request_id,ip,timestamp_req,epoint)
```
## Endpoint (hanya beberapa)
1. `POST /login`
   Menerima data username dan password dari pengguna saat login, memberikan response berupa access token dan refresh token JWT.
2. `POST /token`
   Menggenerate access token JWT dengan input refresh token
3. `POST /logout`
   Logout dari service dan menghapus refresh token akun pengguna dari list
4. `POST /users`
   Melakukan insersi data user saat register
5. `GET /request`
   Mendapatkan data request dari basis data, memberikan response berupa data request
6. `PUT /request`
   Melakukan update status terhadap request yang diaccept/reject ke basis data 
7. `POST /bahan`
   Menerima request menambah bahan ke basis data
8. `GET /bahan`
   Menerima request melihat bahan
9. `GET /bahan/:bahan_name`
   Melihat bahan spesifik
10. `GET /resep`
    Melihat data resep dari basis data
11. `POST /resep`
    Menambah resep baru ke basis data
12. `GET /doraName/:dora_id`
    Mendapatkan dorayaki berdasar ID
13. `POST /dora`
    Melakukan insersi data dorayaki ke basis data
14. `POST /reqdor`
    Menerima request dari interface pabrik (java servlet) dan mengcompose serta mengirimkan email request penambahan stok ke alamat email admin 

## Pembagian Tugas
- Autentikasi dengan JWT : 13519018
- Menerima/menolak request pengubahan stok dari interface pabrik (java servlet) : 13519018
- Membuat resep varian baru : 13519018
- Mengirimkan notifikasi email ketika mendapat request perubahan stok dari interface pabrik: 13519018 
- Mengubah stok bahan : 13519018,13519091
- Menambah bahan baru : 13519018,13519069,13519091
- Melihat daftar resep, daftar resep berdasarkan ID : 13519091
- Menambah resep baru : 13519069, 13519091
- Melihat detail resep : 13519069, 13519091
- Melihat daftar varian dorayaki (termasuk berdasarkan ID dan nama) : 13519091
- Melihat semua daftar bahan, daftar bahan berdasar ID dan Nama : 13519069, 13519091
- Melihat detail bahan : 13519069, 13519091
- Melihat daftar request ke admin pabrik : 13519018, 13519091


## Requirements
1. [nodejs](https://nodejs.org/en/download/)
2. [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/)
3. [expressjs](https://expressjs.com/en/starter/installing.html)
4. [postgresql](https://www.postgresql.org/download/)

## Cara Menjalankan
0. Pastikan requirements terpenuhi
1. Copy Paste Query pada file tempdb.sql ke postgresql lokal, membuat basis data
2. Jalankan console di direktori aplikasi (dorayaki-factory-server)
3. Pada console, jalankan command berikut untuk menginstal dependency :
   ```
   npm install
   ```
4. Setelah dependency terinstal, jalankan :
   ```
   node server.js
   ```
5. Server akan berjalan pada `http://localhost:5000`