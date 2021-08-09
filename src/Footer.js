import React from "react";
import { Link } from "react-router-dom";

function Footer(props) {
  return (
    <>
      <nav className="gnb_bottom">
        <h2 className="blind">하단 네비게이션</h2>
        <ul className="gnb_list">
          <li
            className={
              props.match && props.match.path === "/storerank"
                ? "gnb_item active"
                : "gnb_item"
            }
          >
            <Link to={"/storerank"} className="gnb_link">
              <img
                src="/assets/images/gnb-store.svg"
                alt="store"
                className="gnb_icon"
              />
              <span className="gnb_txt blind">store</span>
            </Link>
          </li>
          <li
            className={
              props.match && props.match.path === "/category"
                ? "gnb_item active"
                : "gnb_item"
            }
          >
            <Link to={"/category"} className="gnb_link">
              <img
                src="/assets/images/gnb-category.svg"
                alt="category"
                className="gnb_icon"
              />
              <span className="gnb_txt blind">category</span>
            </Link>
          </li>
          <li
            className={
              props.match && props.match.path === "/"
                ? "gnb_item active"
                : "gnb_item"
            }
          >
            <Link to={"/"} className="gnb_link">
              <img
                src="/assets/images/gnb-home-active.svg"
                alt="home"
                className="gnb_icon"
              />
              <span className="gnb_txt blind">home</span>
            </Link>
          </li>
          <li
            className={
              props.match && props.match.path === "/pick"
                ? "gnb_item active"
                : "gnb_item"
            }
          >
            <Link to={"/pick"} className="gnb_link">
              <img
                src="/assets/images/gnb-pick.svg"
                alt="pick"
                className="gnb_icon"
              />
              <span className="gnb_txt blind">pick</span>
            </Link>
          </li>

          <li
            className={
              props.match && props.match.path === "/mypage"
                ? "gnb_item active"
                : "gnb_item"
            }
          >
            <Link to={"/mypage"} className="gnb_link">
              <img
                src="/assets/images/gnb-my.svg"
                alt="my"
                className="gnb_icon"
              />
              <span className="gnb_txt blind">my</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Footer;
