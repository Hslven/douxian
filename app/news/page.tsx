"use client";
import NewsBox from "@/components/news-box";
import Footer from "@/components/ui/footer";
import { useEffect, useState, useRef } from "react"; // 添加useRef导入
import "./index.css";
import { useRouter } from "next/navigation";
import Pagination from "@/components/pagination";
import request, { getImgUrl } from "@/utils/request";
import Modal from "@/components/modal";
import Header from "@/components/ui/header";


const noticeTypeMap = {
  LATEST: '最新',
  NEWS:'新闻',
  NOTICE:'公告',
  GUIDE:'攻略'
}
export default function NewsPage() {
  const [list, setList] = useState<any[]>([]);
  const [current, setCurrent] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const router = useRouter();
  const [homeDetails, setHomeDetails] = useState<any>({});
  const [buttonImgs, setButtonImgs] = useState<any>({});
  const [activeNewsType, setActiveNewsType] = useState("LATEST");

  // 创建ref引用news-container元素
  const newsContainerRef = useRef<HTMLDivElement>(null);
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
        // 数据加载完成后滚动到news-container
        setTimeout(() => {
          if (newsContainerRef.current) {
            newsContainerRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      });
  };
  useEffect(() => {
    feachData(current);
  }, []);

  const scrollToPage = (index) => {
 window.open(`/?section=${index}`);
  }
  return (
    <div>
      <Header
        buttonImgs={buttonImgs}
        showLogo
        currentPage={1}
        scrollToPage={scrollToPage}
      />
      <div className="new-bg">
        <img
          className="new-bg-img"
          style={{ width: "100vw" }}
          src={getImgUrl((homeDetails.homeBackgroundUrls || []).at(-1))}
          alt=""
        />
      </div>
      {/* 添加ref到news-container-wrap元素 */}
      <div className="news-container-wrap" ref={newsContainerRef}>
        <div className="news-container">
          {/* <GameToolbar
            openTips={() => setTipsOpen(true)}
            openRegisterModal={() => setRegisterModalOpen(true)}
            buttonImgs={buttonImgs}
          /> */}

          {/*  */}
          <NewsBox
            header={<div className="news-header">
              {Object.keys(noticeTypeMap).map((type) => <div style={{color: activeNewsType === type ? 'red' : ''}} key={type} onClick={() => setActiveNewsType(type)}>{noticeTypeMap[type]}</div>)}
            </div>}
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
                        【 {noticeTypeMap[item.noticeType]} 】
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
      {/* <RegisterModal
        visible={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      /> */}
      {/* <Modal visible={tipsOpen} onClose={() => setTipsOpen(false)}> */}
        {/* <div
          style={{
            textAlign: "center",
            lineHeight: "32.2vw",
            fontWeight: 700,
            color: "#34110a",
            fontSize: "5vw",
          }}
        >
          敬请期待...
        </div> */}
        {/* <img src={mobile} alt="" srcset="" /> */}
      {/* </Modal> */}
    </div>
  );
}
