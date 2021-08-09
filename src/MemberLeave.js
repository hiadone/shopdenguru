import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link, Redirect } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import NumberFormat from "react-number-format";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import { Swiper, SwiperSlide } from "swiper/react";

function MemberLeave(props) {
  let [memberLeaveData, memberLeaveDataFunc] = useState(false);
  let history = useHistory();

  const { enqueueSnackbar } = useSnackbar();
  const [cookie, setCookie] = useCookies();

  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.denguru.kr/membermodify/memberleave",
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        memberLeaveDataFunc(res.data);
      })
      .catch(error => {
        if (error.response) {
          memberLeaveDataFunc(error.response.status);
          // pickDataFunc(error.response.data.msg);
        }
      });
  }, []);

  return (
    <>
      {memberLeaveData === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : (
        <>
          <header className="header03 header03_white">
            <h1 className="h_title">회원탈퇴</h1>
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
            <div className="withdrawal_title_container">
              <div className="img_box">
                <img
                  src="/assets/images/logo-exclamation-mark.svg"
                  alt="!"
                  className="img"
                />
              </div>
              <h2 className="withdrawal_title txt_center">
                댕구루를 탈퇴하면 전부 사라져요!
              </h2>
            </div>
            <div className="withdrawal_info_container">
              <div className="withdrawal_item_box">
                <h2 className="title07">마이펫 추천상품 </h2>
                <div className="withdrawal_item_list_container">
                  <Swiper
                    spaceBetween={10}
                    slidesPerView="auto"
                    freeMod="true"
                    className="withdrawal_item_list"
                  >
                    {memberLeaveData.data.ai_recom.list.map((val, idx) => {
                      return (
                        <SwiperSlide className="thumb_box " key={idx}>
                          <Link to={"/homeiteminfo/" + val.cit_id}>
                            <img
                              src={val.cit_image}
                              alt={val.cit_name}
                              className="img"
                            />
                          </Link>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </div>
              </div>
              <div className="withdrawal_item_box">
                <h2 className="title07">
                  찜한 아이템{" "}
                  <span className="withdrawal_item_num">
                    {memberLeaveData.data.cit_wish.list.length}
                  </span>
                </h2>
                <div className="withdrawal_item_list_container">
                  <Swiper
                    spaceBetween={10}
                    slidesPerView="auto"
                    freeMod="true"
                    className="withdrawal_item_list"
                  >
                    {memberLeaveData.data.cit_wish.list.map((val, idx) => {
                      return (
                        <SwiperSlide className="thumb_box " key={idx}>
                          <Link to={"/homeiteminfo/" + val.cit_id}>
                            <img
                              src={val.cit_image}
                              alt={val.cit_name}
                              className="img"
                            />
                          </Link>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </div>
              </div>
              <div className="withdrawal_item_box">
                <h2 className="title07">
                  스토어 즐겨찾기{" "}
                  <span className="withdrawal_item_num">
                    {memberLeaveData.data.brd_wish.list.length}
                  </span>
                </h2>
                <div className="withdrawal_item_list_container ">
                  <Swiper
                    spaceBetween={10}
                    slidesPerView="auto"
                    freeMod="true"
                    className="withdrawal_item_list"
                  >
                    {memberLeaveData.data.brd_wish.list.map((val, idx) => {
                      return (
                        <SwiperSlide className="thumb_box " key={idx}>
                          <Link to={"/storedetail/" + val.brd_id}>
                            <img
                              src={val.brd_image}
                              alt={val.brd_name}
                              className="img"
                            />
                          </Link>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </div>
              </div>
              <div className="withdrawal_item_box">
                <h2 className="title07">
                  리뷰모아보기{" "}
                  <span className="withdrawal_item_num">
                    {memberLeaveData.data.brd_wish.list.length}
                  </span>
                </h2>
                <div className="withdrawal_item_list_container ">
                  <Swiper
                    spaceBetween={10}
                    slidesPerView="auto"
                    freeMod="true"
                    className="withdrawal_item_list"
                  >
                    {memberLeaveData.data.review.list.map((val, idx) => {
                      return (
                        <SwiperSlide className="thumb_box " key={idx}>
                          <Link to={"/userreview/" + val.mem_id}>
                            <img
                              src={val.cit_image}
                              alt={val.cit_name}
                              className="img"
                            />
                          </Link>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </div>
              </div>

              <ul className="withdrawal_notice_box">
                <li className="withdrawal_notice">
                  - 단, 관련 법령에 의거하여 일정기간 정보를 보유할 필요가 있을
                  경우 법이 정한 기간동안 해당 정보를 보유합니다.
                </li>
                <li className="withdrawal_notice">
                  - 탈퇴 시 찜한 아이템, 즐겨찾는 스토어, 최근 본 상품 목록은
                  서버에서만 삭제되며 앱 삭제 전까지는 해당 기기에 남아있습니다.
                </li>
              </ul>
            </div>
            <div className="withdrawal_btn_container">
              <div className="title06 txt_center">그래도 탈퇴하시겠습니까?</div>
              <div className="btn_box">
                <button
                  className="btn btn_main_line btn_half"
                  onClick={() => {
                    axios({
                      method: "get",
                      url: "https://api.denguru.kr/membermodify/memberleave",
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

                        setCookie("accessToken", "", "-1");
                        localStorage.clear();
                        window.location.reload();
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
                  탈퇴 할래요
                </button>
                <button
                  className="btn btn_main btn_half btn_right"
                  onClick={() => {
                    history.goBack();
                  }}
                >
                  탈퇴 안 할래요
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default MemberLeave;
