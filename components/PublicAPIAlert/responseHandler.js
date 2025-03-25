// responseHandler.js

function handleResponse(res) {
	// alert("載入中");
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
