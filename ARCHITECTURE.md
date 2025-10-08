# Room Management System - Architecture & Development Plan

## 📋 Tổng quan

Hệ thống quản lý phòng trọ bao gồm 3 phần chính:
1. **Admin React App** - Dashboard quản trị (đang phát triển)
2. **Client App** - Ứng dụng cho khách thuê (sắp phát triển)
3. **API Server** - Backend NodeJS (sắp phát triển)

---

## 🏗️ Kiến trúc hệ thống

### Cấu trúc dự án đề xuất

```
room-management/
├── room-admin-react-app/      # ✅ Admin panel (đang có)
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── pages/             # Page components
│   │   ├── contexts/          # React Context API
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API services
│   │   ├── types/             # TypeScript types
│   │   └── utils/             # Utility functions
│   ├── package.json
│   └── vite.config.ts
│
├── room-client-app/            # 🔜 Client web/app cho khách thuê
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── LoginPage/
│   │   │   ├── DashboardPage/
│   │   │   ├── InvoicesPage/
│   │   │   ├── PaymentPage/
│   │   │   └── RequestsPage/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   └── services/
│   ├── package.json
│   └── vite.config.ts
│
├── room-api-server/            # 🔜 Backend API chung
│   ├── src/
│   │   ├── routes/
│   │   │   ├── admin/         # Admin routes
│   │   │   │   ├── buildings.ts
│   │   │   │   ├── blocks.ts
│   │   │   │   ├── floors.ts
│   │   │   │   ├── rooms.ts
│   │   │   │   └── tenants.ts
│   │   │   └── client/        # Client routes
│   │   │       ├── auth.ts
│   │   │       ├── profile.ts
│   │   │       ├── invoices.ts
│   │   │       └── payments.ts
│   │   ├── controllers/
│   │   ├── models/            # Database models
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── authorize.ts
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.ts
│   ├── prisma/                # Database schema
│   ├── package.json
│   └── tsconfig.json
│
└── room-management-shared/    # 🔜 Shared types & utils
    ├── src/
    │   ├── types/
    │   │   ├── Building.ts
    │   │   ├── Block.ts
    │   │   ├── Floor.ts
    │   │   ├── Room.ts
    │   │   └── Tenant.ts
    │   └── utils/
    │       ├── formatters.ts
    │       └── validators.ts
    └── package.json
```

---

## 🎯 Lý do tách riêng Admin & Client

### ✅ Ưu điểm của kiến trúc tách biệt

#### 1. **Security (Bảo mật)**
- ✅ Admin và Client có authentication riêng
- ✅ Admin routes hoàn toàn tách biệt
- ✅ Giảm thiểu rủi ro bị tấn công vào admin panel
- ✅ Client không thể access admin endpoints

#### 2. **Performance (Hiệu suất)**
- ✅ Client app nhẹ hơn (không load admin code)
- ✅ Bundle size nhỏ hơn cho end users
- ✅ Faster initial load time
- ✅ Better code splitting

#### 3. **User Experience**
- ✅ UI/UX tối ưu cho từng đối tượng người dùng
- ✅ Admin: Desktop-first, nhiều data tables
- ✅ Client: Mobile-first, simple & clean
- ✅ Không conflict về design system

#### 4. **Development & Maintenance**
- ✅ Team có thể làm song song
- ✅ Deploy độc lập
- ✅ Scale độc lập
- ✅ Dễ maintain, không ảnh hưởng lẫn nhau
- ✅ Testing riêng biệt

#### 5. **Deployment & Scaling**
- ✅ Deploy lên các domain khác nhau
  - Admin: `admin.yourdomain.com`
  - Client: `app.yourdomain.com`
- ✅ Scale riêng theo traffic
- ✅ Update một phần không ảnh hưởng phần kia

### ❌ Nhược điểm (và cách giải quyết)

| Nhược điểm | Giải pháp |
|-----------|----------|
| Duplicate code | → Tạo shared package cho types & utils |
| Setup phức tạp hơn | → Monorepo với pnpm/yarn workspaces |
| Sync types khó | → Shared package + auto-generate từ API |

---

## 🚀 Roadmap phát triển

### Phase 1: Backend API Server (2-3 tuần) 🔜

