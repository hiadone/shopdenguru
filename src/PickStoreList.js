import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSnackbar } from "notistack";
import NumberFormat from "react-number-format";
import Header from "./Header";
import Footer from "./Footer";
import { useCookies } from "react-cookie";

function PickStoreList(props) {
  let { brdId } = useParams();
  let [pickStoreData, pickStoreDataFunc] = useState(false);
  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [cookie] = useCookies();

  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.denguru.kr/cmall/wishlist/" + brdId + "/store",
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        pickStoreDataFunc(res.data);
      })
      .catch(error => {
        if (error.response) {
          pickStoreDataFunc(error.response.status);
          // pickDataFunc(error.response.data.msg);
        }
      });
  }, []);

  return (
    <>
      {pickStoreData === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : (
        <>
          <Header
            notificationNum={
              pickStoreData !== 403 && pickStoreData.layout.notification_num
                ? pickStoreData.layout.notification_num
                : 0
            }
          ></Header>
          <Footer match={props.match}></Footer>
          {pickStoreData === 403 && (
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
          {pickStoreData !== 403 && pickStoreData.data.total_rows < 1 ? (
            <>
              <div className="pd_header06"></div>
              <div className="pick_title_box">
                <h2 className="title08">PICK</h2>
                <div className="btn_right pick_title_btn_box">
                  <Link
                    to={"/pickstorelist"}
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
          ) : (
            <>
              <header className="header03 header03_white">
                <h1 className="h_title">스토어별 보기</h1>
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
                <div className="pick_title_box">
                  <h2 className="title08">PICK</h2>
                </div>
                <div className="pick_items_wrap pick_edit_items_wrap">
                  <h2 className="title07">
                    {pickStoreData.data.total_rows}개의 스토어
                  </h2>
                  <div className="store_list_rank">
                    <ul className="store_list">
                      {pickStoreData.data.list.map((val, idx) => {
                        return (
                          <li className="store_box">
                            <Link
                              to={"/pickstore/" + val.brd_id}
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
                              <div class="pick_num_item">
                                {val.cnt}
                                <img
                                  src="/assets/images/icon-angle-right-gray.svg"
                                  className="icon"
                                  alt=">"
                                />
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="pd_gnb_bottom"></div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

export default PickStoreList;
