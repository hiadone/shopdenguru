import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useSnackbar } from "notistack";
import NumberFormat from "react-number-format";

function ResisterPetWrite(props) {
  let { petId } = useParams();
  let [value, valueFunc] = useState("");
  let [userPetData, userPetDataFunc] = useState(false);
  let [petPatIdData, petPatIdDataFunc] = useState("14");
  let [petSexData, petSexDataFunc] = useState("1");
  let [petCkdIdData, petCkdIdDataFunc] = useState(0);
  let [configPetKindListData, configPetKindListDataFunc] = useState(false);
  let [petNeutralData, petNeutralDataFunc] = useState(false);
  let [petIsAllergyData, petIsAllergyDataFunc] = useState("0");
  let [checkedAttrs, checkedAttrsFunc] = useState(new Set());
  let [checkedAttrChangeFlag, checkedAttrChangeFlagFunc] = useState(false);
  let [checkedAllergy, checkedAllergyFunc] = useState(new Set());
  let [checkedAllergyChangeFlag, checkedAllergyChangeFlagFunc] = useState(
    false
  );
  let [petMainFlag, petMainFlagFunc] = useState(false);
  let [petPhotoPreview, petPhotoPreviewFunc] = useState(false);
  let [petPhotoPreviewBase64, petPhotoPreviewBase64Func] = useState(
    "/assets/images/profile-noimg.png"
  ); // 파일 base64

  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [cookie] = useCookies();

  const checkedAttrsHandler = (id, isChecked) => {
    if (isChecked) {
      if (checkedAttrs.size < 5) {
        checkedAttrs.add(id);
        checkedAttrsFunc(checkedAttrs);
        checkedAttrChangeFlagFunc(!checkedAttrChangeFlag);
      } else
        enqueueSnackbar(
          "우리 아이 특징 특징키워드는 5개까지만 선택할 수 있습니다.",
          { variant: "notice" }
        );
    } else if (!isChecked && checkedAttrs.has(id)) {
      checkedAttrs.delete(id);
      checkedAttrsFunc(checkedAttrs);
      checkedAttrChangeFlagFunc(!checkedAttrChangeFlag);
    }
  };

  const checkHandler = (id, checked) => {
    checkedAttrsHandler(id, checked);
  };

  const checkedAllergyHandler = (id, isChecked) => {
    if (isChecked) {
      checkedAllergy.add(id);
      checkedAllergyFunc(checkedAllergy);
      checkedAllergyChangeFlagFunc(!checkedAllergyChangeFlag);
    } else if (!isChecked && checkedAllergy.has(id)) {
      checkedAllergy.delete(id);
      checkedAllergyFunc(checkedAllergy);
      checkedAllergyChangeFlagFunc(!checkedAllergyChangeFlag);
    }
  };

  const checkAllergyHandler = (id, checked) => {
    checkedAllergyHandler(id, checked);
  };

  useEffect(() => {
    let url = "";

    if (petId) url = "https://api.denguru.kr/mypage/petwrite/" + petId;
    else url = "https://api.denguru.kr/mypage/petwrite";

    axios({
      method: "get",
      url: url,
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        console.log(res.data);
        if (res.data.data) {
          petSexDataFunc(res.data.data.pet_sex);
          petPatIdDataFunc(res.data.data.pat_id);
          petCkdIdDataFunc(res.data.data.ckd_id);
          petNeutralDataFunc(res.data.data.pet_neutral === "1" && true);
          petIsAllergyDataFunc(res.data.data.pet_is_allergy);
          res.data.data.pet_attr.map(val =>
            checkedAttrsHandler(val.pat_id, true)
          );
          res.data.data.pet_allergy_rel.map(val =>
            checkAllergyHandler(val.pag_id, true)
          );
          petPhotoPreviewBase64Func(res.data.data.pet_photo_url);
        }
        configPetKindListDataFunc(res.data.config.pet_kind);
        userPetDataFunc(res.data);
      })
      .catch(error => {
        if (error.response) {
          userPetDataFunc(error.response.status);
          // console.log(error.response.data.msg);
        }
      });
  }, []);

  const _numberPad = (n, width) => {
    if (n < 1) return "01";
    n = n + "";
    return n.length >= width
      ? n
      : new Array(width - n.length + 1).join("0") + n;
  };

  const _onSubmit = () => {
    var myForm = document.getElementById("myForm");

    let url = "";

    if (petId) url = "https://api.denguru.kr/mypage/petwrite/" + petId;
    else url = "https://api.denguru.kr/mypage/petwrite";

    const frm = new FormData(myForm);

    console.log(frm.get("pet_birthday1"));
    frm.append(
      "pet_birthday",
      frm.get("pet_birthday1") +
        "-" +
        _numberPad(frm.get("pet_birthday2"), 2) +
        "-" +
        _numberPad(frm.get("pet_birthday3"), 2)
    );
    frm.append("ckd_id", petCkdIdData);

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

  const handleonChange = (e, val) => {
    // the item selected
    console.log(val);
    if (val && val.ckd_id) petCkdIdDataFunc(val.ckd_id);
  };

  const _petPhotoChangeFile = e => {
    let reader = new FileReader();

    reader.onloadend = () => {
      // 2. 읽기가 완료되면 아래코드가 실행됩니다.
      const base64 = reader.result;
      if (base64) {
        petPhotoPreviewBase64Func(base64.toString()); // 파일 base64 상태 업데이트
      }
    };
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
      petPhotoPreviewFunc(e.target.files[0]); // 파일 상태 업데이트
    }
  };

  const _onChange = e => {
    // console.log("value:", e.target.value * 1);
    valueFunc(e.target.value);
  };

  return (
    <>
      {userPetData === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : userPetData !== 403 && userPetData.data ? (
        <>
          <header className="header03">
            <h1 className="h_title">마이펫 정보수정</h1>
            <div className="btn_box">
              <Link
                onClick={() => {
                  history.goBack();
                }}
                className="btn_goback btn_left"
              >
                <img
                  src="/assets/images/icon-goback-white.svg"
                  alt=""
                  className="icon"
                />
              </Link>
            </div>
          </header>
          <div className="main">
            <section className="resister_pet_form_wrap pd_header03">
              <h2 className="blind">펫 정보수정 폼</h2>
              <form id="myForm" name="myForm">
                <div className="pet_profile01">
                  <div className="profile_img has_img">
                    <div className="img_box">
                      <img
                        src={petPhotoPreviewBase64}
                        alt="프로필이미지"
                        className="img"
                      />
                    </div>
                    <div className="inp_profile_box inp_has_profile">
                      <input
                        type="file"
                        name="pet_photo"
                        id="pet_photo"
                        hidden
                        onChange={_petPhotoChangeFile}
                      />
                      <label
                        for="pet_photo"
                        className="btn btn_linkstyle btn_change_img"
                      >
                        <img
                          src="/assets/images/btn_set-img.png"
                          alt="레오 정보 수정하기"
                          className="img"
                        />
                      </label>
                    </div>
                  </div>
                  <div className="inp_box01">
                    <div className="lab_box">
                      <label for="pet_name" className="lab">
                        이름
                      </label>
                      <span className="inp_noti">* 필수 입력창입니다.</span>
                    </div>
                    <input
                      type="text"
                      name="pet_name"
                      id="pet_name"
                      className="inp inp_txt"
                      defaultValue={userPetData.data.pet_name}
                    />
                  </div>
                </div>
                <div className="pet_profile02">
                  <div className="inp_box01">
                    <div className="lab_box">
                      <span className="lab">성별</span>
                    </div>
                    <div className="radio_container">
                      <span className="radio_box">
                        <input
                          type="radio"
                          name="pet_sex"
                          id="petBoy"
                          value="1"
                          className="inp_radio"
                          hidden
                          onChange={e => petSexDataFunc("1")}
                          checked={petSexData === "1"}
                        />
                        <label for="petBoy" className="lab_radio">
                          남아
                        </label>
                      </span>
                      <span className="radio_box">
                        <input
                          type="radio"
                          name="pet_sex"
                          id="petGirl"
                          value="2"
                          className="inp_radio"
                          hidden
                          onChange={e => petSexDataFunc("2")}
                          checked={petSexData === "2"}
                        />
                        <label for="petGirl" className="lab_radio">
                          여아
                        </label>
                      </span>
                    </div>
                    <div className="inp_check_box">
                      <input
                        type="checkbox"
                        name="pet_neutral"
                        id="pet_neutral"
                        value="1"
                        hidden
                        className={petNeutralData === true ? "inp_check" : ""}
                        checked={petNeutralData && true}
                      />
                      <label
                        for="pet_neutral"
                        className="lab_checkbox01"
                        onClick={() => petNeutralDataFunc(!petNeutralData)}
                      >
                        중성화한 경우 체크
                      </label>
                    </div>
                  </div>
                  <div className="inp_box01">
                    <div className="lab_box">
                      <span className="lab">생일</span>
                      <span className="inp_noti">* 필수 입력창입니다.</span>
                    </div>
                    <div className="inp inp_date_box">
                      <div className="inp_date">
                        <input
                          type="number"
                          name="pet_birthday1"
                          id="petBirthYear"
                          className="inp_nostyle"
                          placeholder="YYYY"
                          defaultValue={
                            userPetData.data.pet_birthday &&
                            userPetData.data.pet_birthday.split("-")[0]
                          }
                        />{" "}
                        년
                      </div>
                      <div className="inp_date">
                        <input
                          type="number"
                          name="pet_birthday2"
                          id="petBirthMonth"
                          className="inp_nostyle"
                          placeholder="MM"
                          defaultValue={
                            userPetData.data.pet_birthday &&
                            userPetData.data.pet_birthday.split("-")[1]
                          }
                        />{" "}
                        월
                      </div>
                      <div className="inp_date">
                        <input
                          type="number"
                          name="pet_birthday3"
                          id="petBirthDate"
                          className="inp_nostyle"
                          placeholder="DD"
                          defaultValue={
                            userPetData.data.pet_birthday &&
                            userPetData.data.pet_birthday.split("-")[2]
                          }
                        />{" "}
                        일
                      </div>
                    </div>
                  </div>
                  <div className="inp_box01">
                    <div className="lab_box">
                      <label for="pet_weight" className="lab">
                        몸무게
                      </label>
                    </div>
                    <div className="inp_two_thirds">
                      <input
                        type="number"
                        name="pet_weight"
                        id="pet_weight"
                        className="inp"
                        defaultValue={userPetData.data.pet_weight}
                      />
                      kg
                    </div>
                  </div>
                  <div className="inp_box01">
                    <div className="lab_box">
                      <span className="lab">체형</span>
                    </div>
                    <div className="radio_container">
                      <span className="radio_box">
                        <input
                          type="radio"
                          name="pat_id"
                          id="petBody01"
                          hidden
                          className="inp_radio"
                          value="14"
                          onChange={e => petPatIdDataFunc("14")}
                          checked={petPatIdData === "14"}
                        />
                        <label for="petBody01" className="lab_radio">
                          날씬해요
                        </label>
                      </span>
                      <span className="radio_box">
                        <input
                          type="radio"
                          name="pat_id"
                          id="petBody02"
                          hidden
                          className="inp_radio"
                          value="15"
                          onChange={e => petPatIdDataFunc("15")}
                          checked={petPatIdData === "15"}
                        />
                        <label for="petBody02" className="lab_radio">
                          딱좋아요
                        </label>
                      </span>
                      <span className="radio_box">
                        <input
                          type="radio"
                          name="pat_id"
                          id="petBody03"
                          hidden
                          className="inp_radio"
                          value="16"
                          onChange={e => petPatIdDataFunc("16")}
                          checked={petPatIdData === "16"}
                        />
                        <label for="petBody03" className="lab_radio">
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
                        userPetData.data.ckd_id > 0 &&
                        configPetKindListData.find(
                          val => val.ckd_id === userPetData.data.ckd_id
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

                    <div className="btn_more_box">
                      <div className="btn btn_linkstyle link_more">
                        품종을 입력해 주세요
                      </div>
                    </div>
                  </div>
                  <div className="inp_box01">
                    <div className="lab_box">
                      <span className="lab">우리 아이 특징</span>
                      <span className="inp_noti">
                        * 특징키워드는 5개까지만 선택할 수 있습니다.
                      </span>
                    </div>
                    <table className="check_box_table">
                      <tbody>
                        <tr>
                          <td>
                            <input
                              type="checkbox"
                              name="pet_attr[]"
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
                              name="pet_attr[]"
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
                              name="pet_attr[]"
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
                              name="pet_attr[]"
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
                              name="pet_attr[]"
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
                              name="pet_attr[]"
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
                              name="pet_attr[]"
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
                              name="pet_attr[]"
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
                              name="pet_attr[]"
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
                              name="pet_attr[]"
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
                  <div className="inp_box01">
                    <div className="lab_box">
                      <span className="lab">식이 알레르기가 있나요?</span>
                    </div>
                    <div className="radio_container">
                      <span className="radio_box">
                        <input
                          type="radio"
                          name="pet_is_allergy"
                          id="petHasAllergy01"
                          hidden
                          className="inp_radio"
                          value="0"
                          onChange={e => petIsAllergyDataFunc("0")}
                          checked={petIsAllergyData === "0" && true}
                        />
                        <label
                          for="petHasAllergy01"
                          className="lab_radio lab_allergy"
                        >
                          없어요
                        </label>
                      </span>
                      <span className="radio_box">
                        <input
                          type="radio"
                          name="pet_is_allergy"
                          id="petHasAllergy02"
                          hidden
                          className="inp_radio"
                          value="1"
                          onChange={e => petIsAllergyDataFunc("1")}
                          checked={petIsAllergyData === "1" && true}
                        />
                        <label
                          for="petHasAllergy02"
                          className="lab_radio lab_allergy"
                        >
                          있어요
                        </label>
                      </span>
                    </div>
                  </div>

                  <div
                    className={petIsAllergyData === "0" && "allergy_container"}
                    id="allergyContainer"
                  >
                    <div className="inp_box01">
                      <div className="lab_box">
                        <span className="lab_small">단백질원</span>
                      </div>
                      <table className="check_box_table">
                        <tbody>
                          <tr>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyProtein01"
                                className="inp_check_table"
                                hidden
                                value="3"
                                checked={checkedAllergy.has("3")}
                              />
                              <label
                                for="petAllergyProtein01"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "3",
                                    !checkedAllergy.has("3")
                                  )
                                }
                              >
                                닭
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyProtein02"
                                className="inp_check_table"
                                hidden
                                value="4"
                                checked={checkedAllergy.has("4")}
                              />
                              <label
                                for="petAllergyProtein02"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "4",
                                    !checkedAllergy.has("4")
                                  )
                                }
                              >
                                오리
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyProtein03"
                                className="inp_check_table"
                                hidden
                                value="5"
                              />
                              <label
                                for="petAllergyProtein03"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "5",
                                    !checkedAllergy.has("5")
                                  )
                                }
                              >
                                소고기
                              </label>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyProtein04"
                                className="inp_check_table"
                                hidden
                                value="6"
                                checked={checkedAllergy.has("6")}
                              />
                              <label
                                for="petAllergyProtein04"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "6",
                                    !checkedAllergy.has("6")
                                  )
                                }
                              >
                                양고기
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyProtein05"
                                className="inp_check_table"
                                hidden
                                value="7"
                                checked={checkedAllergy.has("7")}
                              />
                              <label
                                for="petAllergyProtein05"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "7",
                                    !checkedAllergy.has("7")
                                  )
                                }
                              >
                                돼지고기
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyProtein06"
                                className="inp_check_table"
                                hidden
                                value="8"
                                checked={checkedAllergy.has("8")}
                              />
                              <label
                                for="petAllergyProtein06"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "8",
                                    !checkedAllergy.has("8")
                                  )
                                }
                              >
                                말고기
                              </label>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyProtein07"
                                className="inp_check_table"
                                hidden
                                value="9"
                                checked={checkedAllergy.has("9")}
                              />
                              <label
                                for="petAllergyProtein07"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "9",
                                    !checkedAllergy.has("9")
                                  )
                                }
                              >
                                캥거루/토끼
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyProtein08"
                                className="inp_check_table"
                                hidden
                                value="10"
                                checked={checkedAllergy.has("10")}
                              />
                              <label
                                for="petAllergyProtein08"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "10",
                                    !checkedAllergy.has("10")
                                  )
                                }
                              >
                                염소/사슴
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyProtein09"
                                className="inp_check_table"
                                hidden
                                value="11"
                                checked={checkedAllergy.has("11")}
                              />
                              <label
                                for="petAllergyProtein09"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "11",
                                    !checkedAllergy.has("11")
                                  )
                                }
                              >
                                연어
                              </label>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyProtein10"
                                className="inp_check_table"
                                hidden
                                value="12"
                                checked={checkedAllergy.has("12")}
                              />
                              <label
                                for="petAllergyProtein10"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "12",
                                    !checkedAllergy.has("12")
                                  )
                                }
                              >
                                참치/청어/상어
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyProtein11"
                                className="inp_check_table"
                                hidden
                                value="13"
                                checked={checkedAllergy.has("13")}
                              />
                              <label
                                for="petAllergyProtein11"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "13",
                                    !checkedAllergy.has("13")
                                  )
                                }
                              >
                                멸치
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyProtein12"
                                className="inp_check_table"
                                hidden
                                value="14"
                                checked={checkedAllergy.has("14")}
                              />
                              <label
                                for="petAllergyProtein12"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "14",
                                    !checkedAllergy.has("14")
                                  )
                                }
                              >
                                계란
                              </label>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyProtein13"
                                className="inp_check_table"
                                hidden
                                value="15"
                                checked={checkedAllergy.has("15")}
                              />
                              <label
                                for="petAllergyProtein13"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "15",
                                    !checkedAllergy.has("15")
                                  )
                                }
                              >
                                맥주효모
                              </label>
                            </td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="inp_box01">
                      <div className="lab_box">
                        <span className="lab_small">야채/과일/곡물</span>
                      </div>
                      <table className="check_box_table">
                        <tbody>
                          <tr>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyGreens01"
                                className="inp_check_table"
                                hidden
                                value="16"
                                checked={checkedAllergy.has("16")}
                              />
                              <label
                                for="petAllergyGreens01"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "16",
                                    !checkedAllergy.has("16")
                                  )
                                }
                              >
                                고구마
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyGreens02"
                                className="inp_check_table"
                                hidden
                                value="17"
                                checked={checkedAllergy.has("17")}
                              />
                              <label
                                for="petAllergyGreens02"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "17",
                                    !checkedAllergy.has("17")
                                  )
                                }
                              >
                                단호박
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyGreens03"
                                className="inp_check_table"
                                hidden
                                value="18"
                                checked={checkedAllergy.has("18")}
                              />
                              <label
                                for="petAllergyGreens03"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "18",
                                    !checkedAllergy.has("18")
                                  )
                                }
                              >
                                양배추
                              </label>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyGreens04"
                                className="inp_check_table"
                                hidden
                                value="19"
                                checked={checkedAllergy.has("19")}
                              />
                              <label
                                for="petAllergyGreens04"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "19",
                                    !checkedAllergy.has("19")
                                  )
                                }
                              >
                                브로콜리
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyGreens05"
                                className="inp_check_table"
                                hidden
                                value="20"
                                checked={checkedAllergy.has("20")}
                              />
                              <label
                                for="petAllergyGreens05"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "20",
                                    !checkedAllergy.has("20")
                                  )
                                }
                              >
                                사과
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyGreens06"
                                className="inp_check_table"
                                hidden
                                value="21"
                                checked={checkedAllergy.has("21")}
                              />
                              <label
                                for="petAllergyGreens06"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "21",
                                    !checkedAllergy.has("21")
                                  )
                                }
                              >
                                바나나
                              </label>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyGreens07"
                                className="inp_check_table"
                                hidden
                                value="22"
                                checked={checkedAllergy.has("22")}
                              />
                              <label
                                for="petAllergyGreens07"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "22",
                                    !checkedAllergy.has("22")
                                  )
                                }
                              >
                                베리류
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyGreens08"
                                className="inp_check_table"
                                hidden
                                value="23"
                                checked={checkedAllergy.has("23")}
                              />
                              <label
                                for="petAllergyGreens08"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "23",
                                    !checkedAllergy.has("23")
                                  )
                                }
                              >
                                감자
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyGreens09"
                                className="inp_check_table"
                                hidden
                                value="24"
                                checked={checkedAllergy.has("24")}
                              />
                              <label
                                for="petAllergyGreens09"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "24",
                                    !checkedAllergy.has("24")
                                  )
                                }
                              >
                                완두콩/땅콩
                              </label>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyGreens10"
                                className="inp_check_table"
                                hidden
                                value="25"
                                checked={checkedAllergy.has("25")}
                              />
                              <label
                                for="petAllergyGreens10"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "25",
                                    !checkedAllergy.has("25")
                                  )
                                }
                              >
                                귀리/오트밀
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyGreens11"
                                className="inp_check_table"
                                hidden
                                value="26"
                                checked={checkedAllergy.has("26")}
                              />
                              <label
                                for="petAllergyGreens11"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "26",
                                    !checkedAllergy.has("26")
                                  )
                                }
                              >
                                참깨/아마씨
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyGreens12"
                                className="inp_check_table"
                                hidden
                                value="27"
                                checked={checkedAllergy.has("27")}
                              />
                              <label
                                for="petAllergyGreens12"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "27",
                                    !checkedAllergy.has("27")
                                  )
                                }
                              >
                                쌀
                              </label>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="submit_box">
                  <div className="btn_box inp_box01">
                    <div className="btn_left">
                      <input
                        type="checkbox"
                        name="pet_main"
                        value="1"
                        id="submitMainPg"
                        hidden
                        className={petMainFlag === true ? "inp_check" : ""}
                        checked={petMainFlag && true}
                      />
                      <label
                        for="submitMainPg"
                        className="lab_checkbox02"
                        onClick={() => petMainFlagFunc(!petMainFlag)}
                      >
                        이 아이로 첫화면 등록하기
                      </label>
                    </div>
                    <button
                      className="btn_linkstyle btn_right btn_trash"
                      type="reset"
                      onClick={() => history.go(0)}
                    >
                      {" "}
                      <img
                        src="/assets/images/icon-trash.svg"
                        alt="삭제하기"
                        className="icon"
                      />
                    </button>
                  </div>
                  <div className="">
                    <button
                      className="btn btn_full btn_main"
                      type="button"
                      id="btnSubmit"
                      onClick={_onSubmit}
                    >
                      저장하기
                    </button>
                  </div>
                </div>
              </form>
            </section>
          </div>
        </>
      ) : userPetData !== 403 && !userPetData.data ? (
        <>
          <header className="header03">
            <h1 className="h_title">마이펫 등록</h1>
            <div className="btn_box">
              <Link
                onClick={() => {
                  history.goBack();
                }}
                className="btn_goback btn_left"
              >
                <img
                  src="/assets/images/icon-goback-white.svg"
                  alt=""
                  className="icon"
                />
              </Link>
            </div>
          </header>
          <div className="main">
            <section className="resister_pet_form_wrap pd_header03">
              <h2 className="blind">펫 정보등록 폼</h2>
              <form id="myForm" name="myForm">
                <div className="pet_profile01">
                  <div className="profile_img has_img">
                    <div className="img_box">
                      <img
                        src={petPhotoPreviewBase64}
                        alt="프로필이미지"
                        className="img"
                      />
                    </div>
                    <div className="inp_profile_box inp_has_profile">
                      <input
                        type="file"
                        name="pet_photo"
                        id="pet_photo"
                        hidden
                        onChange={_petPhotoChangeFile}
                      />
                      <label
                        for="pet_photo"
                        className="btn btn_linkstyle btn_change_img"
                      >
                        <img
                          src="/assets/images/btn_set-img.png"
                          alt="레오 정보 수정하기"
                          className="img"
                        />
                      </label>
                    </div>
                  </div>
                  <div className="inp_box01">
                    <div className="lab_box">
                      <label for="pet_name" className="lab">
                        이름
                      </label>
                      <span className="inp_noti">* 필수 입력창입니다.</span>
                    </div>
                    <input
                      type="text"
                      name="pet_name"
                      id="pet_name"
                      className="inp inp_txt"
                    />
                  </div>
                </div>
                <div className="pet_profile02">
                  <div className="inp_box01">
                    <div className="lab_box">
                      <span className="lab">성별</span>
                    </div>
                    <div className="radio_container">
                      <span className="radio_box">
                        <input
                          type="radio"
                          name="pet_sex"
                          id="petBoy"
                          value="1"
                          className="inp_radio"
                          hidden
                          onChange={e => petSexDataFunc("1")}
                          checked={petSexData === "1"}
                        />
                        <label for="petBoy" className="lab_radio">
                          남아
                        </label>
                      </span>
                      <span className="radio_box">
                        <input
                          type="radio"
                          name="pet_sex"
                          id="petGirl"
                          value="2"
                          className="inp_radio"
                          hidden
                          onChange={e => petSexDataFunc("2")}
                          checked={petSexData === "2"}
                        />
                        <label for="petGirl" className="lab_radio">
                          여아
                        </label>
                      </span>
                    </div>
                    <div className="inp_check_box">
                      <input
                        type="checkbox"
                        name="pet_neutral"
                        id="pet_neutral"
                        value="1"
                        hidden
                        className={petNeutralData === true ? "inp_check" : ""}
                        checked={petNeutralData && true}
                      />
                      <label
                        for="pet_neutral"
                        className="lab_checkbox01"
                        onClick={() => petNeutralDataFunc(!petNeutralData)}
                      >
                        중성화한 경우 체크
                      </label>
                    </div>
                  </div>
                  <div className="inp_box01">
                    <div className="lab_box">
                      <span className="lab">생일</span>
                      <span className="inp_noti">* 필수 입력창입니다.</span>
                    </div>
                    <div className="inp inp_date_box">
                      <div className="inp_date">
                        <input
                          type="number"
                          name="pet_birthday1"
                          id="petBirthYear"
                          className="inp_nostyle"
                          placeholder="YYYY"
                          defaultValue={
                            userPetData.data.pet_birthday &&
                            userPetData.data.pet_birthday.split("-")[0]
                          }
                        />{" "}
                        년
                      </div>
                      <div className="inp_date">
                        <input
                          type="number"
                          name="pet_birthday2"
                          id="petBirthMonth"
                          className="inp_nostyle"
                          placeholder="MM"
                          defaultValue={
                            userPetData.data.pet_birthday &&
                            userPetData.data.pet_birthday.split("-")[1]
                          }
                        />{" "}
                        월
                      </div>
                      <div className="inp_date">
                        <input
                          type="number"
                          name="pet_birthday3"
                          id="petBirthDate"
                          className="inp_nostyle"
                          placeholder="DD"
                          defaultValue={
                            userPetData.data.pet_birthday &&
                            userPetData.data.pet_birthday.split("-")[2]
                          }
                        />{" "}
                        일
                      </div>
                    </div>
                  </div>
                  <div className="inp_box01">
                    <div className="lab_box">
                      <label for="pet_weight" className="lab">
                        몸무게
                      </label>
                    </div>
                    <div className="inp_two_thirds">
                      <input
                        type="number"
                        name="pet_weight"
                        id="pet_weight"
                        className="inp"
                        defaultValue={userPetData.data.pet_weight}
                      />
                      kg
                    </div>
                  </div>
                  <div className="inp_box01">
                    <div className="lab_box">
                      <span className="lab">체형</span>
                    </div>
                    <div className="radio_container">
                      <span className="radio_box">
                        <input
                          type="radio"
                          name="pat_id"
                          id="petBody01"
                          hidden
                          className="inp_radio"
                          value="14"
                          onChange={e => petPatIdDataFunc("14")}
                          checked={petPatIdData === "14"}
                        />
                        <label for="petBody01" className="lab_radio">
                          날씬해요
                        </label>
                      </span>
                      <span className="radio_box">
                        <input
                          type="radio"
                          name="pat_id"
                          id="petBody02"
                          hidden
                          className="inp_radio"
                          value="15"
                          onChange={e => petPatIdDataFunc("15")}
                          checked={petPatIdData === "15"}
                        />
                        <label for="petBody02" className="lab_radio">
                          딱좋아요
                        </label>
                      </span>
                      <span className="radio_box">
                        <input
                          type="radio"
                          name="pat_id"
                          id="petBody03"
                          hidden
                          className="inp_radio"
                          value="16"
                          onChange={e => petPatIdDataFunc("16")}
                          checked={petPatIdData === "16"}
                        />
                        <label for="petBody03" className="lab_radio">
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
                        userPetData.data.ckd_id > 0 &&
                        configPetKindListData.find(
                          val => val.ckd_id === userPetData.data.ckd_id
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

                    <div className="btn_more_box">
                      <div className="btn btn_linkstyle link_more">
                        품종을 입력해 주세요
                      </div>
                    </div>
                  </div>
                  <div className="inp_box01">
                    <div className="lab_box">
                      <span className="lab">우리 아이 특징</span>
                      <span className="inp_noti">
                        * 특징키워드는 5개까지만 선택할 수 있습니다.
                      </span>
                    </div>
                    <table className="check_box_table">
                      <tbody>
                        <tr>
                          <td>
                            <input
                              type="checkbox"
                              name="pet_attr[]"
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
                              name="pet_attr[]"
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
                              name="pet_attr[]"
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
                              name="pet_attr[]"
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
                              name="pet_attr[]"
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
                              name="pet_attr[]"
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
                              name="pet_attr[]"
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
                              name="pet_attr[]"
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
                              name="pet_attr[]"
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
                              name="pet_attr[]"
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
                  <div className="inp_box01">
                    <div className="lab_box">
                      <span className="lab">식이 알레르기가 있나요?</span>
                    </div>
                    <div className="radio_container">
                      <span className="radio_box">
                        <input
                          type="radio"
                          name="pet_is_allergy"
                          id="petHasAllergy01"
                          hidden
                          className="inp_radio"
                          value="0"
                          onChange={e => petIsAllergyDataFunc("0")}
                          checked={petIsAllergyData === "0" && true}
                        />
                        <label
                          for="petHasAllergy01"
                          className="lab_radio lab_allergy"
                        >
                          없어요
                        </label>
                      </span>
                      <span className="radio_box">
                        <input
                          type="radio"
                          name="pet_is_allergy"
                          id="petHasAllergy02"
                          hidden
                          className="inp_radio"
                          value="1"
                          onChange={e => petIsAllergyDataFunc("1")}
                          checked={petIsAllergyData === "1" && true}
                        />
                        <label
                          for="petHasAllergy02"
                          className="lab_radio lab_allergy"
                        >
                          있어요
                        </label>
                      </span>
                    </div>
                  </div>

                  <div
                    className={petIsAllergyData === "0" && "allergy_container"}
                    id="allergyContainer"
                  >
                    <div className="inp_box01">
                      <div className="lab_box">
                        <span className="lab_small">단백질원</span>
                      </div>
                      <table className="check_box_table">
                        <tbody>
                          <tr>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyProtein01"
                                className="inp_check_table"
                                hidden
                                value="3"
                                checked={checkedAllergy.has("3")}
                              />
                              <label
                                for="petAllergyProtein01"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "3",
                                    !checkedAllergy.has("3")
                                  )
                                }
                              >
                                닭
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyProtein02"
                                className="inp_check_table"
                                hidden
                                value="4"
                                checked={checkedAllergy.has("4")}
                              />
                              <label
                                for="petAllergyProtein02"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "4",
                                    !checkedAllergy.has("4")
                                  )
                                }
                              >
                                오리
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyProtein03"
                                className="inp_check_table"
                                hidden
                                value="5"
                              />
                              <label
                                for="petAllergyProtein03"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "5",
                                    !checkedAllergy.has("5")
                                  )
                                }
                              >
                                소고기
                              </label>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyProtein04"
                                className="inp_check_table"
                                hidden
                                value="6"
                                checked={checkedAllergy.has("6")}
                              />
                              <label
                                for="petAllergyProtein04"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "6",
                                    !checkedAllergy.has("6")
                                  )
                                }
                              >
                                양고기
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyProtein05"
                                className="inp_check_table"
                                hidden
                                value="7"
                                checked={checkedAllergy.has("7")}
                              />
                              <label
                                for="petAllergyProtein05"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "7",
                                    !checkedAllergy.has("7")
                                  )
                                }
                              >
                                돼지고기
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyProtein06"
                                className="inp_check_table"
                                hidden
                                value="8"
                                checked={checkedAllergy.has("8")}
                              />
                              <label
                                for="petAllergyProtein06"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "8",
                                    !checkedAllergy.has("8")
                                  )
                                }
                              >
                                말고기
                              </label>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyProtein07"
                                className="inp_check_table"
                                hidden
                                value="9"
                                checked={checkedAllergy.has("9")}
                              />
                              <label
                                for="petAllergyProtein07"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "9",
                                    !checkedAllergy.has("9")
                                  )
                                }
                              >
                                캥거루/토끼
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyProtein08"
                                className="inp_check_table"
                                hidden
                                value="10"
                                checked={checkedAllergy.has("10")}
                              />
                              <label
                                for="petAllergyProtein08"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "10",
                                    !checkedAllergy.has("10")
                                  )
                                }
                              >
                                염소/사슴
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyProtein09"
                                className="inp_check_table"
                                hidden
                                value="11"
                                checked={checkedAllergy.has("11")}
                              />
                              <label
                                for="petAllergyProtein09"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "11",
                                    !checkedAllergy.has("11")
                                  )
                                }
                              >
                                연어
                              </label>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyProtein10"
                                className="inp_check_table"
                                hidden
                                value="12"
                                checked={checkedAllergy.has("12")}
                              />
                              <label
                                for="petAllergyProtein10"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "12",
                                    !checkedAllergy.has("12")
                                  )
                                }
                              >
                                참치/청어/상어
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyProtein11"
                                className="inp_check_table"
                                hidden
                                value="13"
                                checked={checkedAllergy.has("13")}
                              />
                              <label
                                for="petAllergyProtein11"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "13",
                                    !checkedAllergy.has("13")
                                  )
                                }
                              >
                                멸치
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyProtein12"
                                className="inp_check_table"
                                hidden
                                value="14"
                                checked={checkedAllergy.has("14")}
                              />
                              <label
                                for="petAllergyProtein12"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "14",
                                    !checkedAllergy.has("14")
                                  )
                                }
                              >
                                계란
                              </label>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyProtein13"
                                className="inp_check_table"
                                hidden
                                value="15"
                                checked={checkedAllergy.has("15")}
                              />
                              <label
                                for="petAllergyProtein13"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "15",
                                    !checkedAllergy.has("15")
                                  )
                                }
                              >
                                맥주효모
                              </label>
                            </td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="inp_box01">
                      <div className="lab_box">
                        <span className="lab_small">야채/과일/곡물</span>
                      </div>
                      <table className="check_box_table">
                        <tbody>
                          <tr>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyGreens01"
                                className="inp_check_table"
                                hidden
                                value="16"
                                checked={checkedAllergy.has("16")}
                              />
                              <label
                                for="petAllergyGreens01"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "16",
                                    !checkedAllergy.has("16")
                                  )
                                }
                              >
                                고구마
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyGreens02"
                                className="inp_check_table"
                                hidden
                                value="17"
                                checked={checkedAllergy.has("17")}
                              />
                              <label
                                for="petAllergyGreens02"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "17",
                                    !checkedAllergy.has("17")
                                  )
                                }
                              >
                                단호박
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyGreens03"
                                className="inp_check_table"
                                hidden
                                value="18"
                                checked={checkedAllergy.has("18")}
                              />
                              <label
                                for="petAllergyGreens03"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "18",
                                    !checkedAllergy.has("18")
                                  )
                                }
                              >
                                양배추
                              </label>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyGreens04"
                                className="inp_check_table"
                                hidden
                                value="19"
                                checked={checkedAllergy.has("19")}
                              />
                              <label
                                for="petAllergyGreens04"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "19",
                                    !checkedAllergy.has("19")
                                  )
                                }
                              >
                                브로콜리
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyGreens05"
                                className="inp_check_table"
                                hidden
                                value="20"
                                checked={checkedAllergy.has("20")}
                              />
                              <label
                                for="petAllergyGreens05"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "20",
                                    !checkedAllergy.has("20")
                                  )
                                }
                              >
                                사과
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyGreens06"
                                className="inp_check_table"
                                hidden
                                value="21"
                                checked={checkedAllergy.has("21")}
                              />
                              <label
                                for="petAllergyGreens06"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "21",
                                    !checkedAllergy.has("21")
                                  )
                                }
                              >
                                바나나
                              </label>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyGreens07"
                                className="inp_check_table"
                                hidden
                                value="22"
                                checked={checkedAllergy.has("22")}
                              />
                              <label
                                for="petAllergyGreens07"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "22",
                                    !checkedAllergy.has("22")
                                  )
                                }
                              >
                                베리류
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyGreens08"
                                className="inp_check_table"
                                hidden
                                value="23"
                                checked={checkedAllergy.has("23")}
                              />
                              <label
                                for="petAllergyGreens08"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "23",
                                    !checkedAllergy.has("23")
                                  )
                                }
                              >
                                감자
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyGreens09"
                                className="inp_check_table"
                                hidden
                                value="24"
                                checked={checkedAllergy.has("24")}
                              />
                              <label
                                for="petAllergyGreens09"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "24",
                                    !checkedAllergy.has("24")
                                  )
                                }
                              >
                                완두콩/땅콩
                              </label>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyGreens10"
                                className="inp_check_table"
                                hidden
                                value="25"
                                checked={checkedAllergy.has("25")}
                              />
                              <label
                                for="petAllergyGreens10"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "25",
                                    !checkedAllergy.has("25")
                                  )
                                }
                              >
                                귀리/오트밀
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyGreens11"
                                className="inp_check_table"
                                hidden
                                value="26"
                                checked={checkedAllergy.has("26")}
                              />
                              <label
                                for="petAllergyGreens11"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "26",
                                    !checkedAllergy.has("26")
                                  )
                                }
                              >
                                참깨/아마씨
                              </label>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name="pet_allergy_rel[]"
                                id="petAllergyGreens12"
                                className="inp_check_table"
                                hidden
                                value="27"
                                checked={checkedAllergy.has("27")}
                              />
                              <label
                                for="petAllergyGreens12"
                                className="lab_check_table"
                                onClick={e =>
                                  checkAllergyHandler(
                                    "27",
                                    !checkedAllergy.has("27")
                                  )
                                }
                              >
                                쌀
                              </label>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="submit_box">
                  <div className="btn_box inp_box01">
                    <div className="btn_left">
                      <input
                        type="checkbox"
                        name="pet_main"
                        value="1"
                        id="submitMainPg"
                        hidden
                        className={petMainFlag === true ? "inp_check" : ""}
                        checked={petMainFlag && true}
                      />
                      <label
                        for="submitMainPg"
                        className="lab_checkbox02"
                        onClick={() => petMainFlagFunc(!petMainFlag)}
                      >
                        이 아이로 첫화면 등록하기
                      </label>
                    </div>
                    <button
                      className="btn_linkstyle btn_right btn_trash"
                      type="reset"
                      onClick={() => history.go(0)}
                    >
                      {" "}
                      <img
                        src="/assets/images/icon-trash.svg"
                        alt="삭제하기"
                        className="icon"
                      />
                    </button>
                  </div>
                  <div className="">
                    <button
                      className="btn btn_full btn_main"
                      type="button"
                      id="btnSubmit"
                      onClick={_onSubmit}
                    >
                      저장하기
                    </button>
                  </div>
                </div>
              </form>
            </section>
          </div>
        </>
      ) : (
        userPetData === 403 && <Redirect to={{ pathname: "/login" }} />
      )}
    </>
  );
}
export default ResisterPetWrite;
