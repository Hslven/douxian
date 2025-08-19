import React, { useEffect, useState } from "react";
import VideoThumb from "@/public/images/topbanner.jpg";
import glide from "@/public/images/glide.png";
import Image from "next/image";
import GameHeader from "../components/ui/header";
import "./HeroSection.css";
import request, { getImgUrl } from "@/utils/request";
export default function HeroSection({ openRegisterModal, showGlide, homeDetails, buttonImgs }: any) {
  return (
    <section className="hero-section">
      <div className="game-hero">
        <img
          className="section-bg"
          src={getImgUrl(homeDetails.homeBackgroundUrl?.[0])}
          alt=""
        />
        <GameHeader buttonImgs={buttonImgs} openRegisterModal={openRegisterModal} />
        <div className="hero-section-slogan">
          <img
            className="hero-section-slogan-bg"
            src={getImgUrl(homeDetails.homeSloganUrl)}
            alt=""
          />
        </div>
        {showGlide && <Image className="game-glide" src={glide} alt="" />}
      </div>
    </section>
  );
}
