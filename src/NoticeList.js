import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link, Redirect } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import NumberFormat from "react-number-format";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";

function NoticeList(props) {
  let [noticeList, noticeListFunc] = useState(false);
  let [noticeNextList, noticeNextListFunc] = useState(false);
  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [cookie] = useCookies();

  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.denguru.kr/notice/lists",
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        noticeListFunc(res.data.data.list);
        noticeNextListFunc(res.data.next_link);
      })
      .catch(() => {
        console.log("실패햇어요");
      });
  }, []);

  function noticeMore(next_link) {
    if (next_link) {
      axios({
        method: "get",
        url: next_link,
        headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
      })
        .then(res => {
          if (res.data.data.list) {
            console.log(res.data);
            let noticeList_ = noticeList;
            noticeListFunc([...noticeList_, ...res.data.data.list]);
            noticeNextListFunc(res.data.next_link);
          } else enqueueSnackbar("데이터가 없습니다.", { variant: "notice" });
        })
        .catch(() => {
          console.log("실패햇어요3   ");
        });
    } else enqueueSnackbar("데이터가 없습니다.", { variant: "notice" });
  }

  return (
    <>
      {noticeList === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : (
        <>
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
            <div className="post_list_wrap">
              <ul className="post_list01">
                {noticeList.map(val => (
                  <li className="post_item">
                    <Link
                      to={"/noticepost/" + val.noti_id}
                      className="post_link"
                    >
                      <div className="post_date">{val.display_datetime}</div>
                      <div class="post_title">{val.noti_title}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <section className="sect01">
              <div className="btn_box_bottom">
                <a
                  className="btn_more js-btn-review-list-more"
                  onClick={() => {
                    noticeMore(noticeNextList);
                  }}
                >
                  더보기{" "}
                  <img
                    src="/assets/images/icon-angle-down.svg"
                    alt="아래화살표"
                    className="icon"
                  />
                </a>
              </div>
            </section>
            <div
              className=""
              style={{ height: "24px", backgroundColor: "#fff" }}
            ></div>
          </div>
        </>
      )}
    </>
  );
}

export default NoticeList;
