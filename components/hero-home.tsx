"use client";
import { useState, useEffect, useRef } from "react";
import HeroSection from "./HeroSection";
import Footer from "@/components/ui/footer";
import "./home.css"; // 引入样式文件
import GameActive from "./game-active";
import GameInfo from "./game-info";
import GameCarousel from "./game-carousel";
import GameEntry from "./game-entry";
import RegisterModal from "./register-modal";
import Image from "next/image";
import one from "../public/images/1.png";
import two from "../public/images/2.png";
import three from "../public/images/3.png";
import four from "../public/images/4.png";
import five from "../public/images/5.png";
import request, { getImgUrl } from "@/utils/request";
import "./hero-home.css";
import Modal from "./modal";

const PageSection = ({ children, backgroundImg, glideImg }: any) => {
  return (
    <div className="page-section">
      <img className="page-section-bg" src={getImgUrl(backgroundImg)} />
      {children}
      {/* 每个 Section 用不同的图片 */}
      <Image className="game-glide" src={glideImg} alt="" />
    </div>
  );
};

export default function HeroHome() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollPositionRef = useRef(0);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [homeDetails, setHomeDetails] = useState<any>({});
  const [buttonImgs, setButtonImgs] = useState<any>({});
  const [tipsOpen, setTipsOpen] = useState(false);

  useEffect(() => {
    request.get("/douxian/web/home").then((res) => setHomeDetails(res));
    request.get("/douxian/web/button").then((res) => setButtonImgs(res));
  }, []);

  const handleScroll = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const scrollPosition = scrollContainer.scrollTop;
    const clientHeight = scrollContainer.clientHeight;
    const pages = scrollContainer.querySelectorAll(".page-section");

    pages.forEach((page) => {
      const pageTop = page.offsetTop;
      const pageHeight = page.offsetHeight;
      if (
        scrollPosition >= pageTop - clientHeight / 2 &&
        scrollPosition < pageTop + pageHeight - clientHeight / 2
      ) {
        page.style.opacity = "1";
        page.style.transform = "translateY(0)";
      } else {
        page.style.opacity = "0";
        page.style.transform = "translateY(20px)";
      }
    });

    prevScrollPositionRef.current = scrollPosition;
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      const pages = scrollContainer.querySelectorAll(".page-section");
      const scrollContent = scrollContainer.querySelector(".scroll-content");
      if (pages.length > 0) {
        const totalPageHeight = pages.length * window.innerHeight;
        (scrollContent as HTMLElement).style.height = `${totalPageHeight}px`;
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
        {/* 第一部分 - 用 1.png */}
    
          <HeroSection
            homeDetails={homeDetails}
            homeBackgroundUrl={homeDetails.homeBackgroundUrls?.[0]}
            buttonImgs={buttonImgs}
            openTips={() => setTipsOpen(true)}
          openRegisterModal={() => setRegisterModalOpen(true)}
          glideImg={one}
            showGlide
          />

        {/* 第二部分 - 用 2.png */}
        <PageSection
          backgroundImg={homeDetails.homeBackgroundUrls?.[1]}
          glideImg={two}
        >
          <GameActive
            openTips={() => setTipsOpen(true)}
            homeDetails={homeDetails}
            buttonImgs={buttonImgs}
            openRegisterModal={() => setRegisterModalOpen(true)}
          />
        </PageSection>

        {/* 第三部分 - 用 3.png */}
        <PageSection
          backgroundImg={homeDetails.homeBackgroundUrls?.[2]}
          glideImg={three}
        >
          <GameInfo />
        </PageSection>

        {/* 第四部分 - 用 4.png */}
        <PageSection
          backgroundImg={homeDetails.homeBackgroundUrls?.[3]}
          glideImg={four}
        >
          <GameCarousel homeDetails={homeDetails} />
        </PageSection>

        {/* 第五部分 - 用 5.png */}
        <PageSection
          backgroundImg={homeDetails.homeBackgroundUrls?.[4]}
          glideImg={five}
        >
          <GameEntry
            openTips={() => setTipsOpen(true)}
            buttonImgs={buttonImgs}
            openRegisterModal={() => setRegisterModalOpen(true)}
          />
        </PageSection>

        {/* 底部 Footer */}
        <div className="page-section footer-section">
          <Footer />
        </div>
      </div>

      {/* 注册弹窗 */}
      <RegisterModal
        visible={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />

      {/* Tips 弹窗 */}
      <Modal visible={tipsOpen} onClose={() => setTipsOpen(false)}>
        {/* <div style={{textAlign:'center',lineHeight:'32.2vw',fontWeight:700,color:'#34110a',fontSize:'5vw'}}>
          敬请期待...
        </div> */}
      </Modal>
    </section>
  );
}
