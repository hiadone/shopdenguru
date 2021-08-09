import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ScrollArrow = () => {
  let [showScroll, setShowScroll] = useState(false);
  let location = useLocation();

  let checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 1000) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 1000) {
      setShowScroll(false);
    }
  };

  let _scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollTop);
    return () => {
      window.removeEventListener("scroll", checkScrollTop);
    };
  });

  return (
    !location.pathname.indexOf("resisterpetwrite") &&
    showScroll === true && (
      <div className="btn_fixed_box">
        <button
          type="button"
          className="btn btn_circle btn_main_line btn_write"
          id="btnTop"
          onClick={() => {
            _scrollTop();
          }}
        >
          <img
            src="/assets/images/icon-backtop.svg"
            alt="맨위로"
            className="icon icon_up"
          />
        </button>
      </div>
    )
  );
};

export default ScrollArrow;