**Tech stack:**
- Node.js + Express/NestJS
- TypeScript
- Prisma ORM (hoặc TypeORM)
- PostgreSQL (hoặc MongoDB)
- JWT Authentication
- Zod validation

**Tasks:**
```bash
✅ Setup project structure
✅ Database schema design
✅ Authentication & Authorization
✅ Admin CRUD APIs
  - Buildings
  - Blocks
  - Floors
  - Rooms
  - Tenants
✅ Client APIs
  - Profile
  - Invoices
  - Payments
✅ File upload (avatars, documents)
✅ Error handling & logging
✅ API documentation (Swagger)
```

**Database Schema Example:**
```prisma
// prisma/schema.prisma
model Building {
  id          String   @id @default(cuid())
  name        String
  address     String
  description String?
  totalBlocks Int
  blocks      Block[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Block {
  id          String   @id @default(cuid())
  buildingId  String
  building    Building @relation(fields: [buildingId], references: [id])
  name        String
  totalFloors Int
  floors      Floor[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// ... other models
```

---

### Phase 2: Tích hợp Admin App với API (1 tuần) 🔜

**Tasks:**
```bash
✅ Thay mock data bằng real API calls
✅ Setup axios/fetch service
✅ Add authentication flow
  - Login page
  - JWT token storage
  - Auto refresh token
✅ Loading states
✅ Error handling
✅ Success/error notifications
✅ Pagination
✅ Search & filters
```

**API Service Example:**
```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

// Add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Buildings API
export const buildingsAPI = {
  getAll: () => api.get('/admin/buildings'),
  getById: (id: string) => api.get(`/admin/buildings/${id}`),
  create: (data: CreateBuildingDto) => api.post('/admin/buildings', data),
  update: (id: string, data: UpdateBuildingDto) => 
    api.put(`/admin/buildings/${id}`, data),
  delete: (id: string) => api.delete(`/admin/buildings/${id}`),
};

// ... other APIs
```

---

### Phase 3: Client App Development (2-3 tuần) 🔜

**Tech stack:**
- React + TypeScript
- Vite
- Chakra UI (hoặc Tailwind CSS)
- React Router
- React Query (data fetching)
- Mobile-first design

**Features:**

#### 🔐 Authentication
- Login with phone/email
- OTP verification
- Password reset
- Remember me

#### 🏠 Dashboard
- Xem thông tin phòng hiện tại
- Thông tin hợp đồng
- Số ngày còn lại
- Thông báo quan trọng

#### 💰 Invoices & Payments
- Xem hóa đơn hàng tháng
  - Tiền phòng
  - Điện, nước
  - Các khoản phụ thu
- Lịch sử thanh toán
- Thanh toán online
  - VNPay
  - Momo
  - ZaloPay
- Download hóa đơn PDF

#### 🛠️ Maintenance Requests
- Gửi yêu cầu sửa chữa
- Upload hình ảnh
- Theo dõi tiến độ
- Đánh giá sau khi hoàn thành

#### 💬 Communication
- Chat với admin
- Thông báo realtime (Socket.io)
- Nhận thông báo app (Push notifications)

#### 👤 Profile
- Xem/sửa thông tin cá nhân
- Thay đổi mật khẩu
- Upload avatar
- Thông tin CMND/CCCD

**Client App Pages:**
```
/login              - Đăng nhập
/register           - Đăng ký (nếu cho phép)
/forgot-password    - Quên mật khẩu

/dashboard          - Trang chủ
/room               - Thông tin phòng
/invoices           - Hóa đơn
/invoices/:id       - Chi tiết hóa đơn
/payments           - Lịch sử thanh toán
/payment/:id        - Thanh toán
/requests           - Yêu cầu sửa chữa
/requests/new       - Tạo yêu cầu mới
/messages           - Tin nhắn
/profile            - Thông tin cá nhân
/settings           - Cài đặt
```

---

### Phase 4: Advanced Features (2-4 tuần) 🔜

#### Admin Features:
- 📊 **Dashboard Analytics**
  - Biểu đồ doanh thu
  - Tỷ lệ lấp đầy
  - Khách nợ tiền
  - Thống kê theo tháng/quý/năm

