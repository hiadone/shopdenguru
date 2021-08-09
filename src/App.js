import React from "react";

import { Route, Switch } from "react-router-dom";

import "./assets";
import Home from "./Home";
import HomeBest from "./HomeBest";
import HomeItemInfo from "./HomeItemInfo";
import StoreDetail from "./StoreDetail";
import ItemReview from "./ItemReview";
import ScrollArrow from "./ScrollArrow";
import StoreRank from "./StoreRank";
import StoreBookMark from "./StoreBookMark";
import Category from "./Category";
import EventPost from "./EventPost";
import Search from "./Search";
import Pick from "./Pick";
import PickStoreList from "./PickStoreList";
import MyPage from "./MyPage";
import Login from "./Login";
import LoginPage from "./LoginPage";
import KeywordRank from "./KeywordRank";
import ResisterPetWrite from "./ResisterPetWrite";
import Notification from "./Notification";
import PickEdit from "./PickEdit";
import PickStore from "./PickStore";
import ReviewWrite from "./ReviewWrite";
import SearchReviewItem from "./SearchReviewItem";
import UserReview from "./UserReview";
import RecentViewItem from "./RecentViewItem";
import EventApplyList from "./EventApplyList";
import EventResultList from "./EventResultList";
import NoticeList from "./NoticeList";
import NoticePost from "./NoticePost";
import Faq from "./Faq";
import Complain from "./Complain";
import Partners from "./Partners";
import ComplainWrite from "./ComplainWrite";
import Setting from "./Setting";
import MemberLeave from "./MemberLeave";
import MemberModifyPw from "./MemberModifyPw";
import MemberModify from "./MemberModify";
import MemberJoin from "./MemberJoin";
import MemberJoinForm from "./MemberJoinForm";
import MemberJoinSuccess from "./MemberJoinSuccess";
import MemberFindPassWord from "./MemberFindPassWord";
import MemberPassWordMailComplete from "./MemberPassWordMailComplete";

import { useCookies } from "react-cookie";

function App() {
  let accessToken = localStorage.getItem("accessToken");
  const [cookie, setCookie] = useCookies(["accessToken"]);

  if (accessToken !== null)
    setCookie("accessToken", accessToken, { path: "/" });

  return (
    <>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/homebest" component={HomeBest} />
        <Route exact path="/homeiteminfo/:citId">
          <HomeItemInfo></HomeItemInfo>
        </Route>
        <Route exact path="/storedetail/:brdId">
          <StoreDetail></StoreDetail>
        </Route>
        <Route exact path="/userreview/:memId">
          <UserReview></UserReview>
        </Route>
        <Route exact path="/itemreview/:citId">
          <ItemReview></ItemReview>
        </Route>
        <Route exact path="/itemreview/:citId/:rfiId">
          <ItemReview></ItemReview>
        </Route>

        <Route exact path="/storerank" component={StoreRank}></Route>
        <Route exact path="/storebookmark" component={StoreBookMark}></Route>
        <Route exact path="/category" component={Category}></Route>
        <Route exact path="/eventpost/:id">
          <EventPost></EventPost>
        </Route>
        <Route exact path="/search" component={Search} />
        <Route exact path="/search/:ccaId" component={Search} />
        <Route exact path="/pick" component={Pick} />
        <Route exact path="/pickstorelist" component={PickStoreList} />
        <Route exact path="/pickstorelist/:brdId" component={PickStoreList} />
        <Route exact path="/pickedit/:brdId" component={PickEdit} />
        <Route exact path="/pickedit" component={PickEdit} />
        <Route exact path="/pickstore/:brdId" component={PickStore} />

        <Route exact path="/reviewwrite" component={ReviewWrite} />
        <Route exact path="/reviewwrite/:citId" component={ReviewWrite} />
        <Route
          exact
          path="/reviewwrite/:citId/:creId"
          component={ReviewWrite}
        />

        <Route exact path="/mypage" component={MyPage} />
        <Route exact path="/recentviewitem" component={RecentViewItem} />

        <Route exact path="/eventapplylist" component={EventApplyList} />
        <Route exact path="/eventresultlist" component={EventResultList} />

        <Route exact path="/login">
          <Login></Login>
        </Route>

        <Route exact path="/loginpage" component={LoginPage} />

        <Route exact path="/keywordrank">
          <KeywordRank></KeywordRank>
        </Route>
        <Route exact path="/resisterpetwrite/:petId">
          <ResisterPetWrite></ResisterPetWrite>
        </Route>
        <Route exact path="/resisterpetwrite">
          <ResisterPetWrite></ResisterPetWrite>
        </Route>

        <Route exact path="/noticelist">
          <NoticeList></NoticeList>
        </Route>

        <Route exact path="/noticepost/:notiId">
          <NoticePost></NoticePost>
        </Route>

        <Route exact path="/notification">
          <Notification></Notification>
        </Route>

        <Route exact path="/faq">
          <Faq></Faq>
        </Route>

        <Route exact path="/complain">
          <Complain></Complain>
        </Route>
        <Route exact path="/complain/:postId">
          <Complain></Complain>
        </Route>

        <Route exact path="/complainwrite">
          <ComplainWrite></ComplainWrite>
        </Route>

        <Route exact path="/partners">
          <Partners></Partners>
        </Route>

        <Route exact path="/setting">
          <Setting></Setting>
        </Route>

        <Route exact path="/memberleave">
          <MemberLeave></MemberLeave>
        </Route>

        <Route exact path="/membermodifypw">
          <MemberModifyPw></MemberModifyPw>
        </Route>

        <Route exact path="/memberjoin">
          <MemberJoin></MemberJoin>
        </Route>

        <Route exact path="/memberjoinform">
          <MemberJoinForm></MemberJoinForm>
        </Route>

        <Route exact path="/memberjoinsuccess">
          <MemberJoinSuccess></MemberJoinSuccess>
        </Route>

        <Route exact path="/memberfindpassword">
          <MemberFindPassWord></MemberFindPassWord>
        </Route>

        <Route
          exact
          path="/memberpasswordmailcomplete"
          component={MemberPassWordMailComplete}
        />

        <Route exact path="/membermodify/modify">
          <MemberModify></MemberModify>
        </Route>

        <Route exact path="/searchreviewitem">
          <SearchReviewItem></SearchReviewItem>
        </Route>
      </Switch>
      <ScrollArrow scrollStepInPx="50" delayInMs="16.66" />
    </>
  );
}

export default App;
