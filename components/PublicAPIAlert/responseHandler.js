// responseHandler.js

function handleResponse(res) {
	//系統異常
	if (res.returnCode === "002") {
		new CustomAlert({ content: res.returnMessage });
		window.location.assign("../LoginPage/index.html");
	}

	//重新登入
	if (res.returnCode === "003") {
		new CustomAlert({ content: res.returnMessage });

		window.location.assign("../LoginPage/index.html"); // 從根目錄開始
	}
}

//自訂套用頁面
function successResponse(res) {
	//儲存成功
	if (res.returnCode === "1") {
		new CustomAlert({ content: "儲存成功" });
	}
}
