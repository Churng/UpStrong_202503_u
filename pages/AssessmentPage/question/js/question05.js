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

	let targetScore = 0;

	let isRightBoxInitialized = false;

	function formatDate(date) {
		const year = date.getFullYear();

		const month = String(date.getMonth() + 1).padStart(2, "0");

		const day = String(date.getDate()).padStart(2, "0");

		return `${year}/${month}/${day}`;
	}

	$(".next").on("click", function () {
		if (step === "01") {
			// Step 1 資料處理
			let newData = [{ value: [] }];
			if ($("input[name='lv']:checked").val() == 4) {
				let payload = [];
				$("input[name='lv4']:checked").each((idx, e) => {
					payload.push(Number($(e).val()));
				});
				newData[0].value.push({ 4: payload });
			} else {
				newData[0].value.push(Number($("input[name='lv']:checked").val()));
			}

			// 更新本地 oldData
			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;
			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			// 調用 update()，明確傳入 "next" 表示下一頁
			update("next").then(() => {
				// 切換到 step2
				step = "02";
				$(".title span span").html(step);
				$(`.step01`).css("display", "none");
				$(`.step02`).css("display", "block");

				const url = new URL(window.location.href);
				url.searchParams.set("step", Number(step));
				window.history.replaceState(null, "", url);

				// 獲取 step2 的預設資料並顯示
				getCheckListRecord();
			});
		} else if (step === "02") {
			// Step 2 資料處理
			let newData = {};
			let result = {};
			const lengthOfList = 12;

			// 從 oldData 中取得現有資料作為基礎
			let currentData = {};
			if (
				oldData?.item?.[paramBigStep] &&
				Array.isArray(oldData.item[paramBigStep]?.item) &&
				oldData.item[paramBigStep]?.item[Number(step) - 1]?.item &&
				Array.isArray(oldData.item[paramBigStep]?.item[Number(step) - 1]?.item)
			) {
				currentData = oldData.item[paramBigStep].item[Number(step) - 1].item[0].value || {};
			}

			for (let i = 0; i < lengthOfList; i++) {
				// 取得現有資料（如果存在），否則初始化為空物件
				let obj = currentData[i] ? { ...currentData[i] } : {};

				// 更新 target 值
				const targetValue = Number($(`.table-box[data-target=${i}] .select-box`).text().trim());
				const targetValue2 = $(`input[data-list-id=0]`).val(); // 目標值

				if (i === 0) {
					obj["target"] = { 0: targetValue2 };
				} else {
					obj["target"]["0"] = targetValue;

					// 只在 savedData 有修改時更新，否則保留舊值
					if (savedData.hasOwnProperty(i.toString())) {
						obj["target"]["1"] = savedData[i.toString()];
					}
				}

				// 處理特殊索引 i === 7 和 i === 8
				if (i === 7) {
					$(`input[data-list-id=7]`).each((inx, e) => {
						if ($(e).is(":checked")) {
							obj["option"] = Number($(e).val());
						}
					});
				}
				if (i === 8) {
					obj["description"] = $(`input[data-list-id=8]`).val();
				}

				// 將更新後的 obj 存入 newData 和 result
				newData[i] = obj;
				result[i] = obj;
			}

			// 更新 oldData
			if (
				oldData?.item?.[paramBigStep] &&
				Array.isArray(oldData.item[paramBigStep]?.item) &&
				oldData.item[paramBigStep]?.item[Number(step) - 1]?.item &&
				Array.isArray(oldData.item[paramBigStep]?.item[Number(step) - 1]?.item)
			) {
				oldData.item[paramBigStep].item[Number(step) - 1].item[0].value = result;
			}
			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			// console.log(result);

			// 調用 update()，明確傳入 "next" 表示下一頁
			update("next");
		}
	});
	$(".prev").on("click", function () {
		if (step == "01") {
			let newData = [{ value: [] }];

			if ($("input[name='lv']:checked").val() == 4) {
				let payload = [];

				$("input[name='lv4']:checked").each((idx, e) => {
					payload.push(Number($(e).val()));
				});

				newData[0].value.push({ 4: payload });
			} else {
				newData[0].value.push(Number($("input[name='lv']:checked").val()));
			}

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update("prev");
		} else if (step == "02") {
			update("prev");
		}
	});

	//評分標準說明

	$(".score-box").on("click", function () {
		$(".tips-box-bg").css("display", "block");
	});

	$(".tips-box .close-box").on("click", function () {
		$(".tips-box-bg").css("display", "none");
	});

	//彈出視窗
	var testdata = null;
	var savedData = {}; // 存儲所有填寫的數據
	// var targetScore = 0;

	function showPopupBox(target, text) {
		$(".popup-box-bg").css("display", "block");
		testdata = $(text);

		if (testdata.text()) {
			$(`#level${testdata.text()}`).prop("checked", true);
		}

		const textarea = $(".popup-box textarea");
		textarea.attr("id", `popupTextArea_${target}`);

		// 優先讀取 savedData（即使用者新輸入但尚未送出的值）
		let supplement = savedData[target];

		// 如果 savedData 沒有，再從 oldData 裡抓（也就是原本舊的資料）
		if (supplement === undefined) {
			const data = oldData.item[paramBigStep].item[1].item[0].value[target];
			supplement = data && data.target && data.target["1"] ? data.target["1"] : "";
		}

		textarea.val(supplement || "");
	}

	function closePopupBox() {
		$(".popup-box-bg").css("display", "none");
	}

	function saveDataAndClose() {
		if (!testdata) return;

		const target = testdata.closest(".table-box").attr("data-target");
		const textarea = $(`#popupTextArea_${target}`);

		savedData[target] = textarea.val();

		const selectedValue = Number($("[name='level']:checked").val());
		const previousValue = Number(testdata.text()) || 0;
		targetScore += selectedValue - previousValue;

		testdata.text(selectedValue);
		$("#level1").prop("checked", true);
		$(".left-box .score .target-box").text(`${targetScore}分`);

		closePopupBox();
	}

	$(".select-box").on("click", function () {
		const target = $(this).closest(".table-box").attr("data-target");
		showPopupBox(target, this);
	});

	$(".popup-box .close-box").on("click", closePopupBox);
	$(".button-box button").on("click", saveDataAndClose);

	const getStep = () => {
		if (paramStep) {
			step = `0${paramStep}`;

			$(".title span span").html(`0${paramStep}`);

			$(".step01").css("display", "none");

			$(`.step0${paramStep}`).css("display", "block");
		}

		$(`[name="lv"]`).click(() => {
			$(`[name="lv4"]`).prop("checked", false);
		});
	};

	const sortInnerObject = (obj) => {
		const { target, ...rest } = obj;

		const sortedRest = Object.keys(rest)

			.sort()

			.reduce((acc, key) => {
				acc[key] = rest[key];

				return acc;
			}, {});

		return { target, ...sortedRest };
	};

	var oldData = null;
	//預設資料
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
				console.log(res);

				if (res.returnCode) {
					handleResponse(res);
					//教練名稱
					if (res.assessmentor) {
						$(".coach-name span:first").text(res.assessmentor);
					}
					// console.log(res);

					oldData = res.returnData;

					let data01 = res.returnData.item[paramBigStep].item[0]; //粗大動作功能分級 01/02

					let data02 = res.returnData.item[paramBigStep].item[1].item[0].value; //粗大動作功能分級 02/02

					if (typeof data01.item[0].value[0] !== "object") {
						$(`#lv${data01.item[0].value[0]}`).attr("checked", true);
					} else {
						$.each(data01.item[0].value[0], (level, checkboxValues) => {
							$(`#lv${level}`).attr("checked", true);

							checkboxValues.map((i) => {
								$(`#lv${level}_0${i}`).attr("checked", true);
							});
						});
					}

					$(".right-box .table-box").html("");
					const sortedTableData = Object.keys(data02).reduce((acc, key) => {
						acc[key] = sortInnerObject(data02[key]);
						return acc;
					}, {});

					// console.log(sortedTableData);

					const transformedData = Object.entries(sortedTableData).flatMap(([idx, obj]) =>
						Object.keys(obj).map((key, idxx) => ({
							id: idx,
							date: key,
							value: Object.values(obj)[idxx],
							pastnum: idxx,
						}))
					);

					// console.log(transformedData);

					$(transformedData).each((idx, e) => {
						// 單獨處理 id=7 和 id=8 的資料
						if (e.date == "option") {
							// console.log(e.id == "option");
							if (e.id == 7) {
								$(`#radio0${e.value}`).attr("checked", true);
							}
						} else if (e.date == "description") {
							$(`[data-list-id=8]`).val(e.value); // 設置 input
						}

						if (e.date == "target") {
							// 目標值
							if (e.id == 0) {
								$(".left-box .lv-box .target-box").text(e.value[0]);

								// 目標值有需要readonly的話可以取消註解
								// const $input = $(".left-box .target-box");
								// if (!$input.val()) {
								// 	$input.val(e.value[0]);
								// }
								// $input.prop("readonly", true);
							} else {
								$(`[data-target=${e.id}] .select-box`).text(e.value[0]); // ✅ 只顯示分數
							}
						} else if (e.date != "target") {
							// 處理其他 id 的資料
							if (e.id == 0) {
								//項目日期
								$(".right-box .date-box").append(`
									<span class="past-box">${e.date}</span>
								`);
								//功能分級-紀錄
								$(`[data-past=${e.id}]`).append(`
									<span class="past-box">${e.value[0]}</span>
								`);
								//功能分級
								$(`[data-list-id=0]`).val(e.value[0]);
							} else {
								if (e.date !== "option" && e.date !== "description") {
									$(`[data-past=${e.id}]`).append(`
										<span class="past-box" data-pastScore="${e.pastnum}">${e.value[0] !== null ? e.value[0] : 0} ${
										e.value[1] !== "" ? `(${e.value[1]})` : ""
									}</span>
									`);
								}
							}
						}
					});

					let firstKey = Object.keys(data02)[0];
					let lengthOfRecord = Object.keys(data02[firstKey]).length;

					//最後一行總分
					$(".right-box .table-box").each((idx, e) => {
						if (idx === 0 || idx === 1) {
							// if(idx === 0 || idx === 1 || idx === 2 || idx === 3) {

							return;
						}

						if (!data02[idx - 1]) {
							// console.log(idx, data02[idx - 1]);
							for (let i = 0; i < lengthOfRecord - 1; i++) {
								$(e).append(`
							    <span class="past-box" data-test=${i}>0</span>
							  `);
							}
						}
					});

					// 重置 targetScore 並重新計算總分
					targetScore = 0; // 重置為 0，避免累加舊值

					//總分非數字篩選掉
					$("[data-target] .target-box").each((idx, e) => {
						if (idx !== 0) {
							const text = $(e).text().trim();

							//只抓最前面的純數字，不含括號內的內容
							const match = text.match(/^\d+(\.\d+)?/);
							const num = match ? parseFloat(match[0]) : NaN;

							if (!isNaN(num)) {
								targetScore += num;
							}
						}
					});

					$(".right-box .score .past-box").each((idx, e) => {
						for (let i = 0; i < Object.keys(data02).length - 1; i++) {
							$(`[data-pastscore=${i + 1}]`).each((idxx, ee) => {
								if (i == idx) {
									const value1 = $(e).text().trim();
									const value2 = $(ee).text().trim();

									// 只抓開頭的數字，排除括號與補充
									const match1 = value1.match(/^\d+(\.\d+)?/);
									const match2 = value2.match(/^\d+(\.\d+)?/);

									const num1 = match1 ? parseFloat(match1[0]) : 0;
									const num2 = match2 ? parseFloat(match2[0]) : 0;

									// ✅ 進行加總
									if (!isNaN(num1) && !isNaN(num2)) {
										$(e).text(num1 + num2);
									}
								}
							});
						}
					});

					$("[data-pastscore]").each((idx, e) => {});

					$(".left-box .score .target-box").text(`${targetScore}分`);
				}
			},
		});
	};

	getStep();

	getCheckListRecord();

	//存檔API
	const update = (type) => {
		return new Promise((resolve, reject) => {
			let formData = new FormData();
			let session_id = sessionStorage.getItem("sessionId");
			let action = "updateCheckListRecord";
			let chsm = "upStrongCheckListApi"; // api文件相關
			chsm = $.md5(session_id + action + chsm);

			formData.append("session_id", session_id);
			formData.append("action", action);
			formData.append("chsm", chsm);
			formData.append(
				"data",
				JSON.stringify({
					...oldData,
					workOrderId: testparams.workOrderID,
				})
			);

			$.ajax({
				url: `${window.apiUrl}${window.apicheckList}`,
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				success: function (res) {
					console.log(res, "updateCheckListRecord");
					if (res.returnCode) {
						if (type !== "prev") {
							if (step !== "02") {
								$(".title span span").html(`0${Number(step) + 1}`);
								$(`.step0${Number(step)}`).css("display", "none");
								$(`.step0${Number(step) + 1}`).css("display", "block");
								step = `0${Number(step) + 1}`;
								const url = new URL(window.location.href);
								url.searchParams.set("step", Number(step));
								window.history.replaceState(null, "", url);
							} else {
								console.log(res);

								window.location.href = `../../AssessmentPage/question/Index06.html?workOrderID=${testparams.workOrderID}`;
							}
						} else {
							if (step !== "01") {
								$(".title span span").html(`0${Number(step) - 1}`);
								$(`.step0${Number(step)}`).css("display", "none");
								$(`.step0${Number(step) - 1}`).css("display", "block");
								step = `0${Number(step) - 1}`;
							} else {
								window.location.href = `../../AssessmentPage/question/Index05.html?workOrderID=${testparams.workOrderID}`;
							}
						}
						resolve(res); // 成功時解析 Promise
					} else {
						reject(new Error("Update failed with returnCode false"));
					}
				},
				error: function (e) {
					alert(e);
					reject(e); // 失敗時拒絕 Promise
				},
			});
		});
	};

	$(".home-box").click(() => {
		window.location.href = `../../AssessmentPage/index.html?workOrderID=${testparams.workOrderID}`;
	});
});
