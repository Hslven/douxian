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
import classNames from "classnames";

const noticeTypeMap = {
  LATEST: "最新",
  NEWS: "新闻",
  NOTICE: "公告",
  GUIDE: "攻略",
};
export default function NewsPage() {
  const [list, setList] = useState<any[]>([]);
  const [current, setCurrent] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const router = useRouter();
  const [homeDetails, setHomeDetails] = useState<any>({});
  const [buttonImgs, setButtonImgs] = useState<any>({});
  const [activeNewsType, setActiveNewsType] = useState("LATEST");
  const [buttonImgsTop, setButtonImgsTop] = useState<any>({});
  const [buttonImgsBottom, setButtonImgsBottom] = useState<any>({});
  // 创建ref引用news-container元素
  const newsContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // request.get("/douxian/web/home").then((res) => setHomeDetails(res));
    request.get("/douxian/web/button").then((res) => setButtonImgs(res));
    request.get("/douxian/web/notice/config")
      .then((res) => {
        console.log(res, 'res');
        // Assuming the response structure has these fields
        const { noticeContentTopUrl, noticeContentBottomUrl } = res; // Adjust depending on response structure

        // Setting the URLs in the states
        setButtonImgsTop(noticeContentTopUrl);
        setButtonImgsBottom(noticeContentBottomUrl);

        // Logging to verify the data
        console.log('Top Image URL:', noticeContentTopUrl);
        console.log('Bottom Image URL:', noticeContentBottomUrl);
      })
      .catch((error) => {
        console.error('Error fetching notice config:', error);
      });
  }, []);
  const feachData = (
    noticeType: string,
    pageNo: number,
    pageSize: number = 15
  ) => {
    request
      .get("/douxian/web/notice", {
        params: { pageNo, pageSize, noticeType },
      })
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
    feachData(activeNewsType, current);
  }, []);

  const scrollToPage = (index: number) => {
    window.open(`/?section=${index}`);
  };
  return (
    <div>
      <Header
        buttonImgs={buttonImgs}
        showLogo
        currentPage={-1}
        scrollToPage={scrollToPage}
      />
      <img className="new-bg" src={getImgUrl(buttonImgsTop)} />
      {/* 添加ref到news-container-wrap元素 */}
      <div className="news-container-wrap" ref={newsContainerRef}>
        <div className="news-container" style={{
          background: `url(${getImgUrl(buttonImgsBottom)}) center center no-repeat`, // Dynamically set the background
              backgroundSize:' 100%'
        }}>
          <NewsBox
            header={
              <div className="news-header">
                {Object.keys(noticeTypeMap).map((type) => (
                  <div
                    className={classNames("news-tab", {
                      "news-tab-active": activeNewsType === type,
                    })}
                    key={type}
                    onClick={() => {
                      setCurrent(1);
                      setActiveNewsType(type);
                      feachData(type, 1);
                    }}
                  >
                    {noticeTypeMap[type]}
                    <div className="news-tab-active-line"></div>
                  </div>
                ))}
              </div>
            }
            content={
              <div className="new-list">
                {list.map((item) => (
                  <div
                    key={item.noticeId}
                    className="new-item"
                    // style={{
                    //   backgroundColor: item.noticeBackgroundColor,
                    //   border: item.noticeBorderStyle,
                    // }}
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
                      // style={{ color: item.noticeTitleColor }}
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
                onPageChange={(current) => feachData(activeNewsType, current)}
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
