"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./HeroSection.css";
import { getImgUrl } from "@/utils/request";
import  { useVideoModal } from "./video-modal";
import { usePathname } from "next/navigation";
export default function HeroSection({
  openRegisterModal,
  homeDetails,
  buttonImgs,
  homeBackgroundUrl,
  openTips,
  glideImg,
}: any) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  const { openVideo } = useVideoModal();
  // 确保只在客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);
  // const videoUrl = "http://vjs.zencdn.net/v/oceans.mp4";
  return (
    <section className="hero-section">
      <div className="game-hero">
        <img className="section-bg" src={getImgUrl(homeBackgroundUrl)} alt="" />
        {/* 只在路由为"/"时显示，并且确保在客户端渲染 */}
        {isClient && pathname === "/" && (
          <div
            className="hero-section-slogan"
            onClick={() => openVideo(getImgUrl(homeDetails.homeVideoUrl))}
          >
            <img
              className="hero-section-slogan-bg"
              src={getImgUrl(homeDetails.homeSloganUrl)}
              alt=""
            />
          </div>
        )}
        {!buttonImgs.homeButtonImg ? (
          <div className="hero-section-btn-group1">
            <div className="hero-section-btn1" onClick={openTips}>
              <img
                className="btn-bg"
                src={getImgUrl(buttonImgs.gameDownLoadImg)}
              />
            </div>
            <div
              className="hero-section-btn1"
              // onClick={openRegisterModal}
              onClick={openTips}
            >
              <img
                className="btn-bg"
                src={getImgUrl(buttonImgs.accountRegisterImg)}
              />
            </div>
          </div>
        ) : (
          <div className="hero-section-btn-group2">
            <div className="hero-section-down-btn" onClick={openTips}>
              <img
                className="btn-bg"
                src={getImgUrl(buttonImgs.homeButtonImg)}
              />
            </div>
            <div className="hero-section-btn2-box">
              <div
                className="hero-section-btn2"
                // onClick={openRegisterModal}
                onClick={openTips}
              >
                <img
                  className="btn-bg"
                  src={getImgUrl(buttonImgs.gameDownLoadImg)}
                />
              </div>

              <div
                className="hero-section-btn2"
                // onClick={openRegisterModal}
                onClick={openTips}
              >
                <img
                  className="btn-bg"
                  src={getImgUrl(buttonImgs.accountRegisterImg)}
                />
              </div>
            </div>
          </div>
        )}
        <Image className="game-glide" src={glideImg} alt="" />
      </div>
    </section>
  );
}
