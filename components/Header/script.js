// 2023/05/12 避免在外部引入此js的時候，使用(document).readyc或$(window).on('load'，會有偶爾js載入順序不完全的問題發生。
// 2023/09/05 改寫$(document).on('click', '#controlShowPanel', function() {方法，讓其對動態產生，或未來產生的元件做綁定。
(function () {
  class Header {

    constructor() {
      initUserType(); // 初始化時進行用戶類型的檢查
    }

  } // end class

  new Header();
})();





// 依據使用者身分判斷顯示的浮動視窗
function initUserType() {
  // 首先隱藏所有菜單
  $('#noneLoginPopup').hide();
  $('#userPopup').hide();
  $('#couchPopup').hide();

  // 從 sessionStorage 獲取 userType
  const userType = sessionStorage.getItem('userType');
  // console.log('userType:' + userType);

  // 根據 userType= 1:個案、2:教練、else:其他 顯示相應的視窗
  if (userType === '1') { // 個案
    // debugLog('userType=' + userType);
    $(document).on('click', '#controlShowPanel', function () {
      openControler('userPopup');
    });
  } else if (userType === '2') { // 教練
    // console.log('userType=' + userType);
    $(document).on('click', '#controlShowPanel', function () {
      openControler('couchPopup');
    });
  } else {
    // console.log('userType=' + userType);
    $(document).on('click', '#controlShowPanel', function () {
      openControler('noneLoginPopup'); // 登出顯示
    });
  }
} // end initUserType

// 在登出函數中刪除 sessionId 並導向其他頁面
function logout() {
  sessionStorage.removeItem('sessionId');
  sessionStorage.removeItem('userType');
  // console.log("session_id: ", sessionStorage.getItem('sessionId'));
  // console.log("userType: ", sessionStorage.getItem('userType'));  
  window.location.assign('../LoginPage/index.html');
}

// 切換nav開關
let navOpen = false;
function toggleNav() {
  if (navOpen) {
    closeNav();
  } else {
    openNav();
  }
  navOpen = !navOpen;
}

// 開啟nav
function openNav() {
  document.getElementById("mySidenav").style.display = "block";
  let menuImg = document.getElementById("menu_nav_button");
  menuImg.src = "../../assets/menu_focus.svg";

  $('body').css('overflow', 'hidden'); // 打開nav時禁用滾動
}

// 關閉nav
function closeNav() {
  document.getElementById("mySidenav").style.display = "none";
  let menuImg = document.getElementById("menu_nav_button");
  menuImg.src = "../../assets/menu.svg";

  $('body').css('overflow', 'auto'); // 關閉nav時啟用滾動
}


let popupOpen = true;
function openControler(popupId) {
   // 根據身分顯示不同浮動視窗
  // console.log(`open ${popupId}`);
  const popup = document.getElementById(popupId);
  if (popupOpen) {
    // 開啟 popup
    popup.style.display = "block";
  } else {
    // 關閉 popup
    popup.style.display = "none";

  }
  popupOpen = !popupOpen;
}


// 點擊空白區域關閉浮動視窗
$(document).on('click', function (event) {

  if (!$(event.target).is('#controlShowPanel') && !popupOpen) {
    $('.rightPanelRoot').hide(); 
    popupOpen = true;
  }
 
});





