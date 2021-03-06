import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useHistory, useParams, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";

import { useSnackbar } from "notistack";
import NumberFormat from "react-number-format";
import qs from "qs";
import Footer from "./Footer";
const useStyles = makeStyles(theme => ({
  root: {
    width: "80%",
    margin: "0px auto"
  },
  margin: {
    height: theme.spacing(3)
  }
}));

const PrettoSlider = withStyles({
  root: {
    color: "#52af77",
    height: 8
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit"
    }
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)"
  },
  track: {
    height: 8,
    borderRadius: 4
  },
  rail: {
    height: 8,
    borderRadius: 4
  }
})(Slider);

function Search(props) {
  let { ccaId } = useParams();
  let [searchData, searchDataFunc] = useState(false);
  let [searchConfigData, searchConfigDataFunc] = useState(false);
  let [searchDataList, searchDataListFunc] = useState(false);
  let [popover01Flag, popover01FlagFunc] = useState(false);
  let [popupWrapFlag, popupWrapFlagFunc] = useState(false);
  let [popupSearchFilterFlag, popupSearchFilterFlagFunc] = useState(false);
  let [popupSearchFilterData, popupSearchFilterDataFunc] = useState(false);
  let [searchNextLink, searchNextLinkFunc] = useState(false);

  let [totalRows, totalRowsFunc] = useState(false);
  let [searchRows, searchRowsFunc] = useState(false);
  let [searchUrl, searchUrlFunc] = useState(
    "https://api.denguru.kr/search/show_list"
  );
  let [searchPriceUrl, searchPriceUrlFunc] = useState(
    "https://api.denguru.kr/search/price"
  );
  let [searchSizeUrl, searchSizeUrlFunc] = useState(
    "https://api.denguru.kr/search/size"
  );
  let [searchColorUrl, searchColorUrlFunc] = useState(
    "https://api.denguru.kr/search/color"
  );
  let [searchAgeUrl, searchAgeUrlFunc] = useState(
    "https://api.denguru.kr/search/age"
  );
  let [searchCategoryUrl, searchCategoryUrlFunc] = useState(
    "https://api.denguru.kr/search/category"
  );

  let [keyword, keywordFunc] = useState("");
  let [checkedAttrs, checkedAttrsFunc] = useState(new Set());
  let [checkedCategory, checkedCategoryFunc] = useState(new Set());
  let [checkedAge, checkedAgeFunc] = useState(new Set());

  let [startPrice, startPriceFunc] = useState(0);
  let [endPrice, endPriceFunc] = useState(0);
  let [fetching, fetchingFunc] = useState(false); // ?????? ???????????? ??????????????? ???????????? ???????????? state
  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [cookie] = useCookies();
  const classes = useStyles();

  let categoryList = Array(
    "??????",
    "",
    "",
    "",
    "",
    "",
    "??????",
    "??????",
    "??????????????",
    "??????",
    "???????????",
    "?????????????????",
    "??????????????????????????????",
    "??????"
  );

  let [?????????, ???????????????] = useState(false);
  let [?????????, ???????????????] = useState(false);

  const checkedAttrsHandler = (id, isChecked) => {
    if (isChecked) {
      checkedAttrs.add(id);
      checkedAttrsFunc(checkedAttrs);
    } else if (!isChecked && checkedAttrs.has(id)) {
      checkedAttrs.delete(id);
      checkedAttrsFunc(checkedAttrs);
    }
  };

  const checkAttrsHandler = (id, checked) => {
    checkedAttrsHandler(id, checked);
  };

  const checkedCategoryHandler = (id, isChecked) => {
    if (isChecked) {
      checkedCategory.add(id);
      checkedCategoryFunc(checkedCategory);
    } else if (!isChecked && checkedCategory.has(id)) {
      checkedCategory.delete(id);
      checkedCategoryFunc(checkedCategory);
    }
  };

  const checkCategoryHandler = (id, checked) => {
    checkedCategoryHandler(id, checked);
  };

  const _inpSearchFunc = inpSearch => {
    let keywordLatest_ = Array();
    let keywordLatest = JSON.parse(localStorage.getItem("keywordLatest"));

    if (inpSearch) {
      if (keywordLatest) {
        keywordLatest_ = [...new Set([inpSearch, ...keywordLatest])];
      } else {
        keywordLatest_.push(inpSearch);
      }

      localStorage.setItem("keywordLatest", JSON.stringify(keywordLatest_));

      let url = "";

      url = "https://api.denguru.kr/search/show_list";

      const frm = {};
      frm.skeyword = inpSearch;

      if (ccaId) {
        if (frm.scategory) frm.scategory = [...frm.scategory, ccaId];
        else frm.scategory = [ccaId];
      }

      axios({
        method: "get",
        url: url,
        headers: {
          Authorization: cookie.accessToken ? cookie.accessToken : ""
        },
        params: frm
      })
        .then(res => {
          keywordFunc(inpSearch);
          checkedAttrsFunc(new Set());
          checkedCategoryFunc(new Set());
          checkedAgeFunc(new Set());
          startPriceFunc(0);
          endPriceFunc(0);

          totalRowsFunc(res.data.data.total_rows);
          searchRowsFunc(res.data.data.total_rows);
          searchDataListFunc(res.data.data.list);
          searchNextLinkFunc(res.data.next_link);
          searchDataFunc(res.data);
        })
        .catch(error => {
          if (error.response) {
            console.log(error.response.status);
          }
          console.log("?????? ?????????");
        });
    }
  };

  const _clickTabChange = searchType => {
    searchConfigDataFunc(false);

    let url = searchUrl;
    if (searchType === "price") url = searchPriceUrl;
    if (searchType === "size") url = searchSizeUrl;
    if (searchType === "color") url = searchColorUrl;
    if (searchType === "age") url = searchAgeUrl;
    if (searchType === "category") url = searchCategoryUrl;

    const frm = {};

    if (keyword) frm.skeyword = keyword;

    if (checkedAttrs && searchType !== "size") {
      const checkedAttrs_ = new Set([...checkedAttrs]);
      frm.sattr = [...checkedAttrs_];
    }

    if (checkedAttrs && searchType === "size") {
      const checkedAttrs_ = new Set([...checkedAttrs]);
      checkedAttrs_.delete("4");
      checkedAttrs_.delete("5");
      checkedAttrs_.delete("6");
      frm.sattr = [...checkedAttrs_];
    }

    if (checkedAttrs && searchType !== "age") {
      const checkedAttrs_ = new Set([...checkedAttrs]);
      frm.sattr = [...checkedAttrs_];
    }

    if (checkedAttrs && searchType === "age") {
      const checkedAttrs_ = new Set([...checkedAttrs]);
      checkedAttrs_.delete("12");
      checkedAttrs_.delete("13");
      checkedAttrs_.delete("14");
      frm.sattr = [...checkedAttrs_];
    }

    if (checkedCategory && searchType !== "category") {
      const checkedCategory_ = new Set([...checkedCategory]);

      frm.scategory = [...checkedCategory_];
    }

    if (checkedCategory && searchType === "category") {
      frm.scategory = new Set();
    }

    if (startPrice) frm.sstart_price = startPrice;
    if (endPrice) frm.send_price = endPrice;

    if (ccaId) {
      if (frm.scategory) frm.scategory = [...frm.scategory, ccaId];
      else frm.scategory = [ccaId];
    }

    // if (clickTab === "price") {
    //   url = searchData.search_price_url;
    // }

    // if (clickTab === "size") {
    //   url = searchData.search_size_url;
    // }

    axios({
      method: "get",
      url: url,
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" },
      params: frm
    })
      .then(res => {
        console.log(res.data);

        // searchRowsFunc(res.data.data.total_rows);
        searchConfigDataFunc(res.data);
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response.status);
        }
        console.log("?????? ?????????");
      });
  };

  const _clickSearchChange = searchUrl => {
    searchConfigDataFunc(false);
    let url = searchUrl;

    const frm = {};

    if (keyword) frm.skeyword = keyword;
    if (checkedAttrs) frm.sattr = [...checkedAttrs];
    if (checkedCategory) frm.scategory = [...checkedCategory];
    if (checkedAge) frm.sage = [...checkedAge];
    if (startPrice) frm.sstart_price = startPrice;
    if (endPrice) frm.send_price = endPrice;

    if (ccaId) {
      if (frm.scategory) frm.scategory = [...frm.scategory, ccaId];
      else frm.scategory = [ccaId];
    }

    axios({
      method: "get",
      url: url,
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" },
      params: frm
    })
      .then(res => {
        let searchConfigData_ = { ...searchConfigData };

        searchRowsFunc(res.data.data.total_rows);
        searchConfigDataFunc(searchConfigData_);
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response.status);
        }
        console.log("?????? ?????????");
      });
  };

  const _rankMore = async () => {
    // ?????? ???????????? ???????????? ????????? ??????
    fetchingFunc(true);

    // API????????? ????????? ????????? ???????????? ????????? ?????? ???????????? ??????
    await axios.get(searchNextLink).then(res => {
      const fetchedData = res.data.data.list; // ?????? ????????? ??????
      // ?????? ????????? ????????? ?????? ????????? ????????? ????????? ?????? ??? ????????? ????????? state??? ????????????.
      let mergedData = searchDataList.concat(...fetchedData);
      searchDataListFunc(mergedData);
      searchNextLinkFunc(res.data.next_link);
      if (res.data.next_link) fetchingFunc(false);
    });

    // ?????? ????????? ?????? ???
  };

  let checkScrollBottom = () => {
    let scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    let scrollTop = Math.max(
      document.documentElement.scrollTop,
      document.body.scrollTop
    );
    let clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight + 300 >= scrollHeight && fetching === false) {
      _rankMore();
    }
  };

  useEffect(() => {
    let url = "";
    const frm = {};
    url = "https://api.denguru.kr/search/show_list";

    if (props.location.search) {
      if (
        qs.parse(props.location.search, {
          ignoreQueryPrefix: true
        }).skeyword
      ) {
        keywordFunc(
          qs.parse(props.location.search, {
            ignoreQueryPrefix: true
          }).skeyword
        );
        frm.skeyword = qs.parse(props.location.search, {
          ignoreQueryPrefix: true
        }).skeyword;
      }
    }

    _getShowList(url, frm);
  }, []);

  const _getShowList = (searchUrl, frm = {}) => {
    let url = "";
    if (searchUrl) url = searchUrl;
    else url = "https://api.denguru.kr/search/show_list";

    if (ccaId) {
      if (frm.scategory) frm.scategory = [...frm.scategory, ccaId];
      else frm.scategory = [ccaId];
    }

    axios({
      method: "get",
      url: url,
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" },
      params: frm
    })
      .then(res => {
        totalRowsFunc(res.data.data.total_rows);
        searchRowsFunc(res.data.data.total_rows);
        searchDataListFunc(res.data.data.list);
        searchNextLinkFunc(res.data.next_link);
        searchDataFunc(res.data);
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response.status);
        }
        console.log("?????? ?????????");
      });
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollBottom);
    return () => {
      window.removeEventListener("scroll", checkScrollBottom);
    };
  });

  function _openPopup02(id) {
    popupWrapFlagFunc(true);
    document.getElementById("popupWrap").addEventListener("click", e => {
      var isClickInside = document
        .getElementById("popupFilterContainer")
        .contains(e.target);
      if (!isClickInside) {
        _closePopup02();
      }
    });

    var ????????? = setTimeout(() => {
      popupSearchFilterFlagFunc(true);
      document.body.style.overflow = "hidden";
    }, 10);
    return () => {
      clearTimeout(?????????);
    };
  }
  function _closePopup02(id) {
    popupSearchFilterFlagFunc(false);

    document.getElementById("popupWrap").removeEventListener("click", e => {
      var isClickInside = document
        .getElementById("popupFilterContainer")
        .contains(e.target);
      if (!isClickInside) {
        _closePopup02();
      }
    });
    var ????????? = setTimeout(() => {
      popupWrapFlagFunc(false);
      document.body.style.overflow = "visible";
    }, 10);
    return () => {
      clearTimeout(?????????);
    };
  }

  return (
    <>
      {searchData === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : (
        <>
          <header className="header02">
            <h1 className="h_title"></h1>
            <Link
              onClick={() => {
                history.goBack();
              }}
              className="btn_goback h_btn_icon"
            >
              <img
                src="/assets/images/icon-goback.svg"
                alt="????????????"
                className="icon"
              />
            </Link>
            <div className="h_search_box">
              <div className="form_box">
                <label for="inpSearch" className="lab_search">
                  <img
                    src="/assets/images/icon-search.svg"
                    alt="??????"
                    className="icon_search"
                  />
                </label>
                &nbsp;{categoryList[ccaId]}
                <input
                  type="search"
                  name="inpSearch"
                  className="inp_search"
                  id="inpSearch"
                  value={keyword}
                  onChange={e => keywordFunc(e.target.value)}
                  onKeyPress={e => {
                    if (e.key === "Enter") {
                      _inpSearchFunc(e.target.value);
                    }
                  }}
                />
                <span className="search_result">
                  {" "}
                  <NumberFormat
                    value={totalRows}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                  ???
                </span>
                <button
                  type="button"
                  className="btn_del btn_linkstyle blind"
                  id="btnDel"
                >
                  <img
                    src="/assets/images/icon-del.svg"
                    alt="??????"
                    className="icon"
                  />
                </button>
              </div>
            </div>
          </header>
          <Footer match={props.match}></Footer>
          <div className="main">
            <section className="sect03 sect_filter_cate mt_head02">
              <h2 className="blind">????????????</h2>
              <Swiper
                className="btn_box"
                slidesPerView="auto"
                spaceBetween="10"
                freeMode={true}
                onSlideChange={() => console.log("slide change")}
              >
                <SwiperSlide className="filter_btn ">
                  <button
                    type="button"
                    onClick={() => {
                      _openPopup02();
                      _clickTabChange("price");
                      ???????????????("price");
                    }}
                    className="btn_filter_popup btn btn_main_line btn_mid btn_mid_round"
                    on
                  >
                    ??????
                  </button>
                </SwiperSlide>
                <SwiperSlide className="filter_btn ">
                  <button
                    type="button"
                    onClick={() => {
                      _openPopup02();
                      _clickTabChange("size");
                      ???????????????("size");
                    }}
                    className="btn_filter_popup btn btn_main_line btn_mid btn_mid_round"
                  >
                    ?????????
                  </button>
                </SwiperSlide>
                {ccaId == "6" && (
                  <SwiperSlide className="filter_btn ">
                    <button
                      type="button"
                      onClick={() => {
                        _openPopup02();
                        _clickTabChange("color");
                        ???????????????("color");
                      }}
                      className="btn_filter_popup btn btn_main_line btn_mid btn_mid_round"
                    >
                      ??????
                    </button>
                  </SwiperSlide>
                )}
                <SwiperSlide className="filter_btn ">
                  <button
                    type="button"
                    onClick={() => {
                      _openPopup02();
                      _clickTabChange("age");
                      ???????????????("age");
                    }}
                    className="btn_filter_popup btn btn_main_line btn_mid btn_mid_round"
                  >
                    ??????
                  </button>
                </SwiperSlide>
                <SwiperSlide className="filter_btn ">
                  <button
                    type="button"
                    onClick={() => {
                      _openPopup02();
                      _clickTabChange("category");
                      ???????????????("category");
                    }}
                    className="btn_filter_popup btn btn_main_line btn_mid btn_mid_round"
                  >
                    ????????????
                  </button>
                </SwiperSlide>
              </Swiper>
            </section>

            <section className="search_result_container sect04">
              <div className="search_result_top_bar">
                <div className="filter_info">
                  <img
                    src="/assets/images/icon-filter.svg"
                    alt="??????"
                    className="icon"
                  />
                  &nbsp;
                  {searchData.data.member.pet_kind}
                  ,&nbsp;
                  {searchData.data.member.ckd_size_str}
                  ,&nbsp;
                  {searchData.data.member.pet_sex === "2"
                    ? "??????"
                    : searchData.data.member.pet_sex === "1"
                    ? "??????"
                    : ""}
                  ,&nbsp;
                  {searchData.data.member.pet_age < 1
                    ? "??????"
                    : searchData.data.member.pet_age < 6
                    ? "?????????"
                    : searchData.data.member.pet_age > 7 && "?????????"}
                </div>
                <div className="select_sort_box">
                  <select
                    name="ssort"
                    id="sort"
                    className="select_sort"
                    onChange={e => {
                      let url = "";
                      url = searchData.search_url;
                      // if (
                      //   props.location.state &&
                      //   props.location.state.searchUrl
                      // )
                      //   url = props.location.state.searchUrl;
                      // else
                      //   url =
                      //     "https://api.denguru.kr/search/show_list/" +
                      //     props.location.search;

                      axios({
                        method: "get",
                        url: url + "&ssort=" + e.target.value,
                        headers: {
                          Authorization: cookie.accessToken
                            ? cookie.accessToken
                            : ""
                        }
                      })
                        .then(res => {
                          searchDataListFunc(res.data.data.list);
                          searchNextLinkFunc(res.data.next_link);
                          searchDataFunc(res.data);
                        })
                        .catch(error => {
                          if (error.response) {
                            console.log(error.response.status);
                          }
                          console.log("?????? ?????????");
                        });
                    }}
                  >
                    <option value="cit_hit">?????????</option>
                    <option value="cit_datetime">????????????</option>
                    <option value="low_price">?????????</option>
                    <option value="high_price">?????????</option>
                  </select>
                </div>
              </div>
              <div className="search_result_items">
                <div className="items_wrap">
                  <ul className="item_list03">
                    {searchDataList.map((val, idx) => {
                      return (
                        <li className="item_box">
                          <a href="home_item_info.html">
                            <div className="item_thum">
                              <img
                                src={val.cit_image}
                                alt="???????????????"
                                className="img"
                              />
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
                    })}
                  </ul>
                </div>
              </div>
            </section>
            <div
              className="pd_gnb_bottom"
              style={{ backgroundColor: "#fff" }}
            ></div>
          </div>
          <div
            className={
              popupWrapFlag === true ? "popup_wrap show" : "popup_wrap"
            }
            id="popupWrap"
          >
            <form id="myForm" name="myForm">
              <input type="hidden" name="skeyword" value={keyword} />
              <div
                className={
                  popupSearchFilterFlag === true
                    ? "popup_filter_container show"
                    : "popup_filter_container"
                }
                id="popupFilterContainer"
              >
                <h2 className="blind">????????????</h2>

                <>
                  <input type="hidden" name="sstart_price" value={startPrice} />
                  <input type="hidden" name="send_price" value={endPrice} />
                  <div className="popup_top_bar" role="tablist">
                    <button
                      className={
                        ????????? === "price"
                          ? "btn_tab btn_tab01 btn_linkstyle active"
                          : "btn_tab btn_tab01 btn_linkstyle"
                      }
                      type="button"
                      onClick={e => {
                        _clickTabChange("price");
                        ???????????????("price");
                      }}
                    >
                      ??????
                    </button>
                    <button
                      className={
                        ????????? === "size"
                          ? "btn_tab btn_tab02 btn_linkstyle active"
                          : "btn_tab btn_tab02 btn_linkstyle"
                      }
                      type="button"
                      onClick={e => {
                        _clickTabChange("size");
                        ???????????????("size");
                      }}
                    >
                      ?????????
                    </button>
                    {ccaId == "6" && (
                      <button
                        className={
                          ????????? === "color"
                            ? "btn_tab btn_tab02 btn_linkstyle active"
                            : "btn_tab btn_tab02 btn_linkstyle"
                        }
                        type="button"
                        onClick={e => {
                          _clickTabChange("color");
                          ???????????????("color");
                        }}
                      >
                        ??????
                      </button>
                    )}
                    <button
                      className={
                        ????????? === "age"
                          ? "btn_tab btn_tab02 btn_linkstyle active"
                          : "btn_tab btn_tab02 btn_linkstyle"
                      }
                      type="button"
                      onClick={e => {
                        _clickTabChange("age");
                        ???????????????("age");
                      }}
                    >
                      ??????
                    </button>
                    <button
                      className={
                        ????????? === "category"
                          ? "btn_tab btn_tab02 btn_linkstyle active"
                          : "btn_tab btn_tab02 btn_linkstyle"
                      }
                      type="button"
                      onClick={e => {
                        _clickTabChange("category");
                        ???????????????("category");
                      }}
                    >
                      ????????????
                    </button>
                  </div>
                  <div className="popup_main">
                    {searchConfigData === false ? (
                      <CircularProgress
                        style={{
                          position: "absolute",
                          left: "48%",
                          top: "50%"
                        }}
                      />
                    ) : (
                      <>
                        {????????? === "price" && (
                          <div className="tab_panel filter_price_container show">
                            <h3 className="blind">??????</h3>
                            <div className="top_box">
                              <div className="btn_filter_info_box popover_container">
                                <button
                                  type="button"
                                  className="btn_filter_info btn_linkstyle"
                                >
                                  <img
                                    src="/assets/images/icon-info.svg"
                                    alt="??????"
                                    className="icon"
                                    onClick={() =>
                                      popover01FlagFunc(!popover01Flag)
                                    }
                                  />
                                </button>
                                <div
                                  className={
                                    popover01Flag === false
                                      ? "popover popover_main popover_right_top popover_filter_info"
                                      : "popover popover_main popover_right_top popover_filter_info show"
                                  }
                                  id="popover01"
                                >
                                  ???????????? ????????? ???????????? ?????? ???????????? ?????????
                                  ????????? ??? ?????????.
                                </div>
                              </div>
                            </div>
                            <div className={classes.root}>
                              <Typography gutterBottom>?????? ??????</Typography>
                              <PrettoSlider
                                // valueLabelDisplay="auto"
                                aria-label="pretto slider"
                                max="300000"
                                step="1000"
                                defaultValue={[
                                  startPrice ? startPrice : 0,
                                  endPrice ? endPrice : 300000
                                ]}
                                onChange={(e, v) => {
                                  startPriceFunc(v[0]);
                                  endPriceFunc(v[1]);
                                }}
                              />
                            </div>

                            <div className="price_range_txt">
                              <span className="price price_row">
                                <NumberFormat
                                  value={startPrice ? startPrice : 0}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                />
                              </span>
                              ~
                              <span className="price price_high">
                                <NumberFormat
                                  value={endPrice ? endPrice : 300000}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                />
                              </span>
                            </div>
                          </div>
                        )}

                        {????????? === "size" && (
                          <div
                            id="size"
                            className="filter_cate_container tab_panel show"
                          >
                            <div
                              className="filter_cate_box show"
                              id="filterCateSizeBig"
                            >
                              {/* <div className="filter_cate_header">
                              ??????{" "}
                              <span className="filter_item_num">
                                <NumberFormat
                                  value={searchData.data.total_rows}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                />
                              </span>
                            </div> */}
                              <ul className="filter_cate_small_box">
                                {searchConfigData.config.cmall_size.map(val => (
                                  <li className="filter_cate_small">
                                    <input
                                      type="checkbox"
                                      name="sattr[]"
                                      value={val.cat_id}
                                      id={val.cat_id}
                                      class="inp_blind"
                                      hidden
                                      onChange={() => {
                                        _clickSearchChange(searchSizeUrl);
                                      }}
                                      checked={checkedAttrs.has(val.cat_id)}
                                    />
                                    <label
                                      for={val.cat_id}
                                      class="lab_checkbox"
                                      onClick={e =>
                                        checkAttrsHandler(
                                          val.cat_id,
                                          !checkedAttrs.has(val.cat_id)
                                        )
                                      }
                                    >
                                      {val.cat_value}{" "}
                                      <span class="filter_item_num">
                                        <NumberFormat
                                          value={val.rownum}
                                          displayType={"text"}
                                          thousandSeparator={true}
                                        />
                                      </span>
                                    </label>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {????????? === "color" && (
                          <div id="color" className="filter_price_container">
                            <div className="filter_cate_box show">
                              <div className="filter_cate_header">
                                ??????{" "}
                                <span className="filter_item_num">6,234</span>
                              </div>
                              <ul className="filter_cate_color_box">
                                <li className="filter_color_box">
                                  <input
                                    type="checkbox"
                                    name="filterColor"
                                    id="filterColor01"
                                    className="inp_blind"
                                    hidden
                                  />
                                  <label
                                    for="filterColor01"
                                    className="lab_checkbox"
                                  >
                                    <span
                                      className="color_box"
                                      style={{ backgroundColor: "#000" }}
                                    ></span>
                                    <span className="color_name">??????</span>
                                    <span className="filter_item_num">134</span>
                                  </label>
                                </li>

                                <li className="filter_color_box">
                                  <input
                                    type="checkbox"
                                    name="filterColor"
                                    id="filterColor22"
                                    className="inp_blind"
                                    hidden
                                  />
                                  <label
                                    for="filterColor22"
                                    className="lab_checkbox"
                                  >
                                    <span
                                      className="color_box color_box02"
                                      style={{
                                        backgroundImage:
                                          "url(/assets/images/color-etc.png)"
                                      }}
                                    ></span>
                                    <span className="color_name">????????????</span>
                                    <span className="filter_item_num">500</span>
                                  </label>
                                </li>
                              </ul>
                            </div>
                          </div>
                        )}

                        {????????? === "age" && (
                          <div
                            id="age"
                            className="filter_cate_container tab_panel show"
                          >
                            <div
                              className="filter_cate_box show"
                              id="filterCateSizeBig"
                            >
                              {/* <div className="filter_cate_header">
                                ??????{" "}
                                <span className="filter_item_num">
                                  <NumberFormat
                                    value={searchData.data.total_rows}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                  />
                                </span>
                              </div> */}
                              <ul className="filter_cate_small_box">
                                {searchConfigData.config.cmall_age.map(val => (
                                  <li className="filter_cate_small">
                                    <input
                                      type="checkbox"
                                      name="sattr[]"
                                      value={val.cat_id}
                                      id={val.cat_id}
                                      class="inp_blind"
                                      hidden
                                      onChange={() => {
                                        _clickSearchChange(searchAgeUrl);
                                      }}
                                      checked={checkedAttrs.has(val.cat_id)}
                                    />
                                    <label
                                      for={val.cat_id}
                                      class="lab_checkbox"
                                      onClick={e =>
                                        checkAttrsHandler(
                                          val.cat_id,
                                          !checkedAttrs.has(val.cat_id)
                                        )
                                      }
                                    >
                                      {val.cat_id === "12" && "??????(1??? ??????)"}
                                      {val.cat_id === "13" &&
                                        "?????????(1??? ?????? ~ 7??? ??????)"}
                                      {val.cat_id === "14" &&
                                        "?????????(7??? ??????)"}

                                      <span class="filter_item_num">
                                        <NumberFormat
                                          value={val.rownum}
                                          displayType={"text"}
                                          thousandSeparator={true}
                                        />
                                      </span>
                                    </label>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {????????? === "category" && (
                          <div
                            id="category"
                            className="filter_cate_container tab_panel show"
                          >
                            <div
                              className="filter_cate_box show"
                              id="filterCateSizeBig"
                            >
                              {/* <div className="filter_cate_header">
                              ??????{" "}
                              <span className="filter_item_num">
                                <NumberFormat
                                  value={searchData.data.total_rows}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                />
                              </span>
                            </div> */}
                              <ul className="filter_cate_small_box">
                                {searchConfigData.config.cmall_category.map(
                                  val => {
                                    if (ccaId) {
                                      if (val.cca_id == ccaId) {
                                        return val.cca_child.map(val_ => (
                                          <li className="filter_cate_small">
                                            <input
                                              type="checkbox"
                                              name="scategory[]"
                                              value={val_.cca_id}
                                              id={val_.cca_id}
                                              class="inp_blind"
                                              hidden
                                              onChange={() => {
                                                _clickSearchChange(
                                                  searchCategoryUrl
                                                );
                                              }}
                                              checked={checkedCategory.has(
                                                val_.cca_id
                                              )}
                                            />
                                            <label
                                              for={val_.cca_id}
                                              class="lab_checkbox"
                                              onClick={e =>
                                                checkCategoryHandler(
                                                  val_.cca_id,
                                                  !checkedCategory.has(
                                                    val_.cca_id
                                                  )
                                                )
                                              }
                                            >
                                              {val_.cca_value}

                                              <span class="filter_item_num">
                                                <NumberFormat
                                                  value={val_.rownum}
                                                  displayType={"text"}
                                                  thousandSeparator={true}
                                                />
                                              </span>
                                            </label>
                                          </li>
                                        ));
                                      }
                                    } else {
                                      return (
                                        <li className="filter_cate_small">
                                          <input
                                            type="checkbox"
                                            name="scategory[]"
                                            value={val.cca_id}
                                            id={val.cca_id}
                                            class="inp_blind"
                                            hidden
                                            onChange={() => {
                                              _clickSearchChange(
                                                searchCategoryUrl
                                              );
                                            }}
                                            checked={checkedCategory.has(
                                              val.cca_id
                                            )}
                                          />
                                          <label
                                            for={val.cca_id}
                                            class="lab_checkbox"
                                            onClick={e =>
                                              checkCategoryHandler(
                                                val.cca_id,
                                                !checkedCategory.has(val.cca_id)
                                              )
                                            }
                                          >
                                            {val.cca_value}

                                            <span class="filter_item_num">
                                              <NumberFormat
                                                value={val.rownum}
                                                displayType={"text"}
                                                thousandSeparator={true}
                                              />
                                            </span>
                                          </label>
                                        </li>
                                      );
                                    }
                                  }
                                )}
                              </ul>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div className="popup_bottom">
                    {????????? === "price" ? (
                      <>
                        <button className="btn btn_linkstyle btn_refresh">
                          {/* <img
                              src="/assets/images/icon-refresh-gray.svg"
                              alt="refresh"
                              className="icon"
                            />{" "}
                            <span className="filter-cate-js"></span> ????????? */}
                        </button>
                        <button
                          type="button"
                          className="btn btn_accent btn_half"
                          id="btnShowItem"
                          onClick={() => {
                            const frm = {};

                            if (keyword) frm.skeyword = keyword;
                            if (checkedAttrs) frm.sattr = [...checkedAttrs];
                            if (checkedCategory)
                              frm.scategory = [...checkedCategory];
                            if (checkedAge) frm.sage = [...checkedAge];
                            if (startPrice) frm.sstart_price = startPrice;
                            if (endPrice) frm.send_price = endPrice;
                            _getShowList(searchUrl, frm);

                            _closePopup02();
                          }}
                        >
                          ???????????? ????????????
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn_linkstyle btn_refresh">
                          {/* <img
                              src="/assets/images/icon-refresh-gray.svg"
                              alt="refresh"
                              className="icon"
                            />{" "}
                            <span className="filter-cate-js"></span> ????????? */}
                        </button>
                        <button
                          type="button"
                          className="btn btn_accent btn_half"
                          id="btnShowItem"
                          onClick={() => {
                            const frm = {};

                            if (keyword) frm.skeyword = keyword;
                            if (checkedAttrs) frm.sattr = [...checkedAttrs];
                            if (checkedCategory)
                              frm.scategory = [...checkedCategory];
                            if (checkedAge) frm.sage = [...checkedAge];
                            if (startPrice) frm.sstart_price = startPrice;
                            if (endPrice) frm.send_price = endPrice;
                            _getShowList(searchUrl, frm);

                            _closePopup02();
                          }}
                        >
                          <NumberFormat
                            value={
                              searchConfigData && searchRows ? searchRows : 0
                            }
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                          ??? ????????????
                        </button>
                      </>
                    )}
                  </div>
                </>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}

export default Search;
