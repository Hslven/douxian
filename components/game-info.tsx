import { useEffect, useState } from "react";
import "./game-info.css";
import Rate from "./rate";
import more from "../public/images/more.png";
import Image from "next/image";
import request, { getImgUrl } from "@/utils/request";
import { useVideoModal } from "./video-modal";
export default function GameInfo() {
  const [roleList, setRoleList] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  // const [newsDetail, setNewsDetail] = useState<any>([]);
  const { openVideo } = useVideoModal();

  // 创建角色与转职方向的映射关系
  const careerDirections: Record<string, string> = {
    渊龙: "玄翎 / 龙羽",
    轩辕: "圣手 / 风神",
    万妖: "天妖 / 妖皇",
    无极: "剑仙 / 奕剑",
    九黎: "暗影 / 弑魂",
  };
  useEffect(() => {
    request
      .get("/douxian/web/career")
      .then((res: any) => setRoleList((res.list || []).slice(0, 5)));
    // request
    //   .get("/douxian/web/notice", { params: { pageNo: 1, pageSize: 10 } })
    //   .then((res: any) => {
    //     setNewsDetail(res.list);
    //   });
  }, []);
  // 获取当前角色的转职方向
  const getCurrentCareerDirection = () => {
    const currentRole = roleList[activeIndex]?.careerName;
    return careerDirections[currentRole] || "";
  };
  return (
    <div className="game-info">
      {/* <div
        className="game-info-role"
        style={{
          backgroundImage: `url(${getImgUrl(
            roleList[activeIndex]?.careerRoleBackgroundImage
          )})`,
          backgroundSize: "cover",
        }}
      > */}
        <img
          className="game-info-role-img"
          src={getImgUrl(roleList[activeIndex]?.careerRoleImage)}
        />
        <div className="game-info-role-info">
          <div className="game-info-role-card">
            <div className="game-info-role-name">
              {roleList[activeIndex]?.careerName}
            </div>
            <div className="game-info-role-number">
              操作难度：{" "}
              <Rate value={roleList[activeIndex]?.careerDifficulty} />
            </div>
            <div className="game-info-role-number">
              转职方向：{getCurrentCareerDirection()}
            </div>
            <div className="game-info-role-descript">
              {roleList[activeIndex]?.remark}
            </div>
            <div className="game-info-video-group">
              <div
                className="game-info-video"
                onClick={() => openVideo("http://vjs.zencdn.net/v/oceans.mp4")}
              ></div>
              <div
                className="game-info-video"
                onClick={() => openVideo("http://vjs.zencdn.net/v/oceans.mp4")}
              ></div>
            </div>

          <div className="game-info-tabs">
            <div  onClick={() => setActiveIndex(activeIndex ? activeIndex - 1 : 0)}>上一个</div>
            {roleList.map((item, index) => (
              <div
                className={`game-info-tab ${
                  index === activeIndex ? "game-info-tab-active" : ""
                }`}
                key={item.careerId}
                onClick={() => setActiveIndex(index)}
              >
                {item.careerName}
              </div>
            ))}
            <div onClick={() => setActiveIndex(activeIndex + 1 ===  roleList.length? activeIndex : activeIndex + 1)}>下一个</div>

          </div>
          </div>
        </div>
    </div>
  );
}
