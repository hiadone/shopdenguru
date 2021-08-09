import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSnackbar } from "notistack";
import NumberFormat from "react-number-format";
import { Swiper, SwiperSlide } from "swiper/react";
import Footer from "./Footer";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

function ItemReview(props) {
  let { citId, rfiId } = useParams();

  let [itemReviewData, itemReviewDataFunc] = useState(false);
  let [popupWrapFlag, popupWrapFlagFunc] = useState(false);
  let [popupReviewStandardFlag, popupReviewStandardFlagFunc] = useState(false);
  let [popupReviewFilterFlag, popupReviewFilterFunc] = useState(false);
  let [reviewSort, reviewSortFunc] = useState("cit_like");

  let [configPetKindListData, configPetKindListDataFunc] = useState(false);

  let [storeMyPetFlag, storeMyPetFlagFunc] = useState(false);
  let [petCkdIdData, petCkdIdDataFunc] = useState(0);
  let [checkedAttrs, checkedAttrsFunc] = useState(new Set());
  let [scoreData, scoreDataFunc] = useState(new Set());
  let [checkedAttrChangeFlag, checkedAttrChangeFlagFunc] = useState(false);
  let [initData, initDataFunc] = useState(null);

  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [cookie] = useCookies();
  const _starScore = obj => {
    let starScore = [];
    let scoreSum = 0;
    for (const [key, value] of Object.entries(obj)) {
      scoreSum += value;
    }

    for (const [key, value] of Object.entries(obj)) {
      starScore.push(
        <div className="filter_star_rate_box">
          <span className="radio_box">
            <input
              type="checkbox"
              name="starRate"
              id={"starRate" + key}
              hidden
              className="inp_radio"
            />
            <label
              for={"starRate" + key}
              className="lab_radio"
              onClick={e => scoreHandler(key, !scoreData.has(key))}
            >
              {key}점
            </label>
          </span>
          <div className="graph">
            <div
              className="graph_bar"
              style={{ width: (value / scoreSum) * 100 + "%" }}
            ></div>
          </div>
          <span className="filter_star_rate_num">{value}</span>
        </div>
      );
    }
    return starScore;
  };
  const checkedAttrsHandler = (id, isChecked) => {
    if (isChecked) {
      checkedAttrs.add(id);
      checkedAttrsFunc(checkedAttrs);
      checkedAttrChangeFlagFunc(!checkedAttrChangeFlag);
    } else if (!isChecked && checkedAttrs.has(id)) {
      checkedAttrs.delete(id);
      checkedAttrsFunc(checkedAttrs);
      checkedAttrChangeFlagFunc(!checkedAttrChangeFlag);
    }
  };

  const checkHandler = (id, checked) => {
    checkedAttrsHandler(id, checked);
  };

  const checkScoreHandler = (id, isChecked) => {
    if (isChecked) {
      scoreData.add(id);
      scoreDataFunc(scoreData);
      // checkedAttrChangeFlagFunc(!checkedAttrChangeFlag);
    } else if (!isChecked && checkedAttrs.has(id)) {
      scoreData.delete(id);
      scoreDataFunc(scoreData);
      // checkedAttrChangeFlagFunc(!checkedAttrChangeFlag);
    }
  };

  const scoreHandler = (id, checked) => {
    checkScoreHandler(id, checked);
  };

  useEffect(() => {
    let inIt = {};
    if (!citId) citId = 0;
    if (!rfiId) rfiId = "";
    axios({
      method: "get",
      url:
        "https://api.denguru.kr/cmall_review/itemreviewpost/" +
        citId +
        "/" +
        rfiId,
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        console.log(res.data);

        if (res.data.layout.member !== false) {
          storeMyPetFlagFunc(true);

          if (res.data.layout.member.pet_age < 1) {
            checkedAttrsHandler("17", true);
            inIt.age = "17";
          } else if (res.data.layout.member.pet_age < 7) {
            checkedAttrsHandler("18", true);
            inIt.age = "18";
          } else if (res.data.layout.member.pet_age > 6) {
            checkedAttrsHandler("19", true);
            inIt.age = "19";
          }

          checkedAttrsHandler(res.data.layout.member.pat_id, true);
          inIt.patId = res.data.layout.member.pat_id;

          petCkdIdDataFunc(res.data.layout.member.ckd_id);
          inIt.ckdId = res.data.layout.member.ckd_id;

          res.data.layout.member.pet_attr.map(val =>
            checkedAttrsHandler(val.pat_id, true)
          );
          inIt.petAttr = res.data.layout.member.pet_attr;

          initDataFunc(inIt);
          configPetKindListDataFunc(res.data.config.pet_kind);
        }

        itemReviewDataFunc(res.data);
      })
      .catch(() => {
        console.log("실패햇어요");
      });
  }, []);

  function _openPopup01() {
    popupWrapFlagFunc(true);
    popupReviewStandardFlagFunc(true);
    document.body.style.overflow = "hidden";
  }
  function _closePopup01() {
    popupWrapFlagFunc(false);
    popupReviewStandardFlagFunc(false);
    document.body.style.overflow = "visible";
  }

  const handleonChange = (e, val) => {
    // the item selected
    console.log(val);
    if (val && val.ckd_id) petCkdIdDataFunc(val.ckd_id);
  };

  function _openPopup02() {
    popupWrapFlagFunc(true);

    var 타이머 = setTimeout(() => {
      popupReviewFilterFunc(true);
      document.body.style.overflow = "hidden";
    }, 10);
    return () => {
      clearTimeout(타이머);
    };
  }
  function _closePopup02() {
    if (!rfiId) rfiId = "";
    axios({
      method: "get",
      url:
        "https://api.denguru.kr/cmall_review/itemreviewpost/" +
        citId +
        "/" +
        rfiId,
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" },
      params: {
        skind: petCkdIdData,
        is_mypet_match: storeMyPetFlag,
        sattr: [...checkedAttrs]
      }
    })
      .then(res => {
        itemReviewDataFunc(res.data);
      })
      .catch(error => {
        if (error.response) {
          // enqueueSnackbar(error.response.data.msg, { variant: "notice" });
          console.log(error.response.status);
        }
      });
    popupReviewFilterFunc(false);
    var 타이머 = setTimeout(() => {
      popupWrapFlagFunc(false);

      document.body.style.overflow = "visible";
    }, 400);
    return () => {
      clearTimeout(타이머);
    };
  }

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
      {itemReviewData === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : (
        <>
          <header className="header03">
            <h1 className="h_title">제품리뷰</h1>
            <div className="btn_box">
              <Link
                onClick={() => {
                  history.goBack();
                }}
                className="btn_goback btn_left"
              >
                <img
                  src="/assets/images/icon-goback-white.svg"
                  alt="이전페이지"
                  className="icon"
                />
              </Link>
            </div>
          </header>
          <Footer></Footer>
          <div className="main">
            <div style={{ paddingTop: "133px" }}></div>
            <div className="review_item_top">
              <div className="tag_list_container">
                <Swiper
                  className="tag_list01"
                  slidesPerView="auto"
                  spaceBetween={0}
                  freeMode={true}
                  onSlideChange={() => console.log("slide change")}
                >
                  {itemReviewData.data.item.item_attr.length > 0 &&
                    itemReviewData.data.item.item_attr.map(val => {
                      return (
                        <SwiperSlide className="tag_item">
                          <Link
                            className="btn btn_mid btn_mid_round btn_main_line"
                            to={{
                              pathname: "/search",
                              state: {
                                searchUrl:
                                  "https://api.denguru.kr/search/show_list?skeyword=" +
                                  val.cat_value,
                                sKeyWord: val.cat_value
                              }
                            }}
                          >
                            {"#" + val.cat_value}
                          </Link>
                        </SwiperSlide>
                      );
                    })}
                </Swiper>
              </div>
              <div className="filter_bar_container">
                <div className="filter_bar_select_box">
                  <label for="filterSort" className="blind">
                    정렬
                  </label>
                  <select
                    name="filterSort"
                    id="filterSort"
                    className="filter_bar_select"
                    onChange={e => {
                      if (!rfiId) rfiId = "";
                      axios({
                        method: "get",
                        url:
                          "https://api.denguru.kr/cmall_review/itemreviewpost/" +
                          citId +
                          "/" +
                          rfiId +
                          "?sort=" +
                          e.target.value,
                        headers: {
                          Authorization: cookie.accessToken
                            ? cookie.accessToken
                            : ""
                        }
                      })
                        .then(res => {
                          console.log(res.data);
                          itemReviewDataFunc(res.data);
                          reviewSortFunc(e.target.value);
                        })
                        .catch(() => {
                          console.log("실패햇어요");
                        });
                    }}
                  >
                    <option
                      value="cre_like"
                      selected={reviewSort === "cre_like" && "selected"}
                    >
                      유용한순
                    </option>
                    <option
                      value="cre_id"
                      selected={reviewSort === "cre_id" && "selected"}
                    >
                      최신순
                    </option>
                  </select>
                </div>
                {/* <div className="filter_bar_switch_box switch_box">
                  <span className="lab_switch">마이펫 맞춤</span>
                  <input
                    type="checkbox"
                    name="toggleCustom"
                    id="toggleCustom"
                    hidden
                    className="inp_blind"
                    checked={storeMyPetFlag && true}
                  />
                  <label
                    for="toggleCustom"
                    className="inp_switch"
                    onClick={() => storeMyPetFlagFunc(!storeMyPetFlag)}
                  >
                    <span className="circle_switch"></span>
                  </label>
                </div>
                <div className="filter_bar_filter_box">
                  <button className="btn btn_linkstyle" onClick={_openPopup02}>
                    <img
                      src="/assets/images/icon-filter.svg"
                      alt=""
                      className="icon"
                    />
                    필터
                  </button>
                </div> */}
              </div>
            </div>

            <section className="review_item_stars_contianer">
              <h2 className="blind">리뷰제품 정보</h2>
              <div className="review_list02">
                <div className="review_card">
                  <div className="review_item_box">
                    <Link
                      to={"/homeiteminfo/" + itemReviewData.data.item.cit_id}
                      className="review_item_link"
                    >
                      <div className="review_item_txt">
                        <div className="review_item_shop">
                          {itemReviewData.data.item.brd_name}
                        </div>
                        <div className="review_item_name">
                          {itemReviewData.data.item.cit_name}
                        </div>
                      </div>
                      <div className="review_item_thum img_box">
                        <img
                          src={itemReviewData.data.item.cit_image}
                          alt="상품썸네일"
                          className="img"
                        />
                      </div>
                      <div className="btn_arrow">
                        <img
                          src="/assets/images/icon-angle-right-gray.svg"
                          alt=">"
                          className="icon"
                        />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="review_item_stars_title">
                <span className="blind">제품리뷰 별점</span>
                <span className="score">
                  {itemReviewData.data.item.cit_review_average}
                </span>
                <span className="stars">
                  {_makeStars(itemReviewData.data.item.cit_review_average * 2)}
                </span>
              </div>

              {itemReviewData.data.item.popularreview &&
              (itemReviewData.data.item.popularreview.list.review_image.length >
                0 ||
                itemReviewData.data.item.popularreview.list.review_file.length >
                  0) ? (
                <div className="review_list02">
                  <div className="review_img_container">
                    <Swiper
                      className="review_img_list"
                      spaceBetween={5}
                      slidesPerView={3.3}
                      onSlideChange={() => console.log("slide change")}
                    >
                      {itemReviewData.data.item.popularreview.list
                        .review_image &&
                        itemReviewData.data.item.popularreview.list.review_image.map(
                          val => {
                            return (
                              <SwiperSlide className="review_img_box ">
                                <div className="img_box">
                                  <img
                                    src={val.uri}
                                    alt={val.rfi_id}
                                    className="img"
                                  />
                                </div>
                              </SwiperSlide>
                            );
                          }
                        )}
                      {itemReviewData.data.item.popularreview.list
                        .review_file &&
                        itemReviewData.data.item.popularreview.list.review_file.map(
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
                        to={"/reviewwrite/" + itemReviewData.data.item.cit_id}
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

            <section className="review_item_container">
              <h2 className="blind">리뷰리스트</h2>
              <div className="review_item_top_bar btn_box">
                <span className="item_num">
                  총 {itemReviewData.data.total_rows}개
                </span>
                <button
                  className="btn_right btn btn_linkstyle btn_review_popup"
                  onClick={_openPopup01}
                >
                  리뷰 수정요청 기준보기{" "}
                  <img
                    src="/assets/images/icon-angle-right-gray.svg"
                    alt=">"
                    className="icon"
                  />
                </button>
              </div>
              <div className="btn_fixed_write_box">
                <Link
                  to={"/reviewwrite/" + itemReviewData.data.item.cit_id}
                  className="btn btn_circle btn_main btn_write"
                >
                  <img
                    src="/assets/images/icon-write.svg"
                    alt="리뷰쓰기"
                    className="icon"
                  />
                </Link>
              </div>
              <ul className="review_list03">
                {itemReviewData.data.list.length > 0 &&
                  itemReviewData.data.list.map((val, idx) => {
                    if (itemReviewData.review_flag) {
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
                            <div className="review_post_info">
                              <span className="stars">
                                {_makeStars(val.cre_score * 2)}
                              </span>
                              <span className="post_date">
                                {val.cre_update_datetime
                                  ? val.cre_update_datetime
                                  : val.cre_datetime}
                              </span>
                              {/* <span className="post_modified">{val.cre_update_datetime ? '수정됨' : val.cre_datetime}</span> */}
                              <Link
                                className="link_report"
                                onClick={() => {
                                  let method = null;
                                  if (val.reviewblamestatus) method = "delete";
                                  else method = "post";

                                  axios({
                                    method: method,
                                    url: val.reviewblame_url
                                  })
                                    .then(res => {
                                      enqueueSnackbar(res.response.data.msg, {
                                        variant: "notice"
                                      });
                                    })
                                    .catch(error => {
                                      if (error.response) {
                                        enqueueSnackbar(
                                          error.response.data.msg,
                                          {
                                            variant: "notice"
                                          }
                                        );
                                        // console.log(error.response.status);
                                      }
                                    });
                                }}
                              >
                                신고하기
                              </Link>
                              {val.can_update && (
                                <Link
                                  to={
                                    "/reviewwrite/" +
                                    val.cit_id +
                                    "/" +
                                    val.cre_id
                                  }
                                  className="btn btn_sm btn_sm_round btn_main_line"
                                  style={{ marginLeft: "10px" }}
                                >
                                  수정하기
                                </Link>
                              )}
                              {val.can_delete && (
                                <button
                                  className="btn btn_sm btn_sm_round btn_main_line"
                                  style={{ marginLeft: "10px" }}
                                  onClick={() => {
                                    if (window.confirm("삭제 하시겠습니까?")) {
                                      let method = "delete";

                                      axios({
                                        method: method,
                                        url: val.reviewdelete_url,
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

                                          let itemReviewData_ = {
                                            ...itemReviewData
                                          };

                                          let 찾은상품 = itemReviewData_.data.list.find(
                                            x => x.cre_id == val.cre_id
                                          );

                                          if (찾은상품) {
                                            찾은상품.reviewlikestatus = !val.reviewlikestatus;
                                            찾은상품.cre_like = res.data.count;

                                            itemReviewData_.data.list.splice(
                                              itemReviewData_.data.list.findIndex(
                                                x => x.cre_id == val.cre_id
                                              ),
                                              1
                                            );

                                            itemReviewDataFunc(itemReviewData_);
                                          }
                                        })
                                        .catch(error => {
                                          if (error.response) {
                                            enqueueSnackbar(
                                              error.response.data.msg,
                                              {
                                                variant: "notice"
                                              }
                                            );
                                            console.log(error.response.status);
                                          }
                                        });
                                    } else {
                                      return false;
                                    }
                                  }}
                                >
                                  삭제하기
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="review_txt_box">
                            <div className="icon_box">
                              <img
                                src="/assets/images/icon-review-good.svg"
                                alt="좋은점"
                                className="review_icon"
                              />
                            </div>
                            <div className="review_txt">
                              <p>{val.cre_good}</p>
                            </div>
                          </div>
                          <div className="review_txt_box">
                            <div className="icon_box">
                              <img
                                src="/assets/images/icon-review-bad.svg"
                                alt="안좋은점"
                                className="review_icon"
                              />
                            </div>
                            <div className="review_txt">
                              <p>{val.cre_bad}</p>
                            </div>
                          </div>
                          <div className="review_txt_box">
                            <div className="icon_box">
                              <img
                                src="/assets/images/icon-review-tip.svg"
                                alt="꿀팁"
                                className="review_icon"
                              />
                            </div>
                            <div className="review_txt">
                              <p>{val.cre_tip}</p>
                            </div>
                          </div>

                          <div className="review_img_container ">
                            <Swiper
                              className="review_img_list"
                              spaceBetween={5}
                              slidesPerView={3.3}
                              onSlideChange={() => console.log("slide change")}
                            >
                              {val.review_image.map(val => {
                                return (
                                  <SwiperSlide className="review_img_box ">
                                    <div className="img_box">
                                      <img
                                        src={val.uri}
                                        alt={val.rfi_id}
                                        className="img"
                                      />
                                    </div>
                                  </SwiperSlide>
                                );
                              })}
                              {val.review_file.map(val => {
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
                              })}
                            </Swiper>
                          </div>
                          <div className="btn_box">
                            <span className="txt_question">
                              이 리뷰가 도움이 되었나요?
                            </span>
                            <button
                              className="btn btn_mid btn_mid_round btn_main_line btn_like btn_left"
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
                                    enqueueSnackbar(res.data.msg, {
                                      variant: "notice"
                                    });

                                    let itemReviewData_ = {
                                      ...itemReviewData
                                    };

                                    let 찾은상품 = itemReviewData_.data.list.find(
                                      x => x.cre_id == val.cre_id
                                    );

                                    if (찾은상품) {
                                      찾은상품.reviewlikestatus = !val.reviewlikestatus;
                                      찾은상품.cre_like = res.data.count;

                                      itemReviewData_.data.list.splice(
                                        itemReviewData_.data.list.findIndex(
                                          x => x.cre_id == val.cre_id
                                        ),
                                        1,
                                        찾은상품
                                      );

                                      itemReviewDataFunc(itemReviewData_);
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
                              />{" "}
                              <span className="num">{val.cre_like}</span>
                            </button>
                          </div>
                        </li>
                      );
                    } else if (!itemReviewData.review_flag) {
                      if (idx > 0) {
                        return (
                          <li className="review_card">
                            <div className="review_profile_box">
                              <Link href="home_review_user.html">
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
                              <div className="review_post_info">
                                <span className="stars">
                                  {_makeStars(val.cre_score * 2)}
                                </span>
                                <span className="post_date">
                                  {val.cre_update_datetime
                                    ? val.cre_update_datetime
                                    : val.cre_datetime}
                                </span>
                                {/* <span className="post_modified">{val.cre_update_datetime ? '수정됨' : val.cre_datetime}</span> */}
                                <a
                                  className="link_report"
                                  onClick={() => {
                                    let method = null;
                                    if (val.reviewblamestatus)
                                      method = "delete";
                                    else method = "post";

                                    axios({
                                      method: method,
                                      url: val.reviewblame_url
                                    })
                                      .then(res => {
                                        enqueueSnackbar(res.response.data.msg, {
                                          variant: "notice"
                                        });
                                      })
                                      .catch(error => {
                                        if (error.response) {
                                          enqueueSnackbar(
                                            error.response.data.msg,
                                            {
                                              variant: "notice"
                                            }
                                          );
                                          // console.log(error.response.status);
                                        }
                                      });
                                  }}
                                >
                                  신고하기
                                </a>
                                {val.can_update && (
                                  <Link
                                    to={
                                      "/reviewwrite/" +
                                      val.cit_id +
                                      "/" +
                                      val.cre_id
                                    }
                                    className="btn btn_sm btn_sm_round btn_main_line"
                                    style={{ marginLeft: "10px" }}
                                  >
                                    수정하기
                                  </Link>
                                )}
                                {val.can_delete && (
                                  <button
                                    className="btn btn_sm btn_sm_round btn_main_line"
                                    style={{ marginLeft: "10px" }}
                                    onClick={() => {
                                      if (
                                        window.confirm("삭제 하시겠습니까?")
                                      ) {
                                        let method = "delete";

                                        axios({
                                          method: method,
                                          url: val.reviewdelete_url,
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

                                            let itemReviewData_ = {
                                              ...itemReviewData
                                            };

                                            let 찾은상품 = itemReviewData_.data.list.find(
                                              x => x.cre_id == val.cre_id
                                            );

                                            if (찾은상품) {
                                              찾은상품.reviewlikestatus = !val.reviewlikestatus;
                                              찾은상품.cre_like =
                                                res.data.count;

                                              itemReviewData_.data.list.splice(
                                                itemReviewData_.data.list.findIndex(
                                                  x => x.cre_id == val.cre_id
                                                ),
                                                1
                                              );

                                              itemReviewDataFunc(
                                                itemReviewData_
                                              );
                                            }
                                          })
                                          .catch(error => {
                                            if (error.response) {
                                              enqueueSnackbar(
                                                error.response.data.msg,
                                                {
                                                  variant: "notice"
                                                }
                                              );
                                              console.log(
                                                error.response.status
                                              );
                                            }
                                          });
                                      } else {
                                        return false;
                                      }
                                    }}
                                  >
                                    삭제하기
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="review_content_blind_wrap">
                              <div className="review_content_wrap">
                                <div className="review_txt_box">
                                  <div className="icon_box">
                                    <img
                                      src="/assets/images/icon-review-good.svg"
                                      alt="좋은점"
                                      className="review_icon"
                                    />
                                  </div>
                                  <div className="review_txt">
                                    <p>
                                      내는 실로 풀밭에 끓는다. 인간의 무엇을
                                      인생에 때문이다. 온갖 귀는 이상을 것이다.
                                      가진 가장 없으면, 들어 노래하며 피고,
                                      과실이 공자는 청춘을 위하여서. 뛰노는
                                      주며, 수 이상의 얼마나 싸인 때문이다.
                                      구하지 봄바람을 그들에게 듣는다. 바이며,
                                      오직 유소년에게서 미인을 있다.
                                    </p>
                                  </div>
                                </div>
                                <div className="review_txt_box">
                                  <div className="icon_box">
                                    <img
                                      src="/assets/images/icon-review-bad.svg"
                                      alt="안좋은점"
                                      className="review_icon"
                                    />
                                  </div>
                                  <div className="review_txt">
                                    <p>
                                      내는 실로 풀밭에 끓는다. 인간의 무엇을
                                      인생에 때문이다. 온갖 귀는 이상을 것이다.
                                      가진 가장 없으면, 들어 노래하며 피고,
                                      과실이 공자는 청춘을 위하여서.
                                    </p>
                                  </div>
                                </div>
                                <div className="review_txt_box">
                                  <div className="icon_box">
                                    <img
                                      src="/assets/images/icon-review-tip.svg"
                                      alt="꿀팁"
                                      className="review_icon"
                                    />
                                  </div>
                                  <div className="review_txt">
                                    <p>
                                      내는 실로 풀밭에 끓는다. 인간의 무엇을
                                      인생에 때문이다. 온갖 귀는 이상을 것이다.
                                      가진 가장 없으면, 들어 노래하며 피고,
                                      과실이 공자는 청춘을 위하여서. 뛰노는
                                      주며, 수 이상의 얼마나 싸인 때문이다.
                                      구하지 봄바람을 그들에게 듣는다. 바이며,
                                      오직 유소년에게서 미인을 있다. 뛰노는
                                      주며, 수 이상의 얼마나 싸인 때문이다.
                                    </p>
                                  </div>
                                </div>
                                <div className="review_img_container ">
                                  <Swiper
                                    className="review_img_list"
                                    spaceBetween={5}
                                    slidesPerView={3.3}
                                    onSlideChange={() =>
                                      console.log("slide change")
                                    }
                                  >
                                    {val.review_image.map(val => {
                                      return (
                                        <SwiperSlide className="review_img_box ">
                                          <div className="img_box">
                                            <img
                                              src={val.uri}
                                              alt={val.rfi_id}
                                              className="img"
                                            />
                                          </div>
                                        </SwiperSlide>
                                      );
                                    })}
                                    {val.review_file.map(val => {
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
                                    })}
                                  </Swiper>
                                </div>
                              </div>
                              <div className="review_blind_container">
                                <div className="review_blind_title">
                                  {itemReviewData.layout.member && (
                                    <div class="review_blind_title">
                                      {
                                        itemReviewData.layout.member
                                          .mem_nickname
                                      }{" "}
                                      ({itemReviewData.layout.member.pet_name})
                                      님의
                                    </div>
                                  )}
                                  소중한 리뷰를 남겨주세요
                                </div>
                                <div className="review_blind_txt01">
                                  우리 아이가 사용했던 제품 리뷰 1개만 남기면
                                  <br />
                                  모든 리뷰를 볼 수 있어요
                                </div>
                                <div className="btn_box">
                                  <Link
                                    to={
                                      "/reviewwrite/" +
                                      itemReviewData.data.item.cit_id
                                    }
                                    class="btn btn_main btn_center btn_review_write"
                                  >
                                    리뷰 1개 쓰고 모두 보기{" "}
                                    <img
                                      src="/assets/images/icon-angle-right-white.svg"
                                      alt=">"
                                      className="icon"
                                    />
                                  </Link>
                                </div>
                                <div className="review_blind_txt02">
                                  사용중인 반려동물 제품의 모든 리뷰 가능!
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      } else {
                        return (
                          <li className="review_card">
                            <div className="review_profile_box">
                              <Link href="home_review_user.html">
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
                              <div className="review_post_info">
                                <span className="stars">
                                  {_makeStars(val.cre_score * 2)}
                                </span>
                                <span className="post_date">
                                  {val.cre_update_datetime
                                    ? val.cre_update_datetime
                                    : val.cre_datetime}
                                </span>
                                {/* <span className="post_modified">{val.cre_update_datetime ? '수정됨' : val.cre_datetime}</span> */}
                                <a
                                  className="link_report"
                                  onClick={() => {
                                    let method = null;
                                    if (val.reviewblamestatus)
                                      method = "delete";
                                    else method = "post";

                                    axios({
                                      method: method,
                                      url: val.reviewblame_url
                                    })
                                      .then(res => {
                                        enqueueSnackbar(res.response.data.msg, {
                                          variant: "notice"
                                        });
                                      })
                                      .catch(error => {
                                        if (error.response) {
                                          enqueueSnackbar(
                                            error.response.data.msg,
                                            {
                                              variant: "notice"
                                            }
                                          );
                                          // console.log(error.response.status);
                                        }
                                      });
                                  }}
                                >
                                  신고하기
                                </a>
                                {val.can_update && (
                                  <Link
                                    to={
                                      "/reviewwrite/" +
                                      val.cit_id +
                                      "/" +
                                      val.cre_id
                                    }
                                    className="btn btn_sm btn_sm_round btn_main_line"
                                    style={{ marginLeft: "10px" }}
                                  >
                                    수정하기
                                  </Link>
                                )}
                                {val.can_delete && (
                                  <button
                                    className="btn btn_sm btn_sm_round btn_main_line"
                                    style={{ marginLeft: "10px" }}
                                    onClick={() => {
                                      if (
                                        window.confirm("삭제 하시겠습니까?")
                                      ) {
                                        let method = "delete";

                                        axios({
                                          method: method,
                                          url: val.reviewdelete_url,
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

                                            let itemReviewData_ = {
                                              ...itemReviewData
                                            };

                                            let 찾은상품 = itemReviewData_.data.list.find(
                                              x => x.cre_id == val.cre_id
                                            );

                                            if (찾은상품) {
                                              찾은상품.reviewlikestatus = !val.reviewlikestatus;
                                              찾은상품.cre_like =
                                                res.data.count;

                                              itemReviewData_.data.list.splice(
                                                itemReviewData_.data.list.findIndex(
                                                  x => x.cre_id == val.cre_id
                                                ),
                                                1
                                              );

                                              itemReviewDataFunc(
                                                itemReviewData_
                                              );
                                            }
                                          })
                                          .catch(error => {
                                            if (error.response) {
                                              enqueueSnackbar(
                                                error.response.data.msg,
                                                {
                                                  variant: "notice"
                                                }
                                              );
                                              console.log(
                                                error.response.status
                                              );
                                            }
                                          });
                                      } else {
                                        return false;
                                      }
                                    }}
                                  >
                                    삭제하기
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="review_txt_box">
                              <div className="icon_box">
                                <img
                                  src="/assets/images/icon-review-good.svg"
                                  alt="좋은점"
                                  className="review_icon"
                                />
                              </div>
                              <div className="review_txt">
                                <p>{val.cre_good}</p>
                              </div>
                            </div>
                            <div className="review_txt_box">
                              <div className="icon_box">
                                <img
                                  src="/assets/images/icon-review-bad.svg"
                                  alt="안좋은점"
                                  className="review_icon"
                                />
                              </div>
                              <div className="review_txt">
                                <p>{val.cre_bad}</p>
                              </div>
                            </div>
                            <div className="review_txt_box">
                              <div className="icon_box">
                                <img
                                  src="/assets/images/icon-review-tip.svg"
                                  alt="꿀팁"
                                  className="review_icon"
                                />
                              </div>
                              <div className="review_txt">
                                <p>{val.cre_tip}</p>
                              </div>
                            </div>

                            <div className="review_img_container ">
                              <Swiper
                                className="review_img_list"
                                spaceBetween={5}
                                slidesPerView={3.3}
                                onSlideChange={() =>
                                  console.log("slide change")
                                }
                              >
                                {val.review_image.map(val => {
                                  return (
                                    <SwiperSlide className="review_img_box ">
                                      <div className="img_box">
                                        <img
                                          src={val.uri}
                                          alt={val.rfi_id}
                                          className="img"
                                        />
                                      </div>
                                    </SwiperSlide>
                                  );
                                })}
                                {val.review_file.map(val => {
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
                                })}
                              </Swiper>
                            </div>
                            <div className="btn_box">
                              <span className="txt_question">
                                이 리뷰가 도움이 되었나요?
                              </span>
                              <button
                                className="btn btn_mid btn_mid_round btn_main_line btn_like btn_left"
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
                                      enqueueSnackbar(res.data.msg, {
                                        variant: "notice"
                                      });

                                      let itemReviewData_ = {
                                        ...itemReviewData
                                      };

                                      let 찾은상품 = itemReviewData_.data.list.find(
                                        x => x.cre_id == val.cre_id
                                      );

                                      if (찾은상품) {
                                        찾은상품.reviewlikestatus = !val.reviewlikestatus;
                                        찾은상품.cre_like = res.data.count;

                                        itemReviewData_.data.list.splice(
                                          itemReviewData_.data.list.findIndex(
                                            x => x.cre_id == val.cre_id
                                          ),
                                          1,
                                          찾은상품
                                        );

                                        itemReviewDataFunc(itemReviewData_);
                                      }
                                    })
                                    .catch(error => {
                                      if (error.response) {
                                        enqueueSnackbar(
                                          error.response.data.msg,
                                          {
                                            variant: "notice"
                                          }
                                        );
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
                                />{" "}
                                <span className="num">{val.cre_like}</span>
                              </button>
                            </div>
                          </li>
                        );
                      }
                    }
                  })}
              </ul>
            </section>
            <div
              className="pd_gnb_bottom"
              style={{ height: "36px", backgroundColor: "#fff" }}
            ></div>
          </div>
          <div
            className={
              popupWrapFlag === true ? "popup_wrap show" : "popup_wrap"
            }
          >
            <div className="popup_container04" id="popupImg"></div>

            <section
              className={
                popupReviewFilterFlag === true
                  ? "popup_container03 show"
                  : "popup_container03"
              }
              id="popupReviewFilter"
            >
              <div className="popup_head">
                <h2 className="popup_title">
                  필터
                  <img
                    src="/assets/images/icon-filter.svg"
                    alt="필터"
                    className="icon"
                  />
                </h2>
              </div>
              <div className="popup_body">
                <div className="inp_box01">
                  <div className="lab_box">
                    <span className="lab">나이</span>
                  </div>
                  <div className="radio_container">
                    <span className="radio_box">
                      <input
                        type="checkbox"
                        name="sattr[]"
                        id="petAge01"
                        hidden
                        className="inp_radio"
                        value="17"
                        checked={checkedAttrs.has("17")}
                      />
                      <label
                        for="petAge01"
                        className="lab_radio"
                        onClick={() => {
                          checkHandler("17", false);
                          checkHandler("18", false);
                          checkHandler("19", false);
                          checkHandler("17", !checkedAttrs.has("17"));
                        }}
                      >
                        1살 이하
                      </label>
                    </span>
                    <span className="radio_box">
                      <input
                        type="checkbox"
                        name="sattr[]"
                        id="petAge02"
                        hidden
                        className="inp_radio"
                        value="18"
                        checked={checkedAttrs.has("18")}
                      />
                      <label
                        for="petAge02"
                        className="lab_radio"
                        onClick={() => {
                          checkHandler("17", false);
                          checkHandler("18", false);
                          checkHandler("19", false);
                          checkHandler("18", !checkedAttrs.has("18"));
                        }}
                      >
                        1살 ~ 6살
                      </label>
                    </span>
                    <span className="radio_box">
                      <input
                        type="checkbox"
                        name="sattr[]"
                        id="petAge03"
                        hidden
                        className="inp_radio"
                        value="19"
                        checked={checkedAttrs.has("19")}
                      />
                      <label
                        for="petAge03"
                        className="lab_radio"
                        onClick={() => {
                          checkHandler("17", false);
                          checkHandler("18", false);
                          checkHandler("19", false);
                          checkHandler("19", !checkedAttrs.has("19"));
                        }}
                      >
                        7살 이상
                      </label>
                    </span>
                  </div>
                </div>
                <div className="inp_box01">
                  <div className="lab_box">
                    <span className="lab">체형</span>
                  </div>
                  <div className="radio_container">
                    <span className="radio_box">
                      <input
                        type="checkbox"
                        name="sattr[]"
                        id="petBody01"
                        hidden
                        className="inp_radio"
                        value="14"
                        checked={checkedAttrs.has("14")}
                      />
                      <label
                        for="petBody01"
                        className="lab_radio"
                        onClick={() => {
                          checkHandler("14", false);
                          checkHandler("15", false);
                          checkHandler("16", false);
                          checkHandler("14", !checkedAttrs.has("14"));
                        }}
                      >
                        날씬해요
                      </label>
                    </span>
                    <span className="radio_box">
                      <input
                        type="checkbox"
                        name="sattr[]"
                        id="petBody02"
                        hidden
                        className="inp_radio"
                        value="15"
                        checked={checkedAttrs.has("15")}
                      />
                      <label
                        for="petBody02"
                        className="lab_radio"
                        onClick={() => {
                          checkHandler("14", false);
                          checkHandler("15", false);
                          checkHandler("16", false);
                          checkHandler("15", !checkedAttrs.has("15"));
                        }}
                      >
                        딱좋아요
                      </label>
                    </span>
                    <span className="radio_box">
                      <input
                        type="checkbox"
                        name="sattr[]"
                        id="petBody03"
                        hidden
                        className="inp_radio"
                        value="16"
                        checked={checkedAttrs.has("16")}
                      />
                      <label
                        for="petBody03"
                        className="lab_radio"
                        onClick={() => {
                          checkHandler("14", false);
                          checkHandler("15", false);
                          checkHandler("16", false);
                          checkHandler("16", !checkedAttrs.has("16"));
                        }}
                      >
                        통통해요
                      </label>
                    </span>
                  </div>
                </div>
                <div className="inp_box01">
                  <div className="lab_box">
                    <span className="lab">품종</span>
                  </div>
                  <Autocomplete
                    id="combo-box-demo"
                    autoHighlight={"true"}
                    options={configPetKindListData}
                    getOptionLabel={option => option.ckd_value_kr}
                    defaultValue={
                      itemReviewData.layout.member.ckd_id > 0 &&
                      configPetKindListData.find(
                        val =>
                          val.ckd_id === itemReviewData.layout.member.ckd_id
                      )
                    }
                    onChange={handleonChange}
                    style={{
                      width: "100%",

                      border: "1px solid #bdbdbd",
                      borderRadius: "5px",
                      boxSizing: "border-box",
                      fontSize: "16px",
                      color: "#141414"
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="품종을 입력해 주세요"
                        variant="outlined"
                      />
                    )}
                  />
                </div>
                <div className="inp_box01">
                  <div className="lab_box">
                    <span className="lab">우리 아이 특징</span>
                  </div>
                  <table className="check_box_table">
                    <tbody>
                      <tr>
                        <td>
                          <input
                            type="checkbox"
                            name="sattr[]"
                            id="petFeature01"
                            className="inp_check_table"
                            hidden
                            value="4"
                            checked={checkedAttrs.has("4")}
                          />
                          <label
                            for="petFeature01"
                            className="lab_check_table"
                            onClick={e =>
                              checkHandler("4", !checkedAttrs.has("4"))
                            }
                          >
                            뼈/관절강화
                          </label>
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            name="sattr[]"
                            id="petFeature02"
                            className="inp_check_table"
                            hidden
                            value="5"
                            checked={checkedAttrs.has("5")}
                          />
                          <label
                            for="petFeature02"
                            className="lab_check_table"
                            onClick={e =>
                              checkHandler("5", !checkedAttrs.has("5"))
                            }
                          >
                            면역력강화
                          </label>
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            name="sattr[]"
                            id="petFeature03"
                            className="inp_check_table"
                            hidden
                            value="6"
                            checked={checkedAttrs.has("6")}
                          />
                          <label
                            for="petFeature03"
                            className="lab_check_table"
                            onClick={e =>
                              checkHandler("6", !checkedAttrs.has("6"))
                            }
                          >
                            다이어트
                          </label>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="checkbox"
                            name="sattr[]"
                            id="petFeature04"
                            className="inp_check_table"
                            hidden
                            value="7"
                            checked={checkedAttrs.has("7")}
                          />
                          <label
                            for="petFeature04"
                            className="lab_check_table"
                            onClick={e =>
                              checkHandler("7", !checkedAttrs.has("7"))
                            }
                          >
                            피부/털개선
                          </label>
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            name="sattr[]"
                            id="petFeature05"
                            className="inp_check_table"
                            hidden
                            value="8"
                            checked={checkedAttrs.has("8")}
                          />
                          <label
                            for="petFeature05"
                            className="lab_check_table"
                            onClick={e =>
                              checkHandler("8", !checkedAttrs.has("8"))
                            }
                          >
                            구강관리
                          </label>
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            name="sattr[]"
                            id="petFeature06"
                            className="inp_check_table"
                            hidden
                            value="9"
                            checked={checkedAttrs.has("9")}
                          />
                          <label
                            for="petFeature06"
                            className="lab_check_table"
                            onClick={e =>
                              checkHandler("9", !checkedAttrs.has("9"))
                            }
                          >
                            눈/귀 건강
                          </label>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="checkbox"
                            name="sattr[]"
                            id="petFeature07"
                            className="inp_check_table"
                            hidden
                            value="10"
                            checked={checkedAttrs.has("10")}
                          />
                          <label
                            for="petFeature07"
                            className="lab_check_table"
                            onClick={e =>
                              checkHandler("10", !checkedAttrs.has("10"))
                            }
                          >
                            냄새관리
                          </label>
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            name="sattr[]"
                            id="petFeature08"
                            className="inp_check_table"
                            hidden
                            value="11"
                            checked={checkedAttrs.has("11")}
                          />
                          <label
                            for="petFeature08"
                            className="lab_check_table"
                            onClick={e =>
                              checkHandler("11", !checkedAttrs.has("11"))
                            }
                          >
                            해충방지
                          </label>
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            name="sattr[]"
                            id="petFeature09"
                            className="inp_check_table"
                            hidden
                            value="12"
                            checked={checkedAttrs.has("12")}
                          />
                          <label
                            for="petFeature09"
                            className="lab_check_table"
                            onClick={e =>
                              checkHandler("12", !checkedAttrs.has("12"))
                            }
                          >
                            신장/요로/결석
                          </label>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="checkbox"
                            name="sattr[]"
                            id="petFeature10"
                            className="inp_check_table"
                            hidden
                            value="13"
                            checked={checkedAttrs.has("13")}
                          />
                          <label
                            for="petFeature10"
                            className="lab_check_table"
                            onClick={e =>
                              checkHandler("13", !checkedAttrs.has("13"))
                            }
                          >
                            임신/수유
                          </label>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="inp_box01">
                  <div className="lab_box">
                    <span className="lab">별점</span>
                  </div>
                  {_starScore(itemReviewData.config.score)}
                </div>
              </div>
              <div className="popup_bottom btn_box">
                <button
                  type="button"
                  className="btn btn_linkstyle btn_reset"
                  onClick={() => {
                    petCkdIdDataFunc(initData.ckdId);
                    handleonChange(initData, initData);
                    initData.petAttr.map(val =>
                      checkedAttrsHandler(val.pat_id, true)
                    );
                  }}
                >
                  <img
                    src="/assets/images/icon-refresh-gray.svg"
                    alt="refresh"
                    className="icon"
                  />{" "}
                  초기화
                </button>
                <button
                  type="button"
                  className="btn btn_accent btn_submit"
                  onClick={_closePopup02}
                >
                  완 료
                </button>
              </div>
            </section>
            <div
              className={
                popupReviewStandardFlag === true
                  ? "popup_container02 popup_center show"
                  : "popup_container02 popup_center"
              }
              id="popupReviewStandard"
            >
              <div className="popup_head txt_center">리뷰수정요청기준</div>
              <div className="popup_txt_box">
                <div className="popup_txt01">
                  댕구루는 신뢰할 수 있는 리뷰를 제공하기 위해 아래와 같은 경우
                  리뷰 수정요청을 하고 있습니다. 믿을 수 있는 리뷰 문화를
                  댕구루와 함게 만들어 가요!
                </div>
                <ul className="popup_txt_list">
                  <li className="popup_txt_item">
                    <span className="num">1.</span>
                    <span className="txt">
                      너무 간략하여 정보성이 부족한 리뷰
                    </span>
                  </li>
                  <li className="popup_txt_item">
                    <span className="num">2.</span>
                    <span className="txt">사용하지 않은 제품에 대한 리뷰</span>
                  </li>
                  <li className="popup_txt_item">
                    <span className="num">3.</span>
                    <span className="txt">
                      해당 제품이 아닌 다른 제품의 리뷰
                    </span>
                  </li>
                  <li className="popup_txt_item">
                    <span className="num">4.</span>
                    <span className="txt">부적절한 사진을 첨부한 리뷰</span>
                  </li>
                  <li className="popup_txt_item">
                    <span className="num">5.</span>
                    <span className="txt">
                      각 작성 항목의 성격과 맞지 않게 작성된 리뷰{" "}
                    </span>
                  </li>
                  <li className="popup_txt_item">
                    <span className="num">6.</span>
                    <span className="txt">
                      과도한 문자의 반복이나 난해한 오타가 있는 리뷰{" "}
                    </span>
                  </li>
                  <li className="popup_txt_item">
                    <span className="num">7.</span>
                    <span className="txt">
                      욕설, 심한 비방, 광고, 음란 어플 사용한 리뷰{" "}
                    </span>
                  </li>
                  <li className="popup_txt_item">
                    <span className="num">8.</span>
                    <span className="txt">
                      개인정보를 포함한 리뷰 (연락처, 이메일 주소 등){" "}
                    </span>
                  </li>
                  <li className="popup_txt_item">
                    <span className="num">9.</span>
                    <span className="txt">
                      거래를 암시하는 내용이 포함된 리뷰
                    </span>
                  </li>
                  <li className="popup_txt_item">
                    <span className="num">10.</span>
                    <span className="txt">기타 에티켓을 위반한 리뷰 </span>
                  </li>
                  <li className="popup_txt_item">
                    <span className="num">11.</span>
                    <span className="txt">
                      명예훼손, 저작권 침해, 도용등이 우려되는 리뷰{" "}
                    </span>
                  </li>
                </ul>
                <div className="popup_txt02">
                  * 자체 알고리즘을 통해 어뷰징으로 판단되는 리뷰는 별도의
                  안내없이 즉시 블라인드 처리됩니다.
                </div>
              </div>
              <div className="popup_btn_box">
                <button
                  type="button"
                  className="btn btn_main_line btn_full btn_close"
                  onClick={_closePopup01}
                >
                  닫 기
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ItemReview;
