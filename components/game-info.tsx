import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import './game-info.css'


const feachData = (current: number) => {
  return Promise.resolve({ current, pages: 20, list: Array.from({ length: 4 }).map((_, index) => ({ id: index, type: '新闻', title: '6月4日经典服新区“悠梦春晨”18:00开启05-29', time: '2025-05-29' })) })
}
export default function GameInfo() {
      const [roleList, setRoleList] = useState<any[]>([]);
      const [list, setList] = useState<any[]>([]);
      const router = useRouter();
    
      useEffect(() => {
        feachData(1).then(res => {
          setList(res.list)
        })
        setRoleList([{name:'万妖',},{name:'轩辕'},{name:'无极'},{name:'元隆'},{name:'九藜'}])
      }, [])
    return (
        <div className="game-info">
            <div className="game-info-role">
                <div className="game-info-role-img"></div>
                <div className="game-info-role-info">
                    <div className="game-info-tabs">
                        {roleList.map(item => <div className="game-info-tab" key={item.name} >{item.name}</div>)}
                    </div>
                    <div  className="game-info-role-descript"></div>
                </div>
            </div>
            <div className="game-info-news">
                <div  className="game-info-news-header">
                    <div className="game-info-news-header-title">新闻公告</div>
                    <div className="game-info-news-more">+</div>
                </div>
                <div className="game-info-news-top-title"></div>
                <div className="game-info-news-list">
                    {list.map(item => <div className="game-info-news-item" key={item.id}>
                            <div className="game-info-news-content">
                                <span className="game-info-news-type">【 {item.type} 】</span>
                                <span className="game-info-news-title">{item.title}</span>
                            </div>
                            <div className="game-info-news-time">{item.time}</div>
                    </div>)}
                </div>
            </div>
        </div>
    );
}
