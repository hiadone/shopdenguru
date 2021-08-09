import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSnackbar } from "notistack";
import NumberFormat from "react-number-format";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCookies } from "react-cookie";

function HomeItemInfo(props) {
  let { citId } = useParams();
  let [homeItemInfoData, homeItemInfoDataFunc] = useState(false);
  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [cookie] = useCookies();
  let latestItem_ = Array();
  let latestItem = JSON.parse(localStorage.getItem("latestItem"));

  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.denguru.kr/cmall/item/" + citId,
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        homeItemInfoDataFunc(res.data);
        const script = document.createElement("script");

        script.src = "/assets/js/item_info_container.js";
        script.async = true;

        document.body.appendChild(script);
      })
      .catch(() => {
        console.log("실패햇어요");
      });
  }, []);

  useEffect(() => {
    if (citId) {
      if (latestItem) {
        latestItem_ = [...new Set([citId, ...latestItem])];
      } else {
        latestItem_.push(citId);
      }

      localStorage.setItem("latestItem", JSON.stringify(latestItem_));
    }
  }, []);

  function _makeStars(score) {
    let stars = [];
    for (let i = 0; i < 10; i += 2) {
      let starClass = "star__rate";

      if (score !== 0) {
        if (i < parseInt(score)) {
          if (parseInt(score) === i && score % 2 !== 0) {
            starClass += " is-half-selected";
          } else {
            starClass += " is-selected";
          }
        }
      }

      stars.push(<label key={i} className={starClass}></label>);
    }
    return stars;
  }

  return (
    <>
      {homeItemInfoData === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : (
        <>
          <header className="header04">
            <h1 className="h_title">
              <Link to={"/storedetail/" + homeItemInfoData.data.brd_id}>
                <span className="img_box img_shop_box">
                  <img
                    src={homeItemInfoData.data.brd_image}
                    alt="썸네일"
                    className="img"
                  />
                </span>
                <span className="shop_name">
                  {homeItemInfoData.data.brd_name}
                </span>
                <img
                  src="/assets/images/icon-shop.svg"
                  alt="샵 아이콘"
                  className="icon icon_shop"
                />
              </Link>
            </h1>
            <Link
              onClick={() => {
                history.goBack();
              }}
              className="btn_goback btn_left"
            >
              <img
                src="/assets/images/icon-goback.svg"
                alt="뒤로가기"
                className="icon"
              />
            </Link>
            <button
              className="btn_linkstyle h_btn_icon btn_right btn_bookmark"
              id="btnBookmark"
              onClick={() => {
                let method = null;
                if (homeItemInfoData.data.storewishstatus) method = "delete";
                else method = "post";

                axios({
                  method: method,
                  url: homeItemInfoData.data.addstorewish_url,
                  headers: {
                    Authorization: cookie.accessToken ? cookie.accessToken : ""
                  }
                })
                  .then(res => {
                    enqueueSnackbar(res.data.msg, {
                      variant: "notice"
                    });
                    let _homeItemInfoData = { ...homeItemInfoData };
                    _homeItemInfoData.data.storewishstatus = !homeItemInfoData
                      .data.storewishstatus;
                    homeItemInfoDataFunc(_homeItemInfoData);
                  })
                  .catch(error => {
                    if (error.response) {
                      enqueueSnackbar(error.response.data.msg, {
                        variant: "notice"
                      });
                      console.log(error.response.status);
                    }
                  });
              }}
            >
              <img
                src={
                  homeItemInfoData.data.storewishstatus
                    ? "/assets/images/icon-bookmark.svg"
                    : "/assets/images/icon-bookmark-o.svg"
                }
                alt="즐겨찾기 등록"
                className="icon"
              />
            </button>
          </header>
          <div className="shop_shortcut_box">
            <a
              href={homeItemInfoData.data.cit_outlink_url}
              target="_blank"
              className="btn btn_main btn_big btn_big_round"
            >
              쇼핑몰 바로가기
            </a>
          </div>
          <div className="main">
            <section className="shop_item_info_container">
              <h2 className="blind">상품정보</h2>
              <div className="shop_item_info_box">
                <a
                  href={homeItemInfoData.data.cit_outlink_url}
                  target="_blank"
                  className="shop_item_thum img_box"
                >
                  <img
                    src={homeItemInfoData.data.cit_image}
                    alt=""
                    className="img"
                  />
                </a>
                <div className="shop_item_info_txt_box">
                  <a
                    href={homeItemInfoData.data.cit_outlink_url}
                    target="_blank"
                    className="item_name"
                  >
                    {homeItemInfoData.data.cit_name}
                  </a>
                  <a
                    href={homeItemInfoData.data.cit_outlink_url}
                    target="_blank"
                    className="item_discount"
                  >
                    {homeItemInfoData.data.cit_price_sale_percent}%
                  </a>
                  <a
                    href={homeItemInfoData.data.cit_outlink_url}
                    target="_blank"
                    className="item_price"
                  >
                    <NumberFormat
                      value={homeItemInfoData.data.cit_price_sale}
                      displayType={"text"}
                      thousandSeparator={true}
                    />
                    <span
                      className="item_before_origin_price"
                      style={{ paddingLeft: "1%" }}
                    >
                      <NumberFormat
                        value={homeItemInfoData.data.cit_price}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </span>
                  </a>

                  <div className="item_bookmark_box">
                    <button
                      type="button"
                      className="btn btn_user_heart btn_main_line btn_mid btn_mid_round"
                      id="btnItemHeart"
                      onClick={() => {
                        let method = null;
                        if (homeItemInfoData.data.itemwishstatus)
                          method = "delete";
                        else method = "post";

                        axios({
                          method: method,
                          url: homeItemInfoData.data.additemwish_url,
                          headers: {
                            Authorization: cookie.accessToken
                              ? cookie.accessToken
                              : ""
                          }
                        })
                          .then(res => {
                            enqueueSnackbar(res.data.msg, {
                              variant: "notice"
                            });
                            let _homeItemInfoData = {
                              ...homeItemInfoData
                            };
                            _homeItemInfoData.data.itemwishstatus = !homeItemInfoData
                              .data.itemwishstatus;
                            homeItemInfoDataFunc(_homeItemInfoData);
                          })
                          .catch(error => {
                            if (error.response) {
                              enqueueSnackbar(error.response.data.msg, {
                                variant: "notice"
                              });
                              console.log(error.response.status);
                            }
                          });
                      }}
                    >
                      <img
                        src={
                          homeItemInfoData.data.itemwishstatus
                            ? "/assets/images/icon-heart.svg"
                            : "/assets/images/icon-heart-o.svg"
                        }
                        alt="좋아요버튼"
                        className="icon"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </section>
            <section className="review_item_stars_contianer">
              <div className="title04">
                <h2 className="tit">
                  리뷰
                  <span className="tit_sub01">
                    {homeItemInfoData.data.cit_review_count}
                  </span>
                </h2>
                <Link
                  to={"/itemreview/" + homeItemInfoData.data.cit_id}
                  className="btn btn_linkstyle"
                >
                  <img
                    src="/assets/images/icon-angle-right-gray.svg"
                    alt="리뷰더보기"
                    className="icon"
                  />
                </Link>
              </div>
              <div className="review_item_stars_title">
                <span className="blind">제품리뷰 별점</span>
                <span className="score">
                  {homeItemInfoData.data.cit_review_average}
                </span>
                <span className="stars">
                  {_makeStars(homeItemInfoData.data.cit_review_average * 2)}
                </span>
              </div>
              {homeItemInfoData.data.popularreview &&
              (homeItemInfoData.data.popularreview.list.review_image.length >
                0 ||
                homeItemInfoData.data.popularreview.list.review_file.length >
                  0) ? (
                <div className="review_list02">
                  <div className="review_img_container">
                    <Swiper
                      className="review_img_list"
                      spaceBetween={5}
                      slidesPerView={3.3}
                      onSlideChange={() => console.log("slide change")}
                    >
                      {homeItemInfoData.data.popularreview.list.review_image &&
                        homeItemInfoData.data.popularreview.list.review_image.map(
                          val => {
                            return (
                              <SwiperSlide className="review_img_box ">
                                <Link
                                  to={
                                    "/itemreview/" +
                                    homeItemInfoData.data.cit_id +
                                    "/" +
                                    val.rfi_id
                                  }
                                  className="btn btn_linkstyle"
                                >
                                  <div className="img_box">
                                    <img
                                      src={val.uri}
                                      alt={val.rfi_id}
                                      className="img"
                                    />
                                  </div>
                                </Link>
                              </SwiperSlide>
                            );
                          }
                        )}
                      {homeItemInfoData.data.popularreview.list.review_file &&
                        homeItemInfoData.data.popularreview.list.review_file.map(
                          val => {
                            return (
                              <SwiperSlide className="review_img_box ">
                                <div className="img_box">
                                  <img
                                    src={val.thumb_image_uri}
                                    alt={val.rfi_id}
                                    className="img"
                                  />
                                </div>
                              </SwiperSlide>
                            );
                          }
                        )}
                    </Swiper>
                  </div>
                </div>
              ) : (
                <div className="noreview_message_container">
                  <div>
                    <div className="img_box img_noreview">
                      <img
                        src="/assets/images/profile-noimg.png"
                        alt=""
                        className="img"
                      />
                    </div>
                    <div className="txt01 txt_center">
                      아직 작성된 리뷰가 없습니다.
                    </div>
                    <div className="txt02 txt_center">
                      이 제품을 사용해 보셨다면 영광의 첫 리뷰를 남겨보세요.
                      <br />
                      솔직하고 건강한 리뷰가 우리 모두에게 큰 도움이 됩니다
                      <br />
                      매월 베스트 리뷰어에게 푸짐한 상품도 드려요
                    </div>
                    <div className="btn_box">
                      <Link
                        to={"/reviewwrite/" + homeItemInfoData.data.cit_id}
                        className="btn btn_center btn_big btn_main btn_noreiew_write"
                      >
                        <img
                          src="/assets/images/icon-write.svg"
                          alt=""
                          className="icon"
                        />{" "}
                        첫 리뷰 작성하기
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {homeItemInfoData.data.ai_keyword.length > 0 && (
              <section className="ai_keyword_container">
                <div className="title04">
                  <h2 className="tit">DENGURU AI 키워드 추천</h2>
                </div>
                <div className="ai_keyword_box">
                  <div className="ai_keyword_txt_box">
                    이 상품은{" "}
                    <em className="keyword">
                      {homeItemInfoData.data.ai_keyword
                        .slice(0, 3)
                        .map((val, idx) => {
                          if (idx === 2) return val[0];
                          else return val[0] + ", ";
                        })}
                    </em>
                    들이 즐겨찾아요!
                  </div>
                  <div className="ai_keyword_best_tag_box">
                    {homeItemInfoData.data.ai_keyword
                      .slice(0, 3)
                      .map((val, idx) => {
                        if (idx === 0)
                          return (
                            <>
                              <a
                                href="search_result.html"
                                className="ai_keyword_best ai_keyword_best01"
                              >
                                <img
                                  src={
                                    "/assets/images/ai-keyword0" +
                                    (idx + 1) +
                                    ".png"
                                  }
                                  alt={idx + 1 + "위"}
                                  className="icon"
                                />
                                <span className="keyword">{val[0]}</span>
                              </a>
                              <br />
                            </>
                          );
                        else
                          return (
                            <a
                              href="search_result.html"
                              className="ai_keyword_best ai_keyword_best01"
                              style={{ marginRight: "10px" }}
                            >
                              <img
                                src={
                                  "/assets/images/ai-keyword0" +
                                  (idx + 1) +
                                  ".png"
                                }
                                alt={idx + 1 + "위"}
                                className="icon"
                              />
                              <span className="keyword">{val[0]}</span>
                            </a>
                          );
                      })}
                  </div>
                  <div className="ai_keyword_normal_tag_box">
                    {console.log(homeItemInfoData.data.ai_keyword)}
                    {homeItemInfoData.data.ai_keyword
                      .slice(3)
                      .map((val, idx) => {
                        return (
                          <a href="search_result.html" className="keyword">
                            {val[0]}
                          </a>
                        );
                      })}
                  </div>
                </div>
              </section>
            )}

            <div className="shop_items_wrap">
              {homeItemInfoData.data.similaritemlist_similar.list.length >
                0 && (
                <section className="shop_items_container">
                  <h2 className="title05">
                    {homeItemInfoData.data.brd_name}{" "}
                    <span className="tit_sub">#비슷한 아이템</span>
                  </h2>
                  <div className="items_wrap">
                    <ul className="item_list03">
                      {homeItemInfoData.data.similaritemlist_similar.list.map(
                        val => {
                          return (
                            <li className="item_box">
                              <a href={val.cit_outlink_url}>
                                <div className="item_thum">
                                  <img
                                    src={val.cit_image}
                                    alt="상품이미지"
                                    className="img"
                                  />
                                </div>
                                <div className="item_txt_box">
                                  <div className="item_shop">
                                    {val.brd_name}
                                  </div>
                                  <div className="item_name">
                                    {val.cit_name}
                                  </div>
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
                        }
                      )}
                    </ul>
                  </div>
                </section>
              )}
              {homeItemInfoData.data.similaritemlist_type1.list.length > 0 && (
                <section className="shop_items_container">
                  <h2 className="title05">
                    {homeItemInfoData.data.brd_name}{" "}
                    <span className="tit_sub">#BEST 아이템</span>
                  </h2>
                  <div className="items_wrap">
                    <ul className="item_list03">
                      {homeItemInfoData.data.similaritemlist_type1.list.map(
                        val => {
                          return (
                            <li className="item_box">
                              <a href={val.cit_outlink_url}>
                                <div className="item_thum">
                                  <img
                                    src={val.cit_image}
                                    alt="상품이미지"
                                    className="img"
                                  />
                                </div>
                                <div className="item_txt_box">
                                  <div className="item_shop">
                                    {val.brd_name}
                                  </div>
                                  <div className="item_name">
                                    {val.cit_name}
                                  </div>
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
                        }
                      )}
                    </ul>
                  </div>
                </section>
              )}
              {homeItemInfoData.data.similaritemlist_type3.list.length > 0 && (
                <section className="shop_items_container">
                  <h2 className="title05">
                    {homeItemInfoData.data.brd_name}{" "}
                    <span className="tit_sub">#BEST 아이템</span>
                  </h2>
                  <div className="items_wrap">
                    <ul className="item_list03">
                      {homeItemInfoData.data.similaritemlist_type3.list.map(
                        val => {
                          return (
                            <li className="item_box">
                              <a href={val.cit_outlink_url}>
                                <div className="item_thum">
                                  <img
                                    src={val.cit_image}
                                    alt="상품이미지"
                                    className="img"
                                  />
                                </div>
                                <div className="item_txt_box">
                                  <div className="item_shop">
                                    {val.brd_name}
                                  </div>
                                  <div className="item_name">
                                    {val.cit_name}
                                  </div>
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
                        }
                      )}
                    </ul>
                  </div>
                </section>
              )}

              <div className="pd_gnb_bottom"></div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default HomeItemInfo;
