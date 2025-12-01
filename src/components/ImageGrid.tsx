import {GetImagesResponseData} from '../api';
import React,{useState} from 'react';

interface ImageGridPops {
    images: GetImagesResponseData[];
    onDelete: (path:string[]) => void;
    onRefresh: () => void;
}

const ImageGrid: React.FC<ImageGridPops> = ({images, onDelete, onRefresh}) => {
    const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());

    const toggleSelectImage = (path: string) => {
        const newSelectedImages = new Set(selectedImages);
        if (newSelectedImages.has(path)) {
            newSelectedImages.delete(path);
        } else {
            newSelectedImages.add(path);
        }
        setSelectedImages(newSelectedImages);
    };

    const handleDelete = async () => {
        if (selectedImages.size === 0) return;
        await onDelete(Array.from(selectedImages));
        setSelectedImages(new Set());
        onRefresh();
    };

    const handleDeleteSingle = async (path: string) => {
    if (confirm('确定要删除这张图片吗？')) {
      await onDelete([path]);
    }
  };

    if (images.length === 0) {
        return (
            <div className="image-grid-container">
                <div className="empty-state">
                    <div className="empty-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3>暂无图片</h3>
                    <p>上传你的第一张图片开始使用吧</p>
                </div>
            </div>
        );
    };

    return (
        <div className="image-grid-container">
            {selectedImages.size > 0 && (
                <div className="selection-toolbar">
                    <div className="toolbar-content">
                        <span>
                            已选择 <span className="count">{selectedImages.size}</span> 张图片
                        </span>
                        <div className="divider"></div>
                        <button
                            onClick={() => setSelectedImages(new Set())}
                            className="button"
                        >
                            取消选择
                        </button>
                        <button
                            onClick={handleDelete}
                            className="delete-button"
                        >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>删除选中</span>
                        </button>
                    </div>
                </div>
            )}

            <div className="images-grid">
                {images.map((image) => (
                <div
                    key={image.path}
                    className="image-card"
                >
                    <div className="image-wrapper">
                        <img
                            src={image.url}
                            alt={image.filename}
                        />
                        <div className="overlay">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSingle(image.path);
                                }}
                                className="overlay-button delete"
                                title="删除"
                            >
                                <svg className="delete" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                            <button
                                onClick={() => window.open(image.url, '_blank')}
                                className="overlay-button view"
                                title="查看原图"
                            >
                                <svg className="view" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                        </div>

                        <div className="checkbox">
                            <input
                                type="checkbox"
                                checked={selectedImages.has(image.path)}
                                onChange={() => toggleSelectImage(image.path)}
                            />
                        </div>
                    </div>

                    <div className="image-info">
                        <p className="filename" title={image.filename}>
                            {image.filename}
                        </p>
                        <div className="image-meta">
                            <span className="date">
                                {new Date(image.uploadTime).toLocaleDateString()}
                            </span>
                            <a
                                href={image.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="link"
                            >
                                <span>复制链接</span>
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}

export default ImageGrid;