- 💵 **Invoice Management**
  - Tạo hóa đơn tự động
  - Tính điện nước
  - Email/SMS nhắc nhở
  - Báo cáo công nợ

- 📝 **Contract Management**
  - Tạo hợp đồng
  - Ký số
  - Gia hạn tự động
  - Lưu trữ documents

- 🔧 **Maintenance Tracking**
  - Quản lý yêu cầu sửa chữa
  - Assign to staff
  - Track progress
  - Cost tracking

- 👥 **User Management**
  - Admin users
  - Roles & permissions
  - Activity logs

#### Client Features:
- 📱 **Mobile App** (React Native)
- 🔔 **Push Notifications**
- 💬 **Real-time Chat**
- 📱 **QR Code** (check-in/out)
- 🌐 **Multi-language** (VI/EN)

---

## 🔧 Tech Stack Details

### Admin App (Current)
```json
{
  "framework": "React 19.1.1",
  "language": "TypeScript 5.9.3",
  "build": "Vite + SWC",
  "ui": "Chakra UI v3",
  "routing": "React Router v7",
  "state": "Context API",
  "styling": "Emotion"
}
```

### API Server (Recommended)
```json
{
  "runtime": "Node.js 20+",
  "framework": "Express.js or NestJS",
  "language": "TypeScript",
  "database": "PostgreSQL or MongoDB",
  "orm": "Prisma or TypeORM",
  "auth": "JWT + bcrypt",
  "validation": "Zod",
  "testing": "Jest + Supertest",
  "docs": "Swagger/OpenAPI"
}
```

### Client App (Recommended)
```json
{
  "framework": "React 18+",
  "language": "TypeScript",
  "build": "Vite",
  "ui": "Chakra UI or Tailwind CSS",
  "routing": "React Router",
  "state": "React Query + Zustand",
  "forms": "React Hook Form",
  "mobile": "React Native (later)"
}
```

---

## 🔐 Authentication & Authorization

### Admin Authentication
```typescript
// JWT Payload
{
  userId: string;
  email: string;
  role: 'super_admin' | 'admin' | 'staff';
  permissions: string[];
  iat: number;
  exp: number;
}
```

**Admin Roles:**
- `super_admin`: Full access
- `admin`: Manage buildings, rooms, tenants
- `staff`: View only, handle requests

### Client Authentication
```typescript
// JWT Payload
{
  tenantId: string;
  phone: string;
  roomId: string;
  iat: number;
  exp: number;
}
```

---

## 📊 API Endpoints Overview

### Admin Endpoints
```
POST   /api/admin/auth/login
POST   /api/admin/auth/refresh
GET    /api/admin/dashboard/stats

GET    /api/admin/buildings
POST   /api/admin/buildings
GET    /api/admin/buildings/:id
PUT    /api/admin/buildings/:id
DELETE /api/admin/buildings/:id

GET    /api/admin/blocks
POST   /api/admin/blocks
PUT    /api/admin/blocks/:id
DELETE /api/admin/blocks/:id

GET    /api/admin/floors
POST   /api/admin/floors
PUT    /api/admin/floors/:id
DELETE /api/admin/floors/:id

GET    /api/admin/rooms
POST   /api/admin/rooms
PUT    /api/admin/rooms/:id
DELETE /api/admin/rooms/:id

GET    /api/admin/tenants
POST   /api/admin/tenants
PUT    /api/admin/tenants/:id
DELETE /api/admin/tenants/:id

GET    /api/admin/invoices
POST   /api/admin/invoices
PUT    /api/admin/invoices/:id
DELETE /api/admin/invoices/:id
```

### Client Endpoints
```
POST   /api/client/auth/login
POST   /api/client/auth/otp/send
POST   /api/client/auth/otp/verify
POST   /api/client/auth/refresh

GET    /api/client/profile
PUT    /api/client/profile
POST   /api/client/profile/avatar

GET    /api/client/room
GET    /api/client/contract

GET    /api/client/invoices
GET    /api/client/invoices/:id
POST   /api/client/invoices/:id/pay

GET    /api/client/requests
POST   /api/client/requests
GET    /api/client/requests/:id
PUT    /api/client/requests/:id

GET    /api/client/messages
POST   /api/client/messages
```

