import "./news-box.css";

export default function NewsBox({ style, header, content, footer }: any) {
  return (
    <div className="news-box-warp" style={style}>
      <div className="news-box">
        <div className="news-box-header">{header}</div>
        <div className="news-box-content">{content}</div>
        <div className="news-box-footer">{footer}</div>
      </div>
    </div>
  );
}
