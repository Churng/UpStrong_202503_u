// 檢查是否為分享網址格式
function convertToEmbed(url) {
	if (url.includes("youtu.be")) {
		const videoId = url.split("/").pop().split("?")[0]; // 提取 video_id
		return `https://www.youtube.com/embed/${videoId}`;
	}
	return url;
}

$(document).ready(function () {
	//判斷身份隱藏按鈕
	const savedUserType = JSON.parse(sessionStorage.getItem("userType"));
	console.log(typeof savedUserType);

	if (savedUserType == 1) {
		$(".coach-edit").css("visibility", "hidden");
	} else {
		$(".coach-edit").css("visibility", "visible");
	}
	let formData = new FormData();

	let session_id = sessionStorage.getItem("sessionId");
	let action = "getRecommendByWorkOrderId";
	let chsm = "upStrongRecommendApi";
	chsm = $.md5(session_id + action + chsm);

	const urlSearchParams = new URLSearchParams(window.location.search);
	const params = Object.fromEntries(urlSearchParams.entries());
	let data = { workOrderId: params.workOrderID };

	formData.append("action", action);
	formData.append("session_id", session_id);
	formData.append("chsm", chsm);
	formData.append("data", JSON.stringify(data));

	// 測試用
	// for (let pair of formData.entries()) {
	//     console.log(pair[0] + ': ' + pair[1]);
	// }

	// 發送 API 請求
	$.ajax({
		url: `${window.apiUrl}${window.apirecommend}`,
		type: "POST",
		data: formData,
		processData: false,
		contentType: false,
		success: function (response) {
			if (response.returnCode == "1" && response.returnData) {
				handleResponse(response); //處理API回傳
				let recommendationContainer = $("#recommendation-container");
				let recommendData = response.returnData.recommendData;
				$("#title").append(response.returnData.title); //標題

				// console.log("回傳資料:"+ response) //回傳資料
				recommendData.sort((a, b) => a.order - b.order); //根據order排序
				recommendData.forEach((item) => {
					let contentHTML = "";
					if (item.type === "word") {
						//純文字
						contentHTML = `
                            <div class="recommendation-item  mb-5 shadow-sm">
                                <div class="card-body">
                                    <h5 class="card-title">${item.content.replace(/\n/g, "<br>")}</h5>
                                    <p class="card-text">${item.url}</p>
                                    <p class="card-text">${item.description}</p>
                                </div>
                            </div>
                        `;
					} else if (item.type === "image") {
						//圖片
						contentHTML = `
                        <div class="recommendation-item mb-5 shadow-sm">
                                <div class="card-body">
                                    <h5 class="card-title">${item.content}</h5>
                                    <img src="${item.url}" alt="${item.description}" class="img-fluid mb-3" style="width: 300px;">
                                    <p class="card-text">${item.description}</p>
                                </div>
                            </div>
                        `;
					} else if (item.type === "youtube") {
						//嵌入Youtube影片
						var URL = convertToEmbed(item.url);
						contentHTML = `
                            <div class="recommendation-item  mb-5 shadow-sm">
                                <div class="card-body">
                                    <h5 class="card-title">${item.content}</h5>
                                    <iframe class="mb-3 w-100" height="315" src="${URL}" title="YouTube video" frameborder="0" allowfullscreen style="width: 300px;"></iframe>
                                    <p class="card-text">${item.description}</p>
                                </div>
                            </div>
                        `;
					}

					// 將內容塞到html
					recommendationContainer.append(contentHTML);
				});
				//     // }
			} else {
				console.error("API 回應異常:", response.message);
			}
		},
		error: function (xhr, status, error) {
			// 處理錯誤
			console.error("API 呼叫失敗:", error);
		},
	});

	//進入編輯頁面
	document.querySelector(".btn.coach-edit").addEventListener("click", function () {
		window.location.href = `../AssessmentRecommendationEditorCustom/index.html?workOrderID=${params.workOrderID}`;
	});
});
