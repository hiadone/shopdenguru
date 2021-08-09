import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSnackbar } from "notistack";
import NumberFormat from "react-number-format";
import Header from "./Header";
import Footer from "./Footer";
import { useCookies } from "react-cookie";

function Pick(props) {
  let [pickData, pickDataFunc] = useState(false);
  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [cookie] = useCookies();

  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.denguru.kr/cmall/wishlist/",
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        pickDataFunc(res.data);
      })
      .catch(error => {
        if (error.response) {
          pickDataFunc(error.response.status);
          // pickDataFunc(error.response.data.msg);
        }
      });
  }, []);

  return (
    <>
      {pickData === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : (
        <>
          <Header
            notificationNum={
              pickData !== 403 && pickData.layout.notification_num
                ? pickData.layout.notification_num
                : 0
            }
          ></Header>
          <Footer match={props.match}></Footer>
          {pickData === 403 && (
            <>
              <div className="main">
                <div className="pd_header06"></div>
                <div className="pick_title_box">
                  <h2 className="title08">PICK</h2>
                  <div className="btn_right pick_title_btn_box">
                    <span className="btn_linkstyle btn_pick">
                      <img
                        src="/assets/images/icon-list-dot.svg"
                        alt="스토어별 보기"
                        className="icon"
                      />
                    </span>
                    <span className="btn_linkstyle btn_pick">
                      <img
                        src="/assets/images/icon-scissors.svg"
                        alt="찜한 상품 편집하기"
                        className="icon"
                      />
                    </span>
                  </div>
                </div>
                <div className="pick_items_wrap">
                  <div className="pick_nodata">
                    <div className="pick_nodata_img_box">
                      <img
                        src="/assets/images/nodata-pick.png"
                        alt=""
                        className="pick_nodata_img"
                      />
                    </div>
                    <div className="pick_nodata_login_box txt_center">
                      <div className="pick_nodata_login_txt">
                        로그인 후 이용할 수 있는 서비스입니다
                      </div>
                      <Link
                        to={"/login"}
                        className="btn btn_accent btn_big_round btn_half pick_btn_login"
                      >
                        로그인
                      </Link>
                    </div>
                  </div>
                </div>

                <div
                  className="pd_gnb_bottom"
                  style={{ height: "28px", backgroundColor: "#fff" }}
                ></div>
              </div>
            </>
          )}
          {pickData !== 403 && pickData.data.total_rows < 1 && (
            <>
              <div className="pd_header06"></div>
              <div className="pick_title_box">
                <h2 className="title08">PICK</h2>
                <div className="btn_right pick_title_btn_box">
                  <Link
                    to={"/pickstorelist/0"}
                    className="btn_linkstyle btn_pick"
                  >
                    <img
                      src="/assets/images/icon-list-dot.svg"
                      alt="스토어별 보기"
                      className="icon"
                    />
                  </Link>
                  <Link to={"/pickedit"} className="btn_linkstyle btn_pick">
                    <img
                      src="/assets/images/icon-scissors.svg"
                      alt="찜한 상품 편집하기"
                      className="icon"
                    />
                  </Link>
                </div>
              </div>
              <div className="pick_items_wrap">
                <div className="pick_nodata">
                  <div className="pick_nodata_img_box">
                    <img
                      src="/assets/images/nodata-pick.png"
                      alt=""
                      className="pick_nodata_img"
                    />
                  </div>
                </div>
              </div>

              <div
                className="pd_gnb_bottom"
                style={{ height: "28px", backgroundColor: "#fff" }}
              ></div>
            </>
          )}
          {pickData !== 403 && pickData.data.total_rows > 0 && (
            <>
              <div className="pd_header06"></div>
              <div className="pick_title_box">
                <h2 className="title08">PICK</h2>
                <div className="btn_right pick_title_btn_box">
                  <Link
                    to={"/pickstorelist/0"}
                    className="btn_linkstyle btn_pick"
                  >
                    <img
                      src="/assets/images/icon-list-dot.svg"
                      alt="스토어별 보기"
                      className="icon"
                    />
                  </Link>
                  <Link to={"/pickedit"} className="btn_linkstyle btn_pick">
                    <img
                      src="/assets/images/icon-scissors.svg"
                      alt="찜한 상품 편집하기"
                      className="icon"
                    />
                  </Link>
                </div>
              </div>
              <div className="pick_items_wrap">
                <h2 className="title07">
                  찜한 아이템{" "}
                  <span className="emph_color_main">
                    {pickData.data.total_rows}
                  </span>
                </h2>
                <div className="items_wrap">
                  <ul className="item_list03">
                    {pickData.data.list.map(val => {
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
                                  &nbsp;&nbsp;{val.cit_price_sale_percent}%
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
            </>
          )}
        </>
      )}
    </>
  );
}

export default Pick;
