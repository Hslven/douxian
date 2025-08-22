"use client";
import React, { useEffect, useState } from "react";
import glide from "@/public/images/glide.png";
import Image from "next/image";
import GameHeader from "../components/ui/header";
import "./HeroSection.css";
import { getImgUrl } from "@/utils/request";
import VideoModal from "./video-modal";
import { usePathname } from "next/navigation";
export default function HeroSection({
  openRegisterModal,
  showGlide,
  homeDetails,
  buttonImgs,
  homeBackgroundUrl,
  openTips,
}: any) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  // 确保只在客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);
  const videoUrl = "http://vjs.zencdn.net/v/oceans.mp4";
  return (
    <section className="hero-section">
      <div className="game-hero">
        <img
          className="section-bg"
          src={getImgUrl(homeBackgroundUrl)}
          alt=""
          onClick={() => setIsModalVisible(true)}
        />
        <GameHeader
          openTips={openTips}
          buttonImgs={buttonImgs}
          openRegisterModal={openRegisterModal}
        />
        {/* 只在路由为"/"时显示，并且确保在客户端渲染 */}
        {isClient && pathname === "/" && (
          <div
            className="hero-section-slogan"
            onClick={() => setIsModalVisible(true)}
          >
            <img
              className="hero-section-slogan-bg"
              src={getImgUrl(homeDetails.homeSloganUrl)}
              alt=""
            />
          </div>
        )}
        {showGlide && <Image className="game-glide" src={glide} alt="" />}
      </div>
      <VideoModal
        url={videoUrl}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </section>
  );
}