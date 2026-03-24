import React, { useState, useEffect } from 'react';
// 1. 引入 antd 的组件
import { message, Spin } from 'antd'; 
import { imageApi } from './api';
import { GetImagesResponseData } from './api';
import Upload from './components/Upload';
import ImageGrid from './components/ImageGrid';
import './styles/main.scss';

const AppContent: React.FC = () => {
  const [images, setImages] = useState<GetImagesResponseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleTokenChange = (newToken: string) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('auth_token', newToken);
      // 这里的提示可选，为了不打扰用户输入，通常不加，或者加个 debounced 提示
    } else {
      localStorage.removeItem('auth_token');
    }
  };

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await imageApi.getImages();
      setImages(data);
    } catch (error) {
      console.error('Failed to fetch images:', error);
      // 2. 这里虽然拦截器可能报过错，但组件内加个提示更保险
      message.error('获取图片列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (paths: string[]) => {
    const hide = message.loading('正在删除...', 0); // 3. 添加加载中状态
    try {
      await imageApi.deleteImages(paths);
      message.success('删除成功'); // 4. 替换 alert 为 success
      await fetchImages();
    } catch (error) {
      console.error('Delete failed:', error);
      // 5. 替换 alert 为 error
      message.error('删除失败，请重试');
    } finally {
      hide(); // 关闭加载提示
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="header-top">
            <div className="logo">
              <div className="logo-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="logo-text">
                <h1>图床管理系统</h1>
                <p>专业的图片托管服务</p>
              </div>
            </div>
            <div className="header-actions">
              <div className="token-input-group">
                <input
                  type="text"
                  value={token}
                  onChange={(e) => handleTokenChange(e.target.value)}
                  placeholder="请输入Token"
                  className="token-input"
                />
              </div>
              <div className="counter">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>共 {images.length} 张图片</span>
              </div>
              <button onClick={fetchImages} className="button refresh-button">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>刷新</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Upload onUploadSuccess={fetchImages} />

        {loading ? (
          <div className="loading-state">
            {/* 6. 使用 antd 的 Spin 替代手写 spinner */}
            <Spin size="large" />
            <p>加载中...</p>
          </div>
        ) : (
          <ImageGrid
            images={images}
            onDelete={handleDelete}
            onRefresh={fetchImages}
          />
        )}
      </main>
    </div>
  )
}

const App: React.FC = () => {
  return <AppContent />;
}

export default App;