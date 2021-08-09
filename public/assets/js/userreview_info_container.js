
//addPadding
var elShopItemInfoContainer = document.querySelector('.review_user_profile_wrap');
var elReviewItemStarContainer = document.querySelector('.review_user_contianer');
function addPadding() {

    var containerPadding = elShopItemInfoContainer.clientHeight ;

    elReviewItemStarContainer.style.marginTop = containerPadding + 'px';
}
addPadding();
window.addEventListener('resize', function () {
    addPadding();
});

//
var SCROLL = 'scroll'
window.addEventListener('scroll', function () {
    var scrollPosition = window.scrollY;
    if (scrollPosition > 40) {
        elShopItemInfoContainer.classList.add(SCROLL);
    } else {
        elShopItemInfoContainer.classList.remove(SCROLL);
    }
});
//
