import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./game-info.css";
import Rate from "./rate";
import role_image from '../public/images/role_image.png'
import role_name from '../public/images/role_name.png'
import more from '../public/images/more.png'
import Image from "next/image";
 
const feachData = (current: number) => {
  return Promise.resolve({
    current,
    pages: 20,
    list: Array.from({ length: 4 }).map((_, index) => ({
      id: index,
      type: "新闻",
      title: "6月4日经典服新区“悠梦春晨”18:00开启05-29",
      time: "2025-05-29",
    })),
  });
};
export default function GameInfo() {
  const [role, setRole] = useState<any>({});
  const [roleList, setRoleList] = useState<any[]>([]);
  const [list, setList] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    feachData(1).then((res) => {
      setList(res.list);
    });
    setRoleList([
      {
        name: "万妖",
        nd: 3,
        zy: 5,
        describe: "职业介绍万妖职万妖业介绍支支万妖招指挥长",
      },
      {
        name: "轩辕",
        nd: 5,
        zy: 4,
        describe: "职业介绍轩辕职业轩辕介轩辕绍支支招指挥长",
      },
      {
        name: "无极",
        nd: 3,
        zy: 2,
        describe: "无极职业介无极绍职业介绍支支招指挥无极长",
      },
      {
        name: "元隆",
        nd: 2,
        zy: 3,
        describe: "职业介元隆绍职业元隆介绍支支招元隆指挥长",
      },
      {
        name: "九藜",
        nd: 4,
        zy: 4,
        describe: "职九藜业介绍九藜职业介绍支九藜支招指挥长",
      },
    ]);
    setRole({
      name: "万妖",
      nd: 3,
      zy: 5,
      describe: "职业介绍万妖职万妖业介绍支支万妖招指挥长",
    });
  }, []);
  return (
    <div className="game-info">
      <div className="game-info-role">
        {/* <div className="game-info-role-img">
        </div> */}
            <Image className="game-info-role-img" src={role_image} alt='' />

        <div className="game-info-role-info">
            <Image className="game-info-role-info-bg" src={role_name} alt='' />
          <div className="game-info-tabs">
            {roleList.map((item) => (
              <div
                className={`game-info-tab ${
                  item.name === role?.name ? "game-info-tab-active" : ""
                }`}
                key={item.name}
                onMouseEnter={() => setRole(item)}
              >
                {item.name}
              </div>
            ))}
          </div>
          <div className="game-info-role-card">
            <div className="game-info-role-name">{role.name}</div>
            <div>
              操作难度： <Rate value={role.nd} />
            </div>
            <div>
              重要程度： <Rate value={role.zy} />
            </div>
            <div className="game-info-role-descript">{role.describe}</div>
          </div>
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
            <Image src={more} alt='' />
          </div>
        </div>
        <div className="game-info-news-top-title">
            {'6月4日经典服新区“悠梦春晨”18:00开启'}
        </div>
        <div className="game-info-news-list">
          {list.map((item) => (
            <div
              className="game-info-news-item"
              key={item.id}
              onClick={() => window.open(`/detail/${item.id}`)}
            >
              <div className="game-info-news-content">
                <span className="game-info-news-type">【 {item.type} 】</span>
                <span className="game-info-news-title">{item.title}</span>
              </div>
              <div className="game-info-news-time">{item.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
