"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./HeroSection.css";
import request, { getImgUrl } from "@/utils/request";
import { useVideoModal } from "./video-modal";
import { usePathname } from "next/navigation";
import AppointmentModal from "./appointment-modal";
import TipsModal from "./tips-modal";

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
  const [tipsVisible, setTipsVisible] = useState(false);
  const [tips, setTips] = useState("预约成功");
  const [appointmentVisible, setAppointmentVisible] = useState(false);

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
        {!buttonImgs.homeButtonImg ? (
          <div className="hero-section-btn-group1">
            <div
              className="hero-section-btn1"
              onClick={() => {
                if (buttonImgs.gameDownLoadUrl) {
                  window.open(buttonImgs.gameDownLoadUrl);
                } else {
                  openTips();
                }
              }}
            >
              <img
                className="btn-bg"
                src={getImgUrl(buttonImgs.gameDownLoadImg)}
              />
            </div>
            <div
              className="hero-section-btn1"
              // onClick={openRegisterModal}
              onClick={() => {
                if (buttonImgs.accountRegisterUrl) {
                  window.open(buttonImgs.accountRegisterUrl);
                } else {
                  setAppointmentVisible(true);
                }
              }}
            >
              <img
                className="btn-bg"
                src={getImgUrl(buttonImgs.accountRegisterImg)}
              />
            </div>

          </div>
        ) : (
          <div className="hero-section-btn-group2">
            <div
              className="hero-section-down-btn"
              onClick={() => {
                if (buttonImgs.gameDownLoadUrl) {
                  window.open(buttonImgs.gameDownLoadUrl);
                } else {
                  openTips();
                  // setAppointmentVisible(true);
                }
              }}
            >
              <img
                className="btn-bg"
                src={getImgUrl(buttonImgs.gameDownLoadImg)}
              />
            </div>
            <div className="hero-section-btn2-box">
              <button onClick={() => {

              }}>
                测试跳转占用
              </button>
              {/* <div
                className="hero-section-btn2"
                // onClick={openRegisterModal}
                onClick={() => {
                  if (buttonImgs.homeButtonUrl) {
                    window.open(buttonImgs.homeButtonUrl);
                  } else {
                    openTips();
                  }
                }}
              >
                <img
                  className="btn-bg"
                  src={getImgUrl(buttonImgs.homeButtonImg)}
                />
              </div> */}

              <div
                className="hero-section-btn2"
                // onClick={openRegisterModal}
                onClick={() => {
                  if (buttonImgs.accountRegisterUrl) {
                    window.open(buttonImgs.accountRegisterUrl);
                  } else {
                    // setAppointmentVisible(true);
                    // 
                    openTips();

                  }
                }}
              >
                <img
                  className="btn-bg"
                  src={getImgUrl(buttonImgs.accountRegisterImg)}
                />
              </div>
            </div>
          </div>
        )}
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
        <Image className="game-glide" src={glideImg} alt="" />
      </div>
      <AppointmentModal
        visible={appointmentVisible}
        onClose={() => setAppointmentVisible(false)}
        onSubmit={async (phone: string) => {
          if (!phone) return;
          if (/^1[3-9]\d{9}$/.test(phone)) {
            const res = await request.post("/douxian/web/subscribe", {
              subscribePhone: phone,
            });
            setTips("预约成功");
            setAppointmentVisible(false);
          } else {
            setTips("手机格式错误");
          }
          setTipsVisible(true);
        }}
      />
      <TipsModal
        tips={tips}
        visible={tipsVisible}
        onClose={() => setTipsVisible(false)}
      />
    </section>
  );
}
