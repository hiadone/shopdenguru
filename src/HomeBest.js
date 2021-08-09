import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import NumberFormat from "react-number-format";

function HomeBest(props) {
  let [homeBestData, homeBestDataFunc] = useState(false);
  let history = useHistory();

  useEffect(() => {
    axios
      .get("https://api.denguru.kr/cmall/cit_type1_lists")
      .then(res => {
        homeBestDataFunc(res.data);
      })
      .catch(() => {
        console.log("실패햇어요");
      });
  }, []);

  return (
    <>
      {homeBestData === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : (
        <>
          <header className="header03 header03_white">
            <h1 className="h_title">댕구루 BEST</h1>
            <div className="btn_box">
              <Link
                onClick={() => {
                  history.goBack();
                }}
                className="btn_goback btn_left"
              >
                <img
                  src="/assets/images/icon-goback.svg"
                  alt="이전페이지"
                  className="icon"
                />
              </Link>
            </div>
          </header>
          <div className="main">
            <div className="pd_header03"></div>
            {/* 오늘의 BEST ITEMS */}
            <section className="sect05">
              <h2 className="title03">오늘의 BEST ITEMS</h2>
              <div className="items_wrap">
                <ul className="item_list02">
                  {homeBestData.data.list.map((val, idx) => {
                    return (
                      <li className="item_box" key={idx}>
                        <Link to={"/homeiteminfo/" + val.cit_id}>
                          <span className="best_num">{idx + 1}</span>
                          <div className="item_thum">
                            <img
                              src={val.cit_image}
                              alt="상품이미지"
                              className="img"
                            />
                          </div>
                          <div className="item_txt_box">
                            <div className="item_shop">{val.brd_name}</div>
                            <div className="item_name">{val.cit_name}</div>
                            <div className="item_price">
                              <NumberFormat
                                value={val.cit_price}
                                displayType={"text"}
                                thousandSeparator={true}
                              />
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div style={{ height: "24px" }}></div>
            </section>
          </div>
        </>
      )}
    </>
  );
}

export default HomeBest;
