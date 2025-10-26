// 全域變數
let collectedData = [];
let imageFiles = [];
let checkboxInitialStates = {};
let recommendData = null;

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

//文字匡自動符合內容大小
function autoResizeTextarea(element) {
	element.css("height", "auto");
	element.css("height", element.prop("scrollHeight") + "px");
}

// 綁定所有現有的和未來新增的 .edit-textarea
$(document).on("input", ".edit-textarea", function () {
	autoResizeTextarea($(this));
});

// 檢查是否為 YouTube 分享網址並轉為嵌入格式
function convertToEmbed(url) {
	if (url.includes("youtu.be")) {
		const videoId = url.split("/").pop().split("?")[0];
		return `https://www.youtube.com/embed/${videoId}`;
	}
	return url;
}

// 頁面載入時初始化
$(document).ready(function () {
	// 原始資料
	var oldData = null;

	// 取得套用清單
	let formData = new FormData();
	let session_id = sessionStorage.getItem("sessionId");
	let action = "getDefaultRecommendMatchDataListById";
	let chsm = "upStrongRecommendApi";
	chsm = $.md5(session_id + action + chsm);

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
			console.log("getDefaultRecommendMatchDataListById response:", res);
			if (res.returnCode == "1" && res.returnData) {
				// 定義三個容器
				let textContainer = $("#recommendation-container1");
				let imageContainer = $("#recommendation-container2");
				let youtubeContainer = $("#recommendation-container3");

				// 檢查容器是否存在
				if (!textContainer.length || !imageContainer.length || !youtubeContainer.length) {
					console.error(
						"一個或多個容器不存在，請檢查 HTML 是否包含 #recommendation-container1, #recommendation-container2, #recommendation-container3"
					);
					return;
				}

				recommendData = res.returnData;
				$("#title").append(res.returnData.title);

				recommendData.forEach((item) => {
					let contentHTML = "";
					let targetContainer = null;

					if (item.matchTypeName === "文字") {
						contentHTML = `
                            <div class="recommendation-item style01 mb-5 d-flex align-items-center" data-id="${
															item.id
														}">
                                <div class="card-body d-flex align-items-start checkbox-box shadow-sm">
                                    <input type="checkbox" class="isMatch-checkbox" id="${item.id}" 
                                        name="${item.id}" value="${item.checkListId}" 
                                        data-id="${item.id}" ${item.isMatch ? "checked" : ""}>
                                    <label for="${item.id}"></label>
                                    <div class="card-box w-100">
                                        <div class="text-content">
                                            <p class="card-text">${item.content.replace(/\n/g, "<br>")}</p>
                                            <textarea class="edit-textarea form-control d-none" rows="3">${
																							item.content
																						}</textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="edit-bottom">
                                    <button class="btn btn-link edit-btn" type="button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                        </svg>
                                    </button>
                                    <div class="edit-actions d-none">
                                        <button class="btn btn-sm btn-success save-btn">儲存</button>
                                        <button class="btn btn-sm btn-secondary cancel-btn">取消</button>
                                    </div>
                                </div>
                            </div>
                        `;
						targetContainer = textContainer;
					} else if (item.matchTypeName === "圖片") {
						contentHTML = `
                            <div class="recommendation-item mb-5 d-flex align-items-center" data-id="${item.id}">
                                <div class="card-body d-flex align-items-start checkbox-box shadow-sm">
                                    <input type="checkbox" class="isMatch-checkbox" id="${item.id}" 
                                        name="${item.id}" value="${item.checkListId}" 
                                        data-id="${item.id}" ${item.isMatch ? "checked" : ""}>
                                    <label for="${item.id}"></label>
                                    <div class="card-box">
                                        <img src="${item.url}" alt="${
							item.description
						}" class="img-fluid mb-3" style="width: 300px;">
                                        <div class="text-content">
                                            <p class="card-text">${item.description}</p>
                                            <textarea class="edit-textarea form-control d-none" rows="3">${
																							item.description
																						}</textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="edit-bottom">
                                    <button class="btn btn-link edit-btn" type="button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                        </svg>
                                    </button>
                                    <div class="edit-actions d-none">
                                        <button class="btn btn-sm btn-success save-btn">儲存</button>
                                        <button class="btn btn-sm btn-secondary cancel-btn">取消</button>
                                    </div>
                                </div>
                            </div>
                        `;
						targetContainer = imageContainer;
					} else if (item.matchTypeName === "youtube") {
						var URL = convertToEmbed(item.url);
						contentHTML = `
                            <div class="recommendation-item mb-5 d-flex align-items-center" data-id="${item.id}">
                                <div class="card-body d-flex align-items-start checkbox-box shadow-sm">
                                    <input type="checkbox" class="isMatch-checkbox" id="${item.id}" 
                                        name="${item.id}" value="${item.checkListId}" 
                                        data-id="${item.id}" ${item.isMatch ? "checked" : ""}>
                                    <label for="${item.id}"></label>
                                    <div class="card-box">
                                        <iframe class="mb-3 w-100" height="315" src="${URL}" 
                                            title="YouTube video" frameborder="0" allowfullscreen style="width: 300px;"></iframe>
                                        <div class="text-content">
                                            <p class="card-text">${item.description}</p>
                                            <textarea class="edit-textarea form-control d-none" rows="3">${
																							item.description
																						}</textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="edit-bottom">
                                    <button class="btn btn-link edit-btn" type="button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a.5.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                        </svg>
                                    </button>
                                    <div class="edit-actions d-none">
                                        <button class="btn btn-sm btn-success save-btn">儲存</button>
                                        <button class="btn btn-sm btn-secondary cancel-btn">取消</button>
                                    </div>
                                </div>
                            </div>
                        `;
						targetContainer = youtubeContainer;
					}

					if (targetContainer && contentHTML) {
						targetContainer.append(contentHTML);
					} else {
						console.warn(`無效的 matchTypeName 或容器未定義: ${item.matchTypeName}`);
					}

					checkboxInitialStates[item.id] = item.isMatch;
				});
			} else {
				console.error("API 回應異常:", res.message);
			}
		},
		error: function (xhr, status, error) {
			console.error("getDefaultRecommendMatchDataListById failed:", error);
			alert("無法獲取資料，請稍後重試");
		},
	});

	// 字數計數功能（limitedTextarea）
	const textarea = document.getElementById("limitedTextarea");
	const charCounter = document.querySelector(".char-counter");

	if (textarea && charCounter) {
		textarea.addEventListener("input", function () {
			const currentLength = this.value.length;
			const maxLength = parseInt(this.getAttribute("maxlength"));

			charCounter.textContent = `${currentLength}/${maxLength}`;

			if (currentLength > maxLength) {
				textarea.classList.add("border-danger", "border-2");
				charCounter.classList.remove("text-muted", "bg-light");
				charCounter.classList.add("text-danger", "bg-white");
			} else {
				textarea.classList.remove("border-danger", "border-2");
				charCounter.classList.remove("text-danger", "bg-white");
				charCounter.classList.add("text-muted", "bg-light");
			}
		});
	}

	// 可重用的區塊類型
	const containerClasses = [".textarea-box", ".addpic-box", ".ytlink-box"];

	// 更新垃圾桶按鈕狀態
	function updateTrashButtons(sectionType) {
		const allSections = document.querySelectorAll(sectionType);
		const count = allSections.length;

		allSections.forEach((section) => {
			const trashBtn = section.querySelector(".btn-icon .bi-trash")?.parentElement;
			if (trashBtn) {
				trashBtn.style.pointerEvents = count === 1 ? "none" : "auto";
				trashBtn.style.opacity = count === 1 ? "0.5" : "1";
			}
		});
	}

	// 新增區塊功能
	function addNewSection(currentSection) {
		const newSection = currentSection.cloneNode(true);

		if (newSection.classList.contains("textarea-box")) {
			newSection.querySelector("textarea").value = "";
		} else if (newSection.classList.contains("addpic-box")) {
			newSection.querySelector("textarea").value = "";
			newSection.querySelector(".char-counter").textContent = "0/100";

			const addpicIcon = newSection.querySelector(".addpic-icon");
			const previewImage = addpicIcon.querySelector(".preview-image");
			if (previewImage) previewImage.remove();

			addpicIcon.querySelector(".bi-plus").style.display = "block";

			const fileInput = addpicIcon.querySelector("#imageUpload");
			if (fileInput) fileInput.value = "";
		} else if (newSection.classList.contains("ytlink-box")) {
			newSection.querySelector(".ytlink-input").value = "";
			newSection.querySelector(".yttext-input").value = "";
		}

		const addButton = newSection.querySelector(".bi-plus-circle-fill");
		if (addButton) addButton.style.display = "block";

		currentSection.after(newSection);

		const inputElement = newSection.querySelector("textarea") || newSection.querySelector(".ytlink-input");
		if (inputElement) inputElement.focus();

		bindImageUpload(newSection, "imageUpload");

		const sectionType = containerClasses.find((cls) => newSection.matches(cls));
		if (sectionType) updateTrashButtons(sectionType);
	}

	// 統一點擊事件處理
	document.addEventListener("click", function (e) {
		const button = e.target.closest(".btn-icon");
		if (!button) return;

		let currentSection = null;
		for (const className of containerClasses) {
			currentSection = button.closest(className);
			if (currentSection) break;
		}

		if (!currentSection) {
			console.error("找不到匹配的容器元素");
			return;
		}

		const isAddButton = button.querySelector(".bi-plus-circle-fill");
		const isTrashButton = button.querySelector(".bi-trash");

		const sectionType = containerClasses.find((cls) => currentSection.matches(cls));
		const allSections = document.querySelectorAll(sectionType);
		const sectionCount = allSections.length;

		if (isAddButton) {
			addNewSection(currentSection);
			button.style.display = "none";
			updateAddButtons(sectionType);
		}

		function updateAddButtons(sectionType) {
			const allSections = document.querySelectorAll(sectionType);
			allSections.forEach((section, index) => {
				const addIcon = section.querySelector(".bi-plus-circle-fill");
				const addButton = addIcon?.closest("button");
				if (addButton) {
					addButton.style.display = index === allSections.length - 1 ? "block" : "none";
				}
			});
		}

		if (isTrashButton && sectionCount > 1) {
			const prevSection = currentSection.previousElementSibling;
			currentSection.remove();

			if (prevSection) {
				const prevAddBtn = prevSection.querySelector(".bi-plus-circle-fill");
				if (prevAddBtn) prevAddBtn.style.display = "block";
			}

			updateTrashButtons(sectionType);
			updateAddButtons(sectionType);
		}
	});

	// 字數計數功能（addpic-box）
	document.addEventListener("input", function (e) {
		if (e.target.classList.contains("addpic-textarea")) {
			const textarea = e.target;
			const counter = textarea.nextElementSibling;
			counter.textContent = `${textarea.value.length}/100`;
		}
	});

	// 點擊 addpic-icon 觸發檔案選擇
	document.addEventListener("click", function (e) {
		const addpicIcon = e.target.closest(".addpic-icon");
		if (!addpicIcon) return;

		e.stopPropagation();
		const fileInput = addpicIcon.querySelector("#imageUpload");
		if (fileInput) fileInput.click();
	});

	// 圖片上傳處理
	function bindImageUpload(container, inputId) {
		const input = container.querySelector(`#${inputId}`);
		if (!input) return;

		input.addEventListener("change", function (e) {
			const file = e.target.files[0];
			if (file) {
				const reader = new FileReader();

				reader.onload = function (event) {
					const addpicIcon = e.target.closest(".addpic-icon");
					const existingImg = addpicIcon.querySelector(".preview-image");
					if (existingImg) existingImg.remove();

					const img = document.createElement("img");
					img.src = event.target.result;
					img.classList.add("preview-image");
					addpicIcon.appendChild(img);

					addpicIcon.querySelector(".bi-plus").style.display = "none";

					const description = addpicIcon.closest(".addpic-box").querySelector(".addpic-textarea").value;
					imageFiles.push({
						file: file,
						description: description,
					});

					collectedData.push({
						content: "",
						description: description,
						url: "",
						action: "set",
					});
				};
				reader.readAsDataURL(file);
			}
		});
	}

	// 初始綁定圖片上傳
	bindImageUpload(document.querySelector(".addpic-box"), "imageUpload");

	// 編輯功能事件綁定
	$(document).on("click", ".edit-btn", function () {
		const $item = $(this).closest(".recommendation-item");
		const $textContent = $item.find(".text-content");
		const $p = $textContent.find(".card-text");
		const $textarea = $textContent.find(".edit-textarea");
		const $editBottom = $item.find(".edit-bottom");
		const $editBtn = $editBottom.find(".edit-btn");
		const $editActions = $editBottom.find(".edit-actions");

		const displayHtml = $p.html();
		const editText = displayHtml.replace(/<br\s*\/?>/gi, "\n");
		$textarea.val(editText);

		$p.addClass("d-none");
		$textarea.removeClass("d-none").focus();
		$editBtn.addClass("d-none");
		$editActions.removeClass("d-none");

		autoResizeTextarea($textarea);
		$textarea.data("original-content", editText);
	});

	$(document).on("click", ".save-btn", function () {
		const $item = $(this).closest(".recommendation-item");
		const $textContent = $item.find(".text-content");
		const $p = $textContent.find(".card-text");
		const $textarea = $textContent.find(".edit-textarea");
		const $editBottom = $item.find(".edit-bottom");
		const $editBtn = $editBottom.find(".edit-btn");
		const $editActions = $editBottom.find(".edit-actions");
		const itemId = $item.data("id");
		const newTextContent = $textarea.val();

		const newHtmlContent = newTextContent.replace(/\n/g, "<br>");
		$p.html(newHtmlContent).removeClass("d-none");

		$textarea.addClass("d-none");
		$editBtn.removeClass("d-none");
		$editActions.addClass("d-none");

		$textarea.data("current-content", newTextContent);
		$textarea.data("original-content", newTextContent);
	});

	$(document).on("click", ".cancel-btn", function () {
		const $item = $(this).closest(".recommendation-item");
		const $textContent = $item.find(".text-content");
		const $p = $textContent.find(".card-text");
		const $textarea = $textContent.find(".edit-textarea");
		const $editBottom = $item.find(".edit-bottom");
		const $editBtn = $editBottom.find(".edit-btn");
		const $editActions = $editBottom.find(".edit-actions");

		$textarea.val($textarea.data("original-content"));
		$p.removeClass("d-none");
		$textarea.addClass("d-none");
		$editBtn.removeClass("d-none");
		$editActions.addClass("d-none");
	});

	// 處理 checkbox API 的流程
	function processRequestsSequentially(items) {
		return items.reduce((promise, item) => {
			return promise.then(() => {
				const originalItem = recommendData.find((data) => data.id.toString() === item.recommendId);
				if (!originalItem) return Promise.resolve();

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

	// 收集編輯後的現有資料
	function collectEditedData() {
		let editedData = [];

		document.querySelectorAll(".recommendation-item").forEach((item, index) => {
			const itemId = item.getAttribute("data-id");
			console.groupCollapsed(`--- 處理編輯項目 ${index + 1}, ID: ${itemId} ---`);

			const originalItem = recommendData.find((data) => data.id.toString() === itemId.toString());
			if (!originalItem) {
				console.warn(`警告：找不到 ID 為 ${itemId} 的原始項目！`);
				console.groupEnd();
				return;
			}
			console.log("原始項目數據:", originalItem);

			const textarea = item.querySelector(".edit-textarea");
			if (!textarea) {
				console.warn(`警告：ID 為 ${itemId} 的項目找不到編輯文字區塊 (.edit-textarea)！`);
				console.groupEnd();
				return;
			}

			const currentContent = textarea.value.trim();
			let originalContent = "";
			if (originalItem.matchTypeName === "文字") {
				originalContent = (originalItem.content || "").trim();
			} else if (originalItem.matchTypeName === "圖片" || originalItem.matchTypeName === "youtube") {
				originalContent = (originalItem.description || "").trim();
			} else {
				console.warn(`警告：ID 為 ${itemId} 的項目有未知的 matchTypeName: ${originalItem.matchTypeName}`);
				console.groupEnd();
				return;
			}

			console.log(`項目 ID ${itemId} - matchTypeName: "${originalItem.matchTypeName}"`);
			console.log(`編輯後內容: "${currentContent}" (長度: ${currentContent.length})`);
			console.log(`原始內容: "${originalContent}" (長度: ${originalContent.length})`);

			const hasChanged = currentContent !== originalContent;
			console.log(`項目 ID ${itemId} - 是否有變更: ${hasChanged}`);

			if (hasChanged) {
				const updatedItem = {
					recommendId: originalItem.id, // 用於 delete 請求
					id: "", // 用於 set 請求，設為空字串
					isMatch: originalItem.isMatch,
					content: originalItem.matchTypeName === "文字" ? currentContent : originalItem.content || "",
					description: originalItem.matchTypeName !== "文字" ? currentContent : originalItem.description || "",
					url: originalItem.url || "",
					checkListId: Array.isArray(originalItem.checkListId)
						? originalItem.checkListId.join("&")
						: originalItem.checkListId || "",
					checkItemName: originalItem.checkItemName || "",
					matchType: originalItem.matchType || "",
					recommendOrder: originalItem.recommendOrder || editedData.length + 1,
					matchCondition: originalItem.matchCondition || "",
					sourceRecommendId: originalItem.sourceRecommendId || "",
					action: "set",
					workOrderId: params.workOrderID,
				};
				editedData.push(updatedItem);
				console.log("已加入編輯項目至 editedData：", updatedItem);
			}

			console.groupEnd();
		});

		console.log("收集到的編輯資料 (editedData 總計):", JSON.stringify(editedData, null, 2));
		return editedData;
	}

	// 依序處理編輯後的資料（先刪除後設置）
	function processEditedItemsSequentially(items) {
		return items.reduce((promise, item) => {
			return promise.then(() => {
				const deleteData = {
					workOrderId: params.workOrderID,
					recommendId: item.recommendId, // 使用 recommendId 進行刪除
					action: "delete",
				};
				console.log("發送刪除請求:", deleteData);
				return sendRecommendationRequest(deleteData).then(() => {
					const setData = { ...item, id: "" }; // 確保 id 為空
					delete setData.recommendId; // 移除 recommendId，避免 API 混淆
					console.log("發送設置請求:", setData);
					return sendRecommendationRequest(setData);
				});
			});
		}, Promise.resolve());
	}

	// 收集新增的文字、圖片、YouTube 資料
	function collectAllData() {
		let collectedData = [];

		// 收集新輸入的文字資料（textarea-box）
		document.querySelectorAll(".textarea-box").forEach((box, index) => {
			const content = box.querySelector(".recommendation-textarea").value;
			if (content) {
				collectedData.push({
					id: "",
					isMatch: true,
					content,
					description: "",
					url: "",
					checkListId: "",
					checkItemName: "",
					matchType: "1",
					recommendOrder: collectedData.length + 1,
					matchCondition: "",
					action: "set",
					workOrderId: params.workOrderID,
				});
			}
		});

		// 收集新輸入的圖片資料（addpic-box）
		document.querySelectorAll(".addpic-box").forEach((box, index) => {
			const description = box.querySelector(".addpic-textarea").value;
			const fileInput = box.querySelector("#imageUpload");
			const imageFile = fileInput.files[0];

			if (imageFile || description) {
				let item = {
					id: "",
					isMatch: true,
					content: "",
					description: description || "",
					url: "",
					checkListId: "",
					checkItemName: "",
					matchType: "2",
					recommendOrder: collectedData.length + 1,
					matchCondition: "",
					action: "set",
					workOrderId: params.workOrderID,
				};
				if (imageFile) item.recommendPhoto = imageFile;

				collectedData.push(item);
			}
		});

		// 收集新輸入的 YouTube 資料（ytlink-box）
		document.querySelectorAll(".ytlink-box").forEach((box, index) => {
			const url = box.querySelector(".ytlink-input").value;
			const videodescription = box.querySelector(".yttext-input").value;
			if (url) {
				collectedData.push({
					id: "",
					isMatch: true,
					content: "",
					description: videodescription,
					url: convertToEmbed(url),
					checkListId: "",
					checkItemName: "",
					matchType: "3",
					recommendOrder: collectedData.length + 1,
					matchCondition: "",
					action: "set",
					workOrderId: params.workOrderID,
				});
			}
		});

		console.log("收集到的新增資料 (collectedData 總計):", collectedData);
		return collectedData;
	}

	// API 請求 for checkbox 和編輯資料處理
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

			console.log("sendRecommendationRequest data:", data);

			$.ajax({
				url: `${window.apiUrl}${window.apirecommend}`,
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				success: function (res) {
					console.log("sendRecommendationRequest response:", res);
					if (res.returnCode === "1") {
						resolve(res);
					} else {
						reject(new Error("API 回傳錯誤訊息：" + res.message));
					}
				},
				error: function (error) {
					console.error("sendRecommendationRequest failed:", error);
					reject(error);
				},
			});
		});
	}

	// 單筆資料上傳，含圖片處理
	function sendSingleData(dataItem, workOrderId) {
		return new Promise((resolve, reject) => {
			let formData = new FormData();
			const session_id = sessionStorage.getItem("sessionId");
			const action = "setRecommendMatchDataById";
			const chsm = $.md5(session_id + action + "upStrongRecommendApi");

			formData.append("session_id", session_id);
			formData.append("action", action);
			formData.append("chsm", chsm);

			if (dataItem.recommendPhoto instanceof File) {
				formData.append("recommendPhoto", dataItem.recommendPhoto);
				let dataWithoutFile = { ...dataItem };
				delete dataWithoutFile.recommendPhoto;
				formData.append("data", JSON.stringify(dataWithoutFile));
				console.log("圖片檔案：", dataItem.recommendPhoto);
			} else {
				formData.append("data", JSON.stringify(dataItem));
			}

			console.log("sendSingleData data:", dataItem);

			$.ajax({
				url: `${window.apiUrl}${window.apirecommend}`,
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				success: function (res) {
					console.log("sendSingleData response:", res);
					if (res.returnCode === "1") {
						resolve(res);
					} else {
						reject(new Error("API 回傳錯誤訊息：" + res.msg));
					}
				},
				error: function (xhr, status, error) {
					console.error("sendSingleData failed:", error);
					reject(error);
				},
			});
		});
	}

	// 下一頁按鈕
	$(".next").on("click", function (e) {
		e.preventDefault();

		// 處理 checkbox 勾選狀態變更資料
		const $checkboxes = $(".isMatch-checkbox");
		let changedItems = [];

		$checkboxes.each(function () {
			const $checkbox = $(this);
			const checkboxId = $checkbox.data("id").toString();
			const isNowChecked = $checkbox.is(":checked");
			const wasInitiallyChecked = checkboxInitialStates[checkboxId];

			if (isNowChecked !== wasInitiallyChecked) {
				changedItems.push({
					checkbox: $checkbox,
					recommendId: checkboxId,
					isNowChecked: isNowChecked,
				});
				checkboxInitialStates[checkboxId] = isNowChecked;
			}
		});

		// 收集編輯後的現有資料

		const editedItems = collectEditedData();

		// 收集新增的文字、圖片、YouTube 資料
		const newItems = collectAllData();

		// 除錯日誌
		console.log("Checkbox 變更項目:", changedItems);
		console.log("編輯後項目:", editedItems);
		console.log("新增項目:", newItems);

		// 如果沒有任何資料變更，直接跳轉
		if (changedItems.length === 0 && editedItems.length === 0 && newItems.length === 0) {
			window.location.href = `../AssessmentRecommendation/index.html?workOrderID=${params.workOrderID}`;
			return;
		}

		// 依序處理 checkbox、編輯資料、新增資料
		processRequestsSequentially(changedItems)
			.then(() => processEditedItemsSequentially(editedItems))
			.then(() => {
				return Promise.all(
					newItems.map((dataItem) => {
						return sendSingleData(dataItem, params.workOrderID);
					})
				);
			})
			.then(() => {
				// 不重新呼叫 getDefaultRecommendMatchDataListById，保持 UI 不變
				// location.reload();
				window.location.href = `../AssessmentRecommendation/index.html?workOrderID=${params.workOrderID}`;
			})
			.catch((error) => {
				console.error("處理過程中發生錯誤:", error);
				alert("部分資料更新失敗，請稍後再試");
			});
	});
});