---

## 📦 Shared Package Setup

### Create shared package
```bash
mkdir room-management-shared
cd room-management-shared
npm init -y
```

### Package.json
```json
{
  "name": "@room-management/shared",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "watch": "tsc --watch"
  },
  "devDependencies": {
    "typescript": "^5.9.3"
  }
}
```

### Usage in apps
```bash
# Link shared package
cd room-management-shared
npm link

cd ../room-admin-react-app
npm link @room-management/shared

cd ../room-client-app
npm link @room-management/shared

cd ../room-api-server
npm link @room-management/shared
```

### Import in code
```typescript
import { Building, Room, Tenant } from '@room-management/shared';
```

---

## 🌐 Deployment Strategy

### Development
```
Admin:  http://localhost:5173
Client: http://localhost:5174
API:    http://localhost:3000
```

### Production

#### Option 1: Separate Domains
```
Admin:  https://admin.yourdomain.com
Client: https://app.yourdomain.com
API:    https://api.yourdomain.com
```

#### Option 2: Subpaths
```
Admin:  https://yourdomain.com/admin
Client: https://yourdomain.com
API:    https://yourdomain.com/api
```

### Recommended Stack:
- **Frontend**: Vercel or Netlify
- **Backend**: Railway, Render, or DigitalOcean
- **Database**: Supabase, Railway, or DigitalOcean
- **CDN**: Cloudflare
- **File Storage**: AWS S3 or Cloudinary

---

## 📝 Next Steps

### Immediate (Tuần này)
1. ✅ Hoàn thiện Admin App UI
2. ✅ Fix các lỗi TypeScript còn lại
3. ✅ Test tất cả CRUD operations
4. ✅ Add loading states

### Short-term (1-2 tuần tới)
1. 🔜 Setup API Server project
2. 🔜 Design database schema
3. 🔜 Implement authentication
4. 🔜 Build Admin APIs
5. 🔜 Integrate Admin App với API

### Mid-term (3-4 tuần tới)
1. 🔜 Build Client App
2. 🔜 Implement Client APIs
3. 🔜 Add payment integration
4. 🔜 Testing & bug fixes

### Long-term (2-3 tháng)
1. 🔜 Advanced features
2. 🔜 Mobile app
3. 🔜 Performance optimization
4. 🔜 Production deployment

---

## 💡 Best Practices

### Code Organization
- ✅ Use TypeScript strict mode
- ✅ Follow consistent naming conventions
- ✅ Implement proper error handling
- ✅ Write meaningful comments
- ✅ Use ESLint + Prettier

### Security
- ✅ Never expose sensitive keys
- ✅ Use environment variables
- ✅ Implement rate limiting
- ✅ Validate all inputs
- ✅ Sanitize user data
- ✅ Use HTTPS in production
- ✅ Implement CORS properly

### Performance
- ✅ Lazy load components
- ✅ Optimize images
- ✅ Use React Query for caching
- ✅ Implement pagination
- ✅ Debounce search inputs
- ✅ Minimize bundle size

### Testing
- ✅ Unit tests for utilities
- ✅ Integration tests for APIs
- ✅ E2E tests for critical flows
- ✅ Test error scenarios
- ✅ Test mobile responsiveness

---

## 📚 Resources & Documentation

### Tech Docs
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Chakra UI](https://chakra-ui.com)
- [Vite](https://vitejs.dev)
- [Express](https://expressjs.com)
- [Prisma](https://www.prisma.io)

### Tutorials
- [Building REST APIs with Express](https://expressjs.com/en/guide/routing.html)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [React Query Guide](https://tanstack.com/query/latest/docs/react/overview)

---

## 🤝 Contributing

### Git Workflow
```bash
# Feature branch
git checkout -b feature/invoice-management

# Commit with conventional commits
git commit -m "feat: add invoice creation"

# Push and create PR
git push origin feature/invoice-management
```

### Commit Convention
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Maintenance

---

## 📞 Support & Contact

- **Developer**: [Your Name]
- **Email**: [your@email.com]
- **GitHub**: [github.com/yourname]

---

**Last Updated**: October 7, 2025

**Version**: 1.0.0
