"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import one from "../public/images/1.png";
import two from "../public/images/2.png";
import three from "../public/images/3.png";
import four from "../public/images/4.png";
import request, { getImgUrl } from "@/utils/request";
import "./home.css";
import "./hero-home.css";

import TopPage from "./ui/topPage";
import SidebarGameContainer from "./ui/SidebarGameContainer/SidebarGameContainer";

// 仅显示背景图的页面组件
const BackgroundOnlyPage = ({
    backgroundImg,
    glideImg,
    isActive,
    pageName
}: {
    backgroundImg?: string;
    glideImg?: any;
    isActive: boolean;
    pageName?: string;
}) => {
    const [bgLoaded, setBgLoaded] = useState(false);
    const [bgError, setBgError] = useState(false);

    return (
        <div
            className="page-section"
            style={{
                minHeight: "100vh",
                height: "100vh",
                transition: "opacity 0.6s ease, transform 0.6s ease",
                opacity: isActive ? 1 : 0,
                transform: isActive ? "translateY(0)" : "translateY(20px)",
                position: "relative",
                pointerEvents: isActive ? "auto" : "none",
                zIndex: isActive ? 1 : 0,
            }}
        >
            {backgroundImg && !bgError && (
                <img
                    className="page-section-bg"
                    src={getImgUrl(backgroundImg)}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: bgLoaded ? 1 : 0,
                        transition: "opacity 0.3s ease",
                    }}
                    onLoad={() => setBgLoaded(true)}
                    onError={() => {
                        setBgError(true);
                        setBgLoaded(true);
                    }}
                />
            )}
            {bgError && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#000",
                    }}
                />
            )}
            <div style={{ position: "relative", zIndex: 2, height: "100%" }}>
                {glideImg && (
                    <Image
                        className="game-glide"
                        src={glideImg}
                        alt=""
                        style={{ pointerEvents: "none" }}
                    />
                )}
                {pageName && isActive && (
                    <div style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "#fff",
                        fontSize: "48px",
                        fontWeight: "bold",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                        zIndex: 10
                    }}>
                        {pageName}
                    </div>
                )}
            </div>
        </div>
    );
};

