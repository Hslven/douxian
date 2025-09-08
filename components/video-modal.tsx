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
  // 创建一个唯一的容器元素引用
  const containerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [visible, setVisible] = useState(false);

  // 创建并挂载容器到body
  useEffect(() => {
    // 创建容器元素
    containerRef.current = document.createElement('div');
    containerRef.current.id = 'video-modal-container';
    document.body.appendChild(containerRef.current);
    setIsMounted(true);

    // 清理函数：移除容器
    return () => {
      if (containerRef.current && containerRef.current.parentNode) {
        document.body.removeChild(containerRef.current);
      }
    };
  }, []);

  // 渲染视频弹窗到容器
  useEffect(() => {
    if (!isMounted || !containerRef.current) return;

    const root = createRoot(containerRef.current);
    
    root.render(
      <VideoModal
        url={videoUrl}
        visible={visible}
        onClose={() => setVisible(false)}
      />
    );

    // 清理函数：卸载组件
    return () => {
      root.unmount();
    };
  }, [isMounted, videoUrl, visible]);

  // 打开视频弹窗的方法
  const openVideo = (url) => {
    if (url) {
      setVideoUrl(url);
      setVisible(true);
    }
  };

  return { openVideo };
};
    