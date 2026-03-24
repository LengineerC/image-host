import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {login} = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!token.trim()) {
      setError('请输入Token');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      login(token.trim());
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2>图床管理系统</h2>
        <p>请输入您的访问Token以继续</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="token">
              访问Token
            </label>
            <input
              id="token"
              type="text"
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                if (error) setError('');
              }}
              placeholder="请输入Token"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="error-message">
              <svg className="error-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                登录中...
              </>
            ) : (
              '登录'
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center' }}>请使用管理员提供的访问Token</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
