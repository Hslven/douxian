"use client";
import GameToolbar from "@/components/game-toolbar";
import HeroSection from "@/components/HeroSection";
import NewsBox from "@/components/news-box";
import Footer from "@/components/ui/footer";
import { use, useEffect, useState } from "react";
import "./index.css";
import RegisterModal from "@/components/register-modal";
import request from "@/utils/request";
import Image from "next/image";
import arrow from '../../../public/images/arrow.png'
 
export default function Detail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [detail, setDetail] = useState<any>({});
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
      const [homeDetails, setHomeDetails] = useState<any>({});
    const [buttonImgs, setButtonImgs] = useState<any>({});

  useEffect(() => {
    request.get("/douxian/web/home").then((res) => setHomeDetails(res));
    request.get("/douxian/web/button").then((res) => setButtonImgs(res));
  }, []);

  useEffect(() => {
    if (id) {
    request.get(`/douxian/web/notice/${id}`).then(res => setDetail(res || {}))
    }
  }, [id]);
  return (
    <div>
      <HeroSection homeBackgroundUrl={(homeDetails.homeBackgroundUrls || []).at(-1)} homeDetails={homeDetails} buttonImgs={buttonImgs} openRegisterModal={() => setRegisterModalOpen(true)} />
      <div className="detail-container-wrap">
        <div className="detail-container">
        <GameToolbar openRegisterModal={() => setRegisterModalOpen(true)} buttonImgs={buttonImgs} />
        <NewsBox
          title={<div className="detail-title">新闻资讯 <Image className="detail-title-arrow" src={arrow} alt='' /></div>}
          header={
            <div className="detail-header">
              {detail.noticeTitle}
              <div className="detail-time">{detail.noticeShowTime}</div>
            </div>
          }
          content={<div className="detail-content" dangerouslySetInnerHTML={{__html: detail.noticeContent}} />}
          footer={<div style={{ height: "60px" }} />}
        />
        </div>
      </div>
      <Footer />
      <RegisterModal
        visible={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />
    </div>
  );
}
