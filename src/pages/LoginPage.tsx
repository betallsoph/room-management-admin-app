import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { appToaster } from '../lib/toaster';
import './LoginPage.css';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = window.localStorage.getItem('room-admin-auth');
    if (token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setShowSkeleton(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          (result && (result.message || result.error || result.detail)) ||
          'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
        throw new Error(message);
      }

      const token = result?.token ?? result?.accessToken ?? '';

      if (!token) {
        throw new Error('Phản hồi đăng nhập thiếu token. Vui lòng thử lại.');
      }

      window.localStorage.setItem(
        'room-admin-auth',
        JSON.stringify({
          token,
          email,
          loggedInAt: Date.now(),
        }),
      );

      appToaster.success({
        title: 'Đăng nhập thành công',
        description: 'Chào mừng quay lại Room Manager!',
      });

      navigate('/', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(message);
      appToaster.error({
        title: 'Không thể đăng nhập',
        description: message,
      });
    } finally {
      setShowSkeleton(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-pattern" aria-hidden />

      <div className="auth-card">
        <div className="auth-form">
          <div className="auth-form__header">
            <span className="auth-form__eyebrow">Room Manager</span>
            <h1>Welcome!!</h1>
            <p>Sign in to keep your buildings, blocks, rooms and tenants in sync.</p>
          </div>

          <form className="auth-form__body" onSubmit={handleSubmit}>
            <label htmlFor="email">
              <span>Email</span>
              <input
                id="email"
                type="email"
                value={email}
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@roommanager.vn"
                required
              />
            </label>

            <label htmlFor="password">
              <span>Mật khẩu</span>
              <input
                id="password"
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
              />
            </label>

            <div className="auth-form__actions">
              <button type="submit" className="auth-primary-btn" disabled={submitting}>
                {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
              <button type="button" className="auth-secondary-btn" onClick={() => navigate('/register')}>
                Đăng ký
              </button>
            </div>

            {error && <div className="auth-error">{error}</div>}
          </form>
        </div>

        <div className="auth-hero" aria-hidden>
          <img src="/images/login.png" alt="Room Manager illustration" className="auth-illustration" />
          {showSkeleton && (
            <div className="auth-hero__skeleton">
              <div className="auth-skeleton-card">
                <div className="auth-skeleton-avatar" />
                <div className="auth-skeleton-lines">
                  <span />
                  <span />
                  <span className="short" />
                </div>
              </div>
            </div>
          )}
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

export default LoginPage;
