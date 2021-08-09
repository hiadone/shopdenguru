import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSnackbar } from "notistack";
import NumberFormat from "react-number-format";
import { Swiper, SwiperSlide } from "swiper/react";
import Footer from "./Footer";

function UserReview(props) {
  let { memId } = useParams();

  let [userReviewData, userReviewDataFunc] = useState(false);

  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [cookie] = useCookies();

  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.denguru.kr/cmall_review/userreviewpost/" + memId,
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        console.log(res.data);
        userReviewDataFunc(res.data);
        const script = document.createElement("script");

        script.src = "/assets/js/userreview_info_container.js";
        script.async = true;

        document.body.appendChild(script);
      })
      .catch(() => {
        console.log("실패햇어요");
      });
  }, []);

  function _makeStars(score) {
    let stars = [];
    for (let i = 0; i < 10; i += 2) {
      let starClass = "star__rate";
      console.log(score);
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
      {userReviewData === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : (
        <>
          <header className="header03">
            <h1 className="h_title">사용자 리뷰 보기</h1>
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
          <Footer></Footer>msmsgy
          <div className="main">
            <section className="review_user_profile_wrap pd_header03">
              <h2 className="blind">프로필</h2>
              <div className="review_user_profile_container">
                <div className="profile_thum img_box">
                  <img
                    src={userReviewData.mem_info.pet_photo_url}
                    alt={userReviewData.mem_info.pet_name}
                    className="img"
                  />
                </div>
                <div className="profile_txt_box">
                  <div className="user_id">
                    {userReviewData.mem_info.mem_nickname} (
                    {userReviewData.mem_info.pet_name})
                  </div>
                  <div className="user_features">
                    {userReviewData.mem_info.pet_age}살/
                    {userReviewData.mem_info.pet_kind}/
                    {userReviewData.mem_info.pet_attr.map((value, idx) => {
                      if (userReviewData.mem_info.pet_attr.length === idx + 1) {
                        return value.pat_value;
                      } else return value.pat_value + "·";
                    })}
                  </div>
                  <div className="user_review_num">
                    리뷰{" "}
                    <span className="num">
                      {userReviewData.data.total_rows}
                    </span>
                    개
                  </div>
                </div>
                <button
                  className="btn btn_user_heart btn_main_line btn_mid btn_mid_round"
                  id="btnProfileHeart"
                  onClick={() => {
                    let method = null;
                    if (userReviewData.mem_info.reviewerstatus)
                      method = "delete";
                    else method = "post";

                    axios({
                      method: method,
                      url: userReviewData.mem_info.member_reviewer_url,
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
                        let userReviewData_ = { ...userReviewData };

                        userReviewData_.mem_info.reviewerstatus =
                          !userReviewData_.mem_info.reviewerstatus;
                        console.log(userReviewData_);
                        userReviewDataFunc(userReviewData_);
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
                      userReviewData.mem_info.reviewerstatus
                        ? "/assets/images/icon-heart.svg"
                        : "/assets/images/icon-heart-o.svg"
                    }
                    alt="좋아요"
                    className="icon"
                  />
                </button>
              </div>
            </section>
            <section className="review_user_contianer">
              <h2 className="blind">사용자 리뷰 리스트</h2>
              <div className="btn_fixed_box">
                <Link
                  to={"/reviewwrite"}
                  className="btn btn_circle btn_main btn_write"
                >
                  <img
                    src="/assets/images/icon-write.svg"
                    alt="리뷰쓰기"
                    className="icon"
                  />
                </Link>
              </div>
              <ul className="review_list02">
                {userReviewData.data.total_rows > 0 &&
                  userReviewData.data.list.map((val, idx) => {
                    if (userReviewData.review_flag) {
                      return (
                        <li className="review_card">
                          <div className="review_item_box">
                            <Link
                              to={"/homeiteminfo/" + val.cit_id}
                              className="review_item_link"
                            >
                              <div className="review_item_txt">
                                <div className="review_item_shop">
                                  {val.brd_name}
                                </div>
                                <div className="review_item_name">
                                  {val.cit_name}
                                </div>
                              </div>
                              <div className="review_item_thum img_box">
                                <img
                                  src={val.cit_image}
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
                          <div className="review_post_info_box">
                            <span className="stars02">
                              {_makeStars(val.cre_score * 2)}
                            </span>
                            <span className="post_date">
                              {val.display_datetime}
                            </span>
                            {!val.reviewblamestatus && !val.can_update && (
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
                                      let userReviewData_ = {
                                        ...userReviewData
                                      };

                                      let 찾은상품 =
                                        userReviewData_.data.list.find(
                                          x => x.cre_id == val.cre_id
                                        );

                                      if (찾은상품) {
                                        찾은상품.reviewblamestatus =
                                          !val.reviewblamestatus;

                                        userReviewData_.data.list.splice(
                                          userReviewData_.data.list.findIndex(
                                            x => x.cre_id == val.cre_id
                                          ),
                                          1,
                                          찾은상품
                                        );

                                        userReviewDataFunc(userReviewData_);
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
                                신고하기
                              </Link>
                            )}
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

                                        let userReviewData_ = {
                                          ...userReviewData
                                        };

                                        let 찾은상품 =
                                          userReviewData_.data.list.find(
                                            x => x.cre_id == val.cre_id
                                          );

                                        if (찾은상품) {
                                          찾은상품.reviewlikestatus =
                                            !val.reviewlikestatus;
                                          찾은상품.cre_like = res.data.count;

                                          userReviewData_.data.list.splice(
                                            userReviewData_.data.list.findIndex(
                                              x => x.cre_id == val.cre_id
                                            ),
                                            1
                                          );

                                          userReviewDataFunc(userReviewData_);
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
                                    // reviewDataListFunc([...reviewDataList_, ...res.data.data.list]);

                                    enqueueSnackbar(res.data.msg, {
                                      variant: "notice"
                                    });

                                    let userReviewData_ = { ...userReviewData };

                                    let 찾은상품 =
                                      userReviewData_.data.list.find(
                                        x => x.cre_id == val.cre_id
                                      );

                                    if (찾은상품) {
                                      찾은상품.reviewlikestatus =
                                        !val.reviewlikestatus;
                                      찾은상품.cre_like = res.data.count;

                                      userReviewData_.data.list.splice(
                                        userReviewData_.data.list.findIndex(
                                          x => x.cre_id == val.cre_id
                                        ),
                                        1,
                                        찾은상품
                                      );

                                      userReviewDataFunc(userReviewData_);
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
                    } else {
                      if (idx == 0) {
                        return (
                          <li className="review_card">
                            <div className="review_item_box">
                              <Link
                                to={"/homeiteminfo/" + val.cit_id}
                                className="review_item_link"
                              >
                                <div className="review_item_txt">
                                  <div className="review_item_shop">
                                    {val.brd_name}
                                  </div>
                                  <div className="review_item_name">
                                    {val.cit_name}
                                  </div>
                                </div>
                                <div className="review_item_thum img_box">
                                  <img
                                    src={val.cit_image}
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
                            <div className="review_post_info_box">
                              <span className="stars02">
                                {_makeStars(val.cre_score * 2)}
                              </span>
                              <span className="post_date">
                                {val.display_datetime}
                              </span>
                              {!val.reviewblamestatus && !val.can_update && (
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
                                        let userReviewData_ = {
                                          ...userReviewData
                                        };

                                        let 찾은상품 =
                                          userReviewData_.data.list.find(
                                            x => x.cre_id == val.cre_id
                                          );

                                        if (찾은상품) {
                                          찾은상품.reviewblamestatus =
                                            !val.reviewblamestatus;

                                          userReviewData_.data.list.splice(
                                            userReviewData_.data.list.findIndex(
                                              x => x.cre_id == val.cre_id
                                            ),
                                            1,
                                            찾은상품
                                          );

                                          userReviewDataFunc(userReviewData_);
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
                                  신고하기
                                </Link>
                              )}
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
                                      // reviewDataListFunc([...reviewDataList_, ...res.data.data.list]);

                                      enqueueSnackbar(res.data.msg, {
                                        variant: "notice"
                                      });

                                      let userReviewData_ = {
                                        ...userReviewData
                                      };

                                      let 찾은상품 =
                                        userReviewData_.data.list.find(
                                          x => x.cre_id == val.cre_id
                                        );

                                      if (찾은상품) {
                                        찾은상품.reviewlikestatus =
                                          !val.reviewlikestatus;
                                        찾은상품.cre_like = res.data.count;

                                        userReviewData_.data.list.splice(
                                          userReviewData_.data.list.findIndex(
                                            x => x.cre_id == val.cre_id
                                          ),
                                          1,
                                          찾은상품
                                        );

                                        userReviewDataFunc(userReviewData_);
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
                      } else {
                        return (
                          <li className="review_card">
                            <div className="review_item_box">
                              <Link
                                to={"/homeiteminfo/" + val.cit_id}
                                className="review_item_link"
                              >
                                <div className="review_item_txt">
                                  <div className="review_item_shop">
                                    {val.brd_name}
                                  </div>
                                  <div className="review_item_name">
                                    {val.cit_name}
                                  </div>
                                </div>
                                <div className="review_item_thum img_box">
                                  <img
                                    src={val.cit_image}
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
                            <div className="review_blind_container">
                              <div className="review_blind_title">
                                {userReviewData.layout.member && (
                                  <div class="review_blind_title">
                                    {userReviewData.layout.member.mem_nickname}{" "}
                                    ({userReviewData.layout.member.pet_name})
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
                                  to={"/reviewwrite"}
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
                          </li>
                        );
                      }
                    }
                  })}

                {userReviewData.data.total_rows == 0 && (
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
                        사용해보신 제품의 리뷰를 남겨보세요.
                        <br />
                        솔직하고 건강한 리뷰가 우리 모두에게 큰 도움이 됩니다
                        <br />
                        매월 베스트 리뷰어에게 푸짐한 상품도 드려요
                      </div>
                    </div>
                  </div>
                )}
                <div
                  className="pd_gnb_bottom"
                  style={{ height: "36px", backgroundColor: "#fff" }}
                ></div>
              </ul>
            </section>
          </div>
        </>
      )}
    </>
  );
}

export default UserReview;
