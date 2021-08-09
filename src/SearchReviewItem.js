import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link, Redirect } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSnackbar } from "notistack";
import { Swiper, SwiperSlide } from "swiper/react";
import NumberFormat from "react-number-format";
import Header from "./Header";
import Footer from "./Footer";
import { useCookies } from "react-cookie";

function SearchReviewItem(props) {
  let [pickData, pickDataFunc] = useState(false);
  let [latestItemData, latestItemDataFunc] = useState(false);
  let history = useHistory();
  let latestItem = JSON.parse(localStorage.getItem("latestItem"));

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

  useEffect(() => {
    if (latestItem) {
      axios({
        method: "get",
        url: "https://api.denguru.kr/cmall/itemlists/",
        headers: {
          Authorization: cookie.accessToken ? cookie.accessToken : ""
        },
        params: {
          chk_item_id: latestItem
        }
      })
        .then(res => {
          latestItemDataFunc(res.data);
        })
        .catch(error => {
          if (error.response) {
            latestItemDataFunc(error.response.status);
            // pickDataFunc(error.response.data.msg);
          }
        });
    }
  }, []);

  return (
    <>
      {pickData === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : (
        <>
          {pickData !== 403 ? (
            <>
              <header className="header02">
                <h1 className="blind">리뷰제품 선택</h1>
                <Link
                  onClick={() => {
                    history.goBack();
                  }}
                  className="btn_goback"
                >
                  <img
                    src="/assets/images/icon-goback.svg"
                    alt="뒤로가기"
                    className="icon"
                  />
                </Link>
                <div className="h_search_box">
                  <div className="form_box">
                    <label for="inpSearch" className="lab_search">
                      <img
                        src="/assets/images/icon-search.svg"
                        alt="검색"
                        className="icon_search"
                      />
                    </label>
                    <input
                      type="search"
                      name="inpSearch"
                      className="inp_search"
                      id="inpSearch"
                    />
                    <button
                      type="button"
                      className="btn_del btn_linkstyle blind"
                      id="btnDel"
                    >
                      <img
                        src="/assets/images/icon-del.svg"
                        alt="취소"
                        className="icon"
                      />
                    </button>
                  </div>
                </div>
              </header>
              <div className="main">
                <div className="pd_header02"></div>

                <div className="search_review_item_container">
                  <div className="title04">
                    <h2 className="tit">찜한 아이템에서 선택</h2>
                  </div>
                  <div className="hash_list_container">
                    <Swiper
                      className="item_list04"
                      spaceBetween={5}
                      slidesPerView={3.3}
                      onSlideChange={() => console.log("slide change")}
                    >
                      {pickData.data.list.map(val => {
                        return (
                          <SwiperSlide className="item_box ">
                            <Link to={"/reviewwrite/" + val.cit_id}>
                              <div className="item_thum">
                                <img
                                  src={val.cit_image}
                                  alt="상품이미지"
                                  className="img"
                                />
                              </div>
                              <div className="item_shop">{val.brd_name}</div>
                              <div className="item_name">{val.cit_name}</div>
                            </Link>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                </div>
                <div className="search_review_item_container">
                  <div className="title04">
                    <h2 className="tit">최근 본 아이템에서 선택</h2>
                  </div>
                  <div className="hash_list_container">
                    <Swiper
                      className="item_list04"
                      spaceBetween={5}
                      slidesPerView={3.3}
                      onSlideChange={() => console.log("slide change")}
                    >
                      {latestItemData &&
                        latestItemData.data.list.map(val => {
                          return (
                            <SwiperSlide className="item_box ">
                              <Link to={"/reviewwrite/" + val.cit_id}>
                                <div className="item_thum">
                                  <img
                                    src={val.cit_image}
                                    alt="상품이미지"
                                    className="img"
                                  />
                                </div>
                                <div className="item_shop">{val.brd_name}</div>
                                <div className="item_name">{val.cit_name}</div>
                              </Link>
                            </SwiperSlide>
                          );
                        })}
                    </Swiper>
                  </div>
                </div>
              </div>
            </>
          ) : (
            pickData === 403 && <Redirect to={{ pathname: "/login" }} />
          )}
        </>
      )}
    </>
  );
}

export default SearchReviewItem;
