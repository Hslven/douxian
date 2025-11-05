"use client";
import { useState, useEffect, useRef } from "react";
import HeroSection from "./HeroSection";
import Footer from "@/components/ui/footer";
import "./home.css"; // 引入样式文件
import LoginGift from "../components/gameReservation/loginGift";
import GameInfo from "./game-info";
import GameCarousel from "./game-carousel";
import RegisterModal from "./register-modal";
import Image from "next/image";
import one from "../public/images/1.png";
import two from "../public/images/2.png";
import three from "../public/images/3.png";
import four from "../public/images/4.png";
// import five from "../public/images/5.png";
import request, { getImgUrl } from "@/utils/request";
import "./hero-home.css";
import Modal from "./modal";
import Header from "./ui/header";
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
    const [currentPage, setCurrentPage] = useState(0);

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
        let currentVisibleIndex = -1; // 初始化为无效索引

        pages.forEach((page, index) => {
            const pageTop = page.offsetTop;
            const pageHeight = page.offsetHeight;
            if (
                scrollPosition >= pageTop - clientHeight / 2 &&
                scrollPosition < pageTop + pageHeight - clientHeight / 2
            ) {
                page.style.opacity = "1";
                page.style.transform = "translateY(0)";
                currentVisibleIndex = index + 1;
            } else {
                page.style.opacity = "0";
                page.style.transform = "translateY(20px)";
            }
        });

        if (currentVisibleIndex !== -1 && currentVisibleIndex !== currentPage) {
            setCurrentPage(currentVisibleIndex);
        }

        if (scrollPosition < clientHeight / 2) {
            setCurrentPage(0);
        }
        prevScrollPositionRef.current = scrollPosition;
    };
    // 滚动到指定索引的.page-section
    const scrollToPage = (index: number) => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        // 获取所有.page-section元素
        const pages = scrollContainer.querySelectorAll(".page-section");

        // 校验索引有效性
        if (index < 0 || index >= pages.length) {
            console.warn("无效的页面索引");
            return;
        }

        // 获取目标页面元素
        const targetPage = pages[index - 1];
        if (!targetPage && index) return;

        // 滚动到目标页面（基于容器的滚动位置）
        scrollContainer.scrollTo({
            top: index ? targetPage.offsetTop : 0,
            behavior: "smooth", // 平滑滚动效果
        });
        // setCurrentPage(index);
        // 手动触发一次滚动事件，确保样式状态同步
        handleScroll();
    };

    // 优化后的滚动到指定页面函数
    // const scrollToPage = (index) => {
    //   // 验证滚动容器是否存在
    //   const scrollContainer = scrollContainerRef.current;
    //   if (!scrollContainer) {
    //     console.error("滚动容器未找到");
    //     return;
    //   }

    //   // 获取所有页面元素并转换为数组（方便处理）
    //   const pages = Array.from(scrollContainer.querySelectorAll(".page-section"));

    //   // 严格校验索引有效性
    //   if (typeof index !== 'number' || index < 0 || index >= pages.length || !Number.isInteger(index)) {
    //     console.warn(`无效的页面索引: ${index}，有效范围为 0 至 ${pages.length - 1}`);
    //     return;
    //   }

    //   // 获取目标页面元素
    //   const targetPage = pages[index];
    //   if (!targetPage) {
    //     console.error(`未找到索引为 ${index} 的页面元素`);
    //     return;
    //   }

    //   // 执行滚动（考虑容器可能存在的内边距等影响）
    //   const scrollOffset = targetPage.offsetTop;

    //   scrollContainer.scrollTo({
    //     top: scrollOffset,
    //     behavior: "smooth" // 平滑滚动
    //   });

    //   // 强制同步样式状态（使用requestAnimationFrame确保DOM更新后执行）
    //   requestAnimationFrame(() => {
    //     handleScroll();
    //   });
    // };

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

    useEffect(() => {
        const url = new URL(window.location.href);
        const section = url.searchParams.get("section");
        if (section) {
            setTimeout(() => {
                scrollToPage(+section);
            }, 100);
        }
    }, []);

    return (
        <>
            <Header
                buttonImgs={buttonImgs}
                currentPage={currentPage}
                scrollToPage={scrollToPage}
            />
            <section
                className="scroll-container"
                ref={scrollContainerRef}
                onScroll={handleScroll}
            >
                <div className="scroll-content">
                    {/* 第一部分 - 用 1.png */}
                    {/* 
                    <HeroSection
                        homeDetails={homeDetails}
                        homeBackgroundUrl={homeDetails.homeBackgroundUrls?.[0]}
                        buttonImgs={buttonImgs}
                        openTips={() => setTipsOpen(true)}
                        openRegisterModal={() => setRegisterModalOpen(true)}
                        glideImg={one}
                    /> */}
                    <LoginGift homeDetails={homeDetails} />

                    {/* 第二部分 - 用 2.png */}
                    <PageSection
                        backgroundImg={homeDetails.homeBackgroundUrls?.[1]}
                        glideImg={two}
                    >
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
                    {/* <PageSection
          backgroundImg={homeDetails.homeBackgroundUrls?.[4]}
          glideImg={five}
        >
          <GameEntry
            openTips={() => setTipsOpen(true)}
            buttonImgs={buttonImgs}
            openRegisterModal={() => setRegisterModalOpen(true)}
          />
        </PageSection> */}

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
        </>
    );
}
