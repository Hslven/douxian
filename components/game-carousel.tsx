import React, { useState, useEffect, useRef } from "react";
import "./game-carousel.css";
import Image from "next/image";
import carousel_role from "../public/images/carousel_role.png";
import carousel_bg from "../public/images/carousel_bg.png";
import carousel1 from "../public/images/carousel1.png";

export default function GameCarousel() {
  const [images, setImages] = useState([
    { id: 1, url: carousel1, alt: "图片1" },
    { id: 2, url: carousel1, alt: "图片2" },
    { id: 3, url: carousel1, alt: "图片3" },
    { id: 4, url: carousel1, alt: "图片4" },
    { id: 5, url: carousel1, alt: "图片5" },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<any>(null);

  // 自动轮播
  // useEffect(() => {
  //   intervalRef.current = setInterval(() => {
  //     nextSlide();
  //   }, 2000);
  //   return () => clearInterval(intervalRef.current);
  // }, []);

  // 下一张
  const nextSlide = () => {
    setCurrentIndex(currentIndex + 1 === images.length ? 0 : currentIndex + 1);
  };

  const getPosition = (index: number) => {
    if (index === currentIndex) return "current";
    if (
      index + 1 === currentIndex ||
      (currentIndex === 0 && index === images.length - 1)
    )
      return "prev";
    if (
      index - 1 === currentIndex ||
      (index === 0 && currentIndex === images.length - 1)
    )
      return "next";
    return "";
  };

  return (
    <div className="game-carousel">
      <Image className="game-carousel-role" src={carousel_role} alt="" />
      <div className="carousel-container">
        <div className="box">
          {images.map((slide, index) => {
            return (
              <div
                key={slide.id}
                className={`carousel-slide ${getPosition(index)}`}
              >
                <Image
                  src={slide.url}
                  alt={slide.alt}
                  className="slide-image"
                />
                <Image
                  style={{ position: "absolute" }}
                  src={carousel_bg}
                  alt=""
                />
              </div>
            );
          })}
        </div>
        {/* 小圆点指示器 */}
        <div className="dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`dot ${currentIndex === index ? "dot-active" : ""}`}
              onClick={() => {
                console.log(index, 645745);
                setCurrentIndex(index);
              }}
            />
          ))}
        </div>

        {/* 导航按钮 */}
        {/* <button 
                className="nav-btn prev" 
                onClick={prevSlide}
                aria-label="上一张"
            >
                <span className="arrow">←</span>
            </button>
            <button 
                className="nav-btn next" 
                onClick={nextSlide}
                aria-label="下一张"
            >
                <span className="arrow">→</span>
            </button> */}
      </div>
    </div>
  );
}
