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
	var step = "01";

	let params = new URLSearchParams(window.location.search);
	const testparams = Object.fromEntries(params.entries());
	let data = { workOrderId: testparams.workOrderID };

	let paramStep = params.get("step");

	let paramBigStep = params.get("bigstep");

	$(".next").on("click", function () {
		if (step == "01") {
			let newData = { value: {} };
			let mainValue = $("input[name='lv']:checked").val();

			if (mainValue === "0" || mainValue === "4") {
				newData.value[mainValue] = "1"; // 分級一和五
			} else {
				let payload = [];
				$(`.lv${mainValue}-sub-list-content:checked`).each((index, subValue) => {
					payload.push($(subValue).val());
				});
				newData.value[mainValue] = payload; // 分級二、三、四
			}

			// console.log("生成的新資料:", JSON.stringify(newData));

			oldData.item[paramBigStep].item[Number(step) - 1].item[1] = newData;
			oldData.item[paramBigStep].item[Number(step) - 1].item[2].value[5] = $("[name='cognition']:checked").val();
			oldData.item[paramBigStep].item[Number(step) - 1].item[2].value[6] = $("[name='vision']:checked").val();
			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update();
		} else if (step == "02") {
			let newData = [];

			// 初始化 newData 結構
			for (let i = 0; i < $(`[data-index]`).length; i++) {
				newData.push({ value: [] });
			}

			// 收集資料，使用正確的 data-index
			$(`[data-index]`).each((idx, e) => {
				let currentIndex = $(e).attr("data-index"); // 直接獲取 data-index
				console.log(`處理 data-index=${currentIndex}`);
				$(`[data-index="${currentIndex}"] select`).each((idxx, ee) => {
					let selectedValue = Number($(ee).val());
					// console.log(`select[${idxx}] 的值: ${selectedValue}`);
					newData[idx].value.push(selectedValue);
				});
			});

			console.log("step2 生成的資料:", JSON.stringify(newData));

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;
			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update();
		}
	});

	$(".prev").on("click", function () {
		if (step == "01") {
			let newData = [{ value: [] }];

			if ($("input[name='lv']:checked").val() == 4) {
				let payload = [];

				$("input[name='lv4_01']:checked").each((idx, e) => {
					payload.push(Number($(e).val()));
				});

				$("input[name='lv4_02']:checked").each((idx, e) => {
					payload.push(Number($(e).val()));
				});

				newData[0].value.push({ 4: payload });
			} else {
				newData[0].value.push(Number($("input[name='lv']:checked").val()));
			}

			oldData.item[paramBigStep].item[Number(step) - 1].item[1] = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].item[2].value[5] = $("[name='cognition']:checked").val();

			oldData.item[paramBigStep].item[Number(step) - 1].item[2].value[6] = $("[name='vision']:checked").val();

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update("prev");
		} else if (step == "02") {
			let newData = [];

			for (let i = 0; i < $(`[data-index]`).length; i++) {
				newData.push({ value: [] });
			}

			$(`[data-index]`).each((idx, e) => {
				$(`[data-index=${idx + 1}] select`).each((idxx, ee) => {
					newData[idx].value.push(Number($(ee).val()));
				});
			});

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update("prev");
		}
	});

	const getStep = () => {
		if (paramStep) {
			step = `0${paramStep}`;

			$(".title span span").html(`0${paramStep}`);

			$(".step01").css("display", "none");

			$(`.step0${paramStep}`).css("display", "block");
		}

		$(`[name="lv"]`).click(() => {
			$(`[name="lv4_01"]`).prop("checked", false);

			$(`[name="lv4_02"]`).prop("checked", false);
		});
	};

	// 定義設置 select 背景顏色的函數
	const setSelectBackground = (selectElement) => {
		const value = $(selectElement).val(); // 獲取 <select> 的選中值
		switch (value) {
			case "1":
				$(selectElement).css({
					"background-color": "#0DA9DA",
					color: "white",
				});
				break;
			case "2":
				$(selectElement).css("background-color", "#59BD40");

				$(selectElement).css({
					"background-color": "#59BD40",
					color: "white",
				});
				break;
			default:
				$(selectElement).css({
					"background-color": "transparent",
					color: "#654f00",
				});
				break;
		}
	};

	const getList = () => {
		let formData = new FormData();
		// console.log("getList started");

		let session_id = sessionStorage.getItem("sessionId");

		let action = "getCheckListByStep";

		let chsm = "upStrongCheckListApi"; // api文件相關

		let data = { step: "6" };

		chsm = $.md5(session_id + action + chsm);

		formData.append("session_id", session_id);

		formData.append("action", action);

		formData.append("chsm", chsm);

		formData.append("data", JSON.stringify(data));

		$.ajax({
			url: `${window.apiUrl}${window.apicheckList}`,

			type: "POST",

			data: formData,

			processData: false,

			contentType: false,

			success: function (res) {
				// console.log("getList response received:", res);

				let data02 = res.returnData.item[5].item[1];

				$(".step02 .list-box").html("");

				$(data02.item).each((idx, e) => {
					// console.log(e);
					// console.log(e.question);

					$(".step02 .list-box").append(`
    
              <div class="list">
    
                <div class="top-box">
    
                    <div class="left-box">
    
                        <span>${e.title}</span>
    
                        <span>推薦</span>
    
                    </div>
    
                    <div class="right-box">
    
                        <span>0</span>
    
                        <span>0</span>
    
                        <svg class="arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    
                            <path d="M9 18L15 12L9 6" stroke="#999999" stroke-linecap="round" stroke-linejoin="round"/>
    
                        </svg>
    
                    </div>
    
                </div>
    
                <div class="btm-box" data-index="${idx}"">
    
                </div>
    
            </div>
    
          `);

					$(e.question).each((idxx, ee) => {
						$(`[data-index="${idx}"]`).append(`
    
              <div>
    
                  <div class="left-box">
    
                      <span>${ee.title}</span>
    
                      <span class="${ee.tag ? "type01" : ""}">${ee.tag}</span>
    
                  </div>
    
                  <div class="right-box">
    
                      <select>
    
                          <option value="0">請選擇</option>
    
                          <option value="1">使用中</option>
    
                          <option value="2">建議添增</option>
    
                      </select>
    
                  </div>
    
              </div>
    
            `);
					});
				});

				// getCheckListRecord();

				// console.log("生成的 step2 DOM:", $(".step02 .list-box").html());

				$(".step02 .list-box .list").on("click", function () {
					$(this).toggleClass("active");
				});

				$(".step02 .list-box .btm-box").on("click", function (e) {
					e.stopPropagation();
				});

				// 初始化所有 select 的背景色
				$(".step02 .list-box select").each(function () {
					setSelectBackground(this);
				});

				// 為 select 添加 change 事件監聽器
				$(".step02 .list-box select").on("change", function () {
					setSelectBackground(this);
				});
			},
		});
	};

	getList();

	var oldData = null;

	const getCheckListRecord = () => {
		let formData = new FormData();

		let session_id = sessionStorage.getItem("sessionId");

		let action = "getCheckListRecord";

		let chsm = "upStrongCheckListApi"; // api文件相關

		chsm = $.md5(session_id + action + chsm);

		formData.append("session_id", session_id);

		formData.append("action", action);

		formData.append("chsm", chsm);

		formData.append("data", JSON.stringify(data));

		$.ajax({
			url: `${window.apiUrl}${window.apicheckList}`,

			type: "POST",

			data: formData,

			processData: false,

			contentType: false,

			success: function (res) {
				if (res.returnCode) {
					handleResponse(res);
					oldData = res.returnData;
					console.log(oldData);

					let data01 = res.returnData.item[paramBigStep].item[0];
					let data02 = res.returnData.item[paramBigStep].item[1];
					// console.log(data02.item);
					// console.log("data02.item.length:", data02.item.length);

					// console.log("完整的 data01 結構:", JSON.stringify(data01, null, 2));
					// console.log("data01.item[2].value:", data01.item[2].value);
					// console.log(data01.item[1].value);

					$(".user-detail .name").html(data01.item[0].value[0]);

					$(".user-detail .id").html(data01.item[0].value[1]);

					//區塊二資料

					let valueData = data01?.item?.[1]?.value;

					if (valueData === undefined) {
						console.log("valueData 是 undefined，請檢查 data01 結構");
						return;
					}

					// 根據資料格式處理
					const [key, val] = Object.entries(valueData)[0] || [];
					if (key && val) {
						if (key === "0" || key === "4") {
							// 分級一和五的處理
							if (val === "1") {
								$(`#lv${key}`).prop("checked", true);
							}
						} else {
							// 分級二、三、四的處理
							$(`#lv${key}`).prop("checked", true);
							if (Array.isArray(val)) {
								val.forEach((subVal) => {
									$(`.lv${key}-sub-list-content[value="${subVal}"]`).prop("checked", true);
								});
							}
						}
					}
					//區塊三資料

					$(data01.item[2].value).each((idx, e) => {
						// console.log(e);

						$(".other-box .text").each((idxx, ee) => {
							if (idx == idxx) {
								$(ee).text(e);
							}
						});
					});

					$(`#cognition${data01.item[2].value[5]}`).attr("checked", true);

					$(`#vision${data01.item[2].value[6]}`).attr("checked", true);

					// 資料回顯並設置背景色
					if (data02?.item) {
						$(data02.item).each((idx, item) => {
							if (item.value && Array.isArray(item.value)) {
								$(`[data-index="${idx}"] select`).each((idxx, select) => {
									if (idxx < item.value.length) {
										$(select).val(item.value[idxx]);
										setSelectBackground(select);
									}
								});
							}
						});
					}

					// step2 資料回顯
					if (data02?.item) {
						$(data02.item).each((idx, item) => {
							if (item.value && Array.isArray(item.value)) {
								$(`[data-index="${idx}"] select`).each((idxx, select) => {
									if (idxx < item.value.length) {
										$(select).val(item.value[idxx]);
										// console.log(`設置 data-index=${idx} 的第 ${idxx} 個 select 值為 ${item.value[idxx]}`);
									}
								});
							}
						});
					}

					// 先抓到所有的 .list 元素，會有多筆
					const listElements = document.querySelectorAll(".list");

					data02.item.forEach((obj, index) => {
						// 先檢查該筆 .list 是否存在（避免多或少不對齊）
						const currentList = listElements[index];
						if (!currentList) return;

						// 統計該 item 裡 value 陣列中 1 和 2 的數量
						let count1 = 0;
						let count2 = 0;
						obj.value.forEach((val) => {
							if (val === 1) count1++;
							if (val === 2) count2++;
						});

						// 找到該 .list 裡的 .right-box，並更新裡面兩個 span 的文字
						const rightBoxSpans = currentList.querySelectorAll(".right-box span");
						if (rightBoxSpans.length >= 2) {
							rightBoxSpans[0].textContent = count1;
							rightBoxSpans[1].textContent = count2;
						}
					});
				}
			},
		});
	};

	getStep();

	getCheckListRecord();

	$("input[name='lv']").on("change", function () {
		$("input[name='lv-sub']").prop("checked", false);
	});

	$(".step02 .list-box .list").on("click", function () {
		$(this).toggleClass("active");
	});

	$(".step02 .list-box .btm-box").on("click", function (e) {
		e.stopPropagation();
	});

	const update = (type) => {
		let formData = new FormData();

		let session_id = sessionStorage.getItem("sessionId");

		let action = "updateCheckListRecord";

		let chsm = "upStrongCheckListApi"; // api文件相關

		chsm = $.md5(session_id + action + chsm);

		formData.append("session_id", session_id);

		formData.append("action", action);

		formData.append("chsm", chsm);

		formData.append("data", JSON.stringify(oldData));

		formData.append(
			"data",
			JSON.stringify({
				...oldData,
				workOrderId: testparams.workOrderID,
			})
		);

		console.log("傳過去的資料:" + JSON.stringify(oldData));

		$.ajax({
			url: `${window.apiUrl}${window.apicheckList}`,

			type: "POST",

			data: formData,

			processData: false,

			contentType: false,

			success: function (res) {
				if (res.returnCode) {
					if (type != "prev") {
						if (step != "02") {
							$(".title span span").html(`0${Number(step) + 1}`);

							$(`.step0${Number(step)}`).css("display", "none");

							$(`.step0${Number(step) + 1}`).css("display", "block");

							step = `0${Number(step) + 1}`;

							const url = new URL(window.location.href);

							url.searchParams.set("step", Number(step));

							window.history.replaceState(null, "", url);
						} else {
							window.location.href = `../../AssessmentPage/index.html?workOrderID=${testparams.workOrderID}`;
						}
					} else {
						if (step != "01") {
							$(".title span span").html(`0${Number(step) - 1}`);

							$(`.step0${Number(step)}`).css("display", "none");

							$(`.step0${Number(step) - 1}`).css("display", "block");

							step = `0${Number(step) - 1}`;
						} else {
							window.location.href = `../../AssessmentPage/question/Index06.html?workOrderID=${testparams.workOrderID}`;
						}
					}
				}
			},

			error: function (e) {
				alert(e);
			},
		});
	};

	$(".home-box").click(() => {
		window.location.href = `../../AssessmentPage/index.html?workOrderID=${testparams.workOrderID}`;
	});
});
