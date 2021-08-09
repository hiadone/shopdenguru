import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link, Redirect } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import NumberFormat from "react-number-format";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import Footer from "./Footer";

function NoticePost(props) {
  let { notiId } = useParams();
  let [noticePost, noticePostFunc] = useState(false);
  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [cookie] = useCookies();

  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.denguru.kr/notice/post/" + notiId,
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        noticePostFunc(res.data);
      })
      .catch(() => {
        console.log("실패햇어요");
      });
  }, []);

  return (
    <>
      {noticePost === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : (
        <>
          <Footer match={props.match}></Footer>
          <header className="header03 header03_white">
            <h1 className="h_title">공지사항</h1>
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
            <div className="post_content_wrap">
              <div className="post_content_title_container">
                <h2 className="post_content_title">
                  {noticePost.data.noti_title}
                </h2>
                <div className="post_content_date">
                  {noticePost.data.noti_datetime}
                </div>
              </div>
              <div className="post_content_article">
                {noticePost.data.display_content}
              </div>
              <div className="post_content_link_container">
                <div className="post_content_link_box">
                  <Link
                    className="post_content_link"
                    onClick={() => {
                      let url = "";
                      if (noticePost.next_post)
                        url =
                          "https://api.denguru.kr/notice/post/" +
                          noticePost.next_post.noti_id;
                      else url = "";
                      axios({
                        method: "get",
                        url: url,

                        headers: {
                          Authorization: cookie.accessToken
                            ? cookie.accessToken
                            : ""
                        }
                      })
                        .then(res => {
                          noticePostFunc(res.data);
                        })
                        .catch(() => {
                          console.log("실패햇어요");
                        });
                    }}
                  >
                    <div className="icon_box">
                      <img
                        src="/assets/images/icon-angle-up-gray.svg"
                        alt="화살표 위"
                        className="img"
                      />
                    </div>
                    <div className="post_page">다음글</div>
                    <div className="post_title">
                      {noticePost.next_post && noticePost.next_post.noti_title}
                    </div>
                  </Link>
                </div>
                <div className="post_content_link_box">
                  <Link
                    className="post_content_link"
                    onClick={() => {
                      let url = "";
                      if (noticePost.prev_post)
                        url =
                          "https://api.denguru.kr/notice/post/" +
                          noticePost.prev_post.noti_id;
                      else url = "";

                      axios({
                        method: "get",
                        url: url,

                        headers: {
                          Authorization: cookie.accessToken
                            ? cookie.accessToken
                            : ""
                        }
                      })
                        .then(res => {
                          noticePostFunc(res.data);
                        })
                        .catch(() => {
                          console.log("실패햇어요");
                        });
                    }}
                  >
                    <div className="icon_box">
                      <img
                        src="/assets/images/icon-angle-down-gray.svg"
                        alt="화살표 아래"
                        className="img"
                      />
                    </div>
                    <div className="post_page">이전글</div>
                    <div className="post_title">
                      {noticePost.prev_post && noticePost.prev_post.noti_title}
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default NoticePost;
