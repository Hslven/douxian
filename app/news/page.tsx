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

const feachData = (current: number) => {
  console.log(current,'current');
  
  return Promise.resolve({
    current,
    pages: 20,
    list: Array.from({ length: 20 }).map((_, index) => ({
      id: current + '-' + index,
      type: "新闻",
      title: `6月4日经典服新区“悠梦春晨”18:00开启05-29 ${current}`,
      time: "2025-05-29",
    })),
  });
};

export default function NewsPage() {
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [current, setCurrent] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const router = useRouter();
  useEffect(() => {
    feachData(currentPage).then((res) => {
      setTotalPages(21);
      setList(res.list);
    });
  }, []);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    setTotalPages(21);
    feachData(page).then((res) => {
      setList(res.list);
    });
  };
  return (
    <div>
      <HeroSection openRegisterModal={() => setRegisterModalOpen(true)} />
      <div className="news-container">
        <GameToolbar openRegisterModal={() => setRegisterModalOpen(true)} />
        <NewsBox
          header={<div className="news-header">新闻资讯</div>}
          content={
            <div className="new-list">
              {list.map((item) => (
                <div
                  key={item.id}
                  className="new-item"
                  onClick={() => {
                    router.push(`/detail/${item.id}`);
                  }}
                >
                  <div className="new-item-content">
                    <span className="new-item-type">【 {item.type} 】</span>
                    <span className="new-item-title">{item.title}</span>
                  </div>
                  <div>{item.time}</div>
                </div>
              ))}
            </div>
          }
          footer={
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          }
        />
      </div>
      <Footer />
      <RegisterModal
        visible={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />
    </div>
  );
}
