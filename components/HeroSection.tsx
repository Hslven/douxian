"use client";
import React, { useEffect, useState } from "react";
import glide from "@/public/images/glide.png";
import Image from "next/image";
import GameHeader from "../components/ui/header";
import "./HeroSection.css";
import { getImgUrl } from "@/utils/request";
import VideoModal, {useVideoModal} from "./video-modal";
import { usePathname } from "next/navigation";
// import { useVideoModal } from "@/utils/useVideo";
export default function HeroSection({
  openRegisterModal,
  showGlide,
  homeDetails,
  buttonImgs,
  homeBackgroundUrl,
  openTips,
  glideImg,
}: any) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [btnType, setBtnType] = useState(1);

  const {openVideo} = useVideoModal()
  // 确保只在客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);
  const videoUrl = "http://vjs.zencdn.net/v/oceans.mp4";
  return (
    <section className="hero-section">
      <div className="game-hero">
        <img className="section-bg" src={getImgUrl(homeBackgroundUrl)} alt="" />
        {/* 只在路由为"/"时显示，并且确保在客户端渲染 */}
        {isClient && pathname === "/" && (
          <div
            className="hero-section-slogan"
            // onClick={() => setIsModalVisible(true)}
            onClick={()=> openVideo(videoUrl)}
          >
            <img
              className="hero-section-slogan-bg"
              src={getImgUrl(homeDetails.homeSloganUrl)}
              alt=""
            />
          </div>
        )}
        {btnType === 1 ? (
          <div className="hero-section-btn-group1">
            <div className="hero-section-btn1" onClick={openTips}>
              <img
                className="btn-bg"
                src={getImgUrl(buttonImgs.topGameDownLoadImg)}
              />
            </div>
            <div
              className="hero-section-btn1"
              // onClick={openRegisterModal}
              onClick={openTips}
            >
              <img
                className="btn-bg"
                src={getImgUrl(buttonImgs.topAccountRegisterImg)}
              />
            </div>
          </div>
        ) : (
          <div className="hero-section-btn-group2">
            <div className="hero-section-down-btn" onClick={openTips}>
              <img
                className="btn-bg"
                src={getImgUrl(buttonImgs.topGameDownLoadImg)}
              />
            </div>
            <div>
              <div
                className="hero-section-btn2"
                // onClick={openRegisterModal}
                onClick={openTips}
              >
                <img
                  className="btn-bg"
                  src={getImgUrl(buttonImgs.topAccountRegisterImg)}
                />
              </div>

              <div
                className="hero-section-btn2"
                // onClick={openRegisterModal}
                onClick={openTips}
              >
                <img
                  className="btn-bg"
                  src={getImgUrl(buttonImgs.topAccountRegisterImg)}
                />
              </div>
            </div>
          </div>
        )}
        {showGlide && <Image className="game-glide" src={glideImg} alt="" />}
      </div>
      <VideoModal
        url={videoUrl}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </section>
  );
}
