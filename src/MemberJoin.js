import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSnackbar } from "notistack";
import NumberFormat from "react-number-format";
import KakaoLogin from "react-kakao-login";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import NaverLogin from "react-naver-login";

import Header from "./Header";
import Footer from "./Footer";

function MemberJoin(props) {
  let [memberJoinData, memberJoinDataFunc] = useState(false);
  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [cookie, setCookie] = useCookies(["accessToken"]);

  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.denguru.kr/login/login",
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        // console.log(res.data);
        memberJoinDataFunc(res.data);
      })
      .catch(error => {
        if (error.response) {
          memberJoinDataFunc(error.response.status);
          // // console.log(error.response.data.msg);
        }
      });
  }, []);

  const _responseGoogle = res => {
    console.log(res);

    const frm = new FormData();
    frm.append("id", res.profileObj.googleId ? res.profileObj.googleId : "");
    frm.append("email", res.profileObj.email ? res.profileObj.email : "");
    frm.append("nickname", res.profileObj.name ? res.profileObj.name : "");

    axios({
      method: "post",
      url: "https://api.denguru.kr/social/google_login",
      headers: { "content-type": "form-data" },
      data: frm
    })
      .then(res => {
        const accessToken = res.data.token;

        setCookie("accessToken", accessToken, {
          path: "/"
        });
        enqueueSnackbar(res.data.msg ? res.data.msg : "로그인 되었습니다.", {
          variant: "notice"
        });

        axios({
          method: "get",
          url: "https://api.denguru.kr/login/login",
          headers: { Authorization: accessToken ? accessToken : "" }
        })
          .then(res => {
            // console.log(res.data);
            memberJoinDataFunc(res.data);
          })
          .catch(error => {
            if (error.response) {
              memberJoinDataFunc(error.response.status);
              // // console.log(error.response.data.msg);
            }
          });
      })
      .catch(error => {
        if (error.response) {
          enqueueSnackbar(error.response.data.msg, {
            variant: "notice"
          });
          // console.log(error.response.status);
        }
      });
  };

  const _responseKaKao = res => {
    console.log(res);
    const frm = new FormData();
    frm.append("id", res.profile.id ? res.profile.id : "");
    frm.append(
      "email",
      res.profile.kakao_account.email ? res.profile.kakao_account.email : ""
    );
    frm.append(
      "nickname",
      res.profile.kakao_account.profile.nickname
        ? res.profile.kakao_account.profile.nickname
        : ""
    );

    axios({
      method: "post",
      url: "https://api.denguru.kr/social/kakao_login",
      headers: { "content-type": "form-data" },
      data: frm
    })
      .then(res => {
        const accessToken = res.data.token;

        setCookie("accessToken", accessToken, {
          path: "/"
        });
        enqueueSnackbar(res.data.msg ? res.data.msg : "로그인 되었습니다.", {
          variant: "notice"
        });

        axios({
          method: "get",
          url: "https://api.denguru.kr/login/login",
          headers: { Authorization: accessToken ? accessToken : "" }
        })
          .then(res => {
            // console.log(res.data);
            memberJoinDataFunc(res.data);
          })
          .catch(error => {
            if (error.response) {
              memberJoinDataFunc(error.response.status);
              // // console.log(error.response.data.msg);
            }
          });
      })
      .catch(error => {
        if (error.response) {
          enqueueSnackbar(error.response.data.msg, {
            variant: "notice"
          });
          // console.log(error.response.status);
        }
      });
  };

  const _responseNaver = res => {
    console.log(res);

    const frm = new FormData();
    frm.append("id", res.id ? res.id : "");
    frm.append("email", res.email ? res.email : "");
    frm.append("nickname", res.nickname ? res.nickname : "");

    axios({
      method: "post",
      url: "https://api.denguru.kr/social/naver_login",
      headers: { "content-type": "form-data" },
      data: frm
    })
      .then(res => {
        const accessToken = res.data.token;

        setCookie("accessToken", accessToken, {
          path: "/"
        });
        enqueueSnackbar(res.data.msg ? res.data.msg : "로그인 되었습니다.", {
          variant: "notice"
        });

        axios({
          method: "get",
          url: "https://api.denguru.kr/login/login",
          headers: { Authorization: accessToken ? accessToken : "" }
        })
          .then(res => {
            // console.log(res.data);
            memberJoinDataFunc(res.data);
          })
          .catch(error => {
            if (error.response) {
              memberJoinDataFunc(error.response.status);
              // // console.log(error.response.data.msg);
            }
          });
      })
      .catch(error => {
        if (error.response) {
          enqueueSnackbar(error.response.data.msg, {
            variant: "notice"
          });
          // console.log(error.response.status);
        }
      });
  };

  const _responseFacebook = res => {
    // console.log(res);
  };

  const _responseFail = err => {
    // console.log(err);
  };

  return (
    <>
      {memberJoinData === false && (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      )}
      {memberJoinData !== false && memberJoinData.layout.member === false && (
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
            <div className="members_contianer">
              <div className="members_logo img_box">
                <Link to="/">
                  <img
                    src="/assets/images/logo-horizontal.svg"
                    alt="댕구루로고"
                    className="img"
                  />
                </Link>
              </div>

              <div className="members_form_contianer">
                <h2 className="blind">회원가입</h2>
                <div className="join_txt_box txt_center">
                  <div className="join_title">댕구루 간편 회원가입</div>
                  <div className="join_subtitle">
                    댕구루 회원으로 가입합니다.
                  </div>
                </div>
                <div className="btn_box">
                  <Link to="/memberJoinForm" className="btn btn_full btn_main">
                    회원가입
                  </Link>
                </div>
              </div>
              <div className="sns_login_box">
                <h2 className="sns_login_title txt_center">
                  SNS 계정으로 간편하게 회원가입/로그인 하세요.
                </h2>
                <div className="sns_login_btn_box">
                  {memberJoinData.data.use_sociallogin_naver === 1 && (
                    <NaverLogin
                      clientId="ULmNDEcDijhUYfO1wCOd"
                      callbackUrl="https://react.denguru.kr/login"
                      onSuccess={_responseNaver}
                      onFailure={_responseFail}
                      render={props => (
                        <Link class="sns_login_btn sns_naver">
                          <img
                            src="/assets/images/sns_naver.svg"
                            alt="naver"
                            className="img"
                            onClick={props.onClick}
                          />
                        </Link>
                      )}
                    />
                  )}
                  {memberJoinData.data.use_sociallogin_facebook === 1 && (
                    <FacebookLogin
                      appId="944506609393514"
                      autoLoad={false}
                      fields="name,email,picture"
                      onClick={() => {}}
                      callback={_responseFacebook}
                    />
                  )}
                  {memberJoinData.data.use_sociallogin_kakao === 1 && (
                    <KakaoLogin
                      token="c297c7002f1e15aaac7a226f9d3defcd"
                      onSuccess={_responseKaKao}
                      onFail={_responseFail}
                      className="sns_login_btn sns_kakao"
                      render={props => (
                        <Link class="sns_login_btn sns_kakao">
                          <img
                            src="/assets/images/sns_kakao.svg"
                            alt="kakao"
                            className="img"
                            onClick={props.onClick}
                            disabled={props.disabled}
                          />
                        </Link>
                      )}
                    ></KakaoLogin>
                  )}
                  {memberJoinData.data.use_sociallogin_google === 1 && (
                    <GoogleLogin
                      clientId="512144123941-kcc7maimd9gpk2l0s0fk7uqlh27t7414.apps.googleusercontent.com"
                      onSuccess={_responseGoogle}
                      onFailure={_responseFail}
                      render={props => (
                        <Link class="sns_login_btn sns_google">
                          <img
                            src="/assets/images/sns_google.svg"
                            alt="google"
                            className="img"
                            onClick={props.onClick}
                            disabled={props.disabled}
                          />
                        </Link>
                      )}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {memberJoinData !== false && memberJoinData.layout.member !== false && (
        <Redirect to={{ pathname: "/" }} />
      )}
    </>
  );
}
export default MemberJoin;
