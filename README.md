# Web Thiệp Mời Tốt Nghiệp — Nguyễn Trí Dũng

Gồm 3 phần:
- **frontend/**: React (Vite). Trang `/` là landing page thiệp mời + form đăng ký. Trang `/admin` là danh sách người đã đăng ký.
- **backend/**: Spring Boot (Java 17, Maven), expose API `/api/guests` (GET danh sách, POST đăng ký, DELETE xóa).
- **MySQL**: lưu dữ liệu người đăng ký.

Không có bảo mật/đăng nhập gì cả — đúng như yêu cầu, đơn giản cho việc test/dùng nội bộ.

---

## Cách 1 — Chạy bằng Docker (khuyên dùng, nhanh nhất)

Yêu cầu server đã cài **Docker** và **Docker Compose**.

### Bước 1: Đưa code lên server

```bash
# Trên máy bạn, nén thư mục tot-nghiep-app rồi upload lên server (scp/rsync/git...)
scp -r tot-nghiep-app user@your-server-ip:/home/user/
```

### Bước 2: Sửa địa chỉ backend cho frontend

Mở file `docker-compose.yml`, tìm dòng:

```yaml
  frontend:
    build:
      context: ./frontend
      args:
        VITE_API_URL: http://localhost:8080/api
```

Đổi `http://localhost:8080/api` thành **IP hoặc domain thật của server** bạn, ví dụ:

```yaml
        VITE_API_URL: http://123.45.67.89:8080/api
```

(Vì đây là build-time cho React, trình duyệt người dùng sẽ gọi thẳng tới địa chỉ này, nên phải là địa chỉ truy cập được từ bên ngoài, không phải `localhost`.)

### Bước 3: Build & chạy

```bash
cd tot-nghiep-app
docker compose up -d --build
```

Lần đầu build sẽ mất vài phút (tải Maven + npm packages).

### Bước 4: Kiểm tra

- Trang mời + form đăng ký: `http://<ip-server>` (cổng 80)
- Trang danh sách admin: `http://<ip-server>/admin`
- API backend: `http://<ip-server>:8080/api/guests`

Xem log nếu có lỗi:
```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mysql
```

Dừng:
```bash
docker compose down
```

Dừng và xóa luôn dữ liệu MySQL:
```bash
docker compose down -v
```

---

## Cách 2 — Chạy thủ công không dùng Docker (nếu server đã có sẵn MySQL/Java/Node)

### 1. Chuẩn bị MySQL

```sql
CREATE DATABASE totnghiep_db CHARACTER SET utf8mb4;
```

### 2. Chạy backend

Yêu cầu: Java 17 + Maven.

```bash
cd backend
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=totnghiep_db
export DB_USER=root
export DB_PASSWORD=your_mysql_password
mvn clean package -DskipTests
java -jar target/app.jar
```

Backend sẽ chạy ở cổng `8080`. Bảng `guests` sẽ tự tạo (nhờ `ddl-auto=update`).

Muốn chạy nền lâu dài, dùng `nohup` hoặc tạo systemd service:

```bash
nohup java -jar target/app.jar > backend.log 2>&1 &
```

### 3. Build & chạy frontend

Yêu cầu: Node.js 18+.

```bash
cd frontend
npm install
VITE_API_URL=http://<ip-server>:8080/api npm run build
```

Thư mục `dist/` sinh ra chính là các file tĩnh (HTML/CSS/JS). Copy nó lên thư mục phục vụ web của bạn, ví dụ Nginx đang chạy sẵn trên server:

```bash
sudo cp -r dist/* /var/www/html/
```

Rồi cấu hình Nginx trỏ vào `/var/www/html` như bình thường (có sẵn `nginx.conf` mẫu trong thư mục `frontend/` để tham khảo, xử lý route SPA bằng `try_files`).

Hoặc nếu chỉ muốn test nhanh không cần Nginx:
```bash
npm install -g serve
serve -s dist -l 80
```

---

## Cấu trúc dữ liệu (bảng `guests`)

| Cột        | Kiểu       | Ghi chú                    |
|------------|-----------|-----------------------------|
| id         | BIGINT PK | tự tăng                     |
| ho_ten     | VARCHAR   | bắt buộc                    |
| sdt        | VARCHAR   | không bắt buộc               |
| cam_nhan   | TEXT      | lời chúc / cảm nhận          |
| created_at | DATETIME  | thời điểm đăng ký            |

## API tóm tắt

| Method | Endpoint            | Mô tả                          |
|--------|----------------------|----------------------------------|
| POST   | `/api/guests`        | Đăng ký tham dự (body: `hoTen`, `sdt`, `camNhan`) |
| GET    | `/api/guests`        | Lấy danh sách, mới nhất trước    |
| GET    | `/api/guests/count`  | Tổng số người đăng ký            |
| DELETE | `/api/guests/{id}`   | Xóa 1 người khỏi danh sách       |

## Tùy chỉnh nội dung trang mời

Mở `frontend/src/pages/Home.jsx` để sửa phần "Giới thiệu bản thân", "Lời cảm ơn", thời gian/địa điểm, số điện thoại liên hệ... Ảnh thiệp mời gốc nằm ở `frontend/public/thiep-moi.jpg`, có thể thay bằng ảnh khác cùng tên file.
