import React, { useState, useEffect, useRef } from "react";
import "./game-carousel.css";
import Image from "next/image";
import carousel_role from "../public/images/carousel_role.png";
import { getImgUrl } from "@/utils/request";

export default function GameCarousel({ homeDetails }: any) {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if(homeDetails.homeCarouselUrls?.length) {
    setImages(homeDetails.homeCarouselUrls.map((item:string) => getImgUrl(item)));
    }
  }, [homeDetails.homeCarouselUrls]);

  // 自动轮播
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // 下一张
  const nextSlide = () => {
    setCurrentIndex(currentIndex + 1 === images.length ? 0 : currentIndex + 1);
  };

  const getPosition = (index: number) => {
    if (index === currentIndex) return "carousel-current";
    if (
      index + 1 === currentIndex ||
      (currentIndex === 0 && index === images.length - 1)
    )
      return "carousel-prev";
    if (
      index - 1 === currentIndex ||
      (index === 0 && currentIndex === images.length - 1)
    )
      return "carousel-next";
    return "";
  };

  return (
    <div className="game-carousel">
      {/* <Image className="game-carousel-role" src={carousel_role} alt="" /> */}
      <div className="carousel-container">
        <div className="carousel-slide-box">
          {images.map((slide, index) => {
            return (
              <div
                key={slide}
                className={`carousel-slide ${getPosition(index)}`}
              >
                <img src={slide} className="slide-image" />
                {/* <Image
                  style={{ position: "absolute" }}
                  src={carousel_bg}
                  alt=""
                /> */}
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
                setCurrentIndex(index);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
