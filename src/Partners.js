import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link, Redirect } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import NumberFormat from "react-number-format";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import "./assets/css/partners.css";

function Partners(props) {
  let [faqList, faqListFunc] = useState(false);
  let history = useHistory();
  let [checkedFaq, checkedFaqFunc] = useState(new Set());
  let [checkedFaqChangeFlag, checkedFaqChangeFlagFunc] = useState(false);
  let [checkBoxFlag, checkBoxFlagFunc] = useState(true);
  let [partnersFile01, partnersFile01Func] = useState(true);
  let [partnersFile02, partnersFile02Func] = useState(true);
  let [popupWrapFlag, popupWrapFlagFunc] = useState(false);
  let [popupStandardFlag, popupStandardFlagFunc] = useState(false);
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

  function _openPopup01() {
    popupWrapFlagFunc(true);
    popupStandardFlagFunc(true);
  }
  function _closePopup01() {
    popupWrapFlagFunc(false);
    popupStandardFlagFunc(false);
  }

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

  const _onSubmit = () => {
    var partnersForm = document.getElementById("partnersForm");

    let url = "https://api.denguru.kr/board_write/write/b-a-9998";

    const frm = new FormData(partnersForm);

    axios({
      method: "post",
      url: url,
      headers: {
        Authorization: cookie.accessToken ? cookie.accessToken : "",
        "content-type": "multipart/form-data"
      },
      data: frm
    })
      .then(res => {
        enqueueSnackbar(res.data.msg, { variant: "notice" });
      })
      .catch(error => {
        if (error.response) {
          enqueueSnackbar(error.response.data.msg, { variant: "notice" });
          console.log(error.response.status);
        }
      });
  };

  return (
    <>
      {faqList === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : (
        <>
          <header className="header03 header03_white">
            <h1 className="h_title">파트너스 문의</h1>
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
              <div className="complain_container">
                <h2 className="title08">댕구루 제휴 문의</h2>

                <div className="complain_write_container">
                  <form id="partnersForm" name="partnersForm">
                    <div className="inp_box04">
                      <div className="inp_txt_box">
                        <label for="post_title" className="lab_txt">
                          회사명 <span className="emph_color_accent">*</span>
                        </label>
                        <input
                          type="text"
                          name="post_title"
                          className="inp_txt js-input js-inp-required"
                          id="post_title"
                          label="회사명"
                        />
                      </div>
                    </div>
                    <div className="inp_box04">
                      <div className="inp_txt_box">
                        <label for="homepage" className="lab_txt">
                          사이트 url{" "}
                          <span className="emph_color_accent">*</span>
                        </label>
                        <input
                          type="url"
                          name="homepage"
                          className="inp_txt js-input js-inp-required"
                          id="homepage"
                          label="사이트 url"
                          placeholder="https://www.example.com"
                        />
                      </div>
                    </div>
                    <div className="inp_box04">
                      <div className="inp_txt_box">
                        <label for="val_1" className="lab_txt">
                          담당자 <span className="emph_color_accent">*</span>
                        </label>
                        <input
                          type="text"
                          name="val_1"
                          className="inp_txt js-input js-inp-required"
                          id="val_1"
                          label="담당자"
                        />
                      </div>
                    </div>
                    <div className="inp_box04">
                      <div className="inp_txt_box">
                        <label for="val_2" className="lab_txt">
                          연락처 <span className="emph_color_accent">*</span>
                        </label>
                        <input
                          type="tel"
                          name="val_2"
                          className="inp_txt js-input js-inp-required"
                          id="val_2"
                          label="연락처"
                          // placeholder="'-'없이 숫자만 입력"
                        />
                      </div>
                    </div>
                    <div className="inp_box04">
                      <div className="inp_txt_box">
                        <label for="val_3" className="lab_txt">
                          이메일 <span className="emph_color_accent">*</span>
                        </label>
                        <input
                          type="email"
                          name="val_3"
                          className="inp_txt js-input js-inp-required"
                          id="val_3"
                          label="이메일"
                          placeholder="partners@email.com"
                        />
                      </div>
                    </div>
                    <div className="inp_box02">
                      <div className="lab_box">
                        <label for="post_content" className="lab">
                          문의내용 <span className="emph_color_accent">*</span>
                        </label>
                      </div>
                      <div className="inp_box">
                        <textarea
                          name="post_content"
                          id="post_content"
                          className="inp inp_textarea js-inp-required"
                          onkeydown="resizeTextarea(this)"
                          onkeyup="resizeTextarea(this)"
                          placeholder="문의내용을 상세히 적어주시면 더 정확한 응대가 가능합니다."
                        ></textarea>
                      </div>
                    </div>
                    <div className="inp_box04">
                      <div
                        className="inp_box02"
                        style={{ marginBottom: "8px" }}
                      >
                        <div className="lab">
                          파일첨부 <span className="emph_color_accent">*</span>
                        </div>
                      </div>
                      <div className="inp_txt_box">
                        <div className="lab_txt">사업자등록증 첨부</div>
                        <div className="inp_txt js-filename">
                          {partnersFile01}
                        </div>

                        <input
                          type="file"
                          name="post_file[]"
                          className="inp_txt js-input js-inp-required js-partners-file blind"
                          id="partnersFile01"
                          onChange={e =>
                            partnersFile01Func(e.target.files[0].name)
                          }
                        />
                        <label
                          for="partnersFile01"
                          className="partners_btn btn_linkstyle btn_linkstyle_main btn_sm"
                        >
                          파일찾기
                        </label>
                      </div>
                    </div>
                    <div className="inp_box04">
                      <div className="inp_txt_box">
                        <div className="lab_txt">통신판매업증 첨부</div>
                        <div className="inp_txt js-filename">
                          {partnersFile02}
                        </div>

                        <input
                          type="file"
                          name="post_file[]"
                          className="inp_txt js-input js-inp-required js-partners-file blind"
                          id="partnersFile02"
                          onChange={e =>
                            partnersFile02Func(e.target.files[0].name)
                          }
                        />
                        <label
                          for="partnersFile02"
                          className="partners_btn btn_linkstyle btn_linkstyle_main btn_sm"
                        >
                          파일찾기
                        </label>
                      </div>
                    </div>
                    <div className="inp_box04" style={{ padding: "16px 0" }}>
                      <input
                        type="checkbox"
                        name="agree"
                        id="agree"
                        hidden
                        className={checkBoxFlag === true ? "inp_check" : ""}
                        checked={checkBoxFlag && true}
                      />
                      <label
                        for="agree"
                        className="lab_checkbox01"
                        onClick={() => checkBoxFlagFunc(!checkBoxFlag)}
                      >
                        개인정보 수집 및 이용 동의
                      </label>
                      <button
                        type="button"
                        className="btn btn_sm btn_linkstyle btn_linkstyle_main"
                        onClick={_openPopup01}
                      >
                        [내용보기]
                      </button>
                    </div>
                    <div className="btn_box">
                      <button
                        id="btnSubmit"
                        type="button"
                        className="btn btn_full btn_main btn_disabled btn_right"
                        onClick={_onSubmit}
                      >
                        확인
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div
            className={
              popupWrapFlag === true ? "popup_wrap show" : "popup_wrap"
            }
          >
            <div
              className={
                popupWrapFlag === true
                  ? "popup_container_agree popup_container popup_container02 popup_center show"
                  : "popup_container_agree popup_container popup_container02 popup_center"
              }
              id="popupAgree"
            >
              <div className="popup_content">
                <div className="popup_title01">광고제휴개인정보 처리방침</div>
                <div className="popup_title02">Ⅰ. 개인정보 처리방침 안내</div>
                <div className="popup_txt">
                  <p>
                    개인정보 처리방침이란, 이용자의 소중한 개인정보를
                    보호함으로써 이용자가 안심하고 서비스를 이용할 수 있도록
                    댕구루(이하 ‘회사’)가 준수해야 할 지침을 의미합니다.
                  </p>
                  <p>
                    회사는 개인정보 처리방침의 작성, 게시, 이행과 관련하여,
                    정보통신서비스제공자가 준수하여야 하는 대한민국의 관계 법령
                    및 개인정보보호 규정, 가이드라인을 준수하고 있습니다.
                  </p>
                </div>
                <div className="popup_title02">Ⅱ. 개인정보 처리방침 상세</div>
                <div className="popup_title03">1. 개인정보의 처리 목적</div>
                <div className="popup_txt">
                  <p>
                    (필수정보) 광고 비즈니스 이행을 위한 안내 및 고객 관리 목적
                  </p>
                  <p>
                    회사는 광고 관련 정보전달을 위한 안내(광고 부킹 및 운영 관련
                    안내, 광고 상품 프로모션 안내, 고객 관리 등)를 위해 필요한
                    최소한의 개인정보를 수집하고 있습니다.
                  </p>
                </div>
                <div className="popup_title03">
                  2. 개인정보의 처리 및 보유 기간
                </div>
                <div className="popup_txt">
                  <p>
                    이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이
                    달성되면 지체 없이 파기합니다.
                  </p>
                  <p>
                    단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안
                    보존합니다.
                  </p>
                </div>
                <div className="popup_txt">
                  <p>가. 회사 내부 방침에 의한 정보 보유 사유</p>
                </div>
                <div className="popup_table_container">
                  <table className="popup_table">
                    <tbody>
                      <tr>
                        <th className="popup_th">보관 정보</th>
                        <th className="popup_th">보관 사유</th>
                        <th className="popup_th">보관 기간</th>
                      </tr>
                      <tr>
                        <td className="popup_td">
                          회사명, 사이트URL, 담당자이름, 연락처, 이메일,
                          사업자등록증, 통신판매업증, 고객센터번호
                        </td>
                        <td className="popup_td">
                          스토어 사업자 식별, 서비스 이용계약의 체결, 사업자
                          자격유지,관리, 서비스부정이용 방지, 광고 부킹 및 운영
                          관련 안내,광고 상품 프로모션 안내, 이용고지 및 통지
                          연락 목적
                        </td>
                        <td className="popup_td">
                          이용계약 종료시까지. 단, 관계법령에 따라 또는 회사
                          정책에 따른 정보보유사유가 발생하여 보존할 필요가 있는
                          경우에는 필요한 기간동안 해당 판매자 정보를
                          보관합니다.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="popup_title03">
                  3. 정보주체의 권리, 의무 및 그 행사방법에 관한 사항
                </div>
                <div className="popup_txt">
                  <p>
                    가. 이용자 및 법정대리인은 등록되어 있는 이용자 본인의
                    개인정보와 관련하여, 언제든지 개인정보
                    열람/정정·삭제/처리정지/동의 철회를 요청할 수 있습니다.
                  </p>
                  <p>(요청: partner@denguru.kr)</p>
                  <p>
                    나. 개인정보의 오류에 대한 정정을 요청하신 경우 정정을
                    완료하기 전까지 해당 개인정보를 이용하지 않습니다.
                  </p>
                  <p>
                    다. 회사는 다음에 해당하는 경우에는 개인정보의 전부 또는
                    일부에 대하여 열람/ 정정·삭제를 거절할 수 있습니다.
                  </p>
                  <p>- 법률에 따라 열람이 금지되거나 제한되는 경우</p>
                  <p>
                    - 다른 사람의 생명·신체를 해할 우려가 있거나 다른 사람의
                    재산과 그 밖의 이익을 부당하게 침해할 우려가 있는 경우
                  </p>
                  <p>
                    라. 이용자가 개인정보의 오류에 대한 정정을 요청하신 경우에는
                    정정을 완료하기 전까지 당해 개인정보를 이용 또는 제3자에게
                    제공하지 않습니다.
                  </p>
                  <p>
                    마. 또한 잘못된 개인정보를 제3자에게 이미 제공한 경우에는
                    정정 처리결과를 제3자에게 지체없이 통지하겠습니다.
                  </p>
                  <p>
                    바. 이용자의 개인정보를 최신의 상태로 정확하게 입력하여
                    주시기 바랍니다. 이용자가 입력한 부정확한 정보로 인해
                    발생하는 사고의 책임은 이용자 자신에게 있습니다.
                  </p>
                  <p>
                    사. 이용자는 개인정보를 보호 받을 권리와 함께 스스로를
                    보호하고 타인의 정보를 침해하지 않을 의무도 가지고 있습니다.
                  </p>
                  <p>
                    이용자의 개인정보가 유출되지 않도록 조심하시고 타인의
                    개인정보를 훼손하지 않도록 유의해 주십시오.
                  </p>
                  <p>
                    만약 이 같은 책임을 다하지 못하고 타인의 정보 및 존엄성을
                    훼손할 시에는 「정보통신망 이용촉진 및 정보보호 등에 관한
                    법률」 등에 의해 처벌 받을 수 있습니다.
                  </p>
                </div>
              </div>
              <div className="popup_btn_box">
                <button
                  type="button"
                  className="btn btn_full btn_close btn_main"
                  onClick={_closePopup01}
                >
                  닫 기
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Partners;
