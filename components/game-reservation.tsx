"use client";
import { useState, useEffect, useRef } from "react";
import LoginGift from "./gameReservation/loginGift";
import GameInfo from "./game-info";
import GameCarousel from "./game-carousel";
import RegisterModal from "./register-modal";
import Image from "next/image";
import one from "../public/images/1.png";
import two from "../public/images/2.png";
import three from "../public/images/3.png";
import four from "../public/images/4.png";
import request, { getImgUrl } from "@/utils/request";
import "./home.css";
import "./hero-home.css";
import Modal from "./modal";
import Header from "./ui/header";
import SidebarGameContainer from "./ui/SidebarGameContainer/SidebarGameContainer";

const PageSection = ({
    children,
    backgroundImg,
    glideImg,
    isActive
}: {
    children: React.ReactNode;
    backgroundImg?: string;
    glideImg?: any;
    isActive: boolean; // 标记当前是否为激活页（由父组件传入）
}) => {
    const [bgLoaded, setBgLoaded] = useState(false);

    return (
        <div
            className="page-section"
            style={{
                minHeight: "100vh",
                // 过渡动画延长，确保侧边栏切换时平滑过渡
                transition: "opacity 0.6s ease, transform 0.6s ease",
                // 由父组件控制可见性，避免滚动事件延迟导致的灰置
                opacity: isActive ? 1 : 0,
                transform: isActive ? "translateY(0)" : "translateY(20px)",
                position: "relative"
            }}
        >
            {backgroundImg && (
                <img
                    className="page-section-bg"
                    src={getImgUrl(backgroundImg)}
                    style={{
                        display: bgLoaded ? "block" : "none",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover" // 确保背景图铺满，避免留白
                    }}
                    onLoad={() => setBgLoaded(true)}
                    onError={() => setBgLoaded(true)} // 图片加载失败也强制显示，避免永久灰置
                />
            )}
            <div style={{ position: "relative", zIndex: 1 }}> {/* 内容层在背景上 */}
                {children}
                {glideImg && <Image className="game-glide" src={glideImg} alt="" />}
            </div>
        </div>
    );
};

export default function HeroHome() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [registerModalOpen, setRegisterModalOpen] = useState(false);
    const [homeDetails, setHomeDetails] = useState<any>({});
    const [buttonImgs, setButtonImgs] = useState<any>({});
    const [tipsOpen, setTipsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isScrolling, setIsScrolling] = useState(false);
    // 记录总页数，避免重复计算
    const totalPagesRef = useRef(4); // 当前有4个PageSection（可根据实际数量调整）

    useEffect(() => {
        request.get("/douxian/web/home").then((res) => setHomeDetails(res));
        request.get("/douxian/web/button").then((res) => setButtonImgs(res));
    }, []);

    // 处理滚动时的页面激活状态（仅在非侧边栏触发的滚动时生效）
    const handleScroll = () => {
        if (isScrolling) return; // 侧边栏触发的滚动中，不更新状态

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

            // 宽松的可见判断，确保滚动时页面提前激活
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

    // 侧边栏触发的滚动逻辑（重点优化）
    const scrollToPage = (index: number) => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        // 校验索引有效性
        if (index < 1 || index > totalPagesRef.current) {
            console.warn(`无效页面索引: ${index}，有效范围 1-${totalPagesRef.current}`);
            return;
        }

        // 1. 立即更新currentPage，确保侧边栏激活状态同步（关键）
        setCurrentPage(index);
        // 2. 标记滚动中，阻止handleScroll干扰
        setIsScrolling(true);

        const pages = scrollContainer.querySelectorAll(".page-section");
        const targetPage = pages[index - 1];
        if (!targetPage) return;

        // 3. 计算精确滚动位置（不受父元素样式影响）
        const targetRect = targetPage.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();
        const targetScrollTop = targetRect.top - containerRect.top + scrollContainer.scrollTop;

        // 4. 执行滚动
        scrollContainer.scrollTo({
            top: targetScrollTop,
            behavior: "smooth"
        });

        // 5. 滚动结束后恢复状态（延长延迟，确保动画完成）
        const timer = setTimeout(() => {
            setIsScrolling(false);
            handleScroll(); // 强制校验位置，确保状态最终同步
        }, 800); // 匹配过渡动画时长（0.6s），留冗余

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
                totalPagesRef.current = pages.length; // 更新总页数
                pages.forEach(page => {
                    (page as HTMLElement).style.height = `${window.innerHeight}px`;
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
        { id: "1", bgClass: "sidebar-bg-1", currBgClass: "sidebar-bg-curr-1", name: "宗门争霸" },
        { id: "2", bgClass: "sidebar-bg-2", currBgClass: "sidebar-bg-curr-2", name: "御空飞行" },
        { id: "3", bgClass: "sidebar-bg-3", currBgClass: "sidebar-bg-curr-3", name: "PVP竞技场" },
        { id: "4", bgClass: "sidebar-bg-4", currBgClass: "sidebar-bg-curr-4", name: "坐骑养成" },
        { id: "5", bgClass: "sidebar-bg-5", currBgClass: "sidebar-bg-curr-5", name: "情缘系统" },
    ];

    return (
        <>

            {/* 侧边栏：点击时直接触发scrollToPage，并通过activeIndex同步状态 */}
            <SidebarGameContainer
                onChange={(sidebarIndex) => {
                    // 侧边栏索引0对应页面1，索引1对应页面2...
                    scrollToPage(sidebarIndex + 1);
                }}
                activeIndex={currentPage - 1} // 实时同步当前页索引
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
                    // 背景色与页面协调，避免灰置时露出异常颜色
                    backgroundColor: "#000" // 根据实际设计调整
                }}
            >
                <div className="scroll-content" style={{ position: "relative" }}>
                    {/* 第一页：通过isActive控制可见性（与currentPage绑定） */}
                    <PageSection
                        glideImg={one}
                        isActive={currentPage === 1}
                    >
                        <LoginGift homeDetails={homeDetails} />
                    </PageSection>

                    {/* 第二页 */}
                    <PageSection
                        backgroundImg={homeDetails.homeBackgroundUrls?.[1]}
                        glideImg={two}
                        isActive={currentPage === 2}
                    />

                    {/* 第三页 */}
                    <PageSection
                        backgroundImg={homeDetails.homeBackgroundUrls?.[2]}
                        glideImg={three}
                        isActive={currentPage === 3}
                    >
                        <GameInfo />
                    </PageSection>

                    {/* 第四页 */}
                    <PageSection
                        backgroundImg={homeDetails.homeBackgroundUrls?.[3]}
                        glideImg={four}
                        isActive={currentPage === 4}
                    >
                        <GameCarousel homeDetails={homeDetails} />
                    </PageSection>
                </div>

                <RegisterModal
                    visible={registerModalOpen}
                    onClose={() => setRegisterModalOpen(false)}
                />
                <Modal visible={tipsOpen} onClose={() => setTipsOpen(false)} />
            </section>
        </>
    );
}