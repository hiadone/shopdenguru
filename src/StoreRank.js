import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSnackbar } from "notistack";
import NumberFormat from "react-number-format";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCookies } from "react-cookie";
import Header from "./Header";
import Footer from "./Footer";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

function StoreRank(props) {
  let [storeRankData, storeRankDataFunc] = useState(false);
  let [storeRankDataList, storeRankDataListFunc] = useState(false);
  let [popupWrapFlag, popupWrapFlagFunc] = useState(false);
  let [popupRankFilterFlag, popupRankFilterFunc] = useState(false);
  let [storeRankNextLink, storeRankNextLinkFunc] = useState(false);
  let [fetching, fetchingFunc] = useState(false); // 추가 데이터를 로드하는지 아닌지를 담기위한 state
  let [configPetKindListData, configPetKindListDataFunc] = useState(false);

  let [storeMyPetFlag, storeMyPetFlagFunc] = useState(false);
  let [petCkdIdData, petCkdIdDataFunc] = useState(0);
  let [checkedAttrs, checkedAttrsFunc] = useState(new Set());
  let [checkedAttrChangeFlag, checkedAttrChangeFlagFunc] = useState(false);
  let [initData, initDataFunc] = useState(null);

  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [cookie] = useCookies();

  const _rankMore = async () => {
    // 추가 데이터를 로드하는 상태로 전환
    fetchingFunc(true);

    // API로부터 받아온 페이징 데이터를 이용해 다음 데이터를 로드
    await axios.get(storeRankNextLink).then(res => {
      const fetchedData = res.data.data.rank.list; // 피드 데이터 부분
      // 기존 데이터 배열과 새로 받아온 데이터 배열을 합쳐 새 배열을 만들고 state에 저장한다.
      let mergedData = storeRankDataList.concat(...fetchedData);
      storeRankDataListFunc(mergedData);
      storeRankNextLinkFunc(res.data.data.rank.next_link);
    });
    // 추가 데이터 로드 끝
    fetchingFunc(false);
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

  const checkedAttrsHandler = (id, isChecked) => {
    if (isChecked) {
      checkedAttrs.add(id);
      checkedAttrsFunc(checkedAttrs);
      checkedAttrChangeFlagFunc(!checkedAttrChangeFlag);
    } else if (!isChecked && checkedAttrs.has(id)) {
      checkedAttrs.delete(id);
      checkedAttrsFunc(checkedAttrs);
      checkedAttrChangeFlagFunc(!checkedAttrChangeFlag);
    }
  };

  const checkHandler = (id, checked) => {
    checkedAttrsHandler(id, checked);
  };

  useEffect(() => {
    let inIt = {};
    axios({
      method: "get",
      url: "https://api.denguru.kr/cmall/storeranklist",
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        storeRankDataListFunc(res.data.data.rank.list);
        storeRankNextLinkFunc(res.data.data.rank.next_link);

        if (res.data.layout.member !== false) {
          storeMyPetFlagFunc(true);

          if (res.data.layout.member.pet_age < 1) {
            checkedAttrsHandler("17", true);
            inIt.age = "17";
          } else if (res.data.layout.member.pet_age < 7) {
            checkedAttrsHandler("18", true);
            inIt.age = "18";
          } else if (res.data.layout.member.pet_age > 6) {
            checkedAttrsHandler("19", true);
            inIt.age = "19";
          }

          checkedAttrsHandler(res.data.layout.member.pat_id, true);
          inIt.patId = res.data.layout.member.pat_id;

          petCkdIdDataFunc(res.data.layout.member.ckd_id);
          inIt.ckdId = res.data.layout.member.ckd_id;

          res.data.layout.member.pet_attr.map(val =>
            checkedAttrsHandler(val.pat_id, true)
          );
          inIt.petAttr = res.data.layout.member.pet_attr;

          initDataFunc(inIt);
          configPetKindListDataFunc(res.data.config.pet_kind);
        }

        storeRankDataFunc(res.data);
      })
      .catch(() => {
        console.log("실패햇어요");
      });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", checkScrollBottom);
    return () => {
      window.removeEventListener("scroll", checkScrollBottom);
    };
  });

  const handleonChange = (e, val) => {
    // the item selected
    console.log(val);
    if (val && val.ckd_id) petCkdIdDataFunc(val.ckd_id);
  };

  function _openPopup02(id) {
    popupWrapFlagFunc(true);

    var 타이머 = setTimeout(() => {
      popupRankFilterFunc(true);
      document.body.style.overflow = "hidden";
    }, 10);
    return () => {
      clearTimeout(타이머);
    };
  }
  function _closePopup02(i) {
    axios({
      method: "get",
      url: "https://api.denguru.kr/cmall/storeranklist",
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" },
      params: {
        skind: petCkdIdData,
        is_mypet_match: storeMyPetFlag,
        sattr: [...checkedAttrs]
      }
    })
      .then(res => {
        storeRankDataListFunc(res.data.data.rank.list);
        storeRankNextLinkFunc(res.data.data.rank.next_link);
        storeRankDataFunc(res.data);
      })
      .catch(error => {
        if (error.response) {
          // enqueueSnackbar(error.response.data.msg, { variant: "notice" });
          console.log(error.response.status);
        }
      });

    popupRankFilterFunc(false);
    var 타이머 = setTimeout(() => {
      popupWrapFlagFunc(false);

      document.body.style.overflow = "visible";
    }, 400);
    return () => {
      clearTimeout(타이머);
    };
  }

  return (
    <>
      {storeRankData === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : (
        <>
          <Header
            match={props.match}
            notificationNum={
              storeRankData.layout.notification_num
                ? storeRankData.layout.notification_num
                : 0
            }
          ></Header>
          <Footer match={props.match}></Footer>
          <div className="main">
            <div className="pd_header06"></div>
            <div className="tab_nav store_tab_nav">
              <h2 className="blind">스토어 서브메뉴</h2>
              <Link to={"/storerank"} className="tab_nav_link active">
                댕구루 랭킹
              </Link>
              <Link to={"/storebookmark"} className="tab_nav_link">
                즐겨찾기
              </Link>
            </div>
            <section className="store_list_hash">
              <h2 className="title_hash">
                #{storeRankData.data.theme.list.the_title}
              </h2>
              <div className="store_list_swipe_wrap ">
                <Swiper
                  className="store_list_swipe_container"
                  slidesPerView="auto"
                  spaceBetween={8}
                  freeMode={true}
                  onSlideChange={() => console.log("slide change")}
                >
                  {storeRankData.data.theme.list.brd_list.map((val, idx) => {
                    return (
                      <SwiperSlide className="store_box">
                        <Link to={"/storedetail/" + val.brd_id}>
                          <div className="thumb_box">
                            <img src={val.brd_image} alt="" className="img" />
                          </div>
                          <div className="store_name">{val.brd_name}</div>
                        </Link>
                      </SwiperSlide>
                    );
                  })}

                  <SwiperSlide
                    style={{ width: "8px", height: "1px" }}
                  ></SwiperSlide>
                </Swiper>
              </div>
            </section>

            <section className="store_list_rank">
              <h2 className="blind">댕구루 랭킹 리스트</h2>
              <div className="filter_bar_container">
                <div className="filter_bar_switch_box switch_box">
                  <span className="lab_switch">마이펫 맞춤</span>
                  <input
                    type="checkbox"
                    name="toggleCustom"
                    id="toggleCustom"
                    hidden
                    className="inp_blind"
                    checked={storeMyPetFlag && true}
                  />
                  <label
                    for="toggleCustom"
                    className="inp_switch"
                    onClick={() => storeMyPetFlagFunc(!storeMyPetFlag)}
                  >
                    <span className="circle_switch"></span>
                  </label>
                </div>
                <div className="filter_bar_filter_box">
                  <button className="btn btn_linkstyle" onClick={_openPopup02}>
                    <img
                      src="/assets/images/icon-filter.svg"
                      alt=""
                      className="icon"
                    />
                    필터
                  </button>
                </div>
              </div>

              <ul className="store_list">
                {storeRankDataList.map((val, idx) => {
                  return (
                    <li className="store_box">
                      <Link
                        to={"/storedetail/" + val.brd_id}
                        className="store_link"
                      >
                        <span className="store_rank">{idx + 1}</span>
                        <div className="thumb_box">
                          <img
                            src={val.brd_image}
                            alt="쇼핑몰로고"
                            className="img"
                          />
                        </div>
                        <div className="txt_box">
                          <div className="store_name">{val.brd_name}</div>
                          <div className="store_list_tag_box store_list_tag_box01">
                            {val.brd_attr.length > 0 &&
                              val.brd_attr.map((val2, idx2) => {
                                if (val2.cat_id)
                                  return (
                                    <span className="store_list_tag store_list_tag_size">
                                      {val2.cat_value},{" "}
                                    </span>
                                  );
                                else if (val2.cca_id)
                                  return (
                                    <span className="store_list_tag store_list_tag_category">
                                      {val2.cat_value},{" "}
                                    </span>
                                  );
                              })}
                          </div>
                          <div className="store_list_tag_box store_list_tag_box02">
                            <span className="store_list_tag store_list_tag_breed">
                              {val.brd_attr.length > 0 &&
                                val.brd_attr.map((val2, idx2) => {
                                  if (val2.ckd_id) {
                                    if (idx2 + 1 === val.brd_attr.length)
                                      return val2.cat_value;
                                    else return val2.cat_value + ", ";
                                  }
                                })}
                            </span>
                            들이 좋아해요
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
            <div
              className="pd_gnb_bottom"
              style={{ height: "32px", backgroundColor: "#fff" }}
            ></div>
          </div>
          <div
            className={
              popupWrapFlag === true ? "popup_wrap show" : "popup_wrap"
            }
          >
            <section
              className={
                popupRankFilterFlag === true
                  ? "popup_container03 show"
                  : "popup_container03"
              }
            >
              <div className="popup_head">
                <h2 className="popup_title">
                  필터
                  <img
                    src="/assets/images/icon-filter.svg"
                    alt="필터"
                    className="icon"
                  />
                </h2>
              </div>
              <div className="popup_body">
                <form id="storeForm" name="storeForm">
                  <div className="inp_box01">
                    <div className="lab_box">
                      <span className="lab">나이</span>
                    </div>
                    <div className="radio_container">
                      <span className="radio_box">
                        <input
                          type="checkbox"
                          name="sattr[]"
                          id="petAge01"
                          hidden
                          className="inp_radio"
                          value="17"
                          checked={checkedAttrs.has("17")}
                        />
                        <label
                          for="petAge01"
                          className="lab_radio"
                          onClick={() => {
                            checkHandler("17", false);
                            checkHandler("18", false);
                            checkHandler("19", false);
                            checkHandler("17", !checkedAttrs.has("17"));
                          }}
                        >
                          1살 이하
                        </label>
                      </span>
                      <span className="radio_box">
                        <input
                          type="checkbox"
                          name="sattr[]"
                          id="petAge02"
                          hidden
                          className="inp_radio"
                          value="18"
                          checked={checkedAttrs.has("18")}
                        />
                        <label
                          for="petAge02"
                          className="lab_radio"
                          onClick={() => {
                            checkHandler("17", false);
                            checkHandler("18", false);
                            checkHandler("19", false);
                            checkHandler("18", !checkedAttrs.has("18"));
                          }}
                        >
                          1살 ~ 6살
                        </label>
                      </span>
                      <span className="radio_box">
                        <input
                          type="checkbox"
                          name="sattr[]"
                          id="petAge03"
                          hidden
                          className="inp_radio"
                          value="19"
                          checked={checkedAttrs.has("19")}
                        />
                        <label
                          for="petAge03"
                          className="lab_radio"
                          onClick={() => {
                            checkHandler("17", false);
                            checkHandler("18", false);
                            checkHandler("19", false);
                            checkHandler("19", !checkedAttrs.has("19"));
                          }}
                        >
                          7살 이상
                        </label>
                      </span>
                    </div>
                  </div>
                  <div className="inp_box01">
                    <div className="lab_box">
                      <span className="lab">체형</span>
                    </div>
                    <div className="radio_container">
                      <span className="radio_box">
                        <input
                          type="checkbox"
                          name="sattr[]"
                          id="petBody01"
                          hidden
                          className="inp_radio"
                          value="14"
                          checked={checkedAttrs.has("14")}
                        />
                        <label
                          for="petBody01"
                          className="lab_radio"
                          onClick={() => {
                            checkHandler("14", false);
                            checkHandler("15", false);
                            checkHandler("16", false);
                            checkHandler("14", !checkedAttrs.has("14"));
                          }}
                        >
                          날씬해요
                        </label>
                      </span>
                      <span className="radio_box">
                        <input
                          type="checkbox"
                          name="sattr[]"
                          id="petBody02"
                          hidden
                          className="inp_radio"
                          value="15"
                          checked={checkedAttrs.has("15")}
                        />
                        <label
                          for="petBody02"
                          className="lab_radio"
                          onClick={() => {
                            checkHandler("14", false);
                            checkHandler("15", false);
                            checkHandler("16", false);
                            checkHandler("15", !checkedAttrs.has("15"));
                          }}
                        >
                          딱좋아요
                        </label>
                      </span>
                      <span className="radio_box">
                        <input
                          type="checkbox"
                          name="sattr[]"
                          id="petBody03"
                          hidden
                          className="inp_radio"
                          value="16"
                          checked={checkedAttrs.has("16")}
                        />
                        <label
                          for="petBody03"
                          className="lab_radio"
                          onClick={() => {
                            checkHandler("14", false);
                            checkHandler("15", false);
                            checkHandler("16", false);
                            checkHandler("16", !checkedAttrs.has("16"));
                          }}
                        >
                          통통해요
                        </label>
                      </span>
                    </div>
                  </div>
                  <div className="inp_box01">
                    <div className="lab_box">
                      <span className="lab">품종</span>
                    </div>
                    <Autocomplete
                      id="combo-box-demo"
                      autoHighlight={"true"}
                      options={configPetKindListData}
                      getOptionLabel={option => option.ckd_value_kr}
                      defaultValue={
                        storeRankData.layout.member.ckd_id > 0 &&
                        configPetKindListData.find(
                          val =>
                            val.ckd_id === storeRankData.layout.member.ckd_id
                        )
                      }
                      onChange={handleonChange}
                      style={{
                        width: "100%",

                        border: "1px solid #bdbdbd",
                        borderRadius: "5px",
                        boxSizing: "border-box",
                        fontSize: "16px",
                        color: "#141414"
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label="품종을 입력해 주세요"
                          variant="outlined"
                        />
                      )}
                    />
                  </div>
                  <div className="inp_box01">
                    <div className="lab_box">
                      <span className="lab">우리 아이 특징</span>
                    </div>
                    <table className="check_box_table">
                      <tbody>
                        <tr>
                          <td>
                            <input
                              type="checkbox"
                              name="sattr[]"
                              id="petFeature01"
                              className="inp_check_table"
                              hidden
                              value="4"
                              checked={checkedAttrs.has("4")}
                            />
                            <label
                              for="petFeature01"
                              className="lab_check_table"
                              onClick={e =>
                                checkHandler("4", !checkedAttrs.has("4"))
                              }
                            >
                              뼈/관절강화
                            </label>
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              name="sattr[]"
                              id="petFeature02"
                              className="inp_check_table"
                              hidden
                              value="5"
                              checked={checkedAttrs.has("5")}
                            />
                            <label
                              for="petFeature02"
                              className="lab_check_table"
                              onClick={e =>
                                checkHandler("5", !checkedAttrs.has("5"))
                              }
                            >
                              면역력강화
                            </label>
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              name="sattr[]"
                              id="petFeature03"
                              className="inp_check_table"
                              hidden
                              value="6"
                              checked={checkedAttrs.has("6")}
                            />
                            <label
                              for="petFeature03"
                              className="lab_check_table"
                              onClick={e =>
                                checkHandler("6", !checkedAttrs.has("6"))
                              }
                            >
                              다이어트
                            </label>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <input
                              type="checkbox"
                              name="sattr[]"
                              id="petFeature04"
                              className="inp_check_table"
                              hidden
                              value="7"
                              checked={checkedAttrs.has("7")}
                            />
                            <label
                              for="petFeature04"
                              className="lab_check_table"
                              onClick={e =>
                                checkHandler("7", !checkedAttrs.has("7"))
                              }
                            >
                              피부/털개선
                            </label>
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              name="sattr[]"
                              id="petFeature05"
                              className="inp_check_table"
                              hidden
                              value="8"
                              checked={checkedAttrs.has("8")}
                            />
                            <label
                              for="petFeature05"
                              className="lab_check_table"
                              onClick={e =>
                                checkHandler("8", !checkedAttrs.has("8"))
                              }
                            >
                              구강관리
                            </label>
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              name="sattr[]"
                              id="petFeature06"
                              className="inp_check_table"
                              hidden
                              value="9"
                              checked={checkedAttrs.has("9")}
                            />
                            <label
                              for="petFeature06"
                              className="lab_check_table"
                              onClick={e =>
                                checkHandler("9", !checkedAttrs.has("9"))
                              }
                            >
                              눈/귀 건강
                            </label>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <input
                              type="checkbox"
                              name="sattr[]"
                              id="petFeature07"
                              className="inp_check_table"
                              hidden
                              value="10"
                              checked={checkedAttrs.has("10")}
                            />
                            <label
                              for="petFeature07"
                              className="lab_check_table"
                              onClick={e =>
                                checkHandler("10", !checkedAttrs.has("10"))
                              }
                            >
                              냄새관리
                            </label>
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              name="sattr[]"
                              id="petFeature08"
                              className="inp_check_table"
                              hidden
                              value="11"
                              checked={checkedAttrs.has("11")}
                            />
                            <label
                              for="petFeature08"
                              className="lab_check_table"
                              onClick={e =>
                                checkHandler("11", !checkedAttrs.has("11"))
                              }
                            >
                              해충방지
                            </label>
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              name="sattr[]"
                              id="petFeature09"
                              className="inp_check_table"
                              hidden
                              value="12"
                              checked={checkedAttrs.has("12")}
                            />
                            <label
                              for="petFeature09"
                              className="lab_check_table"
                              onClick={e =>
                                checkHandler("12", !checkedAttrs.has("12"))
                              }
                            >
                              신장/요로/결석
                            </label>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <input
                              type="checkbox"
                              name="sattr[]"
                              id="petFeature10"
                              className="inp_check_table"
                              hidden
                              value="13"
                              checked={checkedAttrs.has("13")}
                            />
                            <label
                              for="petFeature10"
                              className="lab_check_table"
                              onClick={e =>
                                checkHandler("13", !checkedAttrs.has("13"))
                              }
                            >
                              임신/수유
                            </label>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </form>
              </div>
              <div className="popup_bottom btn_box">
                <button
                  type="button"
                  className="btn btn_linkstyle btn_reset"
                  onClick={() => {
                    petCkdIdDataFunc(initData.ckdId);
                    handleonChange(initData, initData);
                    initData.petAttr.map(val =>
                      checkedAttrsHandler(val.pat_id, true)
                    );
                  }}
                >
                  <img
                    src="/assets/images/icon-refresh-gray.svg"
                    alt="refresh"
                    className="icon"
                  />{" "}
                  초기화
                </button>
                <button
                  type="button"
                  className="btn btn_accent btn_submit"
                  onClick={_closePopup02}
                >
                  완 료
                </button>
              </div>
            </section>
          </div>
        </>
      )}
    </>
  );
}

export default StoreRank;
