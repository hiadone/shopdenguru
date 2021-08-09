//header01 scroll
var elHeader01 = document.querySelector('.header01');
var MAIN_TRANSPARENT = 'main_transparent';

if(elHeader01){
  window.addEventListener('scroll',function(){
    var scrollPosition = window.scrollY;
    
    if(scrollPosition < 85) {
      elHeader01.classList.add(MAIN_TRANSPARENT);
    } else {
      elHeader01.classList.remove(MAIN_TRANSPARENT);
    }
  });

}

//header02 search_btn 

var elInpSearch = document.getElementById('inpSearch');
var elBtnDel = document.getElementById('btnDel');
var BLIND = 'blind';

function searchDelBtn() {
  var valSearch = elInpSearch.value;

  if (valSearch !== "") {
    elBtnDel.classList.remove(BLIND);
  } else {
    elBtnDel.classList.add(BLIND);
  }
}

if(elInpSearch){
  searchDelBtn();
  
  elInpSearch.addEventListener('keyup',function(){
    searchDelBtn();
  })
  elBtnDel.addEventListener('click',function(){
    elInpSearch.value = '';
    elBtnDel.classList.add(BLIND);
    elInpSearch.focus();
  });
}

