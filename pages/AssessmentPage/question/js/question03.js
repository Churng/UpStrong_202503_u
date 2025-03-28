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
	// Initialize variables
	var step = "01";
	var backTotalScore = 0;
	var frontTotalScore = 0;
	var selectNum = 0;
	var selectData = null;
	var selectId = 0;
	var oldPainColor = null;

	// Pain color scale
	var painColor = [
		"#fff",
		"#FFE5E5",
		"#FFCCCC",
		"#FFB3B3",
		"#FF9999",
		"#FF8080",
		"#FF6666",
		"#FF4C4C",
		"#F30000",
		"#DC0000",
		"#BE0000",
	];

	// Get URL parameters
	let params = new URLSearchParams(window.location.search);
	const testparams = Object.fromEntries(params.entries());
	let paramStep = params.get("step");
	let paramBigStep = params.get("bigstep");
	let data = { workOrderId: testparams.workOrderID };
	console.log(data);

	// Initialize slider
	const initSlider = () => {
		$("#slider-range-max").slider({
			range: "max",
			min: 0,
			max: 10,
			value: 0,
			slide: function (event, ui) {
				selectNum = ui.value;
			},
		});
	};

	// Update URL parameter
	function updateUrlParam(paramName, paramValue, url = window.location.href) {
		const urlObj = new URL(url);
		urlObj.searchParams.set(paramName, paramValue);
		window.history.replaceState(null, "", urlObj);
	}

	// Set current step based on URL parameter
	const setStep = () => {
		if (paramStep) {
			if (paramStep == "4-02") {
				step = "04-02";
				$(".title span span").html("04");
				$(".step01").css("display", "none");
				$(".step03").css("display", "none");
				$(".step04").css("display", "block");
				$(".front").attr("style", "display: none ");
				$(".back").css("display", "block");
				$(".point-box.back").css("display", "flex");
			} else {
				step = `0${paramStep}`;
				$(".title span span").html(`0${paramStep}`);
				$(".step04").css("display", "none");
				$(".step01").css("display", "none");
				$(".back").css("display", "none");
				$(".point-box.back").attr("style", "display: none !important");
				$(`.step0${paramStep}`).css("display", "block");
			}
		}
	};

	// Get checklist record from API
	const getCheckListRecord = () => {
		let formData = new FormData();
		let session_id = sessionStorage.getItem("sessionId");
		let action = "getCheckListRecord";
		let chsm = "upStrongCheckListApi";
		chsm = $.md5(session_id + action + chsm);

		formData.append("session_id", session_id);
		formData.append("action", action);
		formData.append("chsm", chsm);

		$.ajax({
			url: `${window.apiUrl}${window.apicheckList}`,
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			success: function (res) {
				handleResponse(res);
				if (res.returnCode) {
					oldData = res.returnData;
					let data01 = res.returnData.item[paramBigStep].item[0];
					let data02 = res.returnData.item[paramBigStep].item[1];
					let data03 = res.returnData.item[paramBigStep].item[2];
					let data07 = res.returnData.item[1].item[6];
					let data08 = res.returnData.item[1].item[7];

					// Step01/Step02 data
					$(data07.item[0].value).each((index, item) => {
						$(`.step01 #pain${item}`).attr("checked", "true");
					});

					$(data07.item[1].value).each((index, item) => {
						$(`.step01 #urination${item}`).attr("checked", "true");
					});

					$.each(data07.item[2].value, (item, text) => {
						$(`.step01 #ulcer${item}`).attr("checked", "true");
						if (item !== "3") {
							$(`.step01 #ulcer${item}_text`).val(text);
						}
					});

					$(data07.item[3].value).each((index, item) => {
						$(`.step01 #ability${item}`).attr("checked", "true");
					});

					$(data08.item[0].value).each((index, item) => {
						$(`.step02 #tube${item}`).attr("checked", "true");
					});

					$(data08.item[1].value).each((index, item) => {
						$(`.step02 #turn${item}`).attr("checked", "true");
					});

					$(data08.item[2].value).each((index, item) => {
						$(`.step02 #sit${item}`).attr("checked", "true");
					});

					// Step03 data
					$(".step03 input").each((idx, e) => {
						if ($(e).val() == data01.item[0].value[0]) {
							$(e).attr("checked", "true");
						}
					});

					// Front data
					let frontData = [];

					console.log(frontData);

					for (let i = 0; i < Object.keys(data02.item[0].value[0]).length; i++) {
						const id = Object.keys(data02.item[0].value[0])[i];
						const score = Object.values(data02.item[0].value[0])[i];
						if (score === 0) continue;
						frontData.push({ id: id, score: score });
					}

					$(".front path").each((idx, e) => {
						$(frontData).each((idxx, ee) => {
							if ($(e).attr("id") == ee.id) {
								$(".point-box.front .box").append(`
                                    <div class="box01">
                                        <span class="num">${ee.id}</span>
                                        <span class="point">${ee.score}</span>
                                    </div>
                                    <span class="plus">+</span>
                                `);

								$(e).addClass("used");
								$(e).css("fill", painColor[ee.score]);
								$(e).attr("data-sroce", ee.score);
								frontTotalScore = frontTotalScore + ee.score;
							}
						});
					});

					$(".front .total-box .num").html(frontTotalScore);

					// Back data
					let backData = [];
					for (let i = 0; i < Object.keys(data03.item[0].value[0]).length; i++) {
						const id = Object.keys(data03.item[0].value[0])[i];
						const score = Object.values(data03.item[0].value[0])[i];
						if (score === 0) continue;
						backData.push({ id: id, score: score });
					}

					$(".back path").each((idx, e) => {
						$(backData).each((idxx, ee) => {
							if ($(e).attr("id") == ee.id) {
								$(".point-box.back .box").append(`
                                    <div class="box01">
                                        <span class="num">${ee.id}</span>
                                        <span class="point">${ee.score}</span>
                                    </div>
                                    <span class="plus">+</span>
                                `);

								$(e).addClass("used");
								$(e).css("fill", painColor[ee.score]);
								$(e).attr("data-sroce", ee.score);
								backTotalScore = backTotalScore + ee.score;
							}
						});
					});

					$(".back .total-box .num").html(backTotalScore);
				}
			},
		});
	};

	// Update checklist record
	const update = (type) => {
		// console.log(oldData);

		let formData = new FormData();
		let session_id = sessionStorage.getItem("sessionId");
		let action = "updateCheckListRecord";
		let chsm = "upStrongCheckListApi";
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
				handleResponse(res);
				console.log(res);

				if (res.returnCode) {
					if (type != "prev") {
						// Next button logic
						if (step == "01") {
							step = "02";
							$(".title span span").html("02");
							$(".step01").css("display", "none");
							$(".step02").css("display", "block");
							updateUrlParam("step", 2);
						} else if (step == "02") {
							step = "03";
							$(".title span span").html("03");
							$(".step01").css("display", "none");
							$(".step02").css("display", "none");
							$(".step03").css("display", "block");
							updateUrlParam("step", 3);
						} else if (step == "03") {
							step = "04";
							$(".title span span").html("04");
							$(".step01").css("display", "none");
							$(".step02").css("display", "none");
							$(".step03").css("display", "none");
							$(".step04").css("display", "block");
							$(".point-box.back").attr("style", "display: none !important");
							updateUrlParam("step", 4);
						} else if (step == "04") {
							step = "04-02";
							oldPainColor = null;
							$(".title span span").html("04");
							$(".left-box .front").css("display", "none");
							$(".left-box .back").css("display", "block");
							$(".right-box").css("display", "none");
							$(".front").css("display", "none");
							$(".left-box").css("width", "100%");
							$(".point-box.front").css("display", "none");
							$(".point-box.back").css("display", "flex");
							updateUrlParam("step", 4);
						} else if (step == "04-02") {
							step = "05";
							$(".next-button").addClass("step03box");
							$(".right-box").addClass("step03box");
							$(".bottom-box").addClass("step03box");
							$(".point-box.back").attr("style", "display: none !important");
							$(".right-box").css("display", "block");
							$(".left-box").css("width", "45%");
							$(".left-box .front").css("display", "flex");
							$(".left-box .back").css("display", "flex");
							$(".title span span").html("05");
							$(".left-box").addClass("style02");
							$(".left-box .tips").css("display", "none");
							$(".detail-box .ChosePart").css("display", "none");
							$(".left-box .left").css("display", "none");
							$(".left-box .right").css("display", "none");
							$(".left-box .step03box .front .num").html(frontTotalScore);
							$(".left-box .step03box .back .num").html(backTotalScore);
							$(".left-box .step03box .total-box").html("總共" + (backTotalScore + frontTotalScore) + "分");
							$(".color-box").css("display", "none");
							$(".step02box").css("display", "none");
							$(".step03box").css("display", "flex");
							$(".left-box .step03box").css("display", "block");
							updateUrlParam("step", 5);
						} else if (step == "05") {
							window.location.href = `../../AssessmentPage/question/Index04.html?workOrderID=${testparams.workOrderID}`;
						}
					} else {
						// Previous button logic - 修正後的返回流程
						if (step == "03") {
							// step3返回step2
							step = "02";
							oldPainColor = null;
							$(".title span span").html("02");
							$(".step01").css("display", "none");
							$(".step02").css("display", "block");
							$(".step03").css("display", "none");
							$(".step04").css("display", "none");
							updateUrlParam("step", 2);
						} else if (step == "02") {
							// step2返回step1
							step = "01";
							oldPainColor = null;
							$(".title span span").html("01");
							$(".step01").css("display", "block");
							$(".step02").css("display", "none");
							$(".step03").css("display", "none");
							$(".step04").css("display", "none");
							updateUrlParam("step", 1);
						} else if (step == "01") {
							// step1返回quetion2
							window.location.href = `../../AssessmentPage/question/Index03.html?workOrderID=${testparams.workOrderID}`;
						} else if (step == "04") {
							step = "03";
							oldPainColor = null;
							$(".title span span").html("03");
							$(".step01").css("display", "none");
							$(".step02").css("display", "none");
							$(".step03").css("display", "block");
							$(".step04").css("display", "none");
							updateUrlParam("step", 3);
						} else if (step == "04-02") {
							step = "04";
							$(".point-box.back").attr("style", "display: none !important");
							$(".right-box").css("display", "none");
							$(".left-box").css("width", "100%");
							$(`.right-box .front`).css("display", "flex");
							$(".left-box .front").css("display", "block");
							$(".left-box .back").css("display", "none");
							$(".step03").css("display", "none");
							$(".step04").css("display", "block");
							$(".title span span").html("04");
							$(".point-box.front.mb").addClass("show");
							updateUrlParam("step", 4);
						} else if (step == "05") {
							step = "04";
							oldPainColor = null;
							$(".title span span").html("04");
							$(".next-button").removeClass("step03box");
							$(".right-box").removeClass("step03box");
							$(".bottom-box").removeClass("step03box");
							$(".left-box").removeClass("style02");
							$(".right-box").css("display", "none");
							$(".left-box").css("width", "100%");
							$(".back").css("display", "none");
							$(".right-box .point-box.front").css("display", "flex");
							$(".left-box .front").css("display", "block");
							$(".point-box.back").attr("style", "display: none !important");
							$(".point-box.front.mb").addClass("show");
							$(".left-box .tips").css("display", "flex");
							$(".detail-box .ChosePart").css("display", "flex");
							$(".left-box .left").css("display", "flex");
							$(".left-box .right").css("display", "flex");
							$(".color-box").css("display", "flex");
							$(".step02box").css("display", "block");
							$(".step03box").css("display", "none");
							$(".left-box .step03box").css("display", "none");
							updateUrlParam("step", 4);
						}
					}
				}
			},
			error: function () {
				$("#error").text("An error occurred. Please try again later.");
			},
		});
	};

	// Event handlers
	$(".next").on("click", function () {
		if (step == "01") {
			let newData = [{ value: [] }, { value: [] }, { value: {} }, { value: [] }];

			$("input[name='pain']:checked").each((idx, e) => {
				newData[0].value.push($(e).val());
			});

			$("input[name='urination']:checked").each((idx, e) => {
				newData[1].value.push($(e).val());
			});

			$("input[name='ulcer']:checked").each((idx, e) => {
				let ulcerValue = $(e).val();
				let ulcerText = $(`#ulcer${ulcerValue}_text`);
				let ulcerTextValue = ulcerText.val() || "";
				newData[2].value[ulcerValue] = ulcerTextValue;
			});

			$("input[name='ability']:checked").each((idx, e) => {
				newData[3].value.push($(e).val());
			});

			oldData.item[1].item[6].item = newData;
			oldData.item[1].item[6].if_complete = true;
			update();
		} else if (step == "02") {
			let newData = [
				{ value: [$("input[name='tube']:checked").val()] },
				{ value: [$("input[name='turn']:checked").val()] },
				{ value: [$("input[name='sit']:checked").val()] },
			];

			oldData.item[1].item[7].item = newData;
			oldData.item[1].item[7].if_complete = true;
			update();
		} else if (step == "03") {
			let newData = [{ value: [$("input[name='express']:checked").val()] }];
			oldData.item[paramBigStep].item[2].item = newData;
			oldData.item[paramBigStep].item[2].if_complete = true;
			update();

			if ($(".step03 input:checked").val() == 1) {
				window.location.href = `./Index04.html`;
			}
		} else if (step == "04") {
			let newData = [{ value: [] }];
			let payload = {};

			$(".front path").each((idx, e) => {
				if ($(e).attr("class") && $(e).attr("class").includes("used")) {
					const score = Number($(e).attr("data-sroce"));
					if (score === 0) return;
					payload[$(e).attr("id")] = score;
				}
			});

			newData[0].value.push(payload);
			console.log(payload);

			oldData.item[paramBigStep].item[2].item = newData;
			oldData.item[paramBigStep].item[2].if_complete = true;
			update();
		} else if (step == "04-02") {
			let newData = [{ value: [] }];
			let payload = {};

			$(".back path").each((idx, e) => {
				if ($(e).attr("class") && $(e).attr("class").includes("used")) {
					payload[$(e).attr("id")] = Number($(e).attr("data-sroce"));
				}
			});

			newData[0].value.push(payload);
			oldData.item[paramBigStep].item[2].item = newData;
			oldData.item[paramBigStep].item[2].if_complete = true;
			update();
		} else if (step == "05") {
			update();
		}
	});

	$(".prev").on("click", function () {
		if (step == "01") {
			let newData = [{ value: [] }, { value: [] }, { value: [] }, { value: [] }];

			$("input[name='pain']:checked").each((idx, e) => {
				newData[0].value.push($(e).val());
			});

			$("input[name='urination']:checked").each((idx, e) => {
				newData[1].value.push($(e).val());
			});

			$("input[name='ulcer']:checked").each((idx, e) => {
				newData[2].value.push($(e).val());
			});

			$("input[name='ability']:checked").each((idx, e) => {
				newData[3].value.push($(e).val());
			});

			oldData.item[1].item[6].item = newData;
			oldData.item[1].item[6].if_complete = true;
			update("prev");
		} else if (step == "02") {
			let newData = [
				{ value: [$("input[name='tube']:checked").val()] },
				{ value: [$("input[name='turn']:checked").val()] },
				{ value: [$("input[name='sit']:checked").val()] },
			];

			oldData.item[1].item[7].item = newData;
			oldData.item[1].item[7].if_complete = true;
			update("prev");
		} else if (step == "03") {
			let newData = [{ value: [$("input[name='express']:checked").val()] }];
			oldData.item[paramBigStep].item[0].item = newData;
			oldData.item[paramBigStep].item[0].if_complete = true;
			update("prev");
		} else if (step == "04") {
			let newData = [{ value: [] }];
			let payload = {};

			$(".front path").each((idx, e) => {
				if ($(e).attr("class") && $(e).attr("class").includes("used")) {
					const score = Number($(e).attr("data-sroce"));
					if (score === 0) return;
					payload[$(e).attr("id")] = score;
				}
			});

			newData[0].value.push(payload);
			oldData.item[paramBigStep].item[1].item = newData;
			oldData.item[paramBigStep].item[1].if_complete = true;
			update("prev");
		} else if (step == "04-02") {
			let newData = [{ value: [] }];
			let payload = {};

			$(".back path").each((idx, e) => {
				if ($(e).attr("class") && $(e).attr("class").includes("used")) {
					payload[$(e).attr("id")] = Number($(e).attr("data-sroce"));
				}
			});

			newData[0].value.push(payload);
			oldData.item[paramBigStep].item[2].item = newData;
			oldData.item[paramBigStep].item[2].if_complete = true;
			update("prev");
		} else if (step == "05") {
			update("prev");
		}
	});

	// Body part selection
	$(".left-box path").on("click", function () {
		if (step != 3) {
			if ($(this).attr("id")) {
				selectId = $(this).attr("id");
				initSlider();
				$(".right-box .title-box .num").html($(this).attr("id"));

				if (selectData && !$(selectData).attr("class").includes("used")) {
					$(selectData).css("fill", "#fff");
				}

				if ($(this).attr("class").includes("used")) {
					if (selectData && $(selectData).attr("class").includes("used")) {
						$(selectData).css("fill", oldPainColor);
					}
					oldPainColor = $(this).css("fill");
				} else if (!$(this).attr("class").includes("used")) {
					if (selectData && $(selectData).attr("class").includes("used")) {
						$(selectData).css("fill", oldPainColor);
					}
				}

				selectData = $(this)[0];
				$($(this)[0]).css("fill", "#654F00");
				$(".right-box").css("display", "block");
				$(".left-box").css("width", "45%");
			}
		}
	});

	// Confirm pain level selection
	$(".pupop-btn").on("click", function () {
		$(selectData).css("fill", painColor[selectNum]);

		// if (selectId <= 22) {
		// 	frontTotalScore = frontTotalScore + selectNum;
		// 	if ($(selectData).attr("class").includes("used")) {
		// 		$(".box01").each(function () {
		// 			if ($(this).find(".num").text() == selectId) {
		// 				$(this).find(".point").html(selectNum);
		// 			}
		// 		});
		// 	} else {
		// 		$(".point-box.front .box").append(`
		//             <div class="box01">
		//                 <span class="num">${selectId}</span>
		//                 <span class="point">${selectNum}</span>
		//             </div>
		//             <span class="plus">+</span>
		//         `);
		// 	}
		// } else {
		// 	backTotalScore = backTotalScore + selectNum;
		// 	if ($(selectData).attr("class").includes("used")) {
		// 		$(".box01").each(function () {
		// 			if ($(this).find(".num").text() == selectId) {
		// 				$(this).find(".point").html(selectNum);
		// 			}
		// 		});
		// 	} else {
		// 		$(".point-box.back .box").append(`
		//             <div class="box01">
		//                 <span class="num">${selectId}</span>
		//                 <span class="point">${selectNum}</span>
		//             </div>
		//             <span class="plus">+</span>
		//         `);
		// 	}
		// }

		if (selectId <= 22) {
			// 先檢查是否已有舊值
			let oldValue = 0;
			$(".box01").each(function () {
				if ($(this).find(".num").text() == selectId) {
					oldValue = parseInt($(this).find(".point").text()) || 0;
				}
			});

			// 更新總分：扣除舊值，再加上新值（若非0）
			frontTotalScore = frontTotalScore - oldValue;
			if (selectNum && selectNum != 0) {
				frontTotalScore = frontTotalScore + selectNum;
			}

			if ($(selectData).attr("class").includes("used")) {
				$(".box01").each(function () {
					if ($(this).find(".num").text() == selectId) {
						if (selectNum && selectNum != 0) {
							$(this).find(".point").html(selectNum);
						} else {
							// 移除整個 box01 和後面的 + 號
							$(this).next(".plus").remove();
							$(this).remove();
						}
					}
				});
			} else {
				// 只有當 selectNum 不是 0 或空時，才新增元素
				if (selectNum && selectNum != 0) {
					$(".point-box.front .box").append(`
						<div class="box01">
							<span class="num">${selectId}</span>
							<span class="point">${selectNum}</span>
						</div>
						<span class="plus">+</span>
					`);
				}
			}
		} else {
			// 先檢查是否已有舊值
			let oldValue = 0;
			$(".box01").each(function () {
				if ($(this).find(".num").text() == selectId) {
					oldValue = parseInt($(this).find(".point").text()) || 0;
				}
			});

			// 更新總分：扣除舊值，再加上新值（若非0）
			backTotalScore = backTotalScore - oldValue;
			if (selectNum && selectNum != 0) {
				backTotalScore = backTotalScore + selectNum;
			}

			if ($(selectData).attr("class").includes("used")) {
				$(".box01").each(function () {
					if ($(this).find(".num").text() == selectId) {
						if (selectNum && selectNum != 0) {
							$(this).find(".point").html(selectNum);
						} else {
							// 移除整個 box01 和後面的 + 號
							$(this).next(".plus").remove();
							$(this).remove();
						}
					}
				});
			} else {
				// 只有當 selectNum 不是 0 或空時，才新增元素
				if (selectNum && selectNum != 0) {
					$(".point-box.back .box").append(`
						<div class="box01">
							<span class="num">${selectId}</span>
							<span class="point">${selectNum}</span>
						</div>
						<span class="plus">+</span>
					`);
				}
			}
		}
		$(selectData).addClass("used");
		$(selectData).attr("data-sroce", selectNum);
		$(".right-box").css("display", "none");
		$(".left-box").css("width", "100%");
		selectNum = 0;
		$(".front .total-box .num").html(frontTotalScore);
		$(".back .total-box .num").html(backTotalScore);

		if (window.innerWidth <= 500) {
			$(".right-box").css("display", "none");
		}
	});

	// Close pain level popup
	$(".right-box .pupon-box .close-box").on("click", function () {
		$(".right-box").css("display", "none");
	});

	// Home button
	$(".home-box").click(() => {
		window.location.href = `../../AssessmentPage/index.html?workOrderID=${testparams.workOrderID}`;
	});

	// Checkbox behavior for "ulcer" and "ability" options
	$("#ulcer1").change(function () {
		if ($(this).prop("checked")) {
			$('input[name="ulcer"]').not("#ulcer1").prop("checked", false);
		}
	});

	$('input[name="ulcer"]')
		.not("#ulcer1")
		.change(function () {
			if ($(this).prop("checked")) {
				$("#ulcer1").prop("checked", false);
			}
		});

	$("#ability4").change(function () {
		if ($(this).prop("checked")) {
			$('input[name="ability"]').not("#ability4").prop("checked", false);
		}
	});

	$('input[name="ability"]')
		.not("#ability4")
		.change(function () {
			if ($(this).prop("checked")) {
				$("#ability4").prop("checked", false);
			}
		});

	// Initialize
	getCheckListRecord();
	setStep();
});
