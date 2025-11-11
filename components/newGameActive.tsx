"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import one from "../public/images/1.png";
import two from "../public/images/2.png";
import three from "../public/images/3.png";
import four from "../public/images/4.png";
import request from "@/utils/request";
import bac1 from "../public/images/1.jpg";
import bac2 from "../public/images/2.jpg";
import bac3 from "../public/images/3.jpg";
import bac4 from "../public/images/4.jpg";
import bac5 from "../public/images/5.jpg";
import "./home.css";
import "./hero-home.css";
import TopPage from "./ui/topPage";
import SidebarGameContainer from "./ui/SidebarGameContainer/SidebarGameContainer";


// 动态背景页面组件
interface DynamicBackgroundPageProps {
    url: string;
    index: number;
    currentPage: number;
    glideImg?: any;
    pageName?: string;
}

const DynamicBackgroundPage: React.FC<DynamicBackgroundPageProps> = ({
    url,
    index,
    currentPage,
    glideImg,
    pageName
}) => {
    const [bgLoaded, setBgLoaded] = useState(false);
    const [bgError, setBgError] = useState(false);
    const isActive = currentPage === index;

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
            {url && !bgError && (
                <img
                    className="page-section-bg"
                    src={url}
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

    // 页面配置数据
    const pageConfigs = [
        { url: "/images/1.jpg", glideImg: one, name: "首页展示" },
        { url: "/images/2.jpg", glideImg: two, name: "宗门争霸" },
        { url: "/images/3.jpg", glideImg: three, name: "御空飞行" },
        { url: "/images/4.jpg", glideImg: four, name: "PVP竞技场" },
        { url: "/images/5.jpg", glideImg: four, name: "坐骑养成" },
    ];

    useEffect(() => {
        request.get("/douxian/web/home").then((res) => setHomeDetails(res));
    }, []);

    // 侧边栏数据
    const mockData = [
        { id: "1", bgClass: "sidebar-bg-1", currBgClass: "sidebar-bg-curr-1", name: "首页展示" },
        { id: "2", bgClass: "sidebar-bg-2", currBgClass: "sidebar-bg-curr-2", name: "宗门争霸" },
        { id: "3", bgClass: "sidebar-bg-3", currBgClass: "sidebar-bg-curr-3", name: "御空飞行" },
        { id: "4", bgClass: "sidebar-bg-4", currBgClass: "sidebar-bg-curr-4", name: "PVP竞技场" },
        { id: "5", bgClass: "sidebar-bg-5", currBgClass: "sidebar-bg-curr-5", name: "坐骑养成" },
    ];

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

        setTimeout(() => {
            setIsScrolling(false);
            handleScroll();
        }, 800);
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
                    {pageConfigs.map((config, index) => (
                        <DynamicBackgroundPage
                            key={index}
                            url={config.url}
                            index={index + 1}
                            currentPage={currentPage}
                            glideImg={config.glideImg}
                            pageName={config.name}
                        />
                    ))}
                </div>
            </section>
        </>
    );
}