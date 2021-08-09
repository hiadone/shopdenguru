import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSnackbar } from "notistack";
import NumberFormat from "react-number-format";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Header from "./Header";
import Footer from "./Footer";
import { useCookies } from "react-cookie";

function PickStore(props) {
  let { brdId } = useParams();
  let [pickStoreData, pickStoreDataFunc] = useState(false);
  let [checkedPick, checkedPickFunc] = useState(new Set());
  let [checkedPickChangeFlag, checkedPickChangeFlagFunc] = useState(false);
  let [checkedAllPickFlag, checkedAllPickFlagFunc] = useState(false);
  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [cookie] = useCookies();

  useEffect(() => {
    brdId = brdId ? brdId : "";

    axios({
      method: "get",
      url: "https://api.denguru.kr/cmall/wishlist/" + brdId,
      headers: { Authorization: cookie.accessToken ? cookie.accessToken : "" }
    })
      .then(res => {
        pickStoreDataFunc(res.data);
      })
      .catch(error => {
        if (error.response) {
          pickStoreDataFunc(error.response.status);
          // pickStoreDataFunc(error.response.data.msg);
        }
      });
  }, []);

  function handleOnDragEnd(result) {
    if (!result.destination) return;
    const items = { ...pickStoreData };
    const [reorderedItem] = items.data.list.splice(result.source.index, 1);
    items.data.list.splice(result.destination.index, 0, reorderedItem);
    pickStoreDataFunc(items);
    _update();
  }

  const checkedPickHandler = (id, isChecked) => {
    if (isChecked) {
      checkedPick.add(id);
      checkedPickFunc(checkedPick);
      checkedPickChangeFlagFunc(!checkedPickChangeFlag);
    } else if (!isChecked && checkedPick.has(id)) {
      checkedPick.delete(id);
      checkedPickFunc(checkedPick);
      checkedPickChangeFlagFunc(!checkedPickChangeFlag);
    }
  };

  const checkHandler = (id, checked) => {
    checkedPickHandler(id, checked);
  };

  const _modwishlist = () => {
    const frm = new FormData();

    if (checkedPick.size > 0) {
      const _pickStoreData = { ...pickStoreData };
      checkedPick.forEach(item => {
        frm.append("chk_cit_id[]", item);

        _pickStoreData.data.list.splice(
          _pickStoreData.data.list.findIndex(x => x.cit_id == item),
          1
        );
      });
      pickStoreDataFunc(_pickStoreData);
      _update();
    } else {
      enqueueSnackbar("선택된 상품이 없습니다.", { variant: "notice" });
    }
  };

  const _update = () => {
    const frm = new FormData();

    pickStoreData.data.list.forEach(val => {
      frm.append("chk_cit_id[]", val.cit_id);
    });

    frm.append("checkedAllPickFlag", checkedAllPickFlag);

    axios({
      method: "post",
      url: "https://api.denguru.kr/postact/modwishlist",
      headers: {
        Authorization: cookie.accessToken ? cookie.accessToken : "",
        "content-type": "multipart/form-data"
      },
      data: frm
    })
      .then(res => {
        // enqueueSnackbar(res.data.msg, { variant: "notice" });
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
      {pickStoreData === false ? (
        <CircularProgress
          style={{ position: "absolute", left: "48%", top: "50%" }}
        />
      ) : (
        <>
          <Header
            notificationNum={
              pickStoreData !== 403 && pickStoreData.layout.notification_num
                ? pickStoreData.layout.notification_num
                : 0
            }
          ></Header>

          {pickStoreData === 403 && (
            <>
              <div className="main">
                <div className="pd_header06"></div>
                <div className="pick_title_box">
                  <h2 className="title08">PICK</h2>
                  <div className="btn_right pick_title_btn_box">
                    <span className="btn_linkstyle btn_pick">
                      <img
                        src="/assets/images/icon-list-dot.svg"
                        alt="스토어별 보기"
                        className="icon"
                      />
                    </span>
                    <span className="btn_linkstyle btn_pick">
                      <img
                        src="/assets/images/icon-scissors.svg"
                        alt="찜한 상품 편집하기"
                        className="icon"
                      />
                    </span>
                  </div>
                </div>
                <div className="pick_items_wrap">
                  <div className="pick_nodata">
                    <div className="pick_nodata_img_box">
                      <img
                        src="/assets/images/nodata-pick.png"
                        alt=""
                        className="pick_nodata_img"
                      />
                    </div>
                    <div className="pick_nodata_login_box txt_center">
                      <div className="pick_nodata_login_txt">
                        로그인 후 이용할 수 있는 서비스입니다
                      </div>
                      <Link
                        to={"/login"}
                        className="btn btn_accent btn_big_round btn_half pick_btn_login"
                      >
                        로그인
                      </Link>
                    </div>
                  </div>
                </div>

                <div
                  className="pd_gnb_bottom"
                  style={{ height: "28px", backgroundColor: "#fff" }}
                ></div>
              </div>
            </>
          )}
          {pickStoreData !== 403 && pickStoreData.data.list.length < 1 ? (
            <>
              <div className="pd_header06"></div>
              <div className="pick_title_box">
                <h2 className="title08">PICK</h2>
                <div className="btn_right pick_title_btn_box">
                  <Link
                    to={"/pickstorelist/0"}
                    className="btn_linkstyle btn_pick"
                  >
                    <img
                      src="/assets/images/icon-list-dot.svg"
                      alt="스토어별 보기"
                      className="icon"
                    />
                  </Link>
                  <Link to={"/pickedit"} className="btn_linkstyle btn_pick">
                    <img
                      src="/assets/images/icon-scissors.svg"
                      alt="찜한 상품 편집하기"
                      className="icon"
                    />
                  </Link>
                </div>
              </div>
              <div className="pick_items_wrap">
                <div className="pick_nodata">
                  <div className="pick_nodata_img_box">
                    <img
                      src="/assets/images/nodata-pick.png"
                      alt=""
                      className="pick_nodata_img"
                    />
                  </div>
                </div>
              </div>

              <div
                className="pd_gnb_bottom"
                style={{ height: "28px", backgroundColor: "#fff" }}
              ></div>
            </>
          ) : (
            <>
              <div className="pd_header06"></div>
              <div className="pick_title_box">
                <h2 className="title08">PICK</h2>
                <div className="btn_right pick_title_btn_box">
                  <Link
                    to={"/pickstorelist/0"}
                    className="btn_linkstyle btn_pick"
                  >
                    <img
                      src="/assets/images/icon-list-dot.svg"
                      alt="스토어별 보기"
                      className="icon"
                    />
                  </Link>
                  <Link to={"/pickedit"} className="btn_linkstyle btn_pick">
                    <img
                      src="/assets/images/icon-scissors.svg"
                      alt="찜한 상품 편집하기"
                      className="icon"
                    />
                  </Link>
                </div>
              </div>
              <div className="nav_bottom_edit_pick">
                <h2 className="blind">찜아이템 편집바</h2>
                <ul className="nav_list">
                  <li class="nav_item active">
                    <button
                      type="button"
                      className="btn_linkstyle nav_link js-btn-check-all"
                      onClick={() => {
                        checkedAllPickFlagFunc(!checkedAllPickFlag);
                        pickStoreData.data.list.map(val =>
                          checkHandler(val.cit_id, !checkedAllPickFlag)
                        );
                      }}
                    >
                      <img
                        src="/assets/images/nav-checkbox.svg"
                        alt="전체선택"
                        className="nav_icon"
                      />
                      <span className="nav_txt">전체선택</span>
                    </button>
                  </li>

                  <li className="nav_item nav_disabled">
                    <button
                      type="button"
                      className="btn_linkstyle nav_link js-nav-control-disabled"
                      onClick={_modwishlist}
                    >
                      <img
                        src="/assets/images/nav-delete.svg"
                        alt="삭제"
                        className="nav_icon"
                      />
                      <span className="nav_txt">삭제</span>
                    </button>
                  </li>
                </ul>
              </div>
              <div className="pick_items_wrap">
                <h2 className="title07">
                  찜한 아이템{" "}
                  <span className="emph_color_main">
                    {pickStoreData.data.list.length}
                  </span>
                </h2>
                <div className="items_wrap">
                  <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable
                      droppableId="pickStoreData"
                      direction="horizontal"
                    >
                      {(provided, snapshot) => (
                        <ul
                          className="item_list03 js-pick-box"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          isDraggingOver={snapshot.isDraggingOver}
                        >
                          {pickStoreData.data.list.map((val, idx) => {
                            return (
                              <Draggable
                                key={val.cwi_id}
                                draggableId={val.cwi_id}
                                index={idx}
                              >
                                {(provided_, snapshot_) => (
                                  <li
                                    className="item_box"
                                    ref={provided_.innerRef}
                                    {...provided_.draggableProps}
                                    {...provided_.dragHandleProps}
                                    isDragging={snapshot_.isDragging}
                                  >
                                    <a
                                      href={val.cit_outlink_url}
                                      target="_blank"
                                    >
                                      <div className="item_thum">
                                        <img
                                          src={val.cit_image}
                                          alt="상품이미지"
                                          className="img"
                                        />
                                      </div>
                                      <div className="item_txt_box">
                                        <div className="item_shop">
                                          {val.brd_name}
                                        </div>
                                        <div className="item_name">
                                          {val.cit_name}
                                        </div>
                                        <div className="item_price">
                                          <NumberFormat
                                            value={val.cit_price_sale}
                                            displayType={"text"}
                                            thousandSeparator={true}
                                          />

                                          <span className="rate_discount">
                                            &nbsp;&nbsp;
                                            {val.cit_price_sale_percent}%
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
                                      <div className="pick_inp_check_box">
                                        <input
                                          type="checkbox"
                                          name="chk_cit_id[]"
                                          id={val.cit_id}
                                          className="blind inp_check js-pick-check"
                                          checked={checkedPick.has(val.cit_id)}
                                        />
                                        <label
                                          for={val.cit_id}
                                          className="lab_check js-lab-check"
                                          onClick={e =>
                                            checkHandler(
                                              val.cit_id,
                                              !checkedPick.has(val.cit_id)
                                            )
                                          }
                                        >
                                          <span className="blind">
                                            상품선택
                                          </span>
                                        </label>
                                      </div>
                                    </a>
                                  </li>
                                )}
                              </Draggable>
                            );
                          })}
                        </ul>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </div>

              <div
                className="pd_gnb_bottom"
                style={{ height: "28px", backgroundColor: "#fff" }}
              ></div>
            </>
          )}
        </>
      )}
    </>
  );
}

export default PickStore;
