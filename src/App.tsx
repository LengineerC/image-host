import React,{useState,useEffect} from 'react';
import {imageApi} from './api';
import { GetImagesResponseData } from './api';
import Upload from './components/Upload';
import ImageGrid from './components/ImageGrid';
import './styles/main.scss';

const AppContent: React.FC = () => {
  const [images,setImages] = useState<GetImagesResponseData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await imageApi.getImages();
      setImages(data);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (paths: string[]) => {
    try {
      await imageApi.deleteImages(paths);
      await fetchImages();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('删除失败，请重试');
    }
  };

  useEffect(() => {
    fetchImages();
  },[]);


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
            <div className="spinner"></div>
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
  return (
    <AppContent />
  );
}

export default App;