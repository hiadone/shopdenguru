import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import SwiperCore, { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCookies } from "react-cookie";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSnackbar } from "notistack";
import NumberFormat from "react-number-format";
import Header from "./Header";
import Footer from "./Footer";

import "swiper/components/pagination/pagination.scss";
import * as common from "./common.js";

function Home(props) {
  SwiperCore.use([Pagination]);
  let aiRecomRef = useRef();
  let citTypeRef = useRef();

  let [homeData, homeDataFunc] = useState(false);
  let [homeAIrecomData, homeAIrecomDataFunc] = useState(false);
  let [homeDengururecomData, homeDengururecomDataFunc] = useState(false);
  let [homeAIrecomsort, homeAIrecomsortFunc] = useState("cit_type3");
  let [reviewDataList, reviewDataListFunc] = useState(false);
  let [reviewNextList, reviewNextListFunc] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [cookie] = useCookies();

  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.denguru.kr/cmall/main",
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        homeAIrecomDataFunc(res.data.data.ai_recom);
        homeDengururecomDataFunc(res.data.data.denguru_recom);
        homeDataFunc(res.data);
        console.log(res.data);
      })
      .catch(() => {
        console.log("실패햇어요");
      });
  }, []);

  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.denguru.kr/cmall_review/reviewlist",
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        reviewDataListFunc(res.data.data.list);
        reviewNextListFunc(res.data.next_link);
      })
      .catch(() => {
        console.log("실패햇어요2");
      });
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

  function reviewMore(next_link) {
    if (next_link) {
      axios({
        method: "get",
        url: next_link,
        headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
      })
        .then(res => {
          if (res.data.data.list) {
            let reviewDataList_ = reviewDataList;
            reviewDataListFunc([...reviewDataList_, ...res.data.data.list]);
            reviewNextListFunc(res.data.next_link);
          } else enqueueSnackbar("데이터가 없습니다.", { variant: "notice" });
        })
        .catch(() => {
          console.log("실패햇어요3   ");
        });
    } else enqueueSnackbar("데이터가 없습니다.", { variant: "notice" });
  }

  return (
    <>
      {homeData === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : (
        <>
          <div className="pd_header01"></div>
          <Header
            match={props.match}
            notificationNum={
              homeData.layout.notification_num
                ? homeData.layout.notification_num
                : 0
            }
          ></Header>
          <Footer match={props.match}></Footer>
          <div className="main">
            {homeData.layout.banner.main_top !== null && (
              <>
                <div className="img_box">
                  <a
                    href={common.deepLinkToHref(
                      homeData.layout.banner.main_top.ban_deep_link_info
                    )}
                    target={
                      (homeData.layout.banner.main_top.ban_deep_link_info
                        .schema == "webview" ||
                        homeData.layout.banner.main_top.ban_deep_link_info
                          .schema == "href") &&
                      "_blank"
                    }
                  >
                    <img
                      src={homeData.layout.banner.main_top.ban_image_url}
                      alt="광고배너"
                      className="img"
                    />
                  </a>
                </div>
              </>
            )}

            <section className="main_profile">
              <h2 className="blind">마이펫 프로필</h2>

              <Swiper
                observer={"true"}
                className="profile_list"
                style={{ paddingBottom: "30px" }}
                pagination={{ clickable: true }}
                onSlideChange={val => {
                  homeData.layout.member &&
                    homeData.layout.member.petlist.length > 0 &&
                    homeData.layout.member.petlist.list[val.activeIndex]
                      .pet_id &&
                    axios({
                      method: "get",
                      url:
                        "https://api.denguru.kr/cmall/itemairecomlists/" +
                        homeData.layout.member.petlist.list[val.activeIndex]
                          .pet_id +
                        "?sort=cit_type" +
                        (citTypeRef.current.options.selectedIndex + 1),
                      headers: {
                        Authorization: cookie.accessToken
                          ? cookie.accessToken
                          : ""
                      }
                    })
                      .then(res => {
                        if (res.data) homeAIrecomDataFunc(res.data);
                        aiRecomRef.current.swiper.update();
                        console.log(homeAIrecomData);
                      })
                      .catch(() => {
                        console.log("실패햇어요");
                      });

                  axios({
                    method: "get",
                    url:
                      "https://api.denguru.kr/cmall/itemdengururecomlists/" +
                      homeData.layout.member.petlist.list[val.activeIndex]
                        .pet_id,
                    headers: {
                      Authorization: cookie.accessToken
                        ? cookie.accessToken
                        : ""
                    }
                  })
                    .then(res => {
                      if (res.data) homeDengururecomDataFunc(res.data);
                    })
                    .catch(() => {
                      console.log("실패햇어요");
                    });
                }}
              >
                {homeData.layout.member === false ||
                (homeData.layout.member !== false &&
                  !homeData.layout.member.petlist.length > 0) ? (
                  <SwiperSlide className="profile">
                    <div className="profile_img">
                      <img
                        src="/assets/images/profile-noimg.png"
                        alt="프로필 이미지"
                        className="img"
                      />
                    </div>
                    <div className="profile_message01">
                      <span className="emph">사랑스러운 우리아이</span>를<br />
                      등록해주세요.
                    </div>
                    <div className="profile_message02">
                      댕구루 AI가 꼭! 맞는 제품을 추천해드릴께요!
                    </div>
                    <div className="resister_btn_box">
                      <Link
                        to={"resisterpetwrite"}
                        className="btn btn_big btn_accent btn_resister"
                      >
                        등록하기
                      </Link>
                    </div>
                  </SwiperSlide>
                ) : (
                  homeData.layout.member.petlist.list.map((val, idx) => {
                    return (
                      <SwiperSlide className="profile">
                        <div className="profile_img">
                          <img
                            src={val.pet_photo_url}
                            alt="레오 사진"
                            className="img"
                          />
                        </div>
                        <div className="profile_name">
                          {val.pet_name}
                          <span className="profile_name_sm">
                            (
                            {val.pet_sex === 2
                              ? "남아"
                              : val.pet_sex === 1
                              ? "여아"
                              : ""}
                            /{val.pet_months}개월)
                          </span>
                        </div>
                        <ul className="profile_tag_list">
                          <li className="profile_tag">
                            {val.pet_age < 1
                              ? "퍼피"
                              : val.pet_age > 6
                              ? "시니어"
                              : "어덜트"}
                          </li>
                          <li className="profile_tag">{val.ckd_size_str}</li>
                          <li className="profile_tag">{val.pet_kind}</li>
                        </ul>
                        {val.pet_attr && val.pet_attr.length > 0 && (
                          <ul className="profile_tag_list profile_tag_list_feathers">
                            {val.pet_attr.map(aval => {
                              return (
                                <li className="profile_tag">
                                  {aval.pat_value}
                                </li>
                              );
                            })}
                          </ul>
                        )}

                        {val.pet_is_allergy == 1 &&
                          val.pet_allergy_rel &&
                          val.pet_allergy_rel.length > 0 && (
                            <ul className="profile_tag_list profile_tag_list_allergy">
                              <li className="profile_tag">
                                {val.pet_allergy_rel.map(rval => {
                                  return rval.pag_value + ", ";
                                })}
                              </li>
                            </ul>
                          )}

                        <Link
                          to={"resisterpetwrite/" + val.pet_id}
                          className="btn_modify_pet"
                        >
                          <img
                            src="/assets/images/btn_setting.png"
                            alt="레오 정보 수정하기"
                            className="img"
                          />
                        </Link>
                      </SwiperSlide>
                    );
                  })
                )}
              </Swiper>
              <Link to={"resisterpetwrite"} className="btn_add">
                추가{" "}
                <img
                  src="/assets/images/btn_plus.png"
                  alt="+"
                  className="icon"
                />
              </Link>
            </section>
            {homeAIrecomData && (
              <section className="sect02 sect_recommand_ai">
                <h2 className="title01">
                  <img
                    src="/assets/images/logo-icon.svg"
                    alt="로고아이콘"
                    className="logo_icon"
                  />
                  댕구루 AI 추천
                </h2>
                <div className="sub_title01">
                  <span className="emph01 js-petname">
                    {homeAIrecomData.pet_info.pet_name}
                  </span>
                  에게 맞춤 제품을 추천해드려요.
                  <br />
                  <span className="emph02">
                    <span className="js-petage">
                      {homeAIrecomData.pet_info.pet_age}살&nbsp;
                    </span>
                    <span className="js-petbreed">
                      {homeAIrecomData.pet_info.pet_kind}&nbsp;
                    </span>
                    <span className="js-petpercent">80%</span>
                  </span>
                  가 최근 <span className="emph02">일주일</span>동안 가장
                  관심있는 제품입니다.
                </div>
                <div className="list_info_bar01">
                  <div className="list_num">
                    <span className="num">{homeAIrecomData.total_rows}</span>
                    items
                  </div>
                  <select
                    name="listSort"
                    id="listSort"
                    className="list_order click_area"
                    ref={citTypeRef}
                    onChange={e => {
                      axios({
                        method: "get",
                        url:
                          "https://api.denguru.kr/cmall/itemairecomlists/" +
                          homeAIrecomData.pet_info.pet_id +
                          "?sort=" +
                          e.target.value,
                        headers: {
                          Authorization: cookie.accessToken
                            ? cookie.accessToken
                            : ""
                        }
                      })
                        .then(res => {
                          if (res.data) {
                            homeAIrecomDataFunc(res.data);
                            homeAIrecomsortFunc(e.target.value);
                            aiRecomRef.current.swiper.update();
                          }
                        })
                        .catch(() => {
                          console.log("실패햇어요");
                        });
                    }}
                  >
                    <option
                      value="cit_type1"
                      selected={homeAIrecomsort === "cit_type1" && "selected"}
                    >
                      추천순
                    </option>
                    <option
                      value="cit_type2"
                      selected={homeAIrecomsort === "cit_type2" && "selected"}
                    >
                      인기순
                    </option>
                    <option
                      value="cit_type3"
                      selected={homeAIrecomsort === "cit_type3" && "selected"}
                    >
                      신상품순
                    </option>
                  </select>
                </div>
                <div className="items_wrap ">
                  <div className="itmes_container ">
                    <Swiper
                      updateOnWindowResize={"true"}
                      ref={aiRecomRef}
                      spaceBetween={5}
                      slidesPerView={2.5}
                      slidesPerColumn={2}
                      slidesPerColumnFill="row"
                      className="item_list01"
                      pagination={{
                        clickable: true,
                        dynamicBullets: true
                      }}
                    >
                      {homeAIrecomData.list.map(val => {
                        return (
                          <SwiperSlide className="item_box">
                            <Link to={"/homeiteminfo/" + val.cit_id}>
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
                            </Link>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                </div>
              </section>
            )}

            <section className="sect01">
              <h2 className="title01">오늘의 BEST ITEMS</h2>
              <div className="items_wrap">
                <ul className="item_list02">
                  {homeData.data.type1.list.map((val, idx) => {
                    return (
                      <li className="item_box">
                        <Link to={"/homeiteminfo/" + val.cit_id}>
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
                <div className="btn_box_bottom">
                  <Link to={"/homebest"} className="btn_more">
                    더보기{" "}
                    <img
                      src="/assets/images/icon-angle-right.svg"
                      alt=">"
                      className="icon"
                    />
                  </Link>
                </div>
              </div>
            </section>

            <section className="sect_ad01">
              {homeData.layout.banner.main_middle !== null && (
                <>
                  <h2 className="blind">광고영역</h2>
                  <div className="img_box">
                    <a
                      href={common.deepLinkToHref(
                        homeData.layout.banner.main_middle.ban_deep_link_info
                      )}
                      target={
                        (homeData.layout.banner.main_middle.ban_deep_link_info
                          .schema == "webview" ||
                          homeData.layout.banner.main_middle.ban_deep_link_info
                            .schema == "href") &&
                        "_blank"
                      }
                    >
                      <img
                        src={homeData.layout.banner.main_middle.ban_image_url}
                        alt="광고배너"
                        className="img"
                      />
                    </a>
                  </div>
                </>
              )}
            </section>

            <section className="sect02 sect_hot_items">
              <h2 className="title01">지금 뜨는 인기 ITEMS</h2>
              <div className="hash_list_container ">
                <h3 className="blind">인기 검색어</h3>
                <Swiper
                  spaceBetween={5}
                  slidesPerView={3.3}
                  onSlideChange={() => console.log("slide change")}
                  onSwiper={swiper => console.log(swiper)}
                  className="item_list04"
                >
                  {homeData.data.type2.top.list.map(val => {
                    return (
                      <SwiperSlide className="item_box ">
                        <Link
                          to={{
                            pathname: "/search",
                            state: {
                              searchUrl: val.search_url,
                              sKeyWord: val.oth_title
                            }
                          }}
                        >
                          <div className="item_thum">
                            <img
                              src={val.oth_image}
                              alt={val.oth_title}
                              className="img"
                            />
                          </div>
                          <div className="hash">#{val.oth_title}</div>
                        </Link>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
              <div className="items_wrap ">
                <div className="itmes_container ">
                  <Swiper
                    spaceBetween={5}
                    slidesPerView={2.5}
                    slidesPerColumn={2}
                    slidesPerColumnFill="row"
                    pagination={{ clickable: true }}
                    onSlideChange={() => console.log("slide change")}
                    onSwiper={swiper => console.log(swiper)}
                    className="item_list01"
                  >
                    {homeData.data.type2.middle.list.map((val, idx) => {
                      return (
                        <SwiperSlide className="item_box" key={idx}>
                          <Link to={"/homeiteminfo/" + val.cit_id}>
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
                          </Link>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </div>
              </div>
            </section>
            {homeDengururecomData && homeDengururecomData.list.length > 0 && (
              <section className="sect01 sect_recommand_pet">
                <h2 className="title01" style={{ marginBottom: "8px" }}>
                  <img
                    src="/assets/images/logo-icon.svg"
                    alt="로고아이콘"
                    className="logo_icon"
                  />{" "}
                  <span className="emph js-petname">
                    {homeDengururecomData.pet_info.pet_name}
                  </span>
                  를 위해 이런건 어때요?
                </h2>
                <div className="sub_title01" style={{ marginBottom: "16px" }}>
                  <span className="emph02 js-petfeature">
                    {homeDengururecomData.pet_info.pet_attr.map(val => {
                      return val.pat_value + " ";
                    })}
                  </span>
                  의 특징을 가진{" "}
                  <span className="emph02">
                    <span className="js-petage">
                      {homeDengururecomData.pet_info.pet_age}살
                    </span>
                    ,{" "}
                    <span className="js-petbreed">
                      {homeDengururecomData.pet_info.pet_kind}
                    </span>
                  </span>{" "}
                  아이들이 가장 많이 찾는 제품이에요.
                </div>
                <div className="items_wrap">
                  <ul className="item_list03">
                    {homeDengururecomData.list.map(val => {
                      return (
                        <li className="item_box">
                          <Link to={"/homeiteminfo/" + val.cit_id}>
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
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="btn_box_bottom">
                    <Link
                      className="btn_more"
                      onClick={() => {
                        axios({
                          method: "get",
                          url:
                            "https://api.denguru.kr/cmall/itemdengururecomlists/" +
                            homeDengururecomData.pet_info.pet_id,
                          headers: {
                            Authorization: cookie.accessToken
                              ? cookie.accessToken
                              : ""
                          }
                        })
                          .then(res => {
                            if (res.data) homeDengururecomDataFunc(res.data);
                          })
                          .catch(() => {
                            console.log("실패햇어요");
                          });
                      }}
                    >
                      <img
                        src="/assets/images/icon-refresh.svg"
                        alt="새로고침"
                        className="icon"
                      />{" "}
                      추천 상품 새로 보기
                    </Link>
                  </div>
                </div>
              </section>
            )}

            <section className="sect_ad01">
              {homeData.layout.banner.main_bottom !== null && (
                <>
                  <h2 className="blind">광고영역</h2>
                  <div className="img_box">
                    <a
                      href={common.deepLinkToHref(
                        homeData.layout.banner.main_bottom.ban_deep_link_info
                      )}
                      target={
                        (homeData.layout.banner.main_bottom.ban_deep_link_info
                          .schema == "webview" ||
                          homeData.layout.banner.main_bottom.ban_deep_link_info
                            .schema == "href") &&
                        "_blank"
                      }
                    >
                      <img
                        src={homeData.layout.banner.main_bottom.ban_image_url}
                        alt="광고배너"
                        className="img"
                      />
                    </a>
                  </div>
                </>
              )}
            </section>

            <section className="sect01">
              <h2 className="title01">REVIEW</h2>
              <ul className="review_list01">
                {reviewDataList !== false &&
                  reviewDataList.map(val => {
                    return (
                      <li className="review_card">
                        <div className="review_profile_box">
                          <Link to={"/userreview/" + val.mem_id}>
                            <div className="profile_thum">
                              <img
                                src={val.pet_photo_url}
                                alt={val.pet_name}
                                className="img"
                              />
                            </div>
                            <div className="profile_txt_box">
                              <div className="user_id">
                                {val.mem_nickname} ({val.pet_name})
                              </div>
                              <div className="user_features">
                                {val.pet_age}살/{val.pet_kind}/
                                {val.pet_attr.map((value, idx) => {
                                  if (val.pet_attr.length === idx + 1) {
                                    return value.pat_value;
                                  } else return value.pat_value + "·";
                                })}
                              </div>
                            </div>
                          </Link>
                        </div>
                        <div className="review_item_info_box">
                          <div className="review_item_name">
                            <Link to={"/itemReview/" + val.cit_id}>
                              {val.cit_name}
                            </Link>
                          </div>
                          <div className="review_post_info">
                            <span className="stars">
                              {_makeStars(val.cre_score * 2)}
                            </span>
                            <span className="post_date">
                              {val.display_datetime}
                            </span>
                            {val.reviewblamestatus < 1 && (
                              <Link
                                className="link_report"
                                onClick={() => {
                                  let method = null;
                                  method = "post";

                                  axios({
                                    method: method,
                                    url: val.reviewblame_url,
                                    headers: {
                                      Authorization: cookie.accessToken
                                        ? cookie.accessToken
                                        : ""
                                    }
                                  })
                                    .then(res => {
                                      // reviewDataListFunc([...reviewDataList_, ...res.data.data.list]);

                                      enqueueSnackbar(res.data.msg, {
                                        variant: "notice"
                                      });
                                      let reviewDataList_ = [...reviewDataList];

                                      let 찾은상품 = reviewDataList_.find(
                                        x => x.cre_id == val.cre_id
                                      );

                                      if (찾은상품) {
                                        찾은상품.reviewblamestatus =
                                          !val.reviewblamestatus;

                                        reviewDataList_.splice(
                                          reviewDataList_.findIndex(
                                            x => x.cre_id == val.cre_id
                                          ),
                                          1,
                                          찾은상품
                                        );

                                        reviewDataListFunc(reviewDataList_);
                                      }
                                    })
                                    .catch(error => {
                                      if (error.response) {
                                        enqueueSnackbar(
                                          error.response.data.msg,
                                          { variant: "notice" }
                                        );
                                        console.log(error.response.status);
                                      }
                                    });
                                }}
                              >
                                신고하기
                              </Link>
                            )}
                          </div>
                        </div>
                        <div className="review_txt_box">
                          <div className="review_txt01">
                            <Link to={"/itemReview/" + val.cit_id}>
                              {val.cre_good && val.cre_good}
                              <br />
                              {val.cre_bad && val.cre_bad}
                              <br />
                              {val.cre_tip && val.cre_tip}
                            </Link>
                          </div>
                        </div>

                        <div
                          className={
                            val.review_image
                              ? "review_img_box02"
                              : "review_img_box"
                          }
                        >
                          {val.review_image &&
                            val.review_image.slice(0, 2).map((val2, idx) => {
                              return val.review_image.length > 2 &&
                                idx === 1 ? (
                                <Link to={"/itemReview/" + val.cit_id}>
                                  <img
                                    src={val2.uri}
                                    alt={val2.rfi_id}
                                    className="img"
                                  />
                                  <span className="more_img">+ 1</span>
                                </Link>
                              ) : (
                                <Link to={"/itemReview/" + val.cit_id}>
                                  <img
                                    src={val2.uri}
                                    alt={val2.rfi_id}
                                    className="img"
                                  />
                                </Link>
                              );
                            })}
                        </div>
                        <div className="btn_box">
                          <button
                            className="btn btn_mid btn_mid_round btn_main_line btn_like btn_right"
                            onClick={() => {
                              let method = null;
                              if (val.reviewlikestatus) method = "delete";
                              else method = "post";

                              axios({
                                method: method,
                                url: val.reviewlike_url,
                                headers: {
                                  Authorization: cookie.accessToken
                                    ? cookie.accessToken
                                    : ""
                                }
                              })
                                .then(res => {
                                  // reviewDataListFunc([...reviewDataList_, ...res.data.data.list]);

                                  enqueueSnackbar(res.data.msg, {
                                    variant: "notice"
                                  });
                                  let reviewDataList_ = [...reviewDataList];

                                  let 찾은상품 = reviewDataList_.find(
                                    x => x.cre_id == val.cre_id
                                  );

                                  if (찾은상품) {
                                    찾은상품.reviewlikestatus =
                                      !val.reviewlikestatus;
                                    찾은상품.cre_like = res.data.count;

                                    reviewDataList_.splice(
                                      reviewDataList_.findIndex(
                                        x => x.cre_id == val.cre_id
                                      ),
                                      1,
                                      찾은상품
                                    );

                                    reviewDataListFunc(reviewDataList_);
                                  }
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
                                val.reviewlikestatus
                                  ? "/assets/images/icon-heart.svg"
                                  : "/assets/images/icon-heart-o.svg"
                              }
                              alt="하트"
                              className="icon"
                            ></img>

                            <span className="num">{val.cre_like}</span>
                          </button>
                        </div>
                      </li>
                    );
                  })}
              </ul>

              <div className="btn_box_bottom">
                <a
                  className="btn_more js-btn-review-list-more"
                  onClick={() => {
                    reviewMore(reviewNextList);
                  }}
                >
                  더보기{" "}
                  <img
                    src="/assets/images/icon-angle-down.svg"
                    alt="아래화살표"
                    className="icon"
                  />
                </a>
              </div>
            </section>
            <div
              className="pd_gnb_bottom"
              style={{ height: "24px", backgroundColor: "#fff" }}
            ></div>
          </div>
        </>
      )}
    </>
  );
}

export default Home;
