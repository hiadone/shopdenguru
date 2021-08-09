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

function MemberModifyPw(props) {
  let [memberData, memberDataFunc] = useState(false);
  let [userId, userIdFunc] = useState("");
  let [userPassword, userPasswordFunc] = useState("");
  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [cookie] = useCookies();

  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.denguru.kr/membermodify",
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        console.log(res.data);
        memberDataFunc(res.data);
      })
      .catch(error => {
        if (error.response) {
          memberDataFunc(error.response.status);
          // console.log(error.response.data.msg);
        }
      });
  }, []);

  return (
    <>
      {memberData === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : memberData !== 403 ? (
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
                  alt="이전페이지"
                  className="icon"
                />
              </Link>
            </div>
          </header>
          <div className="main">
            <div className="pd_header03"></div>
            <div className="members_join_form">
              <h2 className="title06">비밀번호 재확인</h2>
              <div className="paragraph02 sub_txt">
                회원님의 정보를 안전하게 보호하기 위해 비밀번호를 다시 한 번
                확인해주세요
              </div>
              <div className="join_form_container">
                <form name="myForm" id="myForm">
                  <div className="join_form_txt_container">
                    <div className="inp_box04">
                      <div className="inp_txt_box">
                        <label for="userId" className="lab_txt">
                          이메일
                        </label>
                        <input
                          type="email"
                          className="inp_txt js-input"
                          id="userId"
                          value={memberData.data.mem_email}
                          label="이메일"
                          readonly
                        />
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
                      </div>
                    </div>
                  </div>
                  <div className="btn_box btn_join_success">
                    <button
                      id="btnJoinSubmit"
                      type="button"
                      className="btn btn_full btn_main"
                      onClick={() => {
                        var myForm = document.getElementById("myForm");
                        const frm = new FormData(myForm);
                        axios({
                          method: "post",
                          url: "https://api.denguru.kr/membermodify",
                          data: frm,
                          headers: {
                            "content-type": "form-data",
                            Authorization: cookie.accessToken
                              ? cookie.accessToken
                              : ""
                          }
                        })
                          .then(res => {
                            enqueueSnackbar(res.data.msg, {
                              variant: "notice"
                            });
                            window.location.href = "/membermodify/modify";
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
                      확인
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : (
        memberData === 403 && <Redirect to={{ pathname: "/login" }} />
      )}
    </>
  );
}
export default MemberModifyPw;