export default function HeroHome() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [homeDetails, setHomeDetails] = useState<any>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [isScrolling, setIsScrolling] = useState(false);
    const totalPagesRef = useRef(5);

    useEffect(() => {
        request.get("/douxian/web/home").then((res) => setHomeDetails(res));
    }, []);

    // 处理滚动时的页面激活状态
    const handleScroll = () => {
        if (isScrolling) return;

        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const scrollPosition = scrollContainer.scrollTop;
        const clientHeight = scrollContainer.clientHeight;
        const pages = Array.from(scrollContainer.querySelectorAll(".page-section"));
        let currentVisibleIndex = -1;

        const containerRect = scrollContainer.getBoundingClientRect();
        pages.forEach((page, index) => {
            const pageRect = page.getBoundingClientRect();
            const pageTopRelative = pageRect.top - containerRect.top + scrollContainer.scrollTop;
            const pageHeight = pageRect.height;

            if (scrollPosition >= pageTopRelative - clientHeight * 0.3 &&
                scrollPosition < pageTopRelative + pageHeight - clientHeight * 0.3) {
                currentVisibleIndex = index + 1;
            }
        });

        if (currentVisibleIndex !== -1 && currentVisibleIndex !== currentPage) {
            setCurrentPage(currentVisibleIndex);
        } else if (scrollPosition < clientHeight / 2) {
            setCurrentPage(1);
        }
    };

    // 侧边栏触发的滚动逻辑
    const scrollToPage = (index: number) => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        if (index < 1 || index > totalPagesRef.current) {
            console.warn(`无效页面索引: ${index}，有效范围 1-${totalPagesRef.current}`);
            return;
        }

        setCurrentPage(index);
        setIsScrolling(true);

        const pages = scrollContainer.querySelectorAll(".page-section");
        const targetPage = pages[index - 1];
        if (!targetPage) return;

        const targetRect = targetPage.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();
        const targetScrollTop = targetRect.top - containerRect.top + scrollContainer.scrollTop;

        scrollContainer.scrollTo({
            top: targetScrollTop,
            behavior: "smooth"
        });

        const timer = setTimeout(() => {
            setIsScrolling(false);
            handleScroll();
        }, 800);

        return () => clearTimeout(timer);
    };

    // 初始化页面高度
    useEffect(() => {
        const handleResize = () => {
            const scrollContainer = scrollContainerRef.current;
            if (!scrollContainer) return;

            const pages = scrollContainer.querySelectorAll(".page-section");
            const scrollContent = scrollContainer.querySelector(".scroll-content");
            if (pages.length && scrollContent) {
                totalPagesRef.current = pages.length;
                pages.forEach(page => {
                    (page as HTMLElement).style.height = `${window.innerHeight}px`;
                    (page as HTMLElement).style.minHeight = `${window.innerHeight}px`;
                });
                (scrollContent as HTMLElement).style.height = `${pages.length * window.innerHeight}px`;
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 初始加载时强制激活第一页
    useEffect(() => {
        setCurrentPage(1);
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.scrollTop = 0;
        }
    }, []);

    // URL参数跳转
    useEffect(() => {
        const url = new URL(window.location.href);
        const section = url.searchParams.get("section");
        if (section) {
            const sectionNum = parseInt(section, 10);
            if (!isNaN(sectionNum)) {
                setTimeout(() => scrollToPage(sectionNum), 300);
            }
        }
    }, []);

    // 绑定滚动事件
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", handleScroll);
            return () => scrollContainer.removeEventListener("scroll", handleScroll);
        }
    }, [isScrolling]);

    const mockData = [
        { id: "1", bgClass: "sidebar-bg-1", currBgClass: "sidebar-bg-curr-1", name: "首页展示" },
        { id: "2", bgClass: "sidebar-bg-2", currBgClass: "sidebar-bg-curr-2", name: "宗门争霸" },
        { id: "3", bgClass: "sidebar-bg-3", currBgClass: "sidebar-bg-curr-3", name: "御空飞行" },
        { id: "4", bgClass: "sidebar-bg-4", currBgClass: "sidebar-bg-curr-4", name: "PVP竞技场" },
        { id: "5", bgClass: "sidebar-bg-5", currBgClass: "sidebar-bg-curr-5", name: "坐骑养成" },
    ];

    return (
        <>
            <TopPage />

            <SidebarGameContainer
                onChange={(sidebarIndex) => {
                    scrollToPage(sidebarIndex + 1);
                }}
                activeIndex={currentPage - 1}
                items={mockData}
            />

            <section
                className="scroll-container"
                ref={scrollContainerRef}
                style={{
                    height: "100vh",
                    overflow: "auto",
                    position: "relative",
                    padding: 0,
                    margin: 0,
                    backgroundColor: "#000"
                }}
            >
                <div className="scroll-content" style={{ position: "relative" }}>
                    {/* 第一页：首页展示 */}
                    <BackgroundOnlyPage
                        backgroundImg="https://wegame.gtimg.com/tgp_act/release/wegame/dxOrder/images/bg1.jpg"
                        glideImg={one}
                        isActive={currentPage === 1}
                        pageName="首页展示"
                    />

                    {/* 第二页：宗门争霸 */}
                    <BackgroundOnlyPage
                        backgroundImg="https://wegame.gtimg.com/tgp_act/release/wegame/dxOrder/images/bg2.jpg"
                        glideImg={two}
                        isActive={currentPage === 2}
                        pageName="宗门争霸"
                    />

                    {/* 第三页：御空飞行 */}
                    <BackgroundOnlyPage
                        backgroundImg="https://wegame.gtimg.com/tgp_act/release/wegame/dxOrder/images/bg3.jpg"
                        glideImg={three}
                        isActive={currentPage === 3}
                        pageName="御空飞行"
                    />

                    {/* 第四页：PVP竞技场 */}
                    <BackgroundOnlyPage
                        backgroundImg="https://wegame.gtimg.com/tgp_act/release/wegame/dxOrder/images/bg4.jpg"
                        glideImg={four}
                        isActive={currentPage === 4}
                        pageName="PVP竞技场"
                    />

                    {/* 第五页：坐骑养成 */}
                    <BackgroundOnlyPage
                        backgroundImg="https://wegame.gtimg.com/tgp_act/release/wegame/dxOrder/images/bg5.jpg"
                        glideImg={four}
                        isActive={currentPage === 5}
                        pageName="坐骑养成"
                    />
                </div>
            </section>
        </>
    );
}