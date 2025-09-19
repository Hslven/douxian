"use client";
import React, { useRef, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './video-modal.css'; // 可单独创建样式文件

const VideoModal = ({ url, visible, onClose }) => {
  const videoRef = useRef(null);
  const modalRef = useRef(null);

  // 当弹窗可见时自动播放视频
  useEffect(() => {
    if (visible && videoRef.current) {
      // 尝试自动播放，处理浏览器自动播放策略限制
      const playVideo = async () => {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.warn('自动播放失败，可能由于浏览器策略限制:', error);
        }
      };
      playVideo();
    } else if (!visible && videoRef.current) {
      // 弹窗关闭时暂停视频
      videoRef.current.pause();
    }
  }, [visible]);

  // 点击弹窗外部关闭
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && visible) {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="video-modal-overlay">
      <div className="video-modal-container" ref={modalRef}>
        {/* 关闭按钮 */}
        <button className="video-modal-close" onClick={onClose}>
          &times;
        </button>
        
        {/* 视频播放器 */}
        <video
          ref={videoRef}
          src={url}
          className="video-modal-player"
          autoPlay
          controls
          muted={false} // 如需绕过部分浏览器限制可设为true
          playsInline // 移动端内联播放
        >
          您的浏览器不支持HTML5视频播放
        </video>
      </div>
    </div>
  );
};

export default VideoModal;

export const useVideoModal = () => {
  const containerRef = useRef(null);
  const rootRef = useRef(null); // 存储root实例，避免重复创建
  const [videoUrl, setVideoUrl] = useState(null); // 使用null而非空字符串，避免src错误
  const [visible, setVisible] = useState(false);

  // 初始化容器和root实例（仅执行一次）
  useEffect(() => {
    // 创建容器并添加到body
    containerRef.current = document.createElement('div');
    containerRef.current.id = 'video-modal-container';
    document.body.appendChild(containerRef.current);

    // 创建root实例并保存引用
    rootRef.current = createRoot(containerRef.current);

    // 组件卸载时的清理逻辑
    return () => {
      // 延迟卸载root，避免渲染冲突
      if (rootRef.current) {
        setTimeout(() => {
          rootRef.current.unmount();
          rootRef.current = null;
        }, 0);
      }
      // 移除容器元素
      if (containerRef.current?.parentNode) {
        document.body.removeChild(containerRef.current);
        containerRef.current = null;
      }
    };
  }, []);

  // 仅在视频URL或可见性变化时更新渲染
  useEffect(() => {
    if (!rootRef.current) return;

    // 使用同一个root实例更新内容，避免重复创建
    rootRef.current.render(
      <VideoModal
        url={videoUrl}
        visible={visible}
        onClose={() => setVisible(false)}
      />
    );
  }, [videoUrl, visible]);

  // 仅保留openVideo函数，负责设置视频URL并显示弹窗
  const openVideo = (url) => {
    // 验证URL有效性
    if (typeof url === 'string' && url.trim()) {
      setVideoUrl(url.trim());
      setVisible(true);
    } else {
      console.warn('无效的视频URL:', url);
    }
  };

  return { openVideo };
};
