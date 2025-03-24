if (window.consoleToggle) {
  var console = {};
  console.log = function () { };
} else {
  var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  console = iframe.contentWindow.console;
  window.console = console;
}
(function () {
  class HomePage {

    constructor() {
      console.log('HomePage constructor');

      // 在 HomePage 中讀取 sessionStorage 中的資料
      const sessionId = sessionStorage.getItem('sessionId');
      const userType = sessionStorage.getItem('userType'); // 使用者登入權限: 1:個案、2:教練  2023/09/01 目前有權限值
      console.log("session_id: ", sessionId, 'userType', userType);
    }


  }

  new HomePage();
})();
