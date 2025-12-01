import React,{useState,useRef} from 'react';
import {imageApi} from '../api';

interface UploadProps {
    onUploadSuccess:() => void;
}

const Upload: React.FC<UploadProps> = ({onUploadSuccess}) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = async (files: File[]) => {
        if (files.length === 0) return;

        setUploading(true);
        try {
            await imageApi.upload(files);
            onUploadSuccess();
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
        }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('上传失败，请重试');
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
        const files = Array.from(e.target.files);
        handleFiles(files);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    return(
        <div className="upload-container">
            <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => e.preventDefault()}
                className="upload-area"
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <div className="upload-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                </div>

                <div className="upload-text">
                    <h3>
                        {uploading ? '正在上传...' : '拖拽文件到此处或点击上传'}
                    </h3>
                    <p>支持 JPG、PNG、GIF、WebP 格式，单个文件不超过 10MB</p>
                </div>

                {!uploading && (
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="upload-button"
                    >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>选择文件</span>
                    </button>
                )}

                {uploading && (
                    <div className="loading-bar">
                        <div className="loading-bar-bg">
                            <div className="loading-bar-fill" style={{width: '60%'}}></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Upload;
