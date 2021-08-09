var elBtnTabAll = document.querySelectorAll('.btn_tab');
var elBtnFilterPopupAll = document.querySelectorAll('.btn_filter_popup')
var elFilterContainer = document.getElementsByClassName('popup_filter_container');
var elTabPanelAll = document.querySelectorAll('.tab_panel');
var elPopupWrap = document.getElementById('popupWrap');

var elBtnShowItem = document.getElementById('btnShowItem');
var elFiterCate = document.getElementsByClassName('filter-cate-js');

var ACTIVE = 'active';
var SHOW = 'show';

function showFilterPopup(el){
  elPopupWrap.classList.add(SHOW);
  document.body.style.overflow = 'hidden';
  setTimeout(function(){
    el.classList.add(SHOW);
    elFilterContainer[0].classList.add(SHOW);
  },10);
}
function closeFilterPopup(el){
  elFilterContainer[0].classList.remove(SHOW);
  setTimeout(function(){
    el.classList.remove(SHOW);
    elBtnTabAll.forEach(function(el){
      el.classList.remove(ACTIVE);
    });
    elPopupWrap.classList.remove(SHOW);
    document.body.style.overflow = 'visible';
  },10);
}

if(elBtnTabAll){
  elBtnTabAll.forEach(function(el){
    el.addEventListener('click',function(){
      var getPanelId = this.getAttribute('aria-controls');
      var elPanel = document.getElementById(getPanelId);
      elTabPanelAll.forEach(function(el){
        el.classList.remove(SHOW);
      });
      elBtnTabAll.forEach(function(el){
        el.classList.remove(ACTIVE);
      });
      elPanel.classList.add(SHOW);
      this.classList.add(ACTIVE);

      switch (getPanelId) {
        case 'tab-panel01':
          elFiterCate[0].textContent = '가격';
          break;
        case 'tab-panel02':
          elFiterCate[0].textContent = '사이즈';
          break;
        case 'tab-panel03':
          elFiterCate[0].textContent = '연령';
          break;
        case 'tab-panel04':
          elFiterCate[0].textContent = '카테고리';
          break;
        case 'tab-panel05':
          elFiterCate[0].textContent = '컬러';
          break;
      
        default:
          break;
      }
      this.blur();
    });
  });
};


if(elBtnFilterPopupAll){
  elBtnFilterPopupAll.forEach(function(el){
    el.addEventListener('click',function(){
      var getCateId = el.getAttribute('aria-controls'); 
      var elTabPanel = document.getElementById(getCateId);

      showFilterPopup(elTabPanel);

      switch (getCateId) {
        case 'tab-panel01':
          document.querySelector('.btn_tab01').classList.add(ACTIVE);
          elFiterCate[0].textContent = '가격';
          break;
        case 'tab-panel02':
          document.querySelector('.btn_tab02').classList.add(ACTIVE);
          elFiterCate[0].textContent = '사이즈';
          break;
        case 'tab-panel03':
          document.querySelector('.btn_tab03').classList.add(ACTIVE);
          elFiterCate[0].textContent = '연령';
          break;
        case 'tab-panel04':
          document.querySelector('.btn_tab04').classList.add(ACTIVE);
          elFiterCate[0].textContent = '카테고리';
          break;
        case 'tab-panel05':
          document.querySelector('.btn_tab05').classList.add(ACTIVE);
          elFiterCate[0].textContent = '컬러';
          break;
      
        default:
          break;
      }
      this.blur();
    });
  });
}
if(elBtnShowItem){
  elBtnShowItem.addEventListener('click',function(){
    elTabPanelAll.forEach(function(el){
      if(el.classList.contains(SHOW)){
        closeFilterPopup(el);
      }
    });
  });
}

var elLoading = document.querySelector('.loading');

function openSmallCate(bigCate, smallCate) {
  var elBigCate = document.getElementById(bigCate);
  var elSmallCate = document.getElementById(smallCate);

  elLoading.classList.add(SHOW);
  setTimeout(function(){
      elBigCate.classList.remove(SHOW);
      elSmallCate.classList.add(SHOW);
      elLoading.classList.remove(SHOW);
  },400);
}
function closeSmallCate(bigCate, smallCate) {
  var elBigCate = document.getElementById(bigCate);
  var elSmallCate = document.getElementById(smallCate);

  elLoading.classList.add(SHOW);
  setTimeout(function(){
  elBigCate.classList.add(SHOW);
  elSmallCate.classList.remove(SHOW);
      elLoading.classList.remove(SHOW);
  },400);
}