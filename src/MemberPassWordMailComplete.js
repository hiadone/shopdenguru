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

function MemberPassWordMailComplete(props) {
  let [thisData, thisDataFunc] = useState(false);

  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [cookie] = useCookies();

  useEffect(() => {
    console.log(props);
    axios({
      method: "get",
      url: "https://api.denguru.kr/login/login",
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        thisDataFunc(res.data);
      })
      .catch(error => {
        if (error.response) {
          thisDataFunc(error.response.status);
          // console.log(error.response.data.msg);
        }
      });
  }, []);

  return (
    <>
      {thisData === false && (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      )}

      {thisData !== false && (
        <>
          <div className="main">
            <div className="main">
              <div className="mail_complete_container">
                <div>
                  <div className="img_motion_box">
                    <img
                      src="/assets/images/email_motion.gif"
                      alt=""
                      className="img"
                    />
                  </div>
                  <div className="mail_complete_txt01">
                    <span className="emph">비밀번호 재설정 메일</span>을
                    <br />
                    발송했어요!
                  </div>
                  <div className="mail_complete_txt02">
                    <span className="email">
                      {props.location.state.idPwEmail
                        ? props.location.state.idPwEmail
                        : ""}
                    </span>
                    으로
                    <br />
                    비밀번호 변경 이메일을 발송했어요
                  </div>
                  <div className="btn_box">
                    <Link
                      to="/login"
                      className="btn btn_accent btn_mail_success"
                    >
                      확 인
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
export default MemberPassWordMailComplete;
