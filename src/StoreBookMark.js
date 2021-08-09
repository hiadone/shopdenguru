import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSnackbar } from "notistack";
import NumberFormat from "react-number-format";
import Header from "./Header";
import Footer from "./Footer";
import { useCookies } from "react-cookie";

function StoreBookMark(props) {
  let [storeBookMarkData, storeBookMarkDataFunc] = useState(false);
  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [cookie] = useCookies();

  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.denguru.kr/cmall/storewishlist",
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        storeBookMarkDataFunc(res.data);
      })
      .catch(error => {
        if (error.response) {
          storeBookMarkDataFunc(error.response.status);
        }
      });
  }, []);

  return (
    <>
      {storeBookMarkData === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : (
        <>
          <Header
            match={props.match}
            notificationNum={
              storeBookMarkData !== 403 &&
              storeBookMarkData.layout.notification_num
                ? storeBookMarkData.layout.notification_num
                : 0
            }
          ></Header>
          <Footer match={props.match}></Footer>
          {storeBookMarkData === 403 && (
            <>
              <div className="main">
                <div className="pd_header06"></div>
                <div className="tab_nav store_tab_nav">
                  <h2 className="blind">스토어 서브메뉴</h2>
                  <Link to={"/storerank"} className="tab_nav_link ">
                    댕구루 랭킹
                  </Link>
                  <Link to={"/storebookmark"} className="tab_nav_link active">
                    즐겨찾기
                  </Link>
                </div>
                <section className="store_list_favorite">
                  <div className="favorite_nodata">
                    <div className="favorite_nodata_img_box">
                      <img
                        src="/assets/images/nodata-bookmark.png"
                        alt=""
                        className="favorite_nodata_img"
                      />
                    </div>
                    <div className="favorite_nodata_login_box txt_center">
                      <div className="favorite_nodata_login_txt">
                        로그인 후 이용할 수 있는 서비스입니다
                      </div>
                      <Link
                        to={"/login"}
                        className="btn btn_accent btn_big_round btn_half favorite_btn_login"
                      >
                        로그인
                      </Link>
                    </div>
                  </div>
                </section>

                <div
                  className="pd_gnb_bottom"
                  style={{ height: "32px", backgroundColor: "#fff" }}
                ></div>
              </div>
              <div className="popup_wrap">
                <div className="popup_container popup_center" id="popupWarn">
                  <div className="popup_img_warn">
                    <img
                      src="/assets/images/icon-warn.svg"
                      alt="!"
                      className="img"
                    />
                  </div>
                  <div className="popup_txt_box">
                    <div className="popup_txt_main txt_center">
                      휴면 쇼핑몰이에요
                    </div>
                    <div className="popup_txt_sub txt_center">
                      쇼핑몰 명은
                      <br />
                      응대가 원활 하지 않을 수 있습니다.
                    </div>
                  </div>
                  <div className="popup_btn_box02">
                    <button
                      className="btn btn_half_popup btn_main_line"
                      onclick="location.href='store_detail.html'"
                    >
                      연결
                    </button>
                    <button
                      className="btn btn_half_popup btn_main btn_right"
                      onclick="closePopup('popupWarn')"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
          {storeBookMarkData !== 403 && storeBookMarkData.data.total_rows < 1 && (
            <>
              <div className="main">
                <div className="pd_header06"></div>
                <div className="tab_nav store_tab_nav">
                  <h2 className="blind">스토어 서브메뉴</h2>
                  <Link to={"/storerank"} className="tab_nav_link ">
                    댕구루 랭킹
                  </Link>
                  <Link to={"/storebookmark"} className="tab_nav_link active">
                    즐겨찾기
                  </Link>
                </div>
                <section className="store_list_favorite">
                  <div className="favorite_nodata">
                    <div className="favorite_nodata_img_box">
                      <img
                        src="/assets/images/nodata-bookmark.png"
                        alt=""
                        className="favorite_nodata_img"
                      />
                    </div>
                  </div>
                </section>
                <div
                  className="pd_gnb_bottom"
                  style={{ height: "32px", backgroundColor: "#fff" }}
                ></div>
              </div>
              <div className="popup_wrap">
                <div className="popup_container popup_center" id="popupWarn">
                  <div className="popup_img_warn">
                    <img
                      src="/assets/images/icon-warn.svg"
                      alt="!"
                      className="img"
                    />
                  </div>
                  <div className="popup_txt_box">
                    <div className="popup_txt_main txt_center">
                      휴면 쇼핑몰이에요
                    </div>
                    <div className="popup_txt_sub txt_center">
                      쇼핑몰 명은
                      <br />
                      응대가 원활 하지 않을 수 있습니다.
                    </div>
                  </div>
                  <div className="popup_btn_box02">
                    <button
                      className="btn btn_half_popup btn_main_line"
                      onclick="location.href='store_detail.html'"
                    >
                      연결
                    </button>
                    <button
                      className="btn btn_half_popup btn_main btn_right"
                      onclick="closePopup('popupWarn')"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
          {storeBookMarkData !== 403 && storeBookMarkData.data.total_rows > 0 && (
            <>
              <div className="main">
                <div className="pd_header06"></div>
                <div className="tab_nav store_tab_nav">
                  <h2 className="blind">스토어 서브메뉴</h2>
                  <Link to={"/storerank"} className="tab_nav_link ">
                    댕구루 랭킹
                  </Link>
                  <Link to={"/storebookmark"} className="tab_nav_link active">
                    즐겨찾기
                  </Link>
                </div>
                <section className="store_list_favorite">
                  <h2 className="title_favorite">
                    즐겨찾기{" "}
                    <span className="emph">
                      {storeBookMarkData.data.total_rows}
                    </span>
                  </h2>
                  <ul className="store_list">
                    {storeBookMarkData.data.list.map((val, idx) => {
                      return (
                        <li className="store_box">
                          <Link
                            to={"/storedetail/" + val.brd_id}
                            className="store_link"
                          >
                            <span className="store_rank">{idx + 1}</span>
                            <div className="thumb_box">
                              <img
                                src={val.brd_image}
                                alt="쇼핑몰로고"
                                className="img"
                              />
                            </div>
                            <div className="txt_box">
                              <div className="store_name">{val.brd_name}</div>
                              <div className="store_list_tag_box store_list_tag_box01">
                                {val.brd_attr.length > 0 &&
                                  val.brd_attr.map((val2, idx2) => {
                                    if (val2.cat_id)
                                      return (
                                        <span className="store_list_tag store_list_tag_size">
                                          {val2.cat_value},{" "}
                                        </span>
                                      );
                                    else if (val2.cca_id)
                                      return (
                                        <span className="store_list_tag store_list_tag_category">
                                          {val2.cat_value},{" "}
                                        </span>
                                      );
                                  })}
                              </div>
                              <div className="store_list_tag_box store_list_tag_box02">
                                <span className="store_list_tag store_list_tag_breed">
                                  {val.brd_attr.length > 0 &&
                                    val.brd_attr.map((val2, idx2) => {
                                      if (val2.ckd_id) {
                                        if (idx2 + 1 === val.brd_attr.length)
                                          return val2.cat_value;
                                        else return val2.cat_value + ", ";
                                      }
                                    })}
                                </span>
                                들이 좋아해요
                              </div>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
                <div
                  className="pd_gnb_bottom"
                  style={{ height: "32px", backgroundColor: "#fff" }}
                ></div>
              </div>
              <div className="popup_wrap">
                <div className="popup_container popup_center" id="popupWarn">
                  <div className="popup_img_warn">
                    <img
                      src="/assets/images/icon-warn.svg"
                      alt="!"
                      className="img"
                    />
                  </div>
                  <div className="popup_txt_box">
                    <div className="popup_txt_main txt_center">
                      휴면 쇼핑몰이에요
                    </div>
                    <div className="popup_txt_sub txt_center">
                      쇼핑몰 명은
                      <br />
                      응대가 원활 하지 않을 수 있습니다.
                    </div>
                  </div>
                  <div className="popup_btn_box02">
                    <button
                      className="btn btn_half_popup btn_main_line"
                      onclick="location.href='store_detail.html'"
                    >
                      연결
                    </button>
                    <button
                      className="btn btn_half_popup btn_main btn_right"
                      onclick="closePopup('popupWarn')"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

export default StoreBookMark;
