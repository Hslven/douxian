"use client"

import GameToolbar from "@/components/game-toolbar";
import HeroSection from "@/components/HeroSection";
import NewsBox from "@/components/news-box";
import Footer from "@/components/ui/footer";
import { useEffect, useState } from "react";
import './index.css'
import { useRouter } from "next/navigation";
import Pagination from "@/components/pagination";

const feachData = (current: number) => {
  return Promise.resolve({ current, pages: 20, list: Array.from({ length: 20 }).map((_, index) => ({ id: index, type: '新闻', title: '6月4日经典服新区“悠梦春晨”18:00开启05-29', time: '2025-05-29' })) })
}

export default function NewsPage() {

  const [list, setList] = useState<any[]>([]);
  const [current, setCurrent] = useState(1);
  const router = useRouter();

  useEffect(() => {
    feachData(current).then(res => {
      setList(res.list)
    })
  }, [])
  return <div>
    <HeroSection />
    <div className="news-container" >
      <GameToolbar />
      <NewsBox header={<div className="news-header">新闻资讯</div>} content={<div className="new-list">{list.map(item => <div key={item.id} className="new-item" onClick={() => {
        router.push(`/detail/${item.id}`);
      }}>
        <div className="new-item-content">
          <span className="new-item-type">【 {item.type} 】</span>
          <span className="new-item-title">{item.title}</span>
        </div>
        <div>{item.time}</div>
      </div>)}</div>} footer={<Pagination />} />
    </div>
    <Footer />
  </div>;
}