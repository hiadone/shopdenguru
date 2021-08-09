import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link, Redirect } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import NumberFormat from "react-number-format";
import { useCookies } from "react-cookie";

import * as common from "./common.js";

function Notification(props) {
  let [notiData, notiFunc] = useState(false);
  let history = useHistory();
  const [cookie] = useCookies();

  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.denguru.kr/notification",
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        notiFunc(res.data);
      })
      .catch(error => {
        if (error.response) {
          notiFunc(error.response.status);
          // pickDataFunc(error.response.data.msg);
        }
        console.log("실패햇어요");
      });
  }, []);

  return (
    <>
      {notiData === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : notiData !== 403 ? (
        <>
          <header className="header03 header03_white">
            <h1 className="h_title">알림</h1>
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
          <div className="main" style={{ backgroundColor: "#ffffff" }}>
            <div className="pd_header03"></div>
            <section className="notification_list_container">
              <h2 className="blind">알림</h2>
              <ul className="notification_list">
                {notiData.data.list.map((val, idx) => {
                  return (
                    <li
                      className={
                        val.not_read_datetime === null
                          ? "notification_box notification_new"
                          : "notification_box"
                      }
                    >
                      <a
                        href={
                          val.deep_link_info &&
                          common.deepLinkToHref(val.deep_link_info)
                        }
                        className="notification_link"
                        target={
                          val.deep_link_info &&
                          (val.deep_link_info.schema == "webview" ||
                            val.deep_link_info.schema == "href") &&
                          "_blank"
                        }
                        onClick={() => {
                          axios({
                            method: "get",
                            url: val.read_url,
                            headers: {
                              Authorization: cookie.accessToken
                                ? cookie.accessToken
                                : ""
                            }
                          })
                            .then(res => {
                              if (res.data) console.log("성공");
                            })
                            .catch(() => {
                              console.log("실패햇어요");
                            });
                        }}
                      >
                        <div className="icon_box">
                          <img
                            src={
                              val.not_type === "notification"
                                ? "/assets/images/icon-bell-noti.svg"
                                : val.not_type === "review_blame"
                                ? "/assets/images/icon-loudspeaker.svg"
                                : "/assets/images/icon-saletag.svg"
                            }
                            alt="알림아이콘"
                            className="icon"
                          />
                        </div>
                        <div className="notification_content">
                          <div className="notification_title">
                            <p>{val.not_message}</p>
                          </div>
                          <div className="notification_date">
                            {val.not_datetime}
                          </div>
                          {val.image_url && (
                            <div className="notification_img img_box">
                              <img
                                src={val.image_url}
                                alt={val.not_message}
                                className="img"
                              />
                            </div>
                          )}
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        </>
      ) : (
        notiData === 403 && <Redirect to={{ pathname: "/login" }} />
      )}
    </>
  );
}

export default Notification;
