"use client";
import React, { useRef, useEffect } from 'react';
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
