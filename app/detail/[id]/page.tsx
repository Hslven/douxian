"use client"
import GameToolbar from "@/components/game-toolbar";
import HeroSection from "@/components/HeroSection";
import NewsBox from "@/components/news-box";
import Footer from "@/components/ui/footer";
import { use, useEffect, useState } from "react";
import './index.css'

export default function Detail({ params }: { params: Promise<{ id: string }> }) {
const { id } = use(params);
  const [detail, setDetail] = useState<any>({});

  useEffect(() => {
    console.log(params, 'params');
    if (id) {
      setDetail({
        id,
        title: '6月4日经典服新区“悠梦春晨”18:00开启原汁原味',
        time: '2025-6-12 16:04',
        content: '月4日经典服新区“悠梦春晨”18:00开启05-296月4日经典服新区“悠梦春晨”18:00开启05-296月4日经典服新区“悠梦春晨”18:00开启05-296月4日经典服新区“悠梦春晨”18:00开启05-296月4日经典服新区“悠梦春晨”18:00开启05-296月4日经典服新区“悠梦春晨”18:00开启05-296月4日经典服新区“悠梦春晨”18:00开启05-296月4日经典服新区“悠梦春晨”18:00开启05-296月4日经典服新区“悠梦春晨”18:00开启05-296月4日经典服新区“悠梦春晨”18:00开启05-296月4日经典服新区“悠梦春晨”18:00开启05-296月4日经典服新区“悠梦春晨”18:00开启05-296月4日经典服新区“悠梦春晨”18:00开启05-296月4日经典服新区“悠梦春晨”18:00开启05-296月4日经典服新区“悠梦春晨”18:00开启05-296月4日经典服新区“悠梦春晨”18:00开启05-296月4日经典服新区“悠梦春晨”18:00开启05-296月4日经典服新区“悠梦春晨”18:00开启05-296月4日经典服新区“悠梦春晨”18:00开启05-296月4日经典服新区“悠梦春晨”18:00开启05-29'
      })
    }

  }, [id])
  return <div>
    <HeroSection />
     <div className="detail-container">
      <GameToolbar />
      <NewsBox title={<div className="detail-title">新闻资讯 》</div>} header={<div className="detail-header">{detail.title}<div className="detail-time">{detail.time}</div></div>} content={<div className="detail-content">{detail.content}</div>} footer={<div style={{height:'60px'}} />} />
    </div>
    <Footer />
  </div>;
}