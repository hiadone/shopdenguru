import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useHistory, useParams, Link } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSnackbar } from "notistack";
import NumberFormat from "react-number-format";

function EventPost(props) {
  let { id } = useParams();
  let [eventPostData, eventPostDataFunc] = useState(false);
  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    axios
      .get("https://api.denguru.kr/postact/event_link/" + id)
      .then(res => {
        eventPostDataFunc(res.data);
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response.status);
        }
        console.log("실패 했어요");
      });
  }, []);

  return (
    <>
      {eventPostData === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : (
        <>
          <header className="header07">
            <h1 className="blind">기획전 제목</h1>
            <Link
              onClick={() => {
                history.goBack();
              }}
              className="btn_goback"
            >
              <img
                src="/assets/images/icon-goback-circle.svg"
                alt="이전페이지"
                className="icon"
              />
            </Link>
          </header>

          <div className="main">
            <div className="img_box">
              <img
                src={eventPostData.data.egr_detail_image_url}
                alt="예시배너"
                className="img"
              />
            </div>

            {eventPostData.data.secionlist.map((val, idx) => {
              return (
                <div className="sect08 special_item_list_container">
                  {eventPostData.data.egr_type === "1" && (
                    <h2 className="title09">{val.eve_title}</h2>
                  )}

                  <ul className="item_list03">
                    {val.itemlists.map(val2 => {
                      return (
                        <li className="item_box">
                          <Link to={"/homeiteminfo/" + val2.cit_id}>
                            <div className="item_thum">
                              <img
                                src={val2.cit_image}
                                alt="상품이미지"
                                className="img"
                              />
                            </div>
                            <div className="item_txt_box">
                              <div className="item_shop">{val2.brd_name}</div>
                              <div className="item_name">{val2.cit_name}</div>
                              <div class="item_price">
                                <NumberFormat
                                  value={val2.cit_price_sale}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                />
                                <span class="rate_discount">
                                  &nbsp;&nbsp;{val2.cit_price_sale_percent}%
                                </span>
                              </div>
                              <div class="item_price_before">
                                <NumberFormat
                                  value={val2.cit_price}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                />
                              </div>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
            {eventPostData.data.egr_type === "3" && (
              <div className="shop_shortcut_box">
                <button
                  type="button"
                  className="btn btn_accent btn_big btn_big_round"
                  onClick={() => {
                    let method = null;
                    method = "put";

                    axios({
                      method: method,
                      url: eventPostData.data.event_registr_url
                    })
                      .then(res => {
                        enqueueSnackbar(res.response.data.msg, {
                          variant: "notice"
                        });
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
                  이벤트 참여하기
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default EventPost;
