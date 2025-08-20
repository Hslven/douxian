import { useEffect, useState } from "react";
import "./game-info.css";
import Rate from "./rate";
import more from "../public/images/more.png";
import Image from "next/image";
import request, { getImgUrl } from "@/utils/request";

export default function GameInfo() {
  const [roleList, setRoleList] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [newsDetail, setNewsDetail] = useState<any>([]);

  useEffect(() => {
    request
      .get("/douxian/web/career")
      .then((res: any) => setRoleList((res.list || []).slice(0, 5)));
    request
      .get("/douxian/web/notice", { params: { pageNo: 1, pageSize: 10 } })
      .then((res: any) => {
        setNewsDetail(res.list);
      });
  }, []);
  return (
    <div className="game-info">
      <div className="game-info-role">
        <img
          className="game-info-role-img"
          src={getImgUrl(roleList[activeIndex]?.careerRoleImage)}
        />
        <div className="game-info-role-info">
          <div className="game-info-tabs">
            {roleList.map((item, index) => (
              <div
                className={`game-info-tab ${
                  index === activeIndex ? "game-info-tab-active" : ""
                }`}
                key={item.careerId}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {item.careerName}
              </div>
            ))}
          </div>
          <div className="game-info-role-card">
            <div className="game-info-role-name">
              {roleList[activeIndex]?.careerName}
            </div>
            <div>
              操作难度：{" "}
              <Rate value={roleList[activeIndex]?.careerDifficulty} />
            </div>
            <div>
              重要程度：{" "}
              <Rate value={roleList[activeIndex]?.careerImportance} />
            </div>
            <div className="game-info-role-descript">
              {roleList[activeIndex]?.remark}
            </div>
          </div>
          <img
            className="game-info-role-info-bg"
            src={getImgUrl(roleList[activeIndex]?.careerRoleBackgroundImage)}
          />
        </div>
      </div>
      <div className="game-info-news">
        <div className="game-info-news-header">
          <div className="game-info-news-header-title">新闻公告</div>
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
                key={item.noticeId}
                onClick={() => window.open(`/detail/${item.noticeId}`)}
              >
                <div className="game-info-news-content">
                  <span className="game-info-news-type">【 新闻 】</span>
                  <span className="game-info-news-title">
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
