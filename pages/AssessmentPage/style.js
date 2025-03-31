if (window.consoleToggle) {
	var console = {};

	console.log = function () {};
} else {
	var iframe = document.createElement("iframe");

	iframe.style.display = "none";

	document.body.appendChild(iframe);

	console = iframe.contentWindow.console;

	window.console = console;
}

$(document).ready(function () {
	const urlSearchParams = new URLSearchParams(window.location.search);
	const params = Object.fromEntries(urlSearchParams.entries());
	let data = { workOrderId: params.workOrderID };

	//判斷身份隱藏按鈕
	const savedUserType = JSON.parse(sessionStorage.getItem("userType"));
	console.log(typeof savedUserType8);

	if (savedUserType == 2) {
		console.log("教練");
		if (data.workOrderId) {
			const link = document.querySelector(".userInfo-link");
			console.log("找到的連結元素:", link);
			document.querySelector(".userInfo-link").href = `../EditUserInfoPage/index.html?workOrderID=${data.workOrderId}`;
		}
	} else {
		console.log("個案");
		document.querySelector(".userInfo-link").href = `../EditUserInfoPage/index.html`;
	}

	return;

	// 加入 getNextPage 函數
	function getNextPage(currentUrl) {
		const urlParts = currentUrl.split("?");
		const path = urlParts[0];
		const params = new URLSearchParams(urlParts[1]);

		const currentQuestionMatch = path.match(/question_a(\d+)\.html/);
		if (!currentQuestionMatch) return null;
		const currentNum = parseInt(currentQuestionMatch[1]);
		const nextNum = currentNum + 1;
		const nextQuestion = `question_a${nextNum.toString().padStart(2, "0")}.html`;
		const nextPath = path.replace(/question_a\d+\.html/, nextQuestion);

		params.set("step", "1");
		const currentBigStep = parseInt(params.get("bigstep"));
		params.set("bigstep", currentBigStep + 1);

		return `${nextPath}?${params.toString()}`;
	}
});
