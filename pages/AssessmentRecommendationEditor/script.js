// 檢查是否為分享網址格式
function convertToEmbed(url) {
	if (url.includes("youtu.be")) {
		const videoId = url.split("/").pop().split("?")[0]; // 提取 video_id
		return `https://www.youtube.com/embed/${videoId}`;
	}
	return url;
}

$(document).ready(function () {
	var oldData = null;
	let recommendData = null;
	let checkboxInitialStates = {}; // To store initial checkbox states

	//取得套用清單
	let formData = new FormData();
	let session_id = sessionStorage.getItem("sessionId");
	let action = "getDefaultRecommendMatchDataListById";
	let chsm = "upStrongRecommendApi";
	chsm = $.md5(session_id + action + chsm);

	const urlSearchParams = new URLSearchParams(window.location.search);
	const params = Object.fromEntries(urlSearchParams.entries());
	let data = { workOrderId: params.workOrderID };

	formData.append("action", action);
	formData.append("session_id", session_id);
	formData.append("chsm", chsm);
	formData.append("data", JSON.stringify(data));

	// 發送 API 請求
	$.ajax({
		url: `${window.apiUrl}${window.apirecommend}`,
		type: "POST",
		data: formData,
		processData: false,
		contentType: false,
		success: function (res) {
			console.log(res);
			handleResponse(res);

			if (res.returnCode == "1" && res.returnData) {
				let recommendationContainer = $("#recommendation-container");
				recommendData = res.returnData;
				$("#title").append(res.returnData.title); //標題

				recommendData.forEach((item) => {
					let contentHTML = "";
					if (item.matchTypeName === "文字") {
						//純文字
						contentHTML = `
                            <div class="recommendation-item style01 mb-5 shadow-sm">
                                <div class="card-body d-flex align-items-start checkbox-box">
                                    <input type="checkbox" class="isMatch-checkbox" id="${item.id}" 
                                        name="${item.id}" value="${item.checkListId}" 
                                        data-id="${item.id}" ${item.isMatch ? "checked" : ""}>
                                    <label for="${item.id}"></label>
                                    <div class="card-box">
                                        <p class="card-text">${item.content}</p>
                                    </div>
                                </div>
                            </div>
                        `;
					} else if (item.matchTypeName === "圖片") {
						//圖片
						contentHTML = `
                            <div class="recommendation-item mb-5 shadow-sm">
                                <div class="card-body d-flex align-items-start checkbox-box">
                                    <input type="checkbox" class="isMatch-checkbox" id="${item.id}" 
                                        name="${item.id}" value="${item.checkListId}" 
                                        data-id="${item.id}" ${item.isMatch ? "checked" : ""}>
                                    <label for="${item.id}"></label>
                                    <div class="card-box">
                                        <img src="${item.url}" alt="${
							item.description
						}" class="img-fluid mb-3" style="width: 300px;">
                                        <p class="card-text">${item.description}</p>
                                    </div>
                                </div>
                            </div>
                        `;
					} else if (item.matchTypeName === "youtube") {
						//嵌入Youtube影片
						var URL = convertToEmbed(item.url);
						contentHTML = `
                            <div class="recommendation-item mb-5 shadow-sm">
                                <div class="card-body d-flex align-items-start checkbox-box">
                                    <input type="checkbox" class="isMatch-checkbox" id="${item.id}" 
                                        name="${item.id}" value="${item.checkListId}" 
                                        data-id="${item.id}" ${item.isMatch ? "checked" : ""}>
                                    <label for="${item.id}"></label>
                                    <div class="card-box">
                                        <iframe class="mb-3 w-100" height="315" src="${URL}" 
                                            title="YouTube video" frameborder="0" allowfullscreen style="width: 300px;"></iframe>
                                        <p class="card-text">${item.description}</p>
                                    </div>
                                </div>
                            </div>
                        `;
					}

					// 將內容塞到html
					recommendationContainer.append(contentHTML);

					// Store initial checkbox state
					checkboxInitialStates[item.id] = item.isMatch;
				});
			} else {
				console.error("API 回應異常:", res.message);
			}
		},
		error: function (xhr, status, error) {
			console.error("API 呼叫失敗:", error);
		},
	});

	$(".next")
		.off("click")
		.on("click", function (e) {
			e.preventDefault();

			// 找出有變更的 checkbox
			const $checkboxes = $(".isMatch-checkbox");
			let changedItems = [];

			$checkboxes.each(function () {
				const $checkbox = $(this);
				const checkboxId = $checkbox.data("id").toString();
				const isNowChecked = $checkbox.is(":checked");
				const wasInitiallyChecked = checkboxInitialStates[checkboxId];

				// 只有狀態改變時才加入處理陣列
				if (isNowChecked !== wasInitiallyChecked) {
					changedItems.push({
						checkbox: $checkbox,
						recommendId: checkboxId,
						isNowChecked: isNowChecked,
					});
					// 更新初始狀態，避免後續重複觸發
					checkboxInitialStates[checkboxId] = isNowChecked;
				}
			});

			console.log(changedItems);

			// 如果沒有變更，直接跳轉
			if (changedItems.length === 0) {
				window.location.href = `../AssessmentRecommendationEditorCustom/index.html?workOrderID=${params.workOrderID}`;
				return;
			}

			// 按順序逐一處理 API 請求
			processRequestsSequentially(changedItems)
				.then(() => {
					console.log("所有請求處理完成");
					window.location.href = `../AssessmentRecommendationEditorCustom/index.html?workOrderID=${params.workOrderID}`;
				})
				.catch((error) => {
					console.error("更新失敗:", error);
					alert("部分更新失敗，請稍後再試");
				});
		});

	// 封裝逐一處理請求的函數
	function processRequestsSequentially(items) {
		return items.reduce((promise, item) => {
			return promise.then(() => {
				const originalItem = recommendData.find((data) => data.id.toString() === item.recommendId);
				if (!originalItem) return Promise.resolve(); // 若無資料，跳過

				const requestData = {
					workOrderId: params.workOrderID,
					action: item.isNowChecked ? "set" : "delete",
				};

				if (item.isNowChecked) {
					let checkListIds = "";
					if (Array.isArray(originalItem.checkListId)) {
						checkListIds = originalItem.checkListId.join("&");
					} else if (originalItem.checkListId) {
						checkListIds = originalItem.checkListId.toString();
					}

					Object.assign(requestData, {
						isMatch: true,
						content: originalItem.content || "",
						url: originalItem.url || "",
						description: originalItem.description || "",
						checkListId: checkListIds,
						checkItemName: originalItem.checkItemName || "",
						matchType: originalItem.matchType || "",
						recommendOrder: originalItem.recommendOrder !== undefined ? originalItem.recommendOrder : 0,
						matchCondition: originalItem.matchCondition || "",
						sourceRecommendId: originalItem.sourceRecommendId || "",
					});
				} else {
					Object.assign(requestData, {
						recommendId: item.recommendId,
					});
				}

				return sendRecommendationRequest(requestData);
			});
		}, Promise.resolve());
	}

	// 原有的 API 請求函數
	function sendRecommendationRequest(data) {
		return new Promise((resolve, reject) => {
			let formData = new FormData();
			formData.append("session_id", sessionStorage.getItem("sessionId"));
			formData.append("action", "setRecommendMatchDataById");
			formData.append(
				"chsm",
				$.md5(sessionStorage.getItem("sessionId") + "setRecommendMatchDataById" + "upStrongRecommendApi")
			);
			formData.append("data", JSON.stringify(data));

			console.log("發送 API 請求:", {
				url: `${window.apiUrl}${window.apirecommend}`,
				data: JSON.stringify(data),
				formData: [...formData.entries()], // 查看 FormData 內容
			});

			$.ajax({
				url: `${window.apiUrl}${window.apirecommend}`,
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				success: function (res) {
					if (res.returnCode === "1") {
						resolve();
					} else {
						reject(res.message);
					}
				},
				error: function (error) {
					reject(error);
				},
			});
		});
	}
});
