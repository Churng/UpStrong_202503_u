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

  console.log(window.apiUrl)
  class LoginPage {
    $idNumber = $("#idNumber");
    $password = $("#password");
    $remember = $("#login-remember");
    $loginButton = $("#login-btn");

    loginApiUrl = `${window.apiUrl}${window.apilogin}`;

    constructor() {
      this.init();
    }

    init() {
      this.initTogglePassword("togglePassword", "password"); // 切換密碼明文顯示
      this.$loginButton.on("click", this.onLogin);
      const remember = $.cookie('remember');
      if (remember == 'true') {
        const idNumber = $.cookie('idNumber');
        const password = $.cookie('password');
        // autofill the fields
        this.$idNumber.val(idNumber);
        this.$password.val(password);
      }
    }

    onLogin = () => {
      if (this.$remember[0].checked) {
        const idNumber = this.$idNumber.val();
        const password = this.$password.val();

        // set cookies to expire in 14 days
        $.cookie('idNumber', idNumber, { expires: 14 });
        $.cookie('password', password, { expires: 14 });
        $.cookie('remember', true, { expires: 14 });
      }
      else {
        // reset cookies
        $.cookie('email', null);
        $.cookie('password', null);
        $.cookie('remember', null);
      }

      const idNumber = this.$idNumber.val();
      const password = this.$password.val();
      const chsm = $.md5(`${idNumber}${password}upStrongLoginApi`);

      this.postLoginAPI({ account: idNumber, password, chsm });
    };

    postLoginAPI({ account, password, chsm }) {
      const that = this;

      $.ajax({
        url: this.loginApiUrl,
        type: "POST",
        data: {
          account,
          password,
          chsm,
        },
        success: function (res) {
          const resCode = res.returnCode;
          const resMessage = res.returnMessage;
          const resData = res.returnData;

          if (resCode !== "1") {
            // alert(resMessage);
            console.log('resCode', resCode);
            new CustomAlert({ content: resMessage }); //登入失敗
            
          } else {
            // 未完成, 登入成功後
            // 未完成, 記住我
            // save sesseionId、userType
            console.log('LOGIN SUCCESS');
            console.log(resData);
            // $.cookie('sessionId', resData.sessionId, { expires: 14 });
            // $.cookie('userType', resData.userType, { expires: 14 });
            // 在當前頁面中存儲資料
            sessionStorage.setItem('sessionId', resData.sessionId);
            sessionStorage.setItem('userType', resData.userType);

            console.log("session_id: ", resData.sessionId, 'userType', resData.userType);

            // route to HomePage
            window.location.assign(
              "../HomePage/index.html"
            );
          }
        },
        error: function () {
          $("#error").text("An error occurred. Please try again later.");
        },
      });
    }

    // 切換密碼顯示
    initTogglePassword(toggleButtonId, passwordInputId) {
      const togglePasswordButton = document.getElementById(toggleButtonId);
      const passwordInput = document.getElementById(passwordInputId);

      togglePasswordButton.addEventListener("click", function () {
        if (passwordInput.type === "password") {
          passwordInput.type = "text";
          togglePasswordButton.classList.remove("fa-eye");
          togglePasswordButton.classList.add("fa-eye-slash");
        } else {
          passwordInput.type = "password";
          togglePasswordButton.classList.remove("fa-eye-slash");
          togglePasswordButton.classList.add("fa-eye");
        }
      });
    }

  }

  new LoginPage();
})();
