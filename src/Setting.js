import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link, Redirect } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import NumberFormat from "react-number-format";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";

function Setting(props) {
  let history = useHistory();
  let [settingdata, settingdataFunc] = useState(false);
  let [popupWrapFlag, popupWrapFlagFunc] = useState(false);
  let [checkedReceiveEmail, checkedReceiveEmailFunc] = useState(false);
  let [checkedReceiveSms, checkedReceiveSmsFunc] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const [cookie, setCookie] = useCookies();

  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.denguru.kr/mypage/setup",
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        checkedReceiveEmailFunc(
          res.data.data.mem_receive_email === "1" && true
        );
        checkedReceiveSmsFunc(res.data.data.mem_receive_sms === "1" && true);
        settingdataFunc(res.data);
      })
      .catch(error => {
        if (error.response) {
          settingdataFunc(error.response.status);
        }
      });
  }, []);

  return (
    <>
      {settingdata === false && (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      )}
      {settingdata === 403 && (
        <Redirect
          to={{
            pathname: "/login"
          }}
        />
      )}
      {settingdata !== false && settingdata !== 403 && (
        <>
          <header className="header03 header03_white">
            <h1 className="h_title">설정</h1>
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
            <div className="my_setting_wrap">
              <div className="my_setting_container">
                {/* <div className="my_setting_box">
                  <div className="my_setting_txt">푸시 수신동의</div>
                  <div className="my_setting_btn switch_box">
                    <input
                      type="checkbox"
                      name="agreePush"
                      id="agreePush"
                      hidden
                      className="inp_blind"
                      checked
                    />
                    <label for="agreePush" className="inp_switch">
                      <span className="circle_switch"></span>
                    </label>
                  </div>
                </div> */}
                <div className="my_setting_box">
                  <div className="my_setting_txt">SMS 수신동의</div>
                  <div className="my_setting_btn switch_box">
                    <input
                      type="checkbox"
                      name="mem_receive_sms"
                      id="agreeSMS"
                      hidden
                      className="inp_blind"
                      checked={checkedReceiveSms && true}
                    />
                    <label
                      for="agreeSMS"
                      className="inp_switch"
                      onClick={() => {
                        let url = "";
                        if (checkedReceiveSms)
                          url =
                            "https://api.denguru.kr/mypage/setup/mem_receive_sms/0";
                        else
                          url =
                            "https://api.denguru.kr/mypage/setup/mem_receive_sms/1";

                        axios({
                          method: "post",
                          url: url,
                          headers: {
                            Authorization: cookie.accessToken
                              ? cookie.accessToken
                              : ""
                          }
                        })
                          .then(res => {
                            if (res.status === 201) {
                              checkedReceiveSmsFunc(!checkedReceiveSms);
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
                      <span className="circle_switch"></span>
                    </label>
                  </div>
                </div>
                <div className="my_setting_box">
                  <div className="my_setting_txt">이메일 수신동의</div>
                  <div className="my_setting_btn switch_box">
                    <input
                      type="checkbox"
                      name="mem_receive_email"
                      id="agreeMail"
                      hidden
                      className="inp_blind"
                      checked={checkedReceiveEmail && true}
                    />
                    <label
                      for="agreeMail"
                      className="inp_switch"
                      onClick={() => {
                        let url = "";
                        if (checkedReceiveEmail)
                          url =
                            "https://api.denguru.kr/mypage/setup/mem_receive_email/0";
                        else
                          url =
                            "https://api.denguru.kr/mypage/setup/mem_receive_email/1";
                        axios({
                          method: "post",
                          url: url,
                          headers: {
                            Authorization: cookie.accessToken
                              ? cookie.accessToken
                              : ""
                          }
                        })
                          .then(res => {
                            if (res.status === 201) {
                              checkedReceiveEmailFunc(!checkedReceiveEmail);
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
                      <span className="circle_switch"></span>
                    </label>
                  </div>
                </div>
              </div>
              {/* <div className="my_setting_container">
                <div className="my_setting_box">
                  <div className="my_setting_txt">오픈소스 라이선스</div>
                  <div className="my_setting_btn">
                    <a href="">
                      <img
                        src="/assets/images/icon-angle-right-gray.svg"
                        alt=">"
                        className="icon"
                      />
                    </a>
                  </div>
                </div>
                <div className="my_setting_box">
                  <div className="my_setting_txt">캐시데이터 지우기</div>
                  <div className="my_setting_btn">
                    <a href="javascript: openPopup('popupDelCash')">
                      <img
                        src="/assets/images/icon-angle-right-gray.svg"
                        alt=">"
                        className="icon"
                      />
                    </a>
                  </div>
                </div>
              </div> */}
              <div className="my_setting_container">
                <div className="my_setting_box">
                  <div className="my_setting_txt">회원정보수정</div>
                  <div className="my_setting_btn">
                    <Link to="/membermodifypw">
                      <img
                        src="/assets/images/icon-angle-right-gray.svg"
                        alt=">"
                        className="icon"
                      />
                    </Link>
                  </div>
                </div>
                <div className="my_setting_box">
                  <div className="my_setting_txt">로그아웃</div>
                  <div className="my_setting_btn">
                    <Link onClick={() => popupWrapFlagFunc(true)}>
                      <img
                        src="/assets/images/icon-angle-right-gray.svg"
                        alt=">"
                        className="icon"
                      />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="my_setting_link">
                <Link to="/memberleave" className="link">
                  회원탈퇴
                </Link>
              </div>
            </div>
          </div>
          <div className={popupWrapFlag ? "popup_wrap show" : "popup_wrap"}>
            <div
              className={
                popupWrapFlag
                  ? "popup_container popup_center show"
                  : "popup_container popup_center"
              }
              id="popupLogout"
            >
              <div className="popup_txt_box">
                <div className="popup_txt_main txt_center">
                  로그아웃 하시겠어요?
                </div>
                <div className="popup_txt_sub txt_center">
                  내 상품/즐겨찾기가 저장되지 않아요.
                </div>
              </div>
              <div className="popup_btn_box02">
                <button
                  className="btn btn_half_popup btn_main_line"
                  onClick={() => popupWrapFlagFunc(false)}
                >
                  취소
                </button>
                <button
                  className="btn btn_half_popup btn_main btn_right"
                  onClick={() => {
                    setCookie("accessToken", "", "-1");
                    localStorage.clear();
                    popupWrapFlagFunc(false);
                    enqueueSnackbar("로그아웃 되었습니다.", {
                      variant: "notice"
                    });

                    settingdataFunc(403);
                  }}
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Setting;
