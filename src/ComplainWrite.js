import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link, Redirect } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import NumberFormat from "react-number-format";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";

function ComplainWrite(props) {
  let [complainWrite, complainWriteFunc] = useState(false);
  let [postEmail, postEmailFunc] = useState(false);
  let [postFile01, postFile01Func] = useState(true);
  let history = useHistory();

  const { enqueueSnackbar } = useSnackbar();
  const [cookie] = useCookies();

  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.denguru.kr/cmall/layout",
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        postEmailFunc(res.data.layout.member.mem_email);
        complainWriteFunc(res.data);
      })
      .catch(() => {
        console.log("실패햇어요");
      });
  }, []);

  const _onSubmit = () => {
    var myForm = document.getElementById("myForm");

    let url = "https://api.denguru.kr/board_write/write/b-a-9999";

    const frm = new FormData(myForm);

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
      {complainWrite === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : (
        <>
          <header className="header03 header03_white">
            <h1 className="h_title">앱 문의/ 건의하기</h1>
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
              <h2 className="title08">1:1 문의하기</h2>

              <div className="complain_write_container">
                <form id="myForm" name="myForm">
                  <div className="inp_box04">
                    <div className="inp_txt_box">
                      <label for="post_email" className="lab_txt">
                        이메일
                      </label>
                      <input
                        type="email"
                        name="post_email"
                        className="inp_txt js-input"
                        id="post_email"
                        value={postEmail}
                        label="이메일"
                        onChange={e => postEmailFunc(e.target.value)}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="inp_box04">
                    <div className="inp_txt_box">
                      <label for="post_title" className="lab_txt">
                        제목
                      </label>
                      <input
                        type="text"
                        name="post_title"
                        className="inp_txt"
                        id="post_title"
                        label="제목"
                        maxlength="50"
                      />
                    </div>
                  </div>
                  <div className="inp_box02">
                    <div className="lab_box">
                      <label for="post_content" className="lab">
                        내 용
                      </label>
                    </div>
                    <div className="inp_box">
                      <textarea
                        name="post_content"
                        id="post_content"
                        className="inp inp_textarea"
                        onkeydown="resizeTextarea(this)"
                        onkeyup="resizeTextarea(this)"
                      ></textarea>
                    </div>
                  </div>
                  <div className="inp_box04">
                    <div className="inp_txt_box">
                      <div className="lab_txt">파일첨부</div>
                      <div className="inp_txt js-filename">{postFile01}</div>
                      <input
                        type="file"
                        name="post_file[]"
                        className="inp_txt js-input"
                        id="post_file"
                        hidden
                        accept="image/gif,image/jpeg,image/png"
                        onChange={e => postFile01Func(e.target.files[0].name)}
                      />
                      <label for="post_file" className="btn btn_linkstyle">
                        <img
                          src="/assets/images/icon-camera-main.svg"
                          alt="파일첨부 버튼"
                          className="icon"
                        />
                      </label>
                    </div>
                    <div className="txt_right inp_message js-txt-limit">
                      최대용량 10MB 이내 파일만 등록하실 수 있습니다.
                    </div>
                  </div>
                  <div className="btn_box">
                    <button
                      type="button"
                      className="btn btn_half btn_main"
                      onClick={_onSubmit}
                    >
                      확인
                    </button>
                    <Link
                      className="btn btn_half btn_main_line btn_right"
                      onClick={() => {
                        history.goBack();
                      }}
                    >
                      취소
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ComplainWrite;
