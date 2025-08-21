"use client";

import GameToolbar from "@/components/game-toolbar";
import HeroSection from "@/components/HeroSection";
import NewsBox from "@/components/news-box";
import Footer from "@/components/ui/footer";
import { useEffect, useState } from "react";
import "./index.css";
import { useRouter } from "next/navigation";
import Pagination from "@/components/pagination";
import RegisterModal from "@/components/register-modal";
import request from "@/utils/request";
import Modal from "@/components/modal";

export default function NewsPage() {
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [current, setCurrent] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const router = useRouter();
  const [homeDetails, setHomeDetails] = useState<any>({});
  const [buttonImgs, setButtonImgs] = useState<any>({});
  const [tipsOpen, setTipsOpen] = useState(false);

  useEffect(() => {
    request.get("/douxian/web/home").then((res) => setHomeDetails(res));
    request.get("/douxian/web/button").then((res) => setButtonImgs(res));
  }, []);

  const feachData = (pageNo: number, pageSize: number = 20) => {
    request
      .get("/douxian/web/notice", { params: { pageNo, pageSize } })
      .then((res: any) => {
        setTotalPages(Math.ceil(res.total / pageSize));
        setList(res.list);
        setCurrent(pageNo);
      });
  };
  useEffect(() => {
    feachData(current);
  }, []);

  return (
    <div>
      <HeroSection
        homeBackgroundUrl={(homeDetails.homeBackgroundUrls || []).at(-1)}
        homeDetails={homeDetails}
        buttonImgs={buttonImgs}
        openRegisterModal={() => setRegisterModalOpen(true)}
        openTips={() => setTipsOpen(true)}
      />
      <div className="news-container-wrap">
        <div className="news-container">
          <GameToolbar
            openTips={() => setTipsOpen(true)}
            openRegisterModal={() => setRegisterModalOpen(true)}
            buttonImgs={buttonImgs}
          />
          <NewsBox
            header={<div className="news-header">新闻资讯</div>}
            content={
              <div className="new-list">
                {list.map((item) => (
                  <div
                    key={item.noticeId}
                    className="new-item"
                    style={{
                      backgroundColor: item.noticeBackgroundColor,
                      border: item.noticeBorderStyle,
                    }}
                    onClick={() => {
                      router.push(`/detail/${item.noticeId}`);
                    }}
                  >
                    <div className="new-item-content">
                      <span className="new-item-type">
                        【 {item.type || "资讯"} 】
                      </span>
                      <span
                        className="new-item-title"
                        style={{ color: item.noticeTitleColor }}
                      >
                        {item.noticeTitle}
                      </span>
                    </div>
                    <div>{item.noticeShowTime}</div>
                  </div>
                ))}
              </div>
            }
            footer={
              <Pagination
                currentPage={current}
                totalPages={totalPages}
                onPageChange={feachData}
              />
            }
          />
        </div>
      </div>
      <Footer />
      <RegisterModal
        visible={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />
      <Modal visible={tipsOpen} onClose={() => setTipsOpen(false)}>
        <div
          style={{
            textAlign: "center",
            lineHeight: "32.2vw",
            fontWeight: 700,
            color: "#34110a",
            fontSize: "5vw",
          }}
        >
          敬请期待...
        </div>
      </Modal>
    </div>
  );
}
