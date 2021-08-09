import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useHistory, useParams, Link } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSnackbar } from "notistack";
import NumberFormat from "react-number-format";
import Header from "./Header";
import Footer from "./Footer";

function Category(props) {
  let { id } = useParams();
  let [categoryData, categoryDataFunc] = useState(false);
  let [eventData, eventDataFunc] = useState(false);
  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    axios
      .get("https://api.denguru.kr/cmall/categorylists")
      .then(res => {
        categoryDataFunc(res.data);
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response.status);
        }
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://api.denguru.kr/event/lists")
      .then(res => {
        eventDataFunc(res.data);
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response.status);
        }
      });
  }, []);

  return (
    <>
      {categoryData === false || eventData === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : (
        <>
          <Header
            match={props.match}
            notificationNum={
              categoryData.layout.notification_num
                ? categoryData.layout.notification_num
                : 0
            }
          ></Header>
          <Footer match={props.match}></Footer>

          <div className="main">
            <div className="pd_header06"></div>
            <div className="category_wrap">
              <h2 className="title08">Category</h2>
              <div className="store_list_hash">
                <div className="store_list_swipe_wrap ">
                  <Swiper
                    className="store_list_swipe_container"
                    slidesPerView="auto"
                    spaceBetween="10"
                    freeMode={true}
                    onSlideChange={() => console.log("slide change")}
                  >
                    <SwiperSlide
                      style={{ width: "8px", height: "1px" }}
                    ></SwiperSlide>
                    {categoryData.data.list.map((val, idx) => {
                      return (
                        <SwiperSlide className="store_box ">
                          <Link to={"/search/" + val.cca_id}>
                            <div className="thumb_box">
                              <img
                                src={val.category_image_url}
                                alt="{val.cca_value}"
                                className="img"
                              />
                            </div>
                            <div className="store_name">{val.cca_value}</div>
                          </Link>
                        </SwiperSlide>
                      );
                    })}
                    <SwiperSlide
                      style={{ width: "8px", height: "1px" }}
                    ></SwiperSlide>
                  </Swiper>
                </div>
              </div>
            </div>
            <div className="special_wrap">
              <h2 className="title08">Special</h2>
              {eventData.data.list.map(val => {
                return (
                  <>
                    <div className="store_list_hash">
                      <div className="title_hash">#{val.egr_title}</div>
                    </div>
                    <ul className="banner_list">
                      <li className="banner_box">
                        <Link
                          to={"/eventpost/" + val.egr_id}
                          className="img_box"
                        >
                          <img
                            src={val.egr_image_url}
                            alt="배너제목"
                            className="img"
                          />
                        </Link>
                      </li>
                    </ul>
                  </>
                );
              })}
            </div>

            <div
              className="pd_gnb_bottom"
              style={{ height: "24px", backgroundColor: "#fff" }}
            ></div>
          </div>
        </>
      )}
    </>
  );
}

export default Category;
