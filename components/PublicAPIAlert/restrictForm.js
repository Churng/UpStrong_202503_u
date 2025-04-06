// 身份判斷與表單控制功能
function restrictFormByIdentity(userType) {
	console.log(userType);

	// 定義需要禁用的元素選擇器
	const disableSelectors = [
		'input[type="text"]',
		'input[type="radio"]',
		'input[type="checkbox"]',
		"textarea",
		".btm-box select", // 關鍵修改：改用 .btm-box 作為父級選擇器
		".button-box",
	];

	if (userType === 1) {
		// 新增 MutationObserver 監聽動態內容
		const observer = new MutationObserver((mutations) => {
			mutations.forEach(() => {
				applyDisableStyles();
			});
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});

		// 初始執行
		applyDisableStyles();

		function applyDisableStyles() {
			disableSelectors.forEach((selector) => {
				document.querySelectorAll(selector).forEach((el) => {
					// 處理 select 元素
					if (el.matches("select")) {
						el.disabled = true;
						el.style.backgroundColor = "#f0f0f0";
						el.style.cursor = "not-allowed";
					}
					// 處理 button-box
					else if (el.matches(".button-box")) {
						el.style.pointerEvents = "none";
					}
					// 處理其他輸入元素
					else {
						el.readOnly = true;
						el.disabled = true;
						el.style.backgroundColor = "#f0f0f0";
						el.style.cursor = "not-allowed";
					}
				});
			});
		}
	}
}

// 暴露到全域
window.restrictFormByIdentity = restrictFormByIdentity;

// DOM 載入後執行
document.addEventListener("DOMContentLoaded", function () {
	// 模擬使用者類型 (實際應從後端獲取)
	const currentUserType = sessionStorage.getItem("userType");
	restrictFormByIdentity(currentUserType);
});
