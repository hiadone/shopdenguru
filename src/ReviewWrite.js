import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Swiper, SwiperSlide } from "swiper/react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useSnackbar } from "notistack";
import NumberFormat from "react-number-format";

function ReviewWrite(props) {
  let { citId, creId } = useParams();
  let [value, valueFunc] = useState("");
  let [reviewWriteData, reviewWriteDataFunc] = useState(false);
  let [reviewFileData, reviewFileDataFunc] = useState(new Set());
  let [citReviewScore, citReviewScoreFunc] = useState(false);
  let [reviewComplete, reviewCompleteFunc] = useState(false);

  let [popupReviewStandardFlag, popupReviewStandardFlagFunc] = useState(false);
  let [reviewFile, reviewFileFunc] = useState(new Array());
  let [reviewFileBase64, reviewFileBase64Func] = useState(new Array());
  let [reviewFileDelete, reviewFileDeleteFunc] = useState(new Array());

  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [cookie] = useCookies();

  const _reviewFile = e => {
    console.log("_reviewFile");
    let reader = new FileReader();

    reader.onloadend = () => {
      // 2. 읽기가 완료되면 아래코드가 실행됩니다.
      const base64 = reader.result;
      console.log(reader);

      if (base64) {
        let reviewFileBase64_ = [...reviewFileBase64];
        reviewFileBase64_.push({ rfi_id: false, uri: base64.toString() });
        reviewFileBase64Func(reviewFileBase64_); // 파일 base64 상태 업데이트
      }
    };
    if (e.target.files[0]) {
      let reviewFile_ = [...reviewFile];
      reviewFile_.push(e.target.files[0]);
      reader.readAsDataURL(e.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
      reviewFileFunc(reviewFile_); // 파일 상태 업데이트
    }
  };

  useEffect(() => {
    let url = "https://api.denguru.kr/cmall_review/reviewwrite";

    if (citId) url = url + "/" + citId;
    if (creId) url = url + "/" + creId;

    axios({
      method: "get",
      url: url,
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        console.log(res.data);
        if (res.data.data.review) {
          let reviewFileBase64_ = new Array();

          citReviewScoreFunc(res.data.data.review.cre_score);

          res.data.data.review.review_image.map(val => {
            reviewFileBase64_.push({ rfi_id: val.rfi_id, uri: val.uri });
          });
          reviewFileBase64Func(reviewFileBase64_);
        }

        reviewWriteDataFunc(res.data);
      })
      .catch(error => {
        if (error.response) {
          reviewWriteDataFunc(error.response.status);
          // console.log(error.response.data.msg);
        }
      });
  }, []);

  function _makeStars(score) {
    let stars = [];
    let y = 1;
    for (let i = 0; i < 5; i++) {
      let starClass = "star__rate";
      let y_ = y++;

      if (score !== 0) {
        if (i < parseInt(score)) {
          starClass += " is-selected";
        }
      }

      stars.push(
        <label
          key={i}
          className={starClass}
          style={{ width: "25px", height: "25px" }}
          onClick={() => citReviewScoreFunc(y_)}
        ></label>
      );
    }
    return stars;
  }

  const _onSubmit = () => {
    var reviewForm = document.getElementById("reviewForm");

    let url = "https://api.denguru.kr/cmall_review/reviewwrite";
    if (citId) url = url + "/" + citId;
    if (creId) url = url + "/" + creId;

    const frm = new FormData(reviewForm);
    reviewFile.map(val => frm.append("cre_file[]", val));
    reviewFileDelete.map(val => frm.append("cre_file_del[]", val));

    axios({
      method: "post",
      url: url,
      headers: {
        Authorization: cookie.accessToken ? cookie.accessToken : "",
        "content-type": "multipart/form-data"
      },
      data: frm
    })
      .then(res => {
        enqueueSnackbar(res.data.msg, { variant: "notice" });
        // reviewCompleteFunc(true);
        history.goBack();
      })
      .catch(error => {
        if (error.response) {
          enqueueSnackbar(error.response.data.msg, { variant: "notice" });
          console.log(error.response.status);
        }
      });
  };

  function _openPopup01() {
    popupReviewStandardFlagFunc(true);
    // document.body.style.overflow = "hidden";
  }
  function _closePopup01() {
    popupReviewStandardFlagFunc(false);
    // document.body.style.overflow = "visible";
  }

  const _petPhotoChangeFile = e => {
    let reader = new FileReader();

    reader.onloadend = () => {
      // 2. 읽기가 완료되면 아래코드가 실행됩니다.
      const base64 = reader.result;
      if (base64) {
        reviewFileDataFunc(base64.toString()); // 파일 base64 상태 업데이트
      }
    };
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
      reviewFileDataFunc(e.target.files[0]); // 파일 상태 업데이트
    }
  };

  const _onChange = e => {
    // console.log("value:", e.target.value * 1);
    valueFunc(e.target.value);
  };

  return (
    <>
      {reviewComplete && <Redirect to={"/itemreview/" + citId} />}
      {reviewWriteData === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : reviewWriteData !== 403 ? (
        <>
          <header className="header03 header03_white">
            <h1 className="h_title">{creId ? "리뷰수정" : "리뷰쓰기"}</h1>
            <div className="btn_box">
              <Link
                onClick={() => {
                  history.goBack();
                }}
                className="btn_goback"
              >
                <img
                  src="/assets/images/icon-goback.svg"
                  alt="이전페이지"
                  className="icon"
                />
              </Link>
              <button
                onClick={_onSubmit}
                className="btn btn_linkstyle_main btn_right btn_submit"
              >
                등 록
              </button>
            </div>
          </header>
          <div className="main">
            <div className="pd_header03"></div>
            <div className="btn_box top_msg01">
              <button
                className="btn btn_linkstyle btn_right"
                onClick={_openPopup01}
              >
                리뷰작성 전에 확인하세요
                <img
                  src="/assets/images/icon-angle-right-white.svg"
                  alt=">"
                  className="icon"
                />
              </button>
            </div>
            {citId ? (
              <section className="review_write_item_container">
                <h2 className="blind">리뷰상품선택</h2>
                <div className="review_item_thum img_box">
                  <a href="">
                    <img
                      src={reviewWriteData.data.item.cit_image}
                      alt={reviewWriteData.data.item.cit_name}
                      className="img"
                    />
                  </a>
                </div>
                <div className="review_item_txt_box">
                  <div className="review_item_shop">
                    <a href="">{reviewWriteData.data.item.brd_name}</a>
                  </div>
                  <div className="review_item_name">
                    <a href="">{reviewWriteData.data.item.cit_name}</a>
                  </div>
                  <Link
                    to={"/SearchReviewItem"}
                    className="review_item_btn btn btn_main_line btn_mid"
                  >
                    제품변경
                  </Link>
                </div>
              </section>
            ) : (
              <section className="review_write_item_container">
                <h2 className="blind">리뷰상품선택</h2>
                <div className="review_item_select_box">
                  <div className="review_item_select_title">
                    사용하신 제품을 선택해주세요.
                  </div>
                  <Link
                    to={"/SearchReviewItem"}
                    className="btn btn_full btn_main_line"
                  >
                    <img
                      src="/assets/images/icon-add.svg"
                      alt="+"
                      className="icon"
                    />
                    리뷰 쓸 제품 선택
                  </Link>
                </div>
              </section>
            )}

            <section className="inp_wrap review_write_inp_wrap">
              <form id="reviewForm" name="reviewForm">
                <input
                  type="number"
                  name="cre_score"
                  hidden
                  value={citReviewScore}
                />
                <h2 className="blind">제품리뷰쓰기</h2>
                <div className="inp_review_stars_container txt_center">
                  <div className="review_star_lab">평점을 선택해주세요</div>
                  <div className="stars_container">
                    {_makeStars(citReviewScore)}
                  </div>
                </div>
                <div className="inp_review_txt_contianer">
                  <div className="inp_box02">
                    <div className="lab_box">
                      <label for="cre_good" className="lab">
                        <img
                          src="/assets/images/icon-review-good.svg"
                          alt=""
                          className="lab_icon"
                        />
                        좋았던 점
                      </label>
                      <span className="lab_noti01">(최소 20자 이상)</span>
                    </div>
                    <div className="inp_box">
                      <textarea
                        name="cre_good"
                        id="cre_good"
                        className="inp inp_textarea"
                        onkeydown="resizeTextarea(this)"
                        onkeyup="resizeTextarea(this)"
                      >
                        {reviewWriteData.data.review.cre_good}
                      </textarea>
                    </div>
                  </div>
                  <div className="inp_box02">
                    <div className="lab_box">
                      <label for="cre_bad" className="lab">
                        <img
                          src="/assets/images/icon-review-bad.svg"
                          alt=""
                          className="lab_icon"
                        />
                        아쉬운 점
                      </label>
                      <span className="lab_noti01">(최소 20자 이상)</span>
                    </div>
                    <div className="inp_box">
                      <textarea
                        name="cre_bad"
                        id="cre_bad"
                        className="inp inp_textarea"
                        onkeydown="resizeTextarea(this)"
                        onkeyup="resizeTextarea(this)"
                      >
                        {reviewWriteData.data.review.cre_bad}
                      </textarea>
                    </div>
                  </div>
                  <div className="inp_box02">
                    <div className="lab_box">
                      <label for="cre_tip" className="lab">
                        <img
                          src="/assets/images/icon-review-tip.svg"
                          alt=""
                          className="lab_icon"
                        />
                        나만의 팁
                      </label>
                      <span className="lab_noti01">(선택)</span>
                    </div>
                    <div className="inp_box">
                      <textarea
                        name="cre_tip"
                        id="cre_tip"
                        className="inp inp_textarea"
                        onkeydown="resizeTextarea(this)"
                        onkeyup="resizeTextarea(this)"
                      >
                        {reviewWriteData.data.review.cre_tip}
                      </textarea>
                    </div>
                  </div>
                </div>
              </form>
              <div className="inp_review_img_contianer">
                <div className="btn_box">
                  <label
                    className="btn btn_main_line btn_full"
                    type="button"
                    for="reviewFile"
                  >
                    <input
                      type="file"
                      name="reviewFile[]"
                      id="reviewFile"
                      hidden
                      onChange={_reviewFile}
                      multiple
                    />
                    <img
                      src="/assets/images/icon-camera-main.svg"
                      alt=""
                      className="icon"
                    />
                    사진, 동영상 첨부하기
                  </label>
                </div>

                <div className="has_review_img_container ">
                  <Swiper
                    className="review_img_list"
                    spaceBetween={5}
                    slidesPerView="auto"
                    freeMode={true}
                    onSlideChange={() => console.log("slide change")}
                  >
                    {reviewFileBase64 &&
                      reviewFileBase64.map((val, idx) => {
                        return (
                          <SwiperSlide
                            className="review_img_thum img_box "
                            key={idx}
                          >
                            <img src={val.uri} alt="이미지" className="img" />
                            <button
                              className="btn_del_img btn_linkstyle"
                              onClick={() => {
                                let reviewFileBase64_ = [...reviewFileBase64];

                                reviewFileBase64_.splice(
                                  reviewFileBase64_.findIndex(x => x == val),
                                  1
                                );

                                reviewFileBase64Func(reviewFileBase64_);

                                let reviewFile_ = [...reviewFile];

                                reviewFile_.splice(
                                  reviewFile_.findIndex(x => x == val),
                                  1
                                );

                                reviewFileFunc(reviewFile_);

                                let reviewFileDelete_ = [...reviewFileDelete];

                                if (val.rfi_id)
                                  reviewFileDelete_.push(val.rfi_id);

                                reviewFileDeleteFunc(reviewFileDelete_);
                              }}
                            >
                              <img
                                src="/assets/images/icon-del.svg"
                                alt="이미지 파일명 빼기"
                                className="icon"
                              />
                            </button>
                          </SwiperSlide>
                        );
                      })}
                  </Swiper>
                </div>
              </div>
            </section>
            <section className="review_example_container">
              <h2 className="title02 txt_center">
                이런리뷰를 올려주시면 좋아요!
              </h2>
              <div className="paragraph01 txt_center">
                우리 아이의 상품 사용기를 올려주세요.
                <br />
                생생한 사용영상을 담아주시면 더욱 좋아요.
              </div>
              <ul className="review_example_list">
                <li className="review_example_item">
                  <div className="img_box">
                    <img
                      src="/assets/images/review_example01.png"
                      alt="사용샷"
                      className="img"
                    />
                  </div>
                  <div className="review_example_txt">사용샷</div>
                </li>
                <li className="review_example_item">
                  <div className="img_box">
                    <img
                      src="/assets/images/review_example02.png"
                      alt="제품구성"
                      className="img"
                    />
                  </div>
                  <div className="review_example_txt">제품구성</div>
                </li>
                <li className="review_example_item">
                  <div className="img_box">
                    <img
                      src="/assets/images/review_example03.png"
                      alt="디테일"
                      className="img"
                    />
                  </div>
                  <div className="review_example_txt">디테일</div>
                </li>
              </ul>
              <div className="review_example_noti">
                * 제품과 무관한 사진일 경우 리뷰 수정요청을 드리게 되며, 제품
                리뷰와 맞지 않는 경우 별도의 통보없이 삭제 될 수 있습니다.
              </div>
            </section>
          </div>
          <div
            className={
              popupReviewStandardFlag === true
                ? "popup_wrap show"
                : "popup_wrap"
            }
          >
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
      ) : (
        reviewWriteData === 403 && <Redirect to={{ pathname: "/login" }} />
      )}
    </>
  );
}
export default ReviewWrite;
