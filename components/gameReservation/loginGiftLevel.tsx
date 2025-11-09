import React, { useState, useRef, useEffect } from "react";
import "./loginGiftLevel.css";

export default function SidebarGame() {
    const [activeSidebarIndex, setActiveSidebarIndex] = useState(0);
    const p1tit1Ref = useRef(null);
    const gameCarouselContainerRef = useRef(null);
    const [isAnimated, setIsAnimated] = useState(false);
    const [itemAnimateIndex, setItemAnimateIndex] = useState(0);

    // 轮播数据
    const carouselItems = [
        { image: "https://wegame.gtimg.com/tgp_act/release/wegame/dx20250815/images/p2img1.png" },
        { image: "https://wegame.gtimg.com/tgp_act/release/wegame/dx20250815/images/p2img2.png" },
    ];
    const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

    // 轮播控制逻辑
    const handlePrev = () => {
        const newIndex = currentCarouselIndex === 0 ? carouselItems.length - 1 : currentCarouselIndex - 1;
        setCurrentCarouselIndex(newIndex);
        triggerItemAnimate(newIndex);
    };

    const handleNext = () => {
        const newIndex = currentCarouselIndex === carouselItems.length - 1 ? 0 : currentCarouselIndex + 1;
        setCurrentCarouselIndex(newIndex);
        triggerItemAnimate(newIndex);
    };

    const triggerItemAnimate = (index) => {
        setItemAnimateIndex(-1);
        setTimeout(() => setItemAnimateIndex(index), 50);
    };

    // 监听视口触发动画
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsAnimated(true);
                    } else {
                        setIsAnimated(false);
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (p1tit1Ref.current) {
            observer.observe(p1tit1Ref.current);
        }

        return () => {
            if (p1tit1Ref.current) observer.unobserve(p1tit1Ref.current);
        };
    }, []);

    return (
        <div className="section_cn-two">
            {/* 头部图片：定位在顶部 */}
            <div
                ref={p1tit1Ref}
                className={`p1tit1-two ${isAnimated ? "p1tit1-animate-two" : ""}`}
            ></div>

            {/* 轮播容器：定位在中间 */}
            <div
                ref={gameCarouselContainerRef}
                className={`game-carousel-container-two ${isAnimated ? "game-carousel-container-animate-two" : ""}`}
            >
                <button
                    className="game-carousel-arrow-two game-carousel-arrow-left-two"
                    onClick={handlePrev}
                ></button>

                <div
                    className="game-carousel-wrapper-two"
                    style={{ transform: `translateX(-${currentCarouselIndex * 100}%)` }}
                >
                    {carouselItems.map((item, index) => (
                        <div
                            key={index}
                            className={`game-carousel-item-two ${itemAnimateIndex === index ? "game-carousel-item-animate-two" : ""}`}
                        >
                            <img
                                src={item.image}
                                alt={`轮播图${index + 1}`}
                                className="game-carousel-item-img-two"
                            />
                        </div>
                    ))}
                </div>

                <button
                    className="game-carousel-arrow-two game-carousel-arrow-right-two"
                    onClick={handleNext}
                ></button>
            </div>
        </div>
    );
}