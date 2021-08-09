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

function MemberJoinSuccess(props) {
  let [memberJoinSuccessData, memberJoinSuccessDataFunc] = useState(false);
  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [cookie] = useCookies();

  useEffect(() => {
    axios({
      method: "get",
      url: "http://api.denguru.kr/login/login",
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        memberJoinSuccessDataFunc(res.data);
      })
      .catch(error => {
        if (error.response) {
          memberJoinSuccessDataFunc(error.response.status);
          // console.log(error.response.data.msg);
        }
      });
  }, []);

  return (
    <>
      {memberJoinSuccessData === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : (
        <>
          <header className="header03 header03_white">
            <h1 className="h_title">회원가입</h1>
            <div className="btn_box">
              <Link
                className="btn_goback btn_right"
                onClick={() => {
                  history.goBack();
                }}
              >
                <img
                  src="/assets/images/icon-close-page.svg"
                  alt="이전페이지"
                  className="icon"
                />
              </Link>
            </div>
          </header>
          <div className="main">
            <div className="pd_header03"></div>
            <div className="join_success_contianer">
              <div className="join_success_box">
                <div className="join_success_logo img_box">
                  <img
                    src="/assets/images/logo-icon.svg"
                    alt="댕구루로고"
                    className="img"
                  />
                </div>
                <div className="members_form_contianer">
                  <div className="join_txt_box txt_center">
                    <div className="join_title">
                      댕구루 회원이 되어 주셔서 감사합니다!
                    </div>
                    <div className="join_subtitle">
                      다양한 혜택과 정보로 언제나 즐거움을 드리는
                      <br />
                      댕구루가 되겠습니다.
                    </div>
                  </div>
                  <div className="btn_box">
                    <Link to="/login" className="btn btn_full btn_accent">
                      로그인 하러가기{" "}
                      <img
                        src="/assets/images/icon-angle-right-white.svg"
                        alt=">"
                        className="icon"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
export default MemberJoinSuccess;
