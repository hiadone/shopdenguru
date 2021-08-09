import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import NumberFormat from "react-number-format";
import { useCookies } from "react-cookie";

function EventApplyList(props) {
  let [eventApplyListData, eventApplyListDataFunc] = useState(false);
  let history = useHistory();
  const [cookie] = useCookies();

  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.denguru.kr/mypage/applyevent",
      headers: {
        Authorization: cookie.accessToken ? cookie.accessToken : ""
      }
    })
      .then(res => {
        eventApplyListDataFunc(res.data);
      })
      .catch(() => {
        console.log("실패햇어요");
      });
  }, []);

  return (
    <>
      {eventApplyListData === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : (
        <>
          <header className="header03 header03_white">
            <h1 className="h_title">이벤트 신청 내역</h1>
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
            <div className="tab_nav02">
              <Link to="/eventapplylist" className="tab_nav_link active">
                <span>신청한 이벤트</span>
              </Link>
              <Link to="/eventresultlist" className="tab_nav_link">
                <span>당첨된 이벤트</span>
              </Link>
            </div>
            <div className="event_list_container">
              <ul className="event_list">
                {eventApplyListData.data.list.map(val => (
                  <li className="event_box">
                    <Link to={"/eventpost/" + val.egr_id}>
                      <div className="img_box">
                        <img
                          src={val.egr_image_url}
                          alt="이벤트배너"
                          className="img"
                        />
                      </div>
                      <div className="event_txt_box">
                        <div className="event_title">{val.egr_title}</div>
                        <div className="event_date">
                          {val.egr_start_date} - {val.egr_end_date}
                        </div>
                      </div>
                      <div className="event_tag_box">
                        <span className="tag tag_main">
                          {val.erl_event_result === "1" ? "당 첨" : "신청완료"}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default EventApplyList;
