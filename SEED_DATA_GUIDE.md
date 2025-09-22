# 🌱 Hướng Dẫn Sử Dụng Seed Data

## 📋 Tổng Quan

Script seed data này sẽ tạo ra dữ liệu mẫu phong phú cho ứng dụng Money Management, bao gồm:

- **3 Users** với thông tin đầy đủ
- **15 Wallets** (5 ví cho mỗi user)
- **Default Categories** cho mỗi user
- **Random Transactions** (5-8 giao dịch cho mỗi user)
- **Sample Budgets** (2-3 ngân sách cho mỗi user)
- **Sample Notifications** (4 thông báo cho mỗi user)

## 🚀 Cách Sử Dụng

### 1. Cài Đặt Dependencies

```bash
# Cài đặt tsx nếu chưa có
npm install

# Hoặc cài đặt tsx riêng
npm install -D tsx
```

### 2. Tạo Dữ Liệu Mẫu

```bash
# Tạo dữ liệu mẫu mới
npm run seed:init
```

### 3. Reset Database

```bash
# Xóa toàn bộ dữ liệu và tạo lại
npm run seed:reset
```

## 👥 Thông Tin Đăng Nhập

Sau khi chạy `npm run seed:init`, bạn có thể đăng nhập với các tài khoản sau:

| Email                   | Password | Tên           |
| ----------------------- | -------- | ------------- |
| `an.nguyen@example.com` | `123456` | Nguyễn Văn An |
| `binh.tran@example.com` | `123456` | Trần Thị Bình |
| `cuong.le@example.com`  | `123456` | Lê Minh Cường |

## 💰 Dữ Liệu Mẫu Chi Tiết

### Users

- **Nguyễn Văn An**: Sinh năm 1990, có đầy đủ thông tin cá nhân
- **Trần Thị Bình**: Sinh năm 1995, có đầy đủ thông tin cá nhân
- **Lê Minh Cường**: Sinh năm 1988, có đầy đủ thông tin cá nhân

### Wallets (5 ví cho mỗi user)

1. **Ví Tiền Mặt** - 500,000 VND
2. **Ngân Hàng ACB** - 2,500,000 VND
3. **Thẻ Tín Dụng** - -500,000 VND (nợ)
4. **Ví MoMo** - 300,000 VND
5. **Tài Khoản Tiết Kiệm** - 5,000,000 VND

### Categories (Tự động tạo cho mỗi user)

**Income Categories:**

- Salary (Lương)
- Business (Kinh doanh)
- Investment (Đầu tư)
- Other Income (Thu nhập khác)

**Expense Categories:**

- Food & Dining (Ăn uống)
- Transportation (Giao thông)
- Shopping (Mua sắm)
- Entertainment (Giải trí)
- Bills & Utilities (Hóa đơn)
- Healthcare (Y tế)
- Education (Giáo dục)
- Other Expenses (Chi phí khác)

### Sample Transactions

**Income Transactions:**

- Lương tháng 12/2024: 15,000,000 VND
- Thưởng cuối năm: 2,000,000 VND
- Bán đồ cũ: 500,000 VND

**Expense Transactions:**

- Ăn uống tuần này: 800,000 VND
- Xăng xe: 200,000 VND
- Mua quần áo: 1,500,000 VND
- Xem phim: 300,000 VND
- Tiền điện nước: 1,200,000 VND
- Khám bệnh: 500,000 VND
- Học phí khóa học: 800,000 VND

### Sample Budgets

1. **Ngân sách Ăn uống**: 2,000,000 VND/tháng
2. **Ngân sách Mua sắm**: 3,000,000 VND/tháng
3. **Ngân sách Giải trí**: 1,000,000 VND/tháng
4. **Ngân sách Giao thông**: 800,000 VND/tháng

### Sample Notifications

1. "Chào mừng bạn đến với Money Manager! Hãy bắt đầu quản lý tài chính của bạn."
2. "Bạn đã vượt quá ngân sách Ăn uống tháng này. Hãy kiểm soát chi tiêu tốt hơn!"
3. "Nhắc nhở: Hóa đơn điện nước sắp đến hạn thanh toán."
4. "Bạn có 1 giao dịch mới được thêm vào ví Ngân Hàng ACB."

## 🔧 Tính Năng Script

### Tự Động Hóa

- ✅ **Password Hashing**: Tự động hash password với SHA-256
- ✅ **Default Categories**: Tự động tạo categories mặc định
- ✅ **Random Data**: Tạo giao dịch và ngân sách ngẫu nhiên
- ✅ **Date Management**: Tự động tính toán ngày tháng
- ✅ **Wallet Updates**: Tự động cập nhật số dư ví sau giao dịch

### Error Handling

- ✅ **Duplicate Check**: Kiểm tra user đã tồn tại
- ✅ **Validation**: Validate dữ liệu trước khi tạo
- ✅ **Rollback**: Tự động rollback khi có lỗi
- ✅ **Logging**: Log chi tiết quá trình thực hiện

### Performance

- ✅ **Batch Operations**: Thực hiện operations theo batch
- ✅ **Memory Efficient**: Quản lý memory hiệu quả
- ✅ **Fast Execution**: Thực thi nhanh chóng

## 🐛 Troubleshooting

### Lỗi "Database not initialized"

```bash
# Đảm bảo app đã được start ít nhất 1 lần
npm start
# Sau đó chạy seed
npm run seed:init
```

### Lỗi "tsx command not found"

```bash
# Cài đặt tsx
npm install -D tsx
```

### Lỗi "User already exists"

```bash
# Reset database trước khi tạo mới
npm run seed:reset
npm run seed:init
```

## 📊 Kết Quả Mong Đợi

Sau khi chạy thành công, bạn sẽ thấy:

```
🎉 Hoàn thành tạo dữ liệu mẫu!
📊 Tổng kết:
   👥 Users: 3
   💰 Wallets: 15
   💳 Transactions: 18-24
   📊 Budgets: 6-9
   🔔 Notifications: 12

🔑 Thông tin đăng nhập:
   Email: an.nguyen@example.com | Password: 123456
   Email: binh.tran@example.com | Password: 123456
   Email: cuong.le@example.com | Password: 123456
```

## 🎯 Sử Dụng Trong Development

1. **Testing**: Sử dụng để test các tính năng
2. **Demo**: Demo app với dữ liệu thực tế
3. **Development**: Phát triển với dữ liệu đa dạng
4. **UI Testing**: Test giao diện với nhiều dữ liệu

## ⚠️ Lưu Ý

- Script này chỉ dành cho **development** và **testing**
- **KHÔNG** sử dụng trong production
- Dữ liệu sẽ được lưu **local** trên device
- Mỗi lần chạy `seed:reset` sẽ **xóa toàn bộ** dữ liệu cũ

---

**Happy Coding! 🚀**
