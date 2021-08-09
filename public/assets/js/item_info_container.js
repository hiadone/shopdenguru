
//addPadding
var elShopItemInfoContainer = document.querySelector('.shop_item_info_container');
var elReviewItemStarContainer = document.querySelector('.review_item_stars_contianer');
function addPadding() {

    var containerPadding = elShopItemInfoContainer.clientHeight + 61;

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
