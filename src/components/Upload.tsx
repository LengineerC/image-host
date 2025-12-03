import React,{useState,useRef,useEffect} from 'react';
import {imageApi, ConfigData} from '../api';

interface UploadProps {
    onUploadSuccess:() => void;
}

const Upload: React.FC<UploadProps> = ({onUploadSuccess}) => {
    const [uploading, setUploading] = useState(false);
    const [config, setConfig] = useState<ConfigData | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const configData = await imageApi.getConfig();
                setConfig(configData);
            } catch (error) {
                console.error('Failed to fetch config:', error);
            }
        };
        fetchConfig();
    }, []);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const handleFiles = async (files: File[]) => {
        if (files.length === 0) return;

        if (config && files.length > config.maxUploadCount) {
            alert(`最多只能上传 ${config.maxUploadCount} 个文件`);
            return;
        }

        if (config) {
            for (const file of files) {
                if (file.size > config.fileSize) {
                    alert(`文件 "${file.name}" 超过了大小限制（${formatFileSize(config.fileSize)}）`);
                    return;
                }
            }
        }

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
                    style={{display: 'none'}}
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
                    <p>
                        支持 JPG、PNG、GIF、WebP 格式
                        {config && (
                            <>
                                ，单个文件不超过 {formatFileSize(config.fileSize)}
                                ，最多上传 {config.maxUploadCount} 个文件
                            </>
                        )}
                    </p>
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
