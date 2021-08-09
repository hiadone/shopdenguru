import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useSnackbar } from "notistack";
import NumberFormat from "react-number-format";

function MemberModify(props) {
  let [memberModifyData, memberModifyDataFunc] = useState(false);
  let [nickNameChkMsg, nickNameChkMsgFunc] = useState(false);
  let [phoneChk, phoneChkFunc] = useState(false);
  let [phoneChkMsg, phoneChkMsgFunc] = useState(false);
  let [valueChk, valueChkFunc] = useState(false);

  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [cookie] = useCookies();

  useEffect(() => {
    let url = "https://api.denguru.kr/membermodify/modify/";

    axios({
      method: "get",
      url: url,
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        memberModifyDataFunc(res.data);
      })
      .catch(error => {
        if (error.response) {
          memberModifyDataFunc(error.response.status);
          // console.log(error.response.data.msg);
        }
      });
  }, []);

  const _onSubmit = () => {
    var myForm = document.getElementById("myForm");

    let url = "https://api.denguru.kr/membermodify/modify/";

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
      })
      .catch(error => {
        if (error.response) {
          enqueueSnackbar(error.response.data.msg, { variant: "notice" });
          console.log(error.response.status);
        }
      });
  };

  return (
    <>
      {memberModifyData === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : memberModifyData !== 403 && memberModifyData.data ? (
        <>
          <header className="header03 header03_white">
            <h1 className="h_title">회원정보수정</h1>
            <div className="btn_box">
              <Link
                onClick={() => {
                  history.goBack();
                }}
                className="btn_goback btn_left"
              >
                <img
                  src="/assets/images/icon-goback.svg"
                  alt=""
                  className="icon"
                />
              </Link>
            </div>
          </header>
          <div className="main">
            <div className="pd_header03"></div>
            <div className="members_join_form">
              <div className="join_form_container">
                <form onsubmit="return false;" id="myForm">
                  <div className="join_form_txt_container">
                    <div className="inp_box04">
                      <div className="inp_txt_box" style={{ marginTop: 0 }}>
                        <label for="mem_email" className="lab_txt">
                          이메일
                        </label>
                        <input
                          type="email"
                          className="inp_txt js-input"
                          id="mem_email"
                          name="mem_email"
                          value={memberModifyData.data.mem_email}
                          label="이메일"
                          readonly
                        />
                      </div>
                      <div className="txt_right inp_message"></div>
                    </div>
                    <div className="inp_box04">
                      <div className="inp_txt_box">
                        <label for="mem_password" className="lab_txt">
                          현재 비밀번호
                        </label>
                        <input
                          type="password"
                          className="inp_txt js-input"
                          name="mem_password"
                          id="mem_password"
                          label="현재 비밀번호"
                        />
                        <button
                          type="button"
                          className="btn_inp_txt btn_linkstyle js-btn-passoword-toggle"
                        ></button>
                      </div>
                      <div className="txt_right inp_message">
                        현재 비밀번호를 입력해주세요
                      </div>
                    </div>
                    <div className="inp_box04">
                      <div className="inp_txt_box">
                        <label for="new_password" className="lab_txt">
                          새 비밀번호
                        </label>
                        <input
                          type="password"
                          className="inp_txt js-input"
                          name="new_password"
                          id="new_password"
                          label="새 비밀번호"
                          placeholder="특수문자를 혼합하여 8자 이상"
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
                        <label for="new_password_re" className="lab_txt">
                          새 비밀번호 확인
                        </label>
                        <input
                          type="password"
                          className="inp_txt js-input"
                          name="new_password_re"
                          id="new_password_re"
                          label="새 비밀번호 확인"
                        />
                        <button
                          type="button"
                          className="btn_inp_txt btn_linkstyle js-btn-passoword-toggle"
                        ></button>
                      </div>
                      <div className="txt_right inp_message">
                        새 비밀번호를 다시 입력해주세요
                      </div>
                    </div>
                    <div className="inp_box04">
                      <div className="inp_txt_box">
                        <label for="mem_username" className="lab_txt">
                          이름
                        </label>
                        <input
                          type="text"
                          className="inp_txt js-input"
                          name="mem_username"
                          id="mem_username"
                          label="이름"
                          value={memberModifyData.data.mem_username}
                          onChange={e => {
                            memberModifyData.data.mem_username = e.target.value;
                            memberModifyDataFunc(memberModifyData);
                            valueChkFunc(!valueChk);
                          }}
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
                          value={memberModifyData.data.mem_nickname}
                          onChange={e => {
                            memberModifyData.data.mem_nickname = e.target.value;
                            memberModifyDataFunc(memberModifyData);
                            valueChkFunc(!valueChk);
                          }}
                        />
                        <button
                          type="button"
                          className="btn_inp_txt btn_linkstyle_main btn_linkstyle"
                          onClick={() => {
                            const frm = new FormData();

                            frm.append(
                              "nickname",
                              memberModifyData.data.mem_nickname
                                ? memberModifyData.data.mem_nickname
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
                          value={memberModifyData.data.mem_phone}
                          onChange={e => {
                            memberModifyData.data.mem_phone = e.target.value;
                            memberModifyDataFunc(memberModifyData);
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
                              memberModifyData.data.mem_phone
                                ? memberModifyData.data.mem_phone
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
                          : "inp_box04  inpbox_authentication_number disnone"
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
                          label="인증번호"
                          onChange={e => {
                            memberModifyData.data.cfc_num = e.target.value;
                            memberModifyDataFunc(memberModifyData);
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
                              memberModifyData.data.mem_phone
                                ? memberModifyData.data.mem_phone
                                : ""
                            );

                            frm.append(
                              "cfc_num",
                              memberModifyData.data.cfc_num
                                ? memberModifyData.data.cfc_num
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

                  <div className="btn_box btn_join_success">
                    <button
                      id="btnJoinSubmit"
                      type="button"
                      className="btn btn_full btn_main"
                      onClick={_onSubmit}
                    >
                      수정완료
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : (
        memberModifyData === 403 && <Redirect to={{ pathname: "/login" }} />
      )}
    </>
  );
}
export default MemberModify;
