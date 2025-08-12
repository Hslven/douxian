import React, { useState, useEffect, useRef } from 'react';
import './game-carousel.css';

const Carousel = ({ 
  images, 
  interval = 5000, 
  transitionDuration = 500 
}) => {
  // 状态管理
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);

  // 处理指示点点击
  const handleDotClick = (index: number) => {
    if (index !== currentIndex && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(index);
      
      // 过渡结束后重置状态
      setTimeout(() => {
        setIsTransitioning(false);
      }, transitionDuration);
      
      // 重置自动轮播计时器
      resetTimer();
    }
  };

  // 自动轮播到下一张
  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(prev => (prev + 1) % images.length);
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, transitionDuration);
    }
  };

  // 重置自动轮播计时器
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(nextSlide, interval);
  };

  // 组件挂载时启动自动轮播
  useEffect(() => {
    resetTimer();
    
    // 组件卸载时清理计时器
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // 当轮播项数量变化时重置
  useEffect(() => {
    setCurrentIndex(0);
    resetTimer();
  }, [images.length]);

  return (
    <div className="carousel-container">
      <div 
        className="carousel-slider"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: isTransitioning ? `transform ${transitionDuration}ms ease-in-out` : 'none'
        }}
      >
        {images.map((image, index) => (
          <div key={index} className="carousel-slide">
            <img 
              src={image.src} 
              alt={image.alt || `轮播图片 ${index + 1}`} 
              className="carousel-image"
            />
            {image.caption && (
              <div className="carousel-caption">
                {image.caption}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* 指示点 */}
      <div className="carousel-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
            aria-label={`切换到图片 ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

    

export default function GameCarousel() {
    const carouselImages = [
    {
      src: 'https://picsum.photos/id/10/1200/500',
      alt: '山脉风景',
      caption: '壮丽的山脉景观'
    },
    {
      src: 'https://picsum.photos/id/20/1200/500',
      alt: '海洋风景',
      caption: '宁静的海洋风光'
    },
    {
      src: 'https://picsum.photos/id/30/1200/500',
      alt: '森林风景',
      caption: '茂密的森林景色'
    },
    {
      src: 'https://picsum.photos/id/40/1200/500',
      alt: '城市风景',
      caption: '现代城市天际线'
    }
  ];
  return (
    <div >
      <Carousel 
        images={carouselImages} 
        interval={3000}  // 3秒切换一次
        transitionDuration={500}  // 0.5秒过渡动画
      />
    </div>
  );
}
