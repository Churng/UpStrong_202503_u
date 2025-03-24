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

	const getStep = () => {
		if (paramStep) {
			step = `0${paramStep}`;

			$(".title span span").html(`0${paramStep}`);

			$(".step01").css("display", "none");

			$(`.step0${paramStep}`).css("display", "block");
		}
	};

	const getList = () => {
		let res = { returnData: JSON.parse(localStorage.getItem("listData")) };

		let data01 = res.returnData.item[1].item[0];

		let data02 = res.returnData.item[1].item[1];

		let data03 = res.returnData.item[1].item[2];

		let data04 = res.returnData.item[1].item[3];

		let data05 = res.returnData.item[1].item[4];

		let data06 = res.returnData.item[1].item[5];

		let data07 = res.returnData.item[1].item[6];

		let data08 = res.returnData.item[1].item[7];

		$(".step01 .checkbox-box").html("");

		$(data01.item[0].question).each((idx, e) => {
			$(".step01 .checkbox-box").append(`

                      <div>

                          <input type="checkbox" id="${e.title}${e.id}" name="個案意識狀態" value="${e.id}">

                          <label for="${e.title}${e.id}">${e.title}</label>

                      </div>

                  `);
		});

		$(".step02 .radio-box").html("");

		$(data02.item[0].question).each((idx, e) => {
			$(".step02 .radio-box").append(`

                    <div>

                        <input type="radio" id="${e.title}${e.id}" name="個案視力" value="${e.id}">

                        <label for="${e.title}${e.id}">${e.title}

                            <span class="tips">${e.direction}</span>

                        </label>

                    </div>

                  `);
		});

		$(".step03 .radio-box").html("");

		$(data03.item[0].question).each((idx, e) => {
			$(".step03 .radio-box").append(`

                    <div>

                        <input type="radio" id="hearing${e.id}" name="hearing" value="${e.id}">

                        <label for="hearing${e.id}">${e.title}

                            <span class="tips">${e.direction}</span>

                        </labe>

                    </div>

                  `);
		});

		$(".step04 .radio-box").html("");

		$(data04.item[0].question).each((idx, e) => {
			$(".step04 .radio-box").append(`

                    <div>

                        <input type="radio" id="個案表達能力${e.id}" name="個案表達能力" value="${e.id}">

                        <label for="個案表達能力${e.id}">${e.title}</label>

                    </div>

                  `);
		});

		$(".step05 .radio-box").html("");

		$(data05.item[0].question).each((idx, e) => {
			$(".step05 .radio-box").append(`

                    <div>

                        <input type="radio" id="個案理解能力${e.id}" name="個案理解能力" value="${e.id}">

                        <label for="個案理解能力${e.id}">${e.title}</label>

                    </div>

                  `);
		});

		$(".step06 .checkbox-box").html("");

		$(data06.item[0].question).each((idx, e) => {
			$(".step06 .checkbox-box").append(`

                      <div>

                          <input type="checkbox" id="問題行為${e.id}" name="問題行為" value="${e.id}">

                          <label for="問題行為${e.id}">${e.title}</label>

                      </div>

                  `);
		});

		$(".step07 .detail-box>div").html("");

		$(data07.item).each((idx, e) => {
			$(".step07 .detail-box>div").append(`

        <div class="title-box">

          <span class="title">${e.title}</span>

        </div>

        <div class="bottom-box">

            <div class="checkbox-box" data-id="${idx}">

            </div>

        </div>

      `);

			$(e.question).each((idxx, ee) => {
				$(`[data-id=${idx}]`).append(`

          <div>

              <input type="checkbox" id="${e.title}${ee.id}" name="${e.title}" value="${ee.id}">

              <label for="${e.title}${ee.id}">${ee.title}</label>

          </div>

        `);
			});
		});

		$(".step08 .detail-box>div").html("");

		$(data08.item).each((idx, e) => {
			$(".step08 .detail-box>div").append(`

        <div class="title-box">

          <span class="title">${e.title}</span>

        </div>

        <div class="bottom-box">

            <div class="radio-box" data-08id="${idx}">

            </div>

        </div>

      `);

			$(e.question).each((idxx, ee) => {
				$(`[data-08id=${idx}]`).append(`

        <div>

            <input type="radio" id="${e.title}${ee.id}" name="${e.title}" value="${ee.id}">

            <label for="${e.title}${ee.id}">${ee.title}</label>

        </div>

        `);
			});
		});
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
					handleResponse(res);
					oldData = res.returnData;

					let data01 = res.returnData.item[paramBigStep].item[0];

					let data02 = res.returnData.item[paramBigStep].item[1];

					let data03 = res.returnData.item[paramBigStep].item[2];

					let data04 = res.returnData.item[paramBigStep].item[3];

					let data05 = res.returnData.item[paramBigStep].item[4];

					let data06 = res.returnData.item[paramBigStep].item[5];

					let data07 = res.returnData.item[paramBigStep].item[6];

					let data08 = res.returnData.item[paramBigStep].item[7];

					$.each(data01.item, (consciousness, subConsciousness) => {
						$(`.step01 #consciousness${consciousness}`).attr("checked", "true");

						if (subConsciousness.length === 1) {
							$(`.step01 #consciousness${consciousness}_${subConsciousness}`).attr("checked", "true");
						} else if (typeof subConsciousness === "string" && subConsciousness !== "") {
							$(`.step01 #sub_consciousness${consciousness}`).val(subConsciousness);
						}
					});

					$(".step02 input").each((idx, e) => {
						if ($(e).val() == data02.item[0].value) {
							$(e).attr("checked", "true");
						}
					});

					$(".step03 input").each((idx, e) => {
						if ($(e).val() == data03.item[0].value[0]) {
							$(e).attr("checked", "true");
						}
					});

					$(".step04 input").each((idx, e) => {
						if ($(e).val() == data04.item[0].value[0]) {
							$(e).attr("checked", "true");
						}
					});

					$(".step05 input").each((idx, e) => {
						if ($(e).val() == data05.item[0].value[0]) {
							$(e).attr("checked", "true");
						}
					});

					$(data06.item[0].value).each((index, item) => {
						$(`.step06 #behavior${item}`).attr("checked", "true");
						// 當 "以下皆無" 選項被勾選或取消勾選時
						$("#behavior1").change(function () {
							if ($(this).prop("checked")) {
								// 當 "以下皆無" 被勾選時，取消其他所有選項的勾選
								$('input[name="behavior"]').not("#behavior1").prop("checked", false);
							}
						});

						// 如果其他選項被勾選時，取消 "以下皆無" 的勾選
						$('input[name="behavior"]')
							.not("#behavior1")
							.change(function () {
								if ($(this).prop("checked")) {
									$("#behavior1").prop("checked", false);
								}
							});
					});

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
					handleResponse(res);
					if (type != "prev") {
						if (step != "06") {
							$(".title span span").html(`0${Number(step) + 1}`);

							$(`.step0${Number(step)}`).css("display", "none");

							$(`.step0${Number(step) + 1}`).css("display", "block");

							step = `0${Number(step) + 1}`;

							const url = new URL(window.location.href);

							url.searchParams.set("step", Number(step));

							window.history.replaceState(null, "", url);
						} else {
							window.location.href = `../../AssessmentPage/question/Index03.html?workOrderID=${testparams.workOrderID}`;
						}
					} else {
						if (step != "01") {
							$(".title span span").html(`0${Number(step) - 1}`);

							$(`.step0${Number(step)}`).css("display", "none");

							$(`.step0${Number(step) - 1}`).css("display", "block");

							step = `0${Number(step) - 1}`;
						} else {
							window.location.href = `../../AssessmentPage/question/Index02.html?workOrderID=${testparams.workOrderID}`;
						}
					}
				}
			},

			error: function (e) {
				alert(e);
			},
		});
	};

	$(".next").on("click", function () {
		if (step == "01") {
			let newData = {};

			$("input[name='consciousness']:checked").each((idx, e) => {
				let consciousnessValue = $(e).val();

				let subConsciousness = $(`input[name='sub_consciousness${consciousnessValue}']`);

				let subConsciousnessType = subConsciousness.attr("type");

				let subConsciousnessValue =
					subConsciousnessType === "text"
						? subConsciousness.val()
						: $(`input[name='sub_consciousness${consciousnessValue}']:checked`).val();

				if (subConsciousnessValue === undefined) {
					subConsciousnessValue = "";
				}

				newData[consciousnessValue] = subConsciousnessValue;
			});

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update();
		} else if (step == "02") {
			let newData = [{ value: [$("input[name='vision']:checked").val()] }];

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update();
		} else if (step == "03") {
			let newData = [{ value: [$("input[name='hearing']:checked").val()] }];

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update();
		} else if (step == "04") {
			let newData = [{ value: [$("input[name='express']:checked").val()] }];

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update();
		} else if (step == "05") {
			let newData = [{ value: [$("input[name='understand']:checked").val()] }];

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update();
		} else if (step == "06") {
			let newData = [{ value: [] }];

			$("input[name='behavior']:checked").each((idx, e) => {
				newData[0].value.push($(e).val());
			});

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

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

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update();
		} else if (step == "08") {
			let newData = [
				{ value: [$("input[name='tube']:checked").val()] },

				{ value: [$("input[name='turn']:checked").val()] },

				{ value: [$("input[name='sit']:checked").val()] },
			];

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update();
		}
	});

	$(".prev").on("click", function () {
		if (step == "01") {
			let newData = [{ value: [] }];

			$("input[name='consciousness']:checked").each((idx, e) => {
				newData[0].value.push($(e).val());
			});

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update("prev");
		} else if (step == "02") {
			let newData = [{ value: [$("input[name='vision']:checked").val()] }];

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update("prev");
		} else if (step == "03") {
			let newData = [{ value: [$("input[name='hearing']:checked").val()] }];

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update("prev");
		} else if (step == "04") {
			let newData = [{ value: [$("input[name='express']:checked").val()] }];

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update("prev");
		} else if (step == "05") {
			let newData = [{ value: [$("input[name='understand']:checked").val()] }];

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update("prev");
		} else if (step == "06") {
			let newData = [{ value: [] }];

			$("input[name='behavior']:checked").each((idx, e) => {
				newData[0].value.push($(e).val());
			});

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

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

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update("prev");
		} else if (step == "08") {
			let newData = [
				{ value: [$("input[name='tube']:checked").val()] },

				{ value: [$("input[name='turn']:checked").val()] },

				{ value: [$("input[name='sit']:checked").val()] },
			];

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update("prev");
		}
	});

	$(".home-box").click(() => {
		window.location.href = `../../AssessmentPage/index.html?workOrderID=${testparams.workOrderID}`;
	});
});
