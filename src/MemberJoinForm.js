import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSnackbar } from "notistack";
import NumberFormat from "react-number-format";
// import KaKaoLogin from "react-kakao-login";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import NaverLogin from "@dohyeon/react-naver-login";

import Header from "./Header";
import Footer from "./Footer";

function MemberJoinForm(props) {
  let [memberJoinFormData, memberJoinFormDataFunc] = useState(false);
  let [nickNameChkMsg, nickNameChkMsgFunc] = useState(false);
  let [emailChkMsg, emailChkMsgFunc] = useState("로그인시 필요합니다");
  let [phoneChk, phoneChkFunc] = useState(false);
  let [phoneChkMsg, phoneChkMsgFunc] = useState(false);
  let [allChk, allChkFunc] = useState(false);
  let [agreeChk, agreeChkFunc] = useState(false);
  let [agreeChk2, agreeChk2Func] = useState(false);
  let [MemberJoinSuccess, MemberJoinSuccessFunc] = useState(false);

  let [valueChk, valueChkFunc] = useState(false);
  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [cookie] = useCookies();

  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.denguru.kr/login/login",
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        console.log(res.data);
        memberJoinFormDataFunc(res.data);
      })
      .catch(error => {
        if (error.response) {
          memberJoinFormDataFunc(error.response.status);
          // console.log(error.response.data.msg);
        }
      });
  }, []);

  const _onSubmit = () => {
    var myForm = document.getElementById("myForm");

    let url = "https://api.denguru.kr/register/form";

    const frm = new FormData(myForm);

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
        MemberJoinSuccessFunc(true);
      })
      .catch(error => {
        if (error.response) {
          enqueueSnackbar(error.response.data.msg, { variant: "notice" });
        }
      });
  };

  return (
    <>
      {memberJoinFormData === false && (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      )}
      {memberJoinFormData !== false && MemberJoinSuccess === false && (
        <>
          <header className="header03 header03_white">
            <h1 className="h_title">회원가입</h1>
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
            <section className="members_join_form">
              <h2 className="title06">필수입력</h2>
              <div className="join_form_container">
                <form onsubmit="return false;" id="myForm">
                  <div className="join_form_txt_container">
                    <div className="inp_box04">
                      <div className="inp_txt_box">
                        <label for="mem_email" className="lab_txt">
                          이메일
                        </label>
                        <input
                          type="email"
                          className="inp_txt js-input"
                          id="mem_email"
                          name="mem_email"
                          placeholder="example@email.com"
                          label="이메일"
                          onChange={e => {
                            memberJoinFormData.data.mem_email = e.target.value;
                            memberJoinFormDataFunc(memberJoinFormData);
                          }}
                        />
                        <button
                          type="button"
                          className="btn_inp_txt btn_linkstyle_main btn_linkstyle"
                          id="btnMailCheck"
                          onClick={() => {
                            const frm = new FormData();

                            frm.append(
                              "email",
                              memberJoinFormData.data.mem_email
                                ? memberJoinFormData.data.mem_email
                                : ""
                            );
                            axios({
                              method: "post",
                              url: "https://api.denguru.kr/register/ajax_email_check",
                              headers: {
                                "content-type": "form-data",
                                Authorization: cookie.accessToken
                                  ? cookie.accessToken
                                  : ""
                              },
                              data: frm
                            })
                              .then(res => {
                                // reviewDataListFunc([...reviewDataList_, ...res.data.data.list]);

                                enqueueSnackbar(res.data.msg, {
                                  variant: "notice"
                                });

                                emailChkMsgFunc(res.data.msg);
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
                          확 인
                        </button>
                      </div>
                      <div className="txt_right inp_message">{emailChkMsg}</div>
                    </div>
                    <div className="inp_box04">
                      <div className="inp_txt_box">
                        <label for="mem_username" className="lab_txt">
                          이름
                        </label>
                        <input
                          type="text"
                          className="inp_txt js-input"
                          id="mem_username"
                          name="mem_username"
                          label="이름"
                        />
                      </div>
                      <div className="txt_right inp_message"></div>
                    </div>
                    <div className="inp_box04">
                      <div className="inp_txt_box">
                        <label for="mem_nickname" className="lab_txt">
                          닉네임
                        </label>
                        <input
                          type="text"
                          className="inp_txt js-input"
                          id="mem_nickname"
                          name="mem_nickname"
                          label="닉네임"
                          onChange={e => {
                            memberJoinFormData.data.mem_nickname =
                              e.target.value;
                            memberJoinFormDataFunc(memberJoinFormData);
                          }}
                        />
                        <button
                          type="button"
                          className="btn_inp_txt btn_linkstyle_main btn_linkstyle"
                          id="btnNickCheck"
                          onClick={() => {
                            const frm = new FormData();

                            frm.append(
                              "nickname",
                              memberJoinFormData.data.mem_nickname
                                ? memberJoinFormData.data.mem_nickname
                                : ""
                            );
                            axios({
                              method: "post",
                              url: "https://api.denguru.kr/register/ajax_nickname_check",
                              headers: {
                                "content-type": "form-data",
                                Authorization: cookie.accessToken
                                  ? cookie.accessToken
                                  : ""
                              },
                              data: frm
                            })
                              .then(res => {
                                // reviewDataListFunc([...reviewDataList_, ...res.data.data.list]);

                                enqueueSnackbar(res.data.msg, {
                                  variant: "notice"
                                });

                                nickNameChkMsgFunc(res.data.msg);
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
                          확 인
                        </button>
                      </div>
                      <div className="txt_right inp_message">
                        {nickNameChkMsg}
                      </div>
                    </div>

                    <div className="inp_box04">
                      <div className="inp_txt_box">
                        <label for="mem_password" className="lab_txt">
                          비밀번호
                        </label>
                        <input
                          type="password"
                          className="inp_txt js-input"
                          id="mem_password"
                          name="mem_password"
                          label="비밀번호"
                        />
                        <button
                          type="button"
                          className="btn_inp_txt btn_linkstyle js-btn-passoword-toggle"
                        ></button>
                      </div>
                      <div className="txt_right inp_message">
                        특수문자를 혼합하여 8자 이상 입력해주세요
                      </div>
                    </div>
                    <div className="inp_box04">
                      <div className="inp_txt_box">
                        <label for="mem_password_re" className="lab_txt">
                          비밀번호 확인
                        </label>
                        <input
                          type="password"
                          className="inp_txt js-input"
                          id="mem_password_re"
                          name="mem_password_re"
                          label="비밀번호 확인"
                        />
                        <button
                          type="button"
                          className="btn_inp_txt btn_linkstyle js-btn-passoword-toggle"
                        ></button>
                      </div>
                      <div className="txt_right inp_message"></div>
                    </div>
                    <div className="inp_box04">
                      <div className="inp_txt_box js-box-nowtel">
                        <label for="mem_phone" className="lab_txt">
                          휴대폰번호
                        </label>
                        <input
                          type="tel"
                          className="inp_txt js-input"
                          id="mem_phone"
                          name="mem_phone"
                          label="휴대폰번호"
                          value={memberJoinFormData.data.mem_phone}
                          onChange={e => {
                            memberJoinFormData.data.mem_phone = e.target.value;
                            memberJoinFormDataFunc(memberJoinFormData);
                            valueChkFunc(!valueChk);
                          }}
                        />
                        <button
                          type="button"
                          id="btnNowTel"
                          className="btn_inp_txt btn_linkstyle btn_linkstyle_main"
                          onClick={() => {
                            const frm = new FormData();

                            frm.append(
                              "mem_phone",
                              memberJoinFormData.data.mem_phone
                                ? memberJoinFormData.data.mem_phone
                                : ""
                            );

                            axios({
                              method: "post",
                              url: "https://api.denguru.kr/register/ajax_smssend",
                              headers: {
                                "content-type": "form-data",
                                Authorization: cookie.accessToken
                                  ? cookie.accessToken
                                  : ""
                              },
                              data: frm
                            })
                              .then(res => {
                                // reviewDataListFunc([...reviewDataList_, ...res.data.data.list]);

                                // enqueueSnackbar(res.data.msg, {
                                //   variant: "notice"
                                // });
                                alert(res.data.msg);
                                phoneChkFunc(true);
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
                          인 증
                        </button>
                      </div>
                      <div className="txt_right inp_message">{phoneChkMsg}</div>
                    </div>
                    <div
                      className={
                        phoneChk
                          ? "inp_box04  inpbox_authentication_number"
                          : "inp_box04  inpbox_authentication_number vis_hidden"
                      }
                    >
                      <div className="inp_txt_box">
                        <label
                          for="joinAuthenticationNumber"
                          className="lab_txt"
                        >
                          인증번호
                        </label>
                        <input
                          type="number"
                          className="inp_txt js-input"
                          id="joinAuthenticationNumber"
                          name="cfc_num"
                          label="인증번호"
                          onChange={e => {
                            memberJoinFormData.data.cfc_num = e.target.value;
                            memberJoinFormDataFunc(memberJoinFormData);
                            valueChkFunc(!valueChk);
                          }}
                        />
                        <div className="authentication_time"></div>
                        <button
                          type="button"
                          id="btnCheckAuthenticationNumber"
                          className="btn_inp_txt btn_linkstyle btn_linkstyle_main"
                          onClick={() => {
                            const frm = new FormData();

                            frm.append(
                              "mem_phone",
                              memberJoinFormData.data.mem_phone
                                ? memberJoinFormData.data.mem_phone
                                : ""
                            );

                            frm.append(
                              "cfc_num",
                              memberJoinFormData.data.cfc_num
                                ? memberJoinFormData.data.cfc_num
                                : ""
                            );

                            axios({
                              method: "post",
                              url: "https://api.denguru.kr/register/ajax_smsmap",
                              headers: {
                                "content-type": "form-data",
                                Authorization: cookie.accessToken
                                  ? cookie.accessToken
                                  : ""
                              },
                              data: frm
                            })
                              .then(res => {
                                // reviewDataListFunc([...reviewDataList_, ...res.data.data.list]);

                                enqueueSnackbar(res.data.msg, {
                                  variant: "notice"
                                });
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
                          확 인
                        </button>
                      </div>
                      <div className="txt_right inp_message">
                        인증번호 4자리를 입력해주세요
                      </div>
                    </div>
                  </div>
                  <div className="join_form_agree_container">
                    <div className="inp_box04">
                      <div className="inp_check_box">
                        <input
                          type="checkbox"
                          name="joinAgree"
                          id="joinAgree"
                          hidden
                          className="inp_check"
                          checked={allChk && true}
                        />
                        <label
                          for="joinAgree"
                          className="lab_checkbox01 js-lab-checkbox01"
                          onClick={() => {
                            allChkFunc(!allChk);
                            agreeChkFunc(!allChk);
                            agreeChk2Func(!allChk);
                          }}
                        >
                          전체동의
                        </label>
                      </div>
                      <div className="inp_check_box">
                        <input
                          type="checkbox"
                          name="agree"
                          id="agreeChk"
                          hidden
                          className="inp_check js-inp-check-normal"
                          checked={agreeChk && true}
                        />
                        <label
                          for="agreeChk"
                          className="lab_checkbox02 js-lab-checkbox02"
                          onClick={() => {
                            agreeChkFunc(!agreeChk);
                          }}
                        >
                          <span>
                            <span className="emph_color_main">(필수)</span>{" "}
                            서비스 이용약관, 개인정보수집이용, 개인정보처리
                            방침에 동의하며 만14세이상 고객입니다
                          </span>
                        </label>
                      </div>
                      <div className="inp_check_box">
                        <input
                          type="checkbox"
                          name="agreeChk2"
                          id="agreeChk2"
                          hidden
                          className="inp_check js-inp-check-normal"
                          checked={agreeChk2 && true}
                        />
                        <label
                          for="agreeChk2"
                          className="lab_checkbox02 js-lab-checkbox02"
                          onClick={() => {
                            agreeChk2Func(!agreeChk2);
                          }}
                        >
                          <span>
                            <span className="emph_color_main">(선택)</span>{" "}
                            서비스 관련정보수신에 동의합니다.
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="btn_box btn_join_success">
                    <button
                      id="btnJoinSubmit"
                      type="button"
                      className="btn btn_full btn_main"
                      onClick={_onSubmit}
                    >
                      가입완료
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </>
      )}
      {memberJoinFormData !== false && MemberJoinSuccess && (
        <Redirect to={{ pathname: "/memberjoinsuccess" }} />
      )}
    </>
  );
}
export default MemberJoinForm;
