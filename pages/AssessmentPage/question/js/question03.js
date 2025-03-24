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

	var backTotalScore = 0;

	var frontTotalScore = 0;

	/**
	 * *Important 下一步
	 */

	$(".next").on("click", function () {
		if (step == "01") {
			let newData = [{ value: [$("input[name='express']:checked").val()] }];

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update();

			if ($(".step01 input:checked").val() == 1) {
				window.location.href = `./Index04.html`;
			}
		} else if (step == "02") {
			let newData = [{ value: [] }];

			let payload = {};

			$(".front path").each((idx, e) => {
				if ($(e).attr("class") && $(e).attr("class").includes("used")) {
					const score = Number($(e).attr("data-sroce"));

					// 檢查 score 是否為 0，如果是 0 則跳過不儲存
					if (score === 0) {
						return; // 跳過此次迴圈
					}

					// 如果 score 不為 0，則將 id 和 score 存入 payload
					payload[$(e).attr("id")] = score;
				}
			});

			newData[0].value.push(payload);

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update();
		} else if (step == "02-02") {
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
		} else if (step == "03") {
			update();
		} else if (step == "07") {
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

				let ulcerTextValue = ulcerText.val();

				if (ulcerTextValue === undefined) {
					ulcerTextValue = "";
				}

				newData[2].value[ulcerValue] = ulcerTextValue;
			});

			$("input[name='ability']:checked").each((idx, e) => {
				newData[3].value.push($(e).val());
			});

			oldData.item[1].item[Number(step) - 1].item = newData;

			oldData.item[1].item[Number(step) - 1].if_complete = true;

			update();
		} else if (step == "08") {
			let newData = [
				{ value: [$("input[name='tube']:checked").val()] },

				{ value: [$("input[name='turn']:checked").val()] },

				{ value: [$("input[name='sit']:checked").val()] },
			];

			oldData.item[1].item[Number(step) - 1].item = newData;

			oldData.item[1].item[Number(step) - 1].if_complete = true;

			update();
		}
	});

	/**
	 * *Important 上一步
	 */

	$(".prev").on("click", function () {
		if (step == "01") {
			if ($(".step01 input:checked").val() == 2) {
				let newData = [{ value: [$("input[name='express']:checked").val()] }];

				oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

				oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

				update("prev");
			} else {
				window.location.href = `../../AssessmentPage/question/Index03.html?workOrderID=${testparams.workOrderID}`;
			}
		} else if (step == "02") {
			let newData = [{ value: [] }];

			let payload = {};

			$(".front path").each((idx, e) => {
				if ($(e).attr("class") && $(e).attr("class").includes("used")) {
					const score = Number($(e).attr("data-sroce"));

					// 檢查 score 是否為 0，如果是 0 則跳過不儲存
					if (score === 0) {
						return; // 跳過此次迴圈
					}

					// 如果 score 不為 0，則將 id 和 score 存入 payload
					payload[$(e).attr("id")] = score;
				}
			});

			newData[0].value.push(payload);

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update("prev");
		} else if (step == "02-02") {
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
		} else if (step == "03") {
			update("prev");
		} else if (step == "07") {
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
		} else if (step == "08") {
			let newData = [
				{ value: [$("input[name='tube']:checked").val()] },

				{ value: [$("input[name='turn']:checked").val()] },

				{ value: [$("input[name='sit']:checked").val()] },
			];

			oldData.item[1].item[7].item = newData;

			oldData.item[1].item[7].if_complete = true;

			update("prev");
		}
	});

	/**
	 * @param 滑軌
	 */
	const silder = () => {
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

	var oldPainColor = null;

	var selectNum = 0;

	var selectData = null;

	var selectId = 0;

	$(".left-box path").on("click", function () {
		if (step != 3) {
			if ($(this).attr("id")) {
				selectId = $(this).attr("id");

				silder();

				$(".right-box .title-box .num").html($(this).attr("id"));

				if (selectData && !$(selectData).attr("class").includes("used")) {
					//沒有選過顏色

					$(selectData).css("fill", "#fff");
				}

				if ($(this).attr("class").includes("used")) {
					//選過顏色

					if (selectData && $(selectData).attr("class").includes("used")) {
						//選擇其他區域恢復顏色

						$(selectData).css("fill", oldPainColor);
					}

					oldPainColor = $(this).css("fill"); //記錄選過的顏色
				} else if (!$(this).attr("class").includes("used")) {
					if (selectData && $(selectData).attr("class").includes("used")) {
						//選擇其他區域恢復顏色

						$(selectData).css("fill", oldPainColor);
					}
				}

				selectData = $(this)[0];

				$($(this)[0]).css("fill", "#654F00");

				$(".right-box").css("display", "block");

				$(".left-box").css("width", "45%");

				$();
			}
		}
	});

	$(".pupop-btn").on("click", function () {
		$(selectData).css("fill", painColor[selectNum]);

		if (selectId <= 22) {
			frontTotalScore = frontTotalScore + selectNum;

			if ($(selectData).attr("class").includes("used")) {
				$(".box01").each(function () {
					if ($(this).find(".num").text() == selectId) {
						$(this).find(".point").html(selectNum);
					}
				});
			} else {
				$(".point-box.front  .box").append(`

          <div class="box01">

              <span class="num">${selectId}</span>

              <span class="point">${selectNum}</span>

          </div>

          <span class="plus">+</span>

        `);
			}
		} else {
			backTotalScore = backTotalScore + selectNum;

			if ($(selectData).attr("class").includes("used")) {
				$(".box01").each(function () {
					if ($(this).find(".num").text() == selectId) {
						$(this).find(".point").html(selectNum);
					}
				});
			} else {
				$(".point-box.back .box").append(`

          <div class="box01">

              <span class="num">${selectId}</span>

              <span class="point">${selectNum}</span>

          </div>

          <span class="plus">+</span>

        `);
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

	$(".right-box .pupon-box .close-box").on("click", function () {
		$(".right-box").css("display", "none");
	});

	let params = new URLSearchParams(window.location.search);
	const testparams = Object.fromEntries(params.entries());
	let data = { workOrderId: testparams.workOrderID };

	let paramStep = params.get("step");
	let paramBigStep = params.get("bigstep");

	const getStep = () => {
		if (paramStep) {
			if (paramStep == "2-02") {
				step = `02-02`;

				$(".title span span").html(`02`);

				$(".step01").css("display", "none");

				$(".step02").css("display", "block");

				$(".front").attr("style", "display: none ");
				$(".back").css("display", "block");
				$(".point-box.back").css("display", "flex");
			} else {
				step = `0${paramStep}`;

				$(".title span span").html(`0${paramStep}`);

				$(".step01").css("display", "none");

				$(".back").css("display", "none");
				$(".point-box.back").attr("style", "display: none !important");

				$(`.step0${paramStep}`).css("display", "block");
			}
		}
	};

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

		$.ajax({
			url: `${window.apiUrl}${window.apicheckList}`,

			type: "POST",

			data: formData,

			processData: false,

			contentType: false,

			success: function (res) {
				if (res.returnCode) {
					oldData = res.returnData;

					let data01 = res.returnData.item[paramBigStep].item[0];

					let data02 = res.returnData.item[paramBigStep].item[1];

					let data03 = res.returnData.item[paramBigStep].item[2];

					let data07 = res.returnData.item[1].item[6];

					let data08 = res.returnData.item[1].item[7];

					$(".step01 input").each((idx, e) => {
						if ($(e).val() == data01.item[0].value[0]) {
							$(e).attr("checked", "true");
						}
					});

					// 07、08
					$(data07.item[0].value).each((index, item) => {
						$(`.step07 #pain${item}`).attr("checked", "true");
					});

					$(data07.item[1].value).each((index, item) => {
						$(`.step07 #urination${item}`).attr("checked", "true");
					});

					$.each(data07.item[2].value, (item, text) => {
						$(`.step07 #ulcer${item}`).attr("checked", "true");

						if (item !== "3") {
							$(`.step07 #ulcer${item}_text`).val(text);
						}
					});

					// 當 "無" 選項被勾選或取消勾選時
					$("#ulcer1").change(function () {
						if ($(this).prop("checked")) {
							// 當 "無" 被勾選時，取消其他選項的勾選
							$('input[name="ulcer"]').not("#ulcer1").prop("checked", false);
						}
					});

					// 如果其他選項被勾選時，取消 "無" 的勾選
					$('input[name="ulcer"]')
						.not("#ulcer1")
						.change(function () {
							if ($(this).prop("checked")) {
								$("#ulcer1").prop("checked", false);
							}
						});

					$(data07.item[3].value).each((index, item) => {
						$(`.step07 #ability${item}`).attr("checked", "true");
					});

					// 當 "皆無" 選項被勾選或取消勾選時
					$("#ability4").change(function () {
						if ($(this).prop("checked")) {
							// 當 "皆無" 被勾選時，取消其他選項的勾選
							$('input[name="ability"]').not("#ability4").prop("checked", false);
						}
					});

					// 如果其他選項被勾選時，取消 "皆無" 的勾選
					$('input[name="ability"]')
						.not("#ability4")
						.change(function () {
							if ($(this).prop("checked")) {
								$("#ability4").prop("checked", false);
							}
						});

					$(data08.item[0].value).each((index, item) => {
						$(`.step08 #tube${item}`).attr("checked", "true");
					});

					$(data08.item[1].value).each((index, item) => {
						$(`.step08 #turn${item}`).attr("checked", "true");
					});

					$(data08.item[2].value).each((index, item) => {
						$(`.step08 #sit${item}`).attr("checked", "true");
					});

					//正面

					let frontData = [];

					for (let i = 0; i < Object.keys(data02.item[0].value[0]).length; i++) {
						const id = Object.keys(data02.item[0].value[0])[i];
						const score = Object.values(data02.item[0].value[0])[i];

						// 檢查 score 是否為 0，如果是 0 則跳過不儲存
						if (score === 0) {
							continue;
						}

						// 如果 score 不為 0，則將 id 和 score 存入 frontData
						frontData.push({
							id: id,
							score: score,
						});
					}

					console.log(frontData, "getCheckListRecord");

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

					//背面

					let backData = [];

					for (let i = 0; i < Object.keys(data03.item[0].value[0]).length; i++) {
						const id = Object.keys(data03.item[0].value[0])[i];
						const score = Object.values(data03.item[0].value[0])[i];

						// 檢查 score 是否為 0，如果是 0 則跳過不儲存
						if (score === 0) {
							continue; // 跳過此次迴圈
						}

						// 如果 score 不為 0，則將 id 和 score 存入 backData
						backData.push({
							id: id,
							score: score,
						});
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

	getCheckListRecord();

	getStep();

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

		$.ajax({
			url: `${window.apiUrl}${window.apicheckList}`,

			type: "POST",

			data: formData,

			processData: false,

			contentType: false,

			success: function (res) {
				console.log(res);

				if (res.returnCode) {
					if (type != "prev") {
						if (step == "01") {
							// 進入正面
							console.log("test1");
							step = "02";

							$(".title span span").html("02");

							$(".step01").css("display", "none");

							$(".step02").css("display", "block");

							$(".point-box.back").attr("style", "display: none !important");
						} else if (step == "02") {
							// 進入反面
							console.log("test2");
							step = "02-02";

							oldPainColor = null;

							$(".title span span").html("02");

							$(".left-box .front").css("display", "none");

							$(".left-box .back").css("display", "block");

							$(".right-box").css("display", "none");

							$(".front").css("display", "none");

							$(".left-box").css("width", "100%");

							$(".point-box.front").css("display", "none");

							$(".point-box.back").css("display", "flex");
						} else if (step == "02-02") {
							// 進入雙面
							console.log("test3");
							step = "03";

							$(".next-button").addClass("step03box");

							$(".right-box").addClass("step03box");

							$(".bottom-box").addClass("step03box");

							$(".point-box.back").attr("style", "display: none !important");

							$(".right-box").css("display", "block");

							$(".left-box").css("width", "45%");

							$(".left-box .front").css("display", "flex");

							$(".left-box .back").css("display", "flex");

							$(".title span span").html("03");

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
						} else if (step == "03") {
							// 進入 step07
							step = "07";

							$(".title span span").html("04");

							$(".step02").css("display", "none"); // 隱藏 step03

							$(".step07").css("display", "block"); // 顯示 step07

							console.log("進入 step07");
						} else if (step == "07") {
							// 進入 step08
							step = "08";

							$(".title span span").html("05");

							$(".step07").css("display", "none"); // 隱藏 step07

							$(".step08").css("display", "block"); // 顯示 step08

							console.log("進入 step08");
						} else {
							window.location.href = `../../AssessmentPage/question/Index04.html?workOrderID=${testparams.workOrderID}`;
						}
					} else {
						if (step != "01") {
							if (step == "03") {
								step = "02";

								oldPainColor = null;

								$(".title span span").html("02");

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
							} else if (step == "02") {
								step = "01";

								oldPainColor = null;

								$(".title span span").html("01");

								$(".step01").css("display", "block");

								$(".step02").css("display", "none");
							} else if (step == "02-02") {
								step = "02";

								$(".point-box.back").attr("style", "display: none !important");

								$(".right-box").css("display", "nome");

								$(".left-box").css("width", "100%");

								$(`.right-box .front`).css("display", "flex");

								$(".left-box .front").css("display", "block");

								$(".left-box .back").css("display", "none");

								$(".title span span").html("02");

								$(".point-box.front.mb").addClass("show");
							} else if (step == "04") {
								console.log("返回 step3");
								step = "03";

								$(".title span span").html("03");
							} else if (step == "05") {
								console.log("返回 step4");
								step = "04";

								$(".title span span").html("04");
							}
						} else {
							window.location.href = `../../AssessmentPage/question/Index03.html?workOrderID=${testparams.workOrderID}`;
						}
					}
				}
			},

			error: function () {
				$("#error").text("An error occurred. Please try again later.");
			},
		});
	};

	$(".home-box").click(() => {
		window.location.href = `../../AssessmentPage/index.html?workOrderID=${testparams.workOrderID}`;
	});
});
