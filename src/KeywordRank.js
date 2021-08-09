import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import NumberFormat from "react-number-format";

function KeywordRank(props) {
  let [keywordRankData, keywordRankDataFunc] = useState(false);
  let history = useHistory();

  let keywordLatest_ = Array();
  let keywordLatest = localStorage.getItem("keywordLatest")
    ? JSON.parse(localStorage.getItem("keywordLatest"))
    : "";

  const [cookie] = useCookies();

  console.log(keywordLatest);
  const _inpSearchFunc = inpSearch => {
    if (inpSearch) {
      if (keywordLatest) {
        keywordLatest_ = [...new Set([inpSearch, ...keywordLatest])];
      } else {
        keywordLatest_.push(inpSearch);
      }

      localStorage.setItem("keywordLatest", JSON.stringify(keywordLatest_));

      history.push("search?skeyword=" + inpSearch);
    }
  };

  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.denguru.kr/cmall/getsearchkeywordrank",
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        keywordRankDataFunc(res.data);
        console.log(res.data);
      })
      .catch(() => {
        console.log("실패햇어요");
      });
  }, []);

  return (
    <>
      {keywordRankData === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : (
        <>
          <header className="header02">
            <h1 className="blind">댕구루 검색페이지</h1>
            <Link
              onClick={() => {
                history.goBack();
              }}
              className="btn_goback"
            >
              <img
                src="/assets/images/icon-goback.svg"
                alt="이전페이지"
                className="icon"
              />
            </Link>
            <div className="h_search_box">
              <div className="form_box">
                <label for="inpSearch" className="lab_search">
                  <img
                    src="/assets/images/icon-search.svg"
                    alt="검색"
                    className="icon_search"
                  />
                </label>
                <input
                  type="search"
                  name="inpSearch"
                  className="inp_search"
                  id="inpSearch"
                  onKeyPress={e => {
                    if (e.key === "Enter") {
                      _inpSearchFunc(e.target.value);
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn_del btn_linkstyle blind"
                  id="btnDel"
                >
                  <img
                    src="/assets/images/icon-del.svg"
                    alt="취소"
                    className="icon"
                  />
                </button>
              </div>
            </div>
          </header>
          <div className="main">
            <div className="mt_head02"></div>
            {keywordLatest && keywordLatest.length > 0 && (
              <section className="search_word_container search_word_container01 ">
                <div className="title_box">
                  <h2 className="title_search">
                    <span className="emph">최근</span>검색어
                  </h2>
                  <button
                    type="button"
                    className="btn_del btn_linkstyle"
                    id="btnDelRecent"
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                  >
                    지우기
                  </button>
                </div>
                <div className="swiper-container">
                  <ul className="search_word_list swiper-wrapper">
                    {keywordLatest.map(val => {
                      return (
                        <li className="search_word swiper-slide search_word_recent">
                          <Link
                            className="btn btn_main_line btn_mid btn_mid_round"
                            to={{
                              pathname: "/search",
                              state: {
                                searchUrl:
                                  "https://api.denguru.kr/search/show_list?skeyword=" +
                                  val,
                                sKeyWord: val
                              }
                            }}
                          >
                            {val}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </section>
            )}

            {keywordRankData.search_keyword_rank.list.length > 0 && (
              <section className="search_word_container search_word_container02">
                <div className="title_box">
                  <h2 className="title_search">
                    실시간 <span className="emph">인기</span> 검색어
                  </h2>
                </div>
                <ul className="search_word_list">
                  {keywordRankData.search_keyword_rank.list.map(val => {
                    return (
                      <li className="search_word">
                        <Link
                          className="btn btn_main_line btn_mid btn_mid_round"
                          to={{
                            pathname: "/search",
                            state: {
                              searchUrl: val.search_url,
                              sKeyWord: val.key
                            }
                          }}
                        >
                          {val.key}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            <div className="pd_gnb_bottom"></div>
          </div>
        </>
      )}
    </>
  );
}

export default KeywordRank;
