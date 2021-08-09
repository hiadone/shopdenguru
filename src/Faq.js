import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link, Redirect } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import NumberFormat from "react-number-format";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";

function Faq(props) {
  let [faqList, faqListFunc] = useState(false);
  let history = useHistory();
  let [checkedFaq, checkedFaqFunc] = useState(new Set());
  let [checkedFaqChangeFlag, checkedFaqChangeFlagFunc] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [cookie] = useCookies();

  const checkedFaqHandler = (id, isChecked) => {
    if (isChecked) {
      checkedFaq.add(id);
      checkedFaqFunc(checkedFaq);
      checkedFaqChangeFlagFunc(!checkedFaqChangeFlag);
    } else if (!isChecked && checkedFaq.has(id)) {
      checkedFaq.delete(id);
      checkedFaqFunc(checkedFaq);
      checkedFaqChangeFlagFunc(!checkedFaqChangeFlag);
    }
  };

  const checkHandler = (id, checked) => {
    checkedFaqHandler(id, checked);
  };

  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.denguru.kr/faq/faq",
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        faqListFunc(res.data);
      })
      .catch(() => {
        console.log("실패햇어요");
      });
  }, []);

  return (
    <>
      {faqList === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : (
        <>
          <header className="header03 header03_white">
            <h1 className="h_title">자주하는 질문</h1>
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
              <div className="complain_list_container">
                <ul className="complain_list">
                  {faqList.data.list.map(val => (
                    <li className="complain_box">
                      <div className="complain_title_box">
                        <div className="complain_title_txt_box">
                          <div className="complain_title">
                            <span className="question_icon">
                              <img
                                src="/assets/images/icon-q.svg"
                                alt="q"
                                className="icon"
                              />
                            </span>
                            {val.display_title}
                          </div>
                        </div>
                        <span
                          className={
                            checkedFaq.has(val.faq_id)
                              ? "js-btn-accordion btn_accordion btn_accordion_faq btn_linkstyle up"
                              : "js-btn-accordion btn_accordion btn_accordion_faq btn_linkstyle"
                          }
                          onClick={e =>
                            checkHandler(
                              val.faq_id,
                              !checkedFaq.has(val.faq_id)
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
                          !checkedFaq.has(val.faq_id) && "complain_content_box"
                        }
                      >
                        <div className="complain_content">
                          <span className="answer_icon">
                            <img
                              src="/assets/images/icon-a.svg"
                              alt="a"
                              className="icon"
                            />
                          </span>
                          {val.display_content}
                        </div>
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

export default Faq;
