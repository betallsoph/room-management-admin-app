import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

export function RegisterInfoPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = window.localStorage.getItem('room-admin-auth');
    if (token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="auth-page">
      <div className="auth-pattern" aria-hidden />

      <div className="auth-card">
        <div className="auth-form">
          <div className="auth-form__header">
            <span className="auth-form__eyebrow">Room Manager</span>
            <h1>Đăng ký Quản trị viên</h1>
            <p>Do số lượng Quản trị viên cố định, hiện tại chúng tôi chưa mở đăng ký online.</p>
          </div>

          <div className="auth-info-box">
            <p>
              Vui lòng liên hệ trực tiếp đội phát triển hoặc quản trị hệ thống để được cấp tài khoản quản trị viên.
            </p>
            <p className="auth-info-box__note">
              Chúng tôi sẽ sớm mở quy trình đăng ký tự động khi hệ thống sẵn sàng.
            </p>
          </div>

          <div className="auth-form__actions">
            <button type="button" className="auth-primary-btn" onClick={() => navigate('/login')}>
              Quay lại đăng nhập
            </button>
            <a href="mailto:support@roommanager.vn" className="auth-secondary-link">
              Liên hệ nhà phát triển
            </a>
          </div>
        </div>

        <div className="auth-hero" aria-hidden>
          <img src="/images/login.png" alt="Room Manager illustration" className="auth-illustration" />
        </div>
      </div>

      <p className="auth-footer">
        Click{' '}
        <Link to="/" className="auth-footer__link">
          here
        </Link>{' '}
        để trở lại trang chính.
      </p>
    </div>
  );
}

export default RegisterInfoPage;
