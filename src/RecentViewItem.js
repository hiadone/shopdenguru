import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSnackbar } from "notistack";
import NumberFormat from "react-number-format";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Header from "./Header";
import Footer from "./Footer";
import { useCookies } from "react-cookie";

function RecentViewItem(props) {
  let [recentViewItem, recentViewItemFunc] = useState(false);
  let latestItem = JSON.parse(localStorage.getItem("latestItem"));
  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [cookie] = useCookies();

  useEffect(() => {
    if (latestItem) {
      axios({
        method: "get",
        url: "https://api.denguru.kr/cmall/itemlists/",
        headers: {
          Authorization: cookie.accessToken ? cookie.accessToken : ""
        },
        params: {
          chk_item_id: latestItem,
          listnum: 1000
        }
      })
        .then(res => {
          recentViewItemFunc(res.data);
        })
        .catch(error => {
          if (error.response) {
            recentViewItemFunc(error.response.status);
            // pickDataFunc(error.response.data.msg);
          }
        });
    }
  }, []);

  return (
    <>
      {recentViewItem === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : (
        <>
          <header className="header03 header03_white">
            <h1 className="h_title">최근 본 상품</h1>
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
            <div className="pick_items_wrap">
              <div style={{ paddingTop: "24px" }}></div>
              <h2 className="title07">
                최근 본 상품{" "}
                <span className="emph_color_main">
                  {recentViewItem.data.total_rows}
                </span>
              </h2>
              <div className="items_wrap">
                <ul className="item_list03">
                  {recentViewItem.data.list.map((val, idx) => {
                    return (
                      <li className="item_box">
                        <a href={val.cit_outlink_url} target="_blank">
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
                                value={val.cit_price_sale}
                                displayType={"text"}
                                thousandSeparator={true}
                              />
                              <span className="rate_discount">
                                &nbsp;&nbsp;
                                {val.cit_price_sale_percent}%
                              </span>
                            </div>
                            <div className="item_price_before">
                              <NumberFormat
                                value={val.cit_price}
                                displayType={"text"}
                                thousandSeparator={true}
                              />
                            </div>
                          </div>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div
              className="pd_gnb_bottom"
              style={{ height: "28px", backgroundColor: "#fff" }}
            ></div>
          </div>
        </>
      )}
    </>
  );
}

export default RecentViewItem;
