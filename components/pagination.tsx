
"use client"
import React from'react';
import './pagination.css';

const Pagination = ({ 
  currentPage = 1, 
  totalPages = 21, 
  onPageChange,
  pageRangeDisplayed = 11 // 显示的页码范围
}) => {
  // 处理页码变更
  const handlePageClick = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  // 生成页码按钮
  const renderPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(pageRangeDisplayed / 2));
    let endPage = startPage + pageRangeDisplayed - 1;

    // 调整结束页码，确保不超过总页数
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - pageRangeDisplayed + 1);
    }

    // 添加第一页按钮
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          className={`pagination-btn ${currentPage === 1? 'active' : ''}`}
          onClick={() => handlePageClick(1)}
        >
          1
        </button>
      );
      
      // 添加省略号
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
      }
    }

    // 添加中间页码
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${currentPage === i? 'active' : ''}`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </button>
      );
    }

    // 添加最后一页按钮
    if (endPage < totalPages) {
      // 添加省略号
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
      }
      
      pages.push(
        <button
          key={totalPages}
          className={`pagination-btn ${currentPage === totalPages? 'active' : ''}`}
          onClick={() => handlePageClick(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="pagination-container">
      {currentPage !== 1 && <button
        className="pagination-btn prev-next"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        上一页
      </button>}
      {renderPageNumbers()}
      {currentPage !== totalPages && <button
        className="pagination-btn prev-next"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        下一页
      </button>}
      {/* <span className="pagination-info">
        第 {currentPage} 页 / 共 {totalPages} 页
      </span> */}
    </div>
  );
};

export default Pagination;
