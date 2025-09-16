window.apiUrl = "https://www.88bakery.tw/";
window.consoleToggle = false;

// 依據檔案名稱，下載對應檔案的API，若成功可直接下載檔案
window.apigetFile = "/upStrongAdminDemo/api/file/getFile.php";

//教練基本資料更新API
window.apicoachDetail = "/upStrongAdminDemo/api/user/coachDetail.php";

//讀取服務列表API
window.apiserviceData = "/upStrongAdminDemo/api/service/serviceData.php";

//個案基本資料更新API
window.apiuserDetail = "/upStrongAdminDemo/api/user/userDetail.php";

//取的評估量表、問題列表API
window.apicheckList = "/upStrongAdminDemo/api/checkList/checkList.php";

//忘記密碼API
window.apiforgetPassword = "/upStrongAdminDemo/api/auth/forgetPassword.php";

//登入API
window.apilogin = "/upStrongAdminDemo/api/auth/login.php";

//訂單列表API
window.apiorder = "/upStrongAdminDemo/api/order/order.php";

//報價單API
window.apiquotation = "/upStrongAdminDemo/api/quotation/quotation.php";

//教練工單API
window.apitraining = "/upStrongAdminDemo/api/training/training.php";

//我的訓練API
window.apiworkOrder = "/upStrongAdminDemo/api/workOrder/workOrder.php";

//評估建議API
window.apirecommend = "/upStrongAdminDemo/api/recommend/recommend.php";

if (document.location.host == "www.88bakery.tw" || document.location.host == "88bakery.tw") {
	consoleToggle = true;
}
