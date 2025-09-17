import { useEffect, useRef, useState } from "react";
import "./game-active.css";
import request, { getImgUrl } from "@/utils/request";
import { useVideoModal } from "./video-modal";

const noticeTypeMap = {
  LATEST: "最新",
  NEWS: "新闻",
  NOTICE: "公告",
  GUIDE: "攻略",
};

export default function GameActive({ homeDetails }: any) {
  const [activeList, setActiveList] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeNewsType, setActiveNewsType] = useState("LATEST");
  const [newsDetail, setNewsDetail] = useState<any>([]);
  const intervalRef = useRef<any>(null);
  const { openVideo } = useVideoModal();
  useEffect(() => {
    if (homeDetails.homeCarouselUrls?.length) {
      setActiveList(
        homeDetails.homeCarouselUrls.map((item) => ({
          ...item,
          imageUrl: getImgUrl(item.imageUrl),
          videoUrl: getImgUrl(item.videoUrl),
        }))
      );
    }
  }, [homeDetails.homeCarouselUrls]);

  const getNewsDetail = (noticeType: string) => {
    request
      .get("/douxian/web/notice", {
        params: { pageNo: 1, pageSize: 5, noticeType },
      })
      .then((res: any) => {
        setNewsDetail(res.list);
      });
  };

  useEffect(() => {
    getNewsDetail(activeNewsType);
  }, []);

  // 自动轮播
  useEffect(() => {
    if (activeList.length && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [activeList.length]);

  // 下一张
  const nextSlide = () => {
    setActiveIndex((prevIndex) =>
      prevIndex + 1 === activeList.length ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="game-active">
      <div className="game-active-box">
        <div
          className="game-active-img-warp"
          onClick={() => {
            if (activeList[activeIndex]?.videoUrl) {
              openVideo(activeList[activeIndex]?.videoUrl);
            } else if (activeList[activeIndex]?.jumpUrl) {
              window.open(activeList[activeIndex]?.jumpUrl);
            }
          }}
        >
          <img
            className="game-active-img"
            src={activeList[activeIndex]?.imageUrl}
            alt=""
          />
          {!!activeList[activeIndex]?.videoUrl && (
            <div className="game-active-play" />
          )}
        </div>
        <div className="game-active-dots">
          {activeList.map((_, index) => (
            <button
              key={index}
              className={`game-active-dot ${
                activeIndex === index ? "game-active-dot-active" : ""
              }`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
      <div className="game-info-news">
        <div className="game-info-news-header">
          <div className="game-info-news-header-title">
            {Object.keys(noticeTypeMap).map((type) => (
              <div
                onClick={() => {
                  setActiveNewsType(type);
                  getNewsDetail(type);
                }}
                className={`game-info-news-tab ${
                  activeNewsType === type ? "game-info-news-tab-active" : ""
                }`}
                key={type}
              >
                {noticeTypeMap[type]}
                <div className="game-info-news-tab-active-line" />
              </div>
            ))}
          </div>
          <div
            className="game-info-news-more"
            onClick={() => {
              window.open("/news");
            }}
          ></div>
        </div>
        <div
          className="game-info-news-top-title"
          // style={{ color: newsDetail[0]?.noticeTitleColor }}
          onClick={() => window.open(`/detail/${newsDetail[0]?.noticeId}`)}
        >
          {newsDetail[0]?.noticeTitle}
        </div>
        <div className="game-info-news-list">
          {newsDetail.map((item, index) => {
            if (!index) return null;
            return (
              <div
                className="game-info-news-item"
                // style={{
                //   border: item.noticeBorderStyle,
                //   backgroundColor: item.noticeBackgroundColor,
                // }}
                key={item.noticeId}
                onClick={() => window.open(`/detail/${item.noticeId}`)}
              >
                <div className="game-info-news-content">
                  <span className="game-info-news-type">
                    [{noticeTypeMap[item.noticeType]}]
                  </span>
                  <span
                    className="game-info-news-title"
                    // style={{ color: item.noticeTitleColor }}
                  >
                    {item.noticeTitle}
                  </span>
                </div>
                <div className="game-info-news-time">{item.noticeShowTime}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="game-active-toy" />
    </div>
  );
}
