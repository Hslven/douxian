import React from "react";
import VideoThumb from "@/public/images/topbanner.jpg";
import slogen from "@/public/images/slogen.png";
import glide from "@/public/images/glide.png";
import Image from "next/image";
import GameHeader from "../components/ui/header";
import "./HeroSection.css";
export default function HeroSection({ openRegisterModal, showGlide }: any) {
  return (
    <section className="hero-section">
      <div className="game-hero">
      <GameHeader openRegisterModal={openRegisterModal} />
      <div className="hero-section-slogan">
        <Image fill objectFit="cover" src={slogen} alt="" />
        {/* <Image className="inline-flex" src={VideoThumb} alt="Workflow 03" /> */}
      </div>
      {showGlide && <Image className="game-glide" src={glide} alt="" />}
      </div>
    </section>
  );
}
