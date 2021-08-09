import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link, Redirect } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import NumberFormat from "react-number-format";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";

function Complain(props) {
  let { postId } = useParams();
  let [complainList, complainListFunc] = useState(false);
  let history = useHistory();
  let [checkedComplain, checkedComplainFunc] = useState(new Set());
  let [checkedComplainChangeFlag, checkedComplainChangeFlagFunc] =
    useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [cookie] = useCookies();

  const checkedComplainHandler = (id, isChecked) => {
    if (isChecked) {
      checkedComplain.add(id);
      checkedComplainFunc(checkedComplain);
      checkedComplainChangeFlagFunc(!checkedComplainChangeFlag);
    } else if (!isChecked && checkedComplain.has(id)) {
      checkedComplain.delete(id);
      checkedComplainFunc(checkedComplain);
      checkedComplainChangeFlagFunc(!checkedComplainChangeFlag);
    }
  };

  const checkHandler = (id, checked) => {
    checkedComplainHandler(id, checked);
  };

  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.denguru.kr/board_post/lists/b-a-9999",
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        if (postId) checkHandler(postId, true);

        complainListFunc(res.data);
      })
      .catch(() => {
        console.log("실패햇어요");
      });
  }, []);

  return (
    <>
      {complainList === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : (
        <>
          <header className="header03 header03_white">
            <h1 className="h_title">앱 문의/ 건의하기</h1>
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
            <div className="complain_container">
              <h2 className="title08">1:1 문의내역</h2>

              <div className="complain_announce_container">
                <h3 className="title09">상담시간</h3>
                <div className="complain_announce_txt">
                  평일(월~금) 11:00 ~ 17:00
                  <br />
                  (Off-time 12:00~14:00, 토/일/공휴일 휴무)
                </div>
                <div className="complain_announce_txt">
                  한번 등록한 상담내용은 수정이 불가합니다.
                </div>
                <div className="btn_box">
                  <Link to="/complainwrite" className="btn btn_mid btn_main">
                    1:1 문의하기
                  </Link>
                </div>
              </div>

              <div className="complain_list_container">
                <ul className="complain_list">
                  {complainList.data.list.map((val, idx) => (
                    <li className="complain_box">
                      <div className="complain_title_box">
                        <div className="complain_title_txt_box">
                          <div className="complain_title">
                            <span className="tag tag_wait">
                              {val.comment ? "답변완료" : "답변대기"}
                            </span>
                            {val.display_title}
                          </div>
                          <div className="complain_date">
                            {val.display_datetime}
                          </div>
                        </div>
                        <span
                          className="js-btn-accordion btn_accordion btn_linkstyle"
                          className={
                            checkedComplain.has(val.post_id)
                              ? "js-btn-accordion btn_accordion btn_accordion_faq btn_linkstyle up"
                              : "js-btn-accordion btn_accordion btn_accordion_faq btn_linkstyle"
                          }
                          onClick={e =>
                            checkHandler(
                              val.post_id,
                              !checkedComplain.has(val.post_id)
                            )
                          }
                        >
                          <img
                            src="/assets/images/icon-angle-down-gray.svg"
                            alt="열기"
                            className="icon"
                          />
                        </span>
                      </div>
                      <div
                        className={
                          !checkedComplain.has(val.post_id) &&
                          "complain_content_box"
                        }
                      >
                        <div className="complain_content">
                          {val.thumb_url && (
                            <img
                              src={val.thumb_url}
                              alt="열기"
                              className="icon"
                            />
                          )}
                          {val.thumb_url && <br />}
                          {val.display_content}
                        </div>
                        {val.comment && (
                          <div className="complain_reply_box">
                            <img
                              src="/assets/images/icon-reply.svg"
                              alt="댓글"
                              className="icon"
                            />
                            <div className="complain_reply">{val.comment}</div>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Complain;
