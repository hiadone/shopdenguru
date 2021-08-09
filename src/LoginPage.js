import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";

import Header from "./Header";
import Footer from "./Footer";

function LoginPage(props) {
  let { id } = useParams();
  let [thisData, thisDataFunc] = useState(false);

  // useEffect(() => {
  //   const queryObj = queryStirng.parse(props.location.hash);
  //   axios({
  //     method: "get",
  //     url:
  //       "https://devapi.denguru.kr/social/naver_login?naver_access_token=" +
  //       queryObj.access_token
  //   })
  //     .then(res => {
  //       console.log(res.data);
  //       thisDataFunc(res.data);
  //     })
  //     .catch(error => {
  //       if (error.response) {
  //         thisDataFunc(error.response.status);
  //         // console.log(error.response.data.msg);
  //       }
  //     });
  // }, []);
  return (
    <>
      {thisData === false && (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      )}
    </>
  );
}
export default LoginPage;
