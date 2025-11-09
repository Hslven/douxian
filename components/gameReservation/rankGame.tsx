// components/Ranking/RankGame.jsx
import React, { useState, useEffect, useRef } from "react";
import "./rankGame.css";

// Mock 战力榜数据
const mockRankingData = {
    code: 0,
    msg: "success",
    data: {
        title: "天骄榜",
        description: "战力榜",
        updateTime: "2024-11-09 13:27:31",
        rankings: [
            { rank: 1, roleName: "龙傲天", power: 15842000, sect: "天剑宗", server: "紫禁之巅", q币奖励: 500 },
            { rank: 2, roleName: "云飞扬", power: 14268000, sect: "玄冥教", server: "华山论剑", q币奖励: 300 },
            { rank: 3, roleName: "夜无痕", power: 13895000, sect: "幽冥谷", server: "江湖夜雨", q币奖励: 200 },
            { rank: 4, roleName: "剑无尘", power: 12543000, sect: "天剑宗", server: "紫禁之巅", q币奖励: 100 },
            { rank: 5, roleName: "梦倾城", power: 11876000, sect: "百花谷", server: "烟雨江南", q币奖励: 100 },
            { rank: 6, roleName: "傲世狂刀", power: 10923000, sect: "烈火门", server: "大漠孤烟", q币奖励: 50 },
            { rank: 7, roleName: "独孤求败", power: 10245000, sect: "天剑宗", server: "华山论剑", q币奖励: 50 },
            { rank: 8, roleName: "逆天邪神", power: 9876000, sect: "魔教", server: "江湖夜雨", q币奖励: 50 },
            { rank: 9, roleName: "绝世武神", power: 9234000, sect: "少林派", server: "武林至尊", q币奖励: 30 },
            { rank: 10, roleName: "逍遥剑客", power: 8765000, sect: "天剑宗", server: "紫禁之巅", q币奖励: 30 },
            { rank: 11, roleName: "无情公子", power: 8234000, sect: "玄冥教", server: "烟雨江南", q币奖励: 0 },
            { rank: 12, roleName: "倾城之恋", power: 7982000, sect: "百花谷", server: "江湖夜雨", q币奖励: 0 },
            { rank: 13, roleName: "剑啸九天", power: 7563000, sect: "天剑宗", server: "华山论剑", q币奖励: 0 },
            { rank: 14, roleName: "龙战于野", power: 7234000, sect: "烈火门", server: "大漠孤烟", q币奖励: 0 },
            { rank: 15, roleName: "凤舞九天", power: 6987000, sect: "百花谷", server: "烟雨江南", q币奖励: 0 },
            { rank: 16, roleName: "傲雪狂刀", power: 6543000, sect: "天剑宗", server: "紫禁之巅", q币奖励: 0 },
            { rank: 17, roleName: "一剑光寒", power: 6128000, sect: "玄冥教", server: "华山论剑", q币奖励: 0 },
            { rank: 18, roleName: "绝世剑仙", power: 5892000, sect: "幽冥谷", server: "江湖夜雨", q币奖励: 0 },
            { rank: 19, roleName: "天下无双", power: 5347000, sect: "天剑宗", server: "武林至尊", q币奖励: 0 },
            { rank: 20, roleName: "逍遥自在", power: 4986000, sect: "少林派", server: "烟雨江南", q币奖励: 0 },
        ]
    }
};

export default function RankGame() {
    const [isAnimated, setIsAnimated] = useState(false);
    const p1tit1Ref = useRef(null);
    const [rankingData, setRankingData] = useState(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsAnimated(true);
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (p1tit1Ref.current) {
            observer.observe(p1tit1Ref.current);
        }

        if (process.env.NODE_ENV === "development") {
            setTimeout(() => {
                setRankingData(mockRankingData.data);
            }, 500);
        }

        return () => {
            if (p1tit1Ref.current) observer.unobserve(p1tit1Ref.current);
        };
    }, []);

    return (
        <div className="section-rank">
            {/* 标题元素 */}
            <div
                ref={p1tit1Ref}
                className={`p1tit1-rank ${isAnimated ? "p1tit1-animate-rank" : ""}`}
            ></div>

            {/* 说明文字 */}
            <p className="p5txt1 downxia">
                战力排行半小时更新一次，数据仅供参考<span>最终解释权归官方所有</span>
            </p>

            {/* 表格容器 */}
            <div className="table-container-rank">
                <table className="ranking-table-rank">
                    <thead>
                        <tr>
                            <th className="col-rank">排名</th>
                            <th className="col-qb">Q币奖励</th>
                            <th className="col-rolename">角色名</th>
                            <th className="col-power">战力</th>
                            <th className="col-sect">门派</th>
                            <th className="col-server">所属服务器</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankingData?.rankings?.map((item) => (
                            <tr key={item.rank} className={`rank-row ${item.rank <= 3 ? `top-${item.rank}` : ''}`}>
                                <td className="col-rank">
                                    <div className="rank-badge">
                                        {item.rank <= 3 ? (
                                            <img
                                                src={`https://wegame.gtimg.com/tgp_act/release/wegame/dx20250815/images/top${item.rank}.png`}
                                                alt={`top${item.rank}`}
                                                className="rank-icon"
                                            />
                                        ) : (
                                            <span className="rank-number">{item.rank}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="col-qb">
                                    {(
                                        <span className="qb-none">-</span>
                                    )}
                                </td>
                                <td className="col-rolename">
                                    <span className="role-name">{item.roleName}</span>
                                </td>
                                <td className="col-power">
                                    <span className="power-value">{item.power.toLocaleString()}</span>
                                </td>
                                <td className="col-sect">
                                    <span className="sect-name">{item.sect}</span>
                                </td>
                                <td className="col-server">
                                    <span className="server-name">{item.server}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}