"use client";
import GameToolbar from "@/components/game-toolbar";
import HeroSection from "@/components/HeroSection";
import NewsBox from "@/components/news-box";
import Footer from "@/components/ui/footer";
import { use, useEffect, useState, useRef } from "react"; // 添加useRef导入
import "./index.css";
import RegisterModal from "@/components/register-modal";
import request from "@/utils/request";
import Image from "next/image";
import arrow from '../../../public/images/arrow.png'
import Modal from "@/components/modal";
import mobile from '../../../public/images/modal.jpg'

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
  const [tipsOpen, setTipsOpen] = useState(false);
  // 创建ref引用detail-container-wrap元素
  const detailContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    request.get("/douxian/web/home").then((res) => setHomeDetails(res));
    request.get("/douxian/web/button").then((res) => setButtonImgs(res));
  }, []);
  useEffect(() => {
    if (id) {
      request.get(`/douxian/web/notice/${id}`).then(res => {
        setDetail(res || {});
        // 数据加载完成后滚动到detail-container-wrap
        setTimeout(() => {
          if (detailContainerRef.current) {
            detailContainerRef.current.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 100);
      })
    }
  }, [id]);
  return (
    <div>
      <HeroSection 
        openTips={()=>setTipsOpen(true)}  
        homeBackgroundUrl={(homeDetails.homeBackgroundUrls || []).at(-1)} 
        homeDetails={homeDetails} 
        buttonImgs={buttonImgs} 
        openRegisterModal={() => setRegisterModalOpen(true)} 
      />
      {/* 添加ref到detail-container-wrap元素 */}
      <div className="detail-container-wrap" ref={detailContainerRef}>
        <div className="detail-container">
          <GameToolbar 
            openTips={()=>setTipsOpen(true)}  
            openRegisterModal={() => setRegisterModalOpen(true)} 
            buttonImgs={buttonImgs} 
          />
          <NewsBox
            style={{width:'72.39vw',height:'88.44vw'}}
            title={<div className="detail-title">新闻资讯 <Image className="detail-title-arrow" src={arrow} alt='' /></div>}
            header={
              <div className="detail-header">
                <div style={{color:detail.noticeTitleColor}}>{detail.noticeTitle}</div>
                <div className="detail-time">{detail.noticeShowTime}</div>
              </div>
            }
            content={
              <div 
                className="detail-content" 
                style={{color:detail.noticeContentColor}} 
                dangerouslySetInnerHTML={{__html: detail.noticeContent}} 
              />
            }
            footer={<div style={{ height: "60px" }} />}
          />
        </div>
      </div>
      <Footer />
      <RegisterModal
        visible={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />
      <Modal
        visible={tipsOpen}
        onClose={() => setTipsOpen(false)}
      >
        {/* <div style={{textAlign:'center',lineHeight:'32.2vw',fontWeight:700,color:'#34110a',fontSize:'5vw'}}>
          敬请期待...
        </div> */}
      </Modal>
    </div>
  );
}