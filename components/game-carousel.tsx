import React, { useState, useEffect, useRef } from "react";
import "./game-carousel.css";
import { getImgUrl } from "@/utils/request";
import { useVideoModal } from "./video-modal";

export default function GameCarousel({ homeDetails }: any) {
  const [images, setImages] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<any>(null);
  const { openVideo } = useVideoModal();
  useEffect(() => {
    if (homeDetails.gameShots?.length) {
      setImages(
        homeDetails.gameShots.map((item: any) => ({
          ...item,
          videoUrl: getImgUrl(item.videoUrl),
          imageUrl: getImgUrl(item.imageUrl),
        }))
      );
    }
  }, [homeDetails.gameShots]);

  // 自动轮播
  useEffect(() => {
    if (images.length && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [images.length]);

  // 下一张
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 === images.length ? 0 : prevIndex + 1
    );
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
      <div className="carousel-container">
        <div className="carousel-slide-box">
          {images.map((slide, index) => (
            <div
              key={slide.imageUrl}
              className={`carousel-slide ${getPosition(index)}`}
              onClick={() => {
                if (slide.videoUrl) {
                  openVideo(slide.videoUrl);
                } else if (slide.jumpUrl) {
                  window.open(slide.jumpUrl);
                }
              }}
            >
              <img
                src={slide.imageUrl}
                className="slide-image"
                alt={`Slide ${index}`}
              />
              {!!slide.videoUrl && index === currentIndex && (
                <div className="carousel-slide-video-play" />
              )}
            </div>
          ))}
        </div>
        {/* 小圆点指示器 */}
        <div className="dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`dot ${currentIndex === index ? "dot-active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
      <div className="game-carousel-msg">
        <div className="game-carousel-msg-title">
          洪荒旦古&nbsp;&nbsp;一念神魔
        </div>
        <div className="game-carousel-msg-line"></div>
        <div className="game-carousel-msg-content">
          洪荒中有无数的远古生灵，
          <br />
          他们努力的提高自己的力量，他们
          <br />
          修炼的终极目标就是
          <br />
          成为“圣”。远古生灵中最厉害
          <br />
          的一个叫做鸿钧，鸿钧凭借神器天书“封神榜“
          <br />
          成为了最早的“圣”级高手之后收了六个弟子:
          <br />
          太上老君、元始天尊、通天教主、女娲娘娘、
          <br />
          接引道人、准提道人，并指引
          <br />
          这六个弟子也成为了“圣”级的高手，学成之后
          <br />
          接引道人和准提道人回到了西方世界，鸿钧将天道神器
          <br />
          封神榜”交给了元始天尊保管，
          <br />
          自己不知所终... <br />
          太上老君清净无为，四处游历。
        </div>
      </div>
    </div>
  );
}
