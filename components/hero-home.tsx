"use client";
import { useState, useEffect, useRef } from "react";
import VideoThumb from "@/public/images/topbanner.jpg";
import ModalVideo from "@/components/modal-video";
import HeroSection from "./HeroSection";
import Footer from "@/components/ui/footer";
import "./home.css"; // 引入样式文件
import GameActive from "./game-active";
import GameInfo from "./game-info";
import GameCarousel from "./game-carousel";
import GameEntry from "./game-entry";
import RegisterModal from "./register-modal";
import Image from "next/image";
import glide from "../public/images/glide.png";
import bg1 from "../public/images/bg1.png";
import bg2 from "../public/images/bg2.png";
import bg3 from "../public/images/bg3.png";
import bg4 from "../public/images/bg4.png";
import bg5 from "../public/images/bg5.png";
import request, { getImgUrl } from "@/utils/request";
import "./hero-home.css";
const PageSection = ({ children, backgroundImg }: any) => {
  return (
    <div className="page-section">
      <img  className="page-section-bg" src={getImgUrl(backgroundImg)} />
      {children}
      <Image  className="game-glide" src={glide} alt="" />
    </div>
  );
};

export default function HeroHome() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollPositionRef = useRef(0);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
    const [homeDetails, setHomeDetails] = useState<any>({});
    const [buttonImgs, setButtonImgs] = useState<any>({});

  useEffect(() => {
    request.get("/douxian/web/home").then((res) => setHomeDetails(res));
    request.get("/douxian/web/button").then((res) => setButtonImgs(res));
  }, []);

  const handleScroll = (e) => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    const scrollPosition = scrollContainer.scrollTop;
    const scrollHeight = scrollContainer.scrollHeight;
    const clientHeight = scrollContainer.clientHeight;

    const pages = scrollContainer.querySelectorAll(".page-section");
    pages.forEach((page, index) => {
      const pageTop = page.offsetTop;
      const pageHeight = page.offsetHeight;

      // 检查页面是否在视口中
      if (
        scrollPosition >= pageTop - clientHeight / 2 &&
        scrollPosition < pageTop + pageHeight - clientHeight / 2
      ) {
        // 添加动画效果
        page.style.opacity = "1";
        page.style.transform = "translateY(0)";
      } else {
        // 移除动画效果
        page.style.opacity = "0";
        page.style.transform = "translateY(20px)";
      }
    });

    // 保存当前滚动位置
    prevScrollPositionRef.current = scrollPosition;
  };

  // 初始化滚动容器高度
  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      const pages = scrollContainer.querySelectorAll(".page-section");
      const scrollContent = scrollContainer.querySelector(".scroll-content");

      // 设置滚动容器高度
      if (pages.length > 0) {
        const totalPageHeight = pages.length * window.innerHeight;
        scrollContent.style.height = `${totalPageHeight}px`;
      }
    }
  }, []);

  return (
    <section
      className="scroll-container"
      ref={scrollContainerRef}
      onScroll={handleScroll}
    >
      <div className="scroll-content">
        {/* 第一部分 */}
        <HeroSection
          homeDetails={homeDetails}
          buttonImgs={buttonImgs}
          openRegisterModal={() => setRegisterModalOpen(true)}
          showGlide
        />
        {/* 第二部分 */}
        <PageSection backgroundImg={homeDetails.homeBackgroundUrls?.[1]}>
          <GameActive homeDetails={homeDetails} buttonImgs={buttonImgs} openRegisterModal={() => setRegisterModalOpen(true)} />
        </PageSection>
        {/* 第三部分 */}
        <PageSection backgroundImg={homeDetails.homeBackgroundUrls?.[2]}>
          <GameInfo />
        </PageSection>
        {/* 第四部分 */}
        <PageSection backgroundImg={homeDetails.homeBackgroundUrls?.[3]}>
          <GameCarousel homeDetails={homeDetails}/>
        </PageSection>
        {/* 第五部分 */}
        <PageSection backgroundImg={homeDetails.homeBackgroundUrls?.[4]}>
          <GameEntry      buttonImgs={buttonImgs} openRegisterModal={() => setRegisterModalOpen(true)} />
        </PageSection>
        <div className="page-section footer-section">
          <Footer />
        </div>
      </div>
      <RegisterModal
        visible={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />
    </section>
  );
}
