import { useEffect, useRef, useState } from "react";
import GameToolbar from "./game-toolbar";
import "./game-active.css";
import request, { getImgUrl } from "@/utils/request";

import more from "../public/images/more.png";
import Image from "next/image";
import { useVideoModal } from "./video-modal";

const newsType = [
  { key: "new", name: "最新" },
  { key: "news", name: "新闻" },
  { key: "notice", name: "公告" },
  { key: "nin", name: "攻略" },
];


const noticeTypeMap = {
  LATEST: '最新',
  NEWS:'新闻',
  NOTICE:'公告',
  GUIDE:'攻略'
}

const isVedio = () => {
  return false;
}

export default function GameActive({
  openRegisterModal,
  homeDetails,
  buttonImgs,
}: any) {
  const [activeList, setActiveList] = useState<any[]>(["", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeNewsType, setActiveNewsType] = useState("new");
  const [newsDetail, setNewsDetail] = useState<any>([]);
  const intervalRef = useRef<any>(null);
const {openVideo} = useVideoModal()
  // useEffect(() => {
  //   if(homeDetails.gameShots?.length) {
  //     setActiveList(homeDetails.gameShots.map(url => getImgUrl(url)))
  //   }
  // }, [homeDetails.gameShots]);

  useEffect(() => {
    request
      .get("/douxian/web/notice", { params: { pageNo: 1, pageSize: 10 } })
      .then((res: any) => {
        setNewsDetail(res.list);
      });
  }, []);

  // 自动轮播
  useEffect(() => {
    if (activeList.length && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, 3000);
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
      {/* <GameToolbar className="game-active-toolbar" openRegisterModal={openRegisterModal} buttonImgs={buttonImgs} /> */}
      <div className="game-active-box">
        <div
          className="game-active-img-warp"
          onClick={() => {
            if(isVedio()) {
             openVideo("http://vjs.zencdn.net/v/oceans.mp4")
            } else {
              window.open(`/detail/${activeIndex + 4}`)
            }
          }}
        >
          <img
            className="game-active-img"
            src={activeList[activeIndex]}
            alt=""
          />
        </div>
        {/* <div className="game-active-tabs">
          {Array.from({length:3}).map((_, index) => (
            <div
              onMouseEnter={() => setActiveIndex(index)}
              className={`game-active-tab ${
                activeIndex === index ? "game-active-tab-active" : ""
              }`}
              key={index}

            >
              活动页面{index+ 1}
            </div>
          ))}
        </div> */}

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
                onMouseEnter={() => setActiveNewsType(type)}
                className={`game-info-news-tab ${
                  activeNewsType === type ? "game-info-news-tab-active" : ""
                }`}
                key={type}
              >
                {noticeTypeMap[type]}
              </div>
            ))}
          </div>
          <div
            className="game-info-news-more"
            onClick={() => {
              window.open("/news");
            }}
          >
            <Image src={more} alt="" />
          </div>
        </div>
        <div
          className="game-info-news-top-title"
          style={{ color: newsDetail[0]?.noticeTitleColor }}
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
                style={{
                  border: item.noticeBorderStyle,
                  backgroundColor: item.noticeBackgroundColor,
                }}
                key={item.noticeId}
                onClick={() => window.open(`/detail/${item.noticeId}`)}
              >
                <div className="game-info-news-content">
                  <span className="game-info-news-type">【 {noticeTypeMap[item.noticeType]} 】</span>
                  <span
                    className="game-info-news-title"
                    style={{ color: item.noticeTitleColor }}
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
    </div>
  );
}
