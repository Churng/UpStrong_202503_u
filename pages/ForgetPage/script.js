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

  class ForgetPage {
    $idNumber = $("#idNumber");
    $email = $("#email");
    $forgetButton = $("#forget-btn");

    forgetPasswordAPIUrl =
      `${window.apiUrl}${window.apiforgetPassword}`;

    constructor() {
      this.init();
    }

    init() {
      this.$forgetButton.on("click", this.onForget);
    }

    onForget = () => {
      const idNumber = this.$idNumber.val();
      const email = this.$email.val();
      const chsm = $.md5(`${idNumber}${email}upStrongForgetPasswordApi`);

      this.postForgetPasswordAPI({ account: idNumber, email, chsm });
    };

    postForgetPasswordAPI({ account, email, chsm }) {
      $.ajax({
        url: this.forgetPasswordAPIUrl,
        type: "POST",
        data: {
          account,
          email,
          chsm,
        },
        success: function (res) {
          const resCode = res.returnCode;
          const resMessage = res.returnMessage;
        console.log("resCode:"+resCode)
        console.log("resMessage:"+resMessage)
          if (resCode !== "1") {
            new CustomAlert({ content: resMessage });
          } else {
            // 未完成, 新密碼寄至註冊信箱後
            console.log('Forget SUCCESS');
            console.log(res);
            // route to HomePage
            // window.location.assign(
            //   "../HomePage/index.html"
            // );
          }
        },
        error: function () {
          $("#error").text("An error occurred. Please try again later.");
        },
      });
    }
  }

  new ForgetPage();
})();
