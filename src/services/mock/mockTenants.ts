import type { Tenant } from '../../types';

export const mockTenants: Tenant[] = [
  {
    id: '1',
    roomId: '1', // A1-01-01
    fullName: 'Nguyễn Văn A',
    phone: '0901234567',
    email: 'nguyenvana@email.com',
    idCard: '001234567890',
    dateOfBirth: new Date('1995-03-15'),
    hometown: 'Hà Nội',
    moveInDate: new Date('2024-01-15'),
    deposit: 3000000,
    monthlyRent: 3000000,
    status: 'active',
    notes: 'Khách thuê lâu năm, thanh toán đúng hạn',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    roomId: '2', // A1-01-02
    fullName: 'Trần Thị B',
    phone: '0912345678',
    email: 'tranthib@email.com',
    idCard: '001234567891',
    dateOfBirth: new Date('1992-07-20'),
    hometown: 'Đà Nẵng',
    moveInDate: new Date('2024-02-01'),
    deposit: 3500000,
    monthlyRent: 3500000,
    status: 'active',
    notes: 'Làm việc tại công ty ABC',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '3',
    roomId: '1001', // A2-01-07 (first of A2)
    fullName: 'Lê Văn C',
    phone: '0923456789',
    email: 'levanc@email.com',
    idCard: '001234567892',
    dateOfBirth: new Date('1998-11-10'),
    hometown: 'TP.HCM',
    moveInDate: new Date('2024-03-01'),
    deposit: 2900000,
    monthlyRent: 2900000,
    status: 'active',
    notes: 'Sinh viên năm cuối',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: '4',
    roomId: '1005', // A2-01-11
    fullName: 'Phạm Thị D',
    phone: '0934567890',
    email: 'phamthid@email.com',
    idCard: '001234567893',
    dateOfBirth: new Date('1990-05-25'),
    hometown: 'Cần Thơ',
    moveInDate: new Date('2024-01-20'),
    deposit: 3300000,
    monthlyRent: 3300000,
    status: 'active',
    notes: 'Giáo viên, rất sạch sẽ',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
];


