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

function MemberFindPassWord(props) {
  let [MemberFindPassWordData, MemberFindPassWordDataFunc] = useState(false);
  let [emailChkMsg, emailChkMsgFunc] = useState("이메일을 입력해주세요.");
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
        MemberFindPassWordDataFunc(res.data);
      })
      .catch(error => {
        if (error.response) {
          MemberFindPassWordDataFunc(error.response.status);
          // console.log(error.response.data.msg);
        }
      });
  }, []);

  const _onSubmit = () => {
    var myForm = document.getElementById("myForm");

    let url = "https://api.denguru.kr/findaccount";

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
        emailChkMsgFunc("complete");
      })
      .catch(error => {
        if (error.response) {
          enqueueSnackbar(error.response.data.msg, { variant: "notice" });
          emailChkMsgFunc(error.response.data.msg);
        }
      });
  };

  return (
    <>
      {MemberFindPassWordData === false && (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      )}
      {emailChkMsg === "complete" && (
        <Redirect
          to={{
            pathname: "/memberpasswordmailcomplete",
            state: {
              idPwEmail: MemberFindPassWordData.data.idpw_email
            }
          }}
        />
      )}
      {MemberFindPassWordData !== false && (
        <>
          <header className="header03 header03_white">
            <h1 className="h_title">비밀번호 재설정</h1>
            <div className="btn_box">
              <Link
                className="btn_goback btn_left"
                onClick={() => {
                  history.goBack();
                }}
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
            <div className="find_password_contianer">
              <h2 className="title08">비밀번호 재설정</h2>
              <div className="find_password_form">
                <form id="myForm">
                  <div className="inp_box04">
                    <div className="inp_txt_box">
                      <label for="idpw_email" className="lab_txt">
                        이메일
                      </label>
                      <input
                        type="email"
                        className="inp_txt js-input"
                        id="idpw_email"
                        name="idpw_email"
                        placeholder="example@email.com"
                        label="이메일"
                        onChange={e => {
                          MemberFindPassWordData.data.idpw_email =
                            e.target.value;
                          MemberFindPassWordDataFunc(MemberFindPassWordData);
                        }}
                      />
                    </div>
                    <div className="txt_right inp_message">{emailChkMsg}</div>
                  </div>
                  <div className="btn_box">
                    <button
                      className="btn  btn_main btn_full"
                      type="button"
                      id="btnEmail"
                      onClick={_onSubmit}
                    >
                      메일 발송
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
export default MemberFindPassWord;
