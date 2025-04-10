// 全域變數
let collectedData = [];
let imageFiles = []; // 在全域範圍初始化 imageFiles

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

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
	const textarea = document.getElementById("limitedTextarea");
	const charCounter = document.querySelector(".char-counter");

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
});

// 📌 可重用的區塊類型
const containerClasses = [".textarea-box", ".addpic-box", ".ytlink-box"];

/**
 * 🗑️ 根據區塊類型更新所有垃圾桶按鈕狀態
 */
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

/**
 * 🔁 新增區塊功能
 */
function addNewSection(currentSection) {
	const newSection = currentSection.cloneNode(true);

	// 清空內容依類型處理
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

	// 顯示新增按鈕
	const addButton = newSection.querySelector(".bi-plus-circle-fill");
	if (addButton) addButton.style.display = "block";

	// 插入新區塊
	currentSection.after(newSection);

	// 聚焦輸入欄
	const inputElement = newSection.querySelector("textarea") || newSection.querySelector(".ytlink-input");
	if (inputElement) inputElement.focus();

	// 綁定圖片上傳事件
	bindImageUpload(newSection, "imageUpload");

	// 🗑️ 更新垃圾桶狀態
	const sectionType = containerClasses.find((cls) => newSection.matches(cls));
	if (sectionType) updateTrashButtons(sectionType);
}

/**
 * 👂 統一點擊事件處理
 */
document.addEventListener("click", function (e) {
	const button = e.target.closest(".btn-icon");
	if (!button) return;

	// 找出所在的區塊
	let currentSection = null;
	for (const className of containerClasses) {
		currentSection = button.closest(className);
		if (currentSection) break;
	}

	if (!currentSection) {
		console.error("❌ 找不到任何匹配的容器元素");
		return;
	}

	const isAddButton = button.querySelector(".bi-plus-circle-fill");
	const isTrashButton = button.querySelector(".bi-trash");

	// 判斷區塊類型並取得數量
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
				// 只讓最後一個的新增按鈕顯示
				addButton.style.display = index === allSections.length - 1 ? "block" : "none";
			}
		});
	}
	if (isTrashButton && sectionCount > 1) {
		const prevSection = currentSection.previousElementSibling;
		currentSection.remove();

		// 回顯前一個區塊的新增按鈕
		if (prevSection) {
			const prevAddBtn = prevSection.querySelector(".bi-plus-circle-fill");
			if (prevAddBtn) prevAddBtn.style.display = "block";
		}

		// 更新垃圾桶狀態
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

// 收集資料
function collectAllData() {
	collectedData = [];
	imageFiles = [];

	// 收集文字區塊資料
	document.querySelectorAll(".textarea-box").forEach((box, index) => {
		const content = box.querySelector(".recommendation-textarea").value;
		if (content) {
			collectedData.push({
				id: "",
				isMatch: true,
				content: content,
				description: "",
				url: "",
				checkListId: "",
				checkItemName: "",
				matchType: "1",
				recommendOrder: index + 1, // 根據順序設定值
				matchCondition: "",
				action: "set",
				workOrderId: params.workOrderID,
			});
		}
	});

	// 收集圖片區塊資料
	document.querySelectorAll(".addpic-box").forEach((box, index) => {
		const description = box.querySelector(".addpic-textarea").value;
		const fileInput = box.querySelector("#imageUpload");
		const previewImage = box.querySelector(".preview-image");
		const imageFile = fileInput.files[0];

		if (imageFile || description) {
			collectedData.push({
				id: "",
				isMatch: true,
				content: "",
				description: description || "",
				url: "",
				checkListId: "",
				checkItemName: "",
				matchType: "2",
				recommendOrder: index + 1, // 根據順序設定值
				matchCondition: "",
				action: "set",
				workOrderId: params.workOrderID,
				recommendPhoto: imageFile || null,
			});

			if (imageFile) {
				imageFiles.push({
					file: imageFile,
					description: description || "",
				});
			}
		}
	});

	// 收集YouTube區塊資料
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
				recommendOrder: index + 1, // 根據順序設定值
				matchCondition: "",
				action: "set",
				workOrderId: params.workOrderID,
			});
		}
	});

	return collectedData;
}
// // 單筆資料傳送函數（含圖片上傳）
function sendSingleData(dataItem, workOrderId) {
	let formData = new FormData();
	let session_id = sessionStorage.getItem("sessionId");
	let action = "setRecommendMatchDataById";
	let chsm = "upStrongRecommendApi";
	chsm = $.md5(session_id + action + chsm);

	// 基本資料
	formData.append("action", action);
	formData.append("session_id", session_id);
	formData.append("chsm", chsm);

	// 如果有圖片檔案，添加到FormData
	if (dataItem.recommendPhoto instanceof File) {
		formData.append("recommendPhoto", dataItem.recommendPhoto);
		let dataWithoutFile = { ...dataItem };
		delete dataWithoutFile.recommendPhoto;
		formData.append("data", JSON.stringify(dataWithoutFile));
	} else {
		formData.append("data", JSON.stringify(dataItem));
	}

	$.ajax({
		url: `${window.apiUrl}${window.apirecommend}`,
		type: "POST",
		data: formData,
		processData: false, // 必要！防止jQuery處理FormData
		contentType: false, // 必要！讓瀏覽器自動設置Content-Type
		success: function (res) {
			console.log(res);
			successResponse(res);
			window.location.href = `../AssessmentRecommendation/index.html?workOrderID=${params.workOrderID}`;
		},
		error: function (xhr, status, error) {
			console.error("API呼叫失敗:", error);
			alert("圖片上傳失敗，請稍後再試");
		},
	});
}

// Next按鈕點擊處理
document.querySelector(".next-button").addEventListener("click", function () {
	const dataToSend = collectAllData();

	// 檢查是否有任何資料被收集到
	if (dataToSend.length === 0) {
		// 如果沒有資料，直接跳轉
		window.location.href = `../AssessmentRecommendation/index.html?workOrderID=${params.workOrderID}`;
		return; // 結束函數執行
	}

	// 如果有資料，執行原本的傳送邏輯
	const allRequests = dataToSend.map((dataItem) => {
		return new Promise((resolve) => {
			sendSingleData(dataItem, params.workOrderID);
			resolve();
		});
	});

	Promise.all(allRequests)
		.then(() => {})
		.catch((error) => {
			console.error("資料傳送錯誤:", error);
		});
});
