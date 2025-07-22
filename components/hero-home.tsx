"use client";
import { useState, useEffect, useRef } from "react";
import VideoThumb from "@/public/images/topbanner.jpg";
import ModalVideo from "@/components/modal-video";
import Workflows from "@/components/workflows";
import HeroSection from './HeroSection';
import Features from "@/components/features";
import Testimonials from "@/components/testimonials";
import Cta from "@/components/cta";
import Footer from "@/components/ui/footer";
import './home.css'; // 引入样式文件

export default function HeroHome() {
  const scrollContainerRef = useRef(null);
  const prevScrollPositionRef = useRef(0);

  const handleScroll = (e) => {
    const scrollContainer = e.target;
    const scrollPosition = scrollContainer.scrollTop;
    const scrollHeight = scrollContainer.scrollHeight;
    const clientHeight = scrollContainer.clientHeight;

    const pages = scrollContainer.querySelectorAll('.page-section');
    pages.forEach((page, index) => {
      const pageTop = page.offsetTop;
      const pageHeight = page.offsetHeight;

      // 检查页面是否在视口中
      if (
        scrollPosition >= pageTop - clientHeight / 2 &&
        scrollPosition < pageTop + pageHeight - clientHeight / 2
      ) {
        // 添加动画效果
        page.style.opacity = '1';
        page.style.transform = 'translateY(0)';
      } else {
        // 移除动画效果
        page.style.opacity = '0';
        page.style.transform = 'translateY(20px)';
      }
    });

    // 保存当前滚动位置
    prevScrollPositionRef.current = scrollPosition;
  };

  // 初始化滚动容器高度
  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      const pages = scrollContainer.querySelectorAll('.page-section');
      const scrollContent = scrollContainer.querySelector('.scroll-content');

      // 设置滚动容器高度
      if (pages.length > 0) {
        const totalPageHeight = pages.length * window.innerHeight;
        scrollContent.style.height = `${totalPageHeight}px`;
      }
    }
  }, []);

  return (
    <section className="scroll-container" ref={scrollContainerRef} onScroll={handleScroll}>
      <div className="scroll-content">
        {/* 第一部分 */}
        <HeroSection />
        
        {/* 第二部分 */}
        <div className="page-section">

          <Workflows />
       {/* <Workflows />
      <Features />
      <Testimonials />
      <Cta /> */}
        </div>
        
        {/* 第三部分 */}
        <div className="page-section">
     <Features />
        </div>

        <div className="page-section">
     <Testimonials />
        </div>
        {/* <div className="page-section">
     <Cta />
        </div> */}
        <div className="page-section footer-section">
        <Footer />
        </div>
      </div>
    </section>
  );
}