import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSnackbar } from "notistack";
import NumberFormat from "react-number-format";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCookies } from "react-cookie";

function StoreDetail(props) {
  let { brdId } = useParams();
  let [storeDetailData, storeDetailDataFunc] = useState(false);
  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [cookie] = useCookies();

  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.denguru.kr/cmall/store/" + brdId,
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        storeDetailDataFunc(res.data);

        const script = document.createElement("script");

        script.src = "/assets/js/store_info_container.js";
        script.async = true;

        document.body.appendChild(script);
      })
      .catch(() => {
        console.log("실패햇어요");
      });
  }, []);

  return (
    <>
      {storeDetailData === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : (
        <>
          <header className="header03 header03_white">
            <h1 className="h_title">STORE</h1>
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
            <section className="store_info_container">
              <h2 className="blind">스토어 정보</h2>
              <div className="store_info_box">
                <a
                  href={storeDetailData.data.brd_outlink_url}
                  className="store_thum img_box"
                >
                  <img
                    src={storeDetailData.data.brd_image}
                    alt=""
                    className="img"
                  />
                </a>
                <div className="store_info_txt_box">
                  <a
                    href={storeDetailData.data.brd_outlink_url}
                    className="store_name"
                  >
                    {storeDetailData.data.brd_name}
                  </a>
                  <div className="store_info_tag_box store_info_tag_box01">
                    {storeDetailData.data.brd_attr.length > 0 &&
                      storeDetailData.data.brd_attr.map((val, idx) => {
                        if (val.cat_id)
                          return (
                            <span className="store_info_tag store_info_tag_size">
                              {val.cat_value},{" "}
                            </span>
                          );
                        else if (val.cca_id)
                          return (
                            <span className="store_info_tag store_info_tag_category">
                              {val.cat_value},{" "}
                            </span>
                          );
                      })}
                  </div>
                  <div className="store_info_tag_box store_info_tag_box02">
                    <span className="store_info_tag store_info_tag_breed">
                      {storeDetailData.data.brd_attr.length > 0 &&
                        storeDetailData.data.brd_attr.map((val, idx) => {
                          if (val.ckd_id) {
                            if (
                              idx + 1 ===
                              storeDetailData.data.brd_attr.length
                            )
                              return val.cat_value;
                            else return val.cat_value + ", ";
                          }
                        })}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn_linkstyle btn_bookmark"
                  id="btnBookmark"
                  onClick={() => {
                    let method = null;
                    if (storeDetailData.storewishstatus) method = "delete";
                    else method = "post";

                    axios({
                      method: method,
                      url: storeDetailData.addstorewish_url,
                      headers: {
                        Authorization: cookie.accessToken
                          ? cookie.accessToken
                          : ""
                      }
                    })
                      .then(res => {
                        enqueueSnackbar(res.data.msg, {
                          variant: "notice"
                        });
                        let _storeDetailData = { ...storeDetailData };
                        _storeDetailData.storewishstatus =
                          !storeDetailData.storewishstatus;
                        _storeDetailData.storewishcount = res.data.count;
                        storeDetailDataFunc(_storeDetailData);
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
                  <img
                    src={
                      storeDetailData.storewishstatus
                        ? "/assets/images/icon-bookmark.svg"
                        : "/assets/images/icon-bookmark-o.svg"
                    }
                    alt="즐겨찾기 추가"
                    className="icon"
                  />
                  <span className="bookmark_num">
                    <NumberFormat
                      value={storeDetailData.storewishcount}
                      displayType={"text"}
                      thousandSeparator={true}
                    />
                  </span>
                </button>
              </div>
            </section>
            <div className="shop_shortcut_box">
              <a
                href={storeDetailData.data.brd_outlink_url}
                target="_blank"
                className="btn btn_main btn_big btn_big_round"
              >
                쇼핑몰 바로가기
              </a>
            </div>
            <div className="store_item_list_container">
              <div className="store_new_item_info">
                금주의 신상품 - {storeDetailData.brd_updated_datetime} 업데이트
              </div>
              <ul className="item_list03">
                {storeDetailData.data.similaritemlist.list.length > 0
                  ? storeDetailData.data.similaritemlist.list.map(val => {
                      return (
                        <li className="item_box">
                          <a href={val.cit_outlink_url}>
                            <div className="item_thum">
                              <img
                                src={val.cit_image}
                                alt="상품이미지"
                                className="img"
                              />
                              <span className="tag_new">
                                <img
                                  src="/assets/images/tag-item-new.svg"
                                  alt="신상품"
                                  className="img_tag"
                                />
                              </span>
                            </div>

                            <div className="item_txt_box">
                              <div className="item_shop">{val.brd_name}</div>
                              <div className="item_name">{val.cit_name}</div>
                              <div className="item_price">
                                <NumberFormat
                                  value={val.cit_price_sale}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                />

                                <span className="rate_discount">
                                  &nbsp;&nbsp;{val.cit_price_sale_percent}%
                                </span>
                              </div>
                              <div className="item_price_before">
                                <NumberFormat
                                  value={val.cit_price}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                />
                              </div>
                            </div>
                          </a>
                        </li>
                      );
                    })
                  : "금주 신상품이 없습니다."}
              </ul>
              <div className="pd_gnb_bottom"></div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default StoreDetail;
