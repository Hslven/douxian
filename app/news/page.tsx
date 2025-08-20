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

export default function NewsPage() {
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [current, setCurrent] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const router = useRouter();
  const [homeDetails, setHomeDetails] = useState<any>({});
    const [buttonImgs, setButtonImgs] = useState<any>({});

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
      />
      <div className="news-container-wrap">
        <div className="news-container">
          <GameToolbar openRegisterModal={() => setRegisterModalOpen(true)} buttonImgs={buttonImgs} />
          <NewsBox
            header={<div className="news-header">新闻资讯</div>}
            content={
              <div className="new-list">
                {list.map((item) => (
                  <div
                    key={item.noticeId}
                    className="new-item"
                    onClick={() => {
                      router.push(`/detail/${item.noticeId}`);
                    }}
                  >
                    <div className="new-item-content">
                      <span className="new-item-type">
                        【 {item.type || "资讯"} 】
                      </span>
                      <span className="new-item-title">{item.noticeTitle}</span>
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
    </div>
  );
}
