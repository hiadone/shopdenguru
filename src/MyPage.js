import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link, Redirect } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";
import NumberFormat from "react-number-format";
import Header from "./Header";
import Footer from "./Footer";

function MyPage(props) {
  let { id } = useParams();
  let [myPageData, myPageDataFunc] = useState(false);
  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [cookie] = useCookies();

  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.denguru.kr/mypage",
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        console.log(res.data);
        myPageDataFunc(res.data);
      })
      .catch(error => {
        if (error.response) {
          myPageDataFunc(error.response.status);
          // pickDataFunc(error.response.data.msg);
        }
      });
  }, []);

  return (
    <>
      {myPageData === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : myPageData !== 403 ? (
        <>
          <Header
            match={props.match}
            notificationNum={
              myPageData.layout.notification_num
                ? myPageData.layout.notification_num
                : 0
            }
          ></Header>
          <Footer match={props.match}></Footer>

          <div className="main">
            <div className="pd_header06"></div>
            <section className="my_profile">
              <h2 className="blind">내정보</h2>
              <div className="my_profile_container">
                <div className="thumb_box">
                  <img
                    src={myPageData.data.member.pet_photo_url}
                    alt="프로필이미지"
                    className="img"
                  />
                </div>
                <div className="txt_box">
                  <div className="user_mail">
                    {myPageData.data.member.mem_email}
                  </div>
                  <div className="user_nick">
                    {myPageData.data.member.pet_name}
                  </div>
                  <div className="user_pet_info">
                    {myPageData.data.member.pet_age
                      ? myPageData.data.member.pet_age + "살/"
                      : ""}
                    {myPageData.data.member.pet_kind}
                  </div>
                </div>
              </div>
              <div className="my_profile_tag_list">
                {myPageData.data.member.pet_attr &&
                  myPageData.data.member.pet_attr.length > 0 &&
                  myPageData.data.member.pet_attr.map(val => {
                    return <span className="tag">{val.pat_value}</span>;
                  })}
              </div>
              <Link
                to={
                  myPageData.data.member.pet_id
                    ? "resisterpetwrite/" + myPageData.data.member.pet_id
                    : "resisterpetwrite/"
                }
                className="my_profile_set_btn btn btn_linkstyle_main"
              >
                {myPageData.data.member.pet_id
                  ? "마이펫 정보수정"
                  : "마이펫 등록"}
                <img
                  src="/assets/images/icon-angle-right.svg"
                  alt=">"
                  className="icon"
                />
              </Link>
            </section>
            <div className="my_icon_btn_box">
              <a href="my_orderhistory_list.html" className="my_icon_btn">
                <div className="img_box">
                  <img
                    src="/assets/images/my-delivery.svg"
                    alt="아이콘"
                    className="img"
                  />
                </div>
                <div className="txt_box">주문/배송</div>
              </a>
              <Link
                to={"/userreview/" + myPageData.data.member.mem_id}
                className="my_icon_btn"
              >
                <div className="img_box">
                  <img
                    src="/assets/images/my-review.svg"
                    alt="아이콘"
                    className="img"
                  />
                </div>
                <div className="txt_box">내가 쓴 리뷰</div>
              </Link>
            </div>
            <section className="my_category">
              <h2 className="title_category">MY</h2>
              <ul className="my_category_list">
                <li className="my_category_item">
                  <a href="my_store_join_helper.html">스토어 가입도우미</a>
                </li>
                <li className="my_category_item">
                  <Link to="/recentviewitem">최근 본 상품</Link>
                </li>
                <li className="my_category_item">
                  <Link to="/eventapplylist">이벤트 신청내역</Link>
                </li>
              </ul>
            </section>
            <section className="my_category">
              <h2 className="title_category">고객센터</h2>
              <ul className="my_category_list">
                <li className="my_category_item">
                  <Link to="/noticelist">공지사항</Link>
                </li>
                <li className="my_category_item">
                  <Link to="/faq">자주 하는 질문</Link>
                </li>
                <li className="my_category_item">
                  <Link to="/complain">앱 문의/건의하기</Link>
                </li>
                <li className="my_category_item">
                  <Link to="/partners">파트너스 문의</Link>
                </li>
              </ul>
              <div className="version_info">v 1.1.1</div>
              <div className="my_small_txt_box">
                댕구루는 상품에 직접 관여하지 않으며 상품 주문, 배송 및 환불의
                의무와 책임은 각 판매업체에 있습니다.
              </div>
            </section>
            <div className="pd_gnb_bottom"></div>
          </div>
        </>
      ) : (
        myPageData === 403 && (
          <Redirect
            to={{
              pathname: "/login"
            }}
          />
        )
        // <>
        //   <Header match={props.match} notificationNum={0}></Header>
        //   <Footer match={props.match}></Footer>

        //   <div className="main">
        //     <div className="pd_header06"></div>

        //     <div className="my_icon_btn_box">
        //       <a href="my_orderhistory_list.html" className="my_icon_btn">
        //         <div className="img_box">
        //           <img
        //             src="/assets/images/my-delivery.svg"
        //             alt="아이콘"
        //             className="img"
        //           />
        //         </div>
        //         <div className="txt_box">주문/배송</div>
        //       </a>
        //       <Link to={"/userreview/"} className="my_icon_btn">
        //         <div className="img_box">
        //           <img
        //             src="/assets/images/my-review.svg"
        //             alt="아이콘"
        //             className="img"
        //           />
        //         </div>
        //         <div className="txt_box">내가 쓴 리뷰</div>
        //       </Link>
        //     </div>
        //     <section className="my_category">
        //       <h2 className="title_category">MY</h2>
        //       <ul className="my_category_list">
        //         <li className="my_category_item">
        //           <a href="my_store_join_helper.html">스토어 가입도우미</a>
        //         </li>
        //         <li className="my_category_item">
        //           <Link to="/recentviewitem">최근 본 상품</Link>
        //         </li>
        //         <li className="my_category_item">
        //           <Link to="/eventapplylist">이벤트 신청내역</Link>
        //         </li>
        //       </ul>
        //     </section>
        //     <section className="my_category">
        //       <h2 className="title_category">고객센터</h2>
        //       <ul className="my_category_list">
        //         <li className="my_category_item">
        //           <Link to="/noticelist">공지사항</Link>
        //         </li>
        //         <li className="my_category_item">
        //           <a href="my_faq.html">자주 하는 질문</a>
        //         </li>
        //         <li className="my_category_item">
        //           <a href="my_complain.html">앱 문의/건의하기</a>
        //         </li>
        //         <li className="my_category_item">
        //           <a href="my_partners.html">파트너스 문의</a>
        //         </li>
        //       </ul>
        //       <div className="version_info">v 1.1.1</div>
        //       <div className="my_small_txt_box">
        //         댕구루는 상품에 직접 관여하지 않으며 상품 주문, 배송 및 환불의
        //         의무와 책임은 각 판매업체에 있습니다.
        //       </div>
        //     </section>
        //     <div className="pd_gnb_bottom"></div>
        //   </div>
        // </>
      )}
    </>
  );
}

export default MyPage;
