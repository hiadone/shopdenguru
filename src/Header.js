import React from "react";
import { Link } from "react-router-dom";

function Header(props) {
  return (
    <>
      {props.match && props.match.path === "/" ? (
        <header className="header01">
          <h1 className="h_logo_box">
            <Link to={"/"} className="h_link">
              <img
                src="/assets/images/logo-horizontal.svg"
                alt="DENGURU 로고"
                className="h_logo"
              />
            </Link>
          </h1>
          <div className="h_search_box">
            <Link to={"keywordrank"}>
              <div className="icon_box">
                <img
                  src="/assets/images/icon-search.svg"
                  alt="검색"
                  className="icon"
                />
              </div>
              <div className="search_txt">추천검색어</div>
            </Link>
          </div>
          <div className="h_btn">
            <Link to={"notification"}>
              <span className="badge">{props.notificationNum}</span>
              <img
                src="/assets/images/icon-bell-with-dot.svg"
                alt="알림"
                className="icon"
              />
            </Link>
          </div>
        </header>
      ) : props.match && props.match.path === "/mypage" ? (
        <header className="header06">
          <h1 className="h_logo_box">
            <Link to={"/"} className="h_link">
              <img
                src="/assets/images/logo-horizontal.svg"
                alt="DENGURU 로고"
                className="h_logo"
              />
            </Link>
          </h1>
          <div className="h_btn h_btn_mlauto">
            <Link to={"keywordrank"}>
              <img
                src="/assets/images/icon-search-gray.svg"
                alt="검색"
                className="icon"
              />
            </Link>
          </div>
          <div className="h_btn">
            <Link to="/setting">
              <img
                src="/assets/images/icon-setting.svg"
                alt="설정"
                className="icon"
              />
            </Link>
          </div>
          <div className="h_btn">
            <Link to={"notification"}>
              <span className="badge">{props.notificationNum}</span>
              <img
                src="/assets/images/icon-bell-with-dot.svg"
                alt="알림"
                className="icon"
              />
            </Link>
          </div>
        </header>
      ) : (
        <header className="header06">
          <h1 className="h_logo_box">
            <Link to={"/"} className="h_link">
              <img
                src="/assets/images/logo-horizontal.svg"
                alt="DENGURU 로고"
                className="h_logo"
              />
            </Link>
          </h1>
          <div className="h_btn h_btn_mlauto">
            <Link to={"keywordrank"}>
              <img src="/assets/images/icon-search-gray.svg" alt="검색" />
            </Link>
          </div>
          <div className="h_btn">
            <Link to={"notification"}>
              <span className="badge">{props.notificationNum}</span>
              <img
                src="/assets/images/icon-bell-with-dot.svg"
                alt="알림"
                className="icon"
              />
            </Link>
          </div>
        </header>
      )}
    </>
  );
}

export default Header;
