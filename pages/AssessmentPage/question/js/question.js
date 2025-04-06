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

		getCheckListRecord();
	};

	const getList = () => {
		let res = { returnData: JSON.parse(localStorage.getItem("listData")) };

		let data03 = res.returnData.item[0].item[2];

		let data05 = res.returnData.item[0].item[4];

		let data06 = res.returnData.item[0].item[5];

		$(".step03 .checkbox-box").html("");

		$(data03.item[0].question).each((idx, e) => {
			$(".step03 .checkbox-box").append(`

                      <div>

                          <input type="checkbox" id="obstacle${e.id}" name="obstacle" value="${e.id}">

                          <label for="obstacle${e.id}">${e.title}</label>

                      </div>

                  `);
		});

		$(".step05 .checkbox-box").html("");

		$(data05.item[0].question).each((idx, e) => {
			$(".step05 .checkbox-box").append(`

                      <div>

                          <input type="checkbox" id="diagnosis${e.id}" name="diagnosis" value="${e.id}">

                          <label for="diagnosis${e.id}">${e.title}</label>

                      </div>

                  `);
		});

		$(".step06 .checkbox-box").html("");

		$(data06.item[1].question).each((idx, e) => {
			$(".step06 .checkbox-box").append(`

                      <div>

                          <input type="checkbox" id="history${e.id}" name="history" value="${e.id}">

                          <label for="history${e.id}">${e.title}</label>

                      </div>

                  `);
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
				console.log(res);

				if (res.returnCode) {
					oldData = res.returnData;
					console.log(res.assessmentDate);

					$("#Assessmentdate").text(res.assessmentDate);

					$("#coachA").val(`${res.returnData.item[paramBigStep].item[0].item[0].value[0]}`);

					$("#coachB").val(`${res.returnData.item[paramBigStep].item[0].item[0].value[1]}`);

					let rightData01 = res.returnData.item[paramBigStep].item[0].item[1];

					let rightData02 = res.returnData.item[paramBigStep].item[1];

					let rightData03 = res.returnData.item[paramBigStep].item[2];

					let rightData04 = res.returnData.item[paramBigStep].item[3];

					let rightData05 = res.returnData.item[paramBigStep].item[4];

					let rightData06 = res.returnData.item[paramBigStep].item[5];

					let rightData07 = res.returnData.item[paramBigStep].item[6];

					$(`#sex${rightData01.value[0]}`).attr("checked", "true");

					$(".step01 .name").val(`${rightData01.value[1]}`);

					$(".step01 .nametitle").text(rightData01.value[1] !== "" ? `個案資料 - ${rightData01.value[1]}` : `個案資料`);

					$(".step01 .name02").val(`${rightData01.value[2]}`);

					$(".step01 .birthday").val(`${rightData01.value[3]}`);

					$(".step01 .city").val(`${rightData01.value[4]}`);

					$(".step01 .county").val(`${rightData01.value[5]}`);

					$(".step01 .add").val(`${rightData01.value[6]}`);

					$(".step01 .family").val(`${rightData01.value[7]}`);

					$(".step01 .caregiver").val(`${rightData01.value[8]}`);

					$(`.step02 #elevator${rightData02.item[0].value[0]}`).attr(
						"checked",

						"true"
					);

					$(`.step02 #disability${rightData02.item[1].value[0]}`).attr(
						"checked",

						"true"
					);

					$(`.step02 #cms${rightData02.item[2].value[0]}`).attr(
						"checked",

						"true"
					);

					$.each(rightData03.item[0].value, (idx, e) => {
						$(`.step03 #obstacle${e}`).attr("checked", "true");
					});

					$(`.step03 #emoji${rightData03.item[1].value[0]}`).attr(
						"checked",

						"true"
					);

					$(`.step04 #motives${rightData04.item[0].value[0]}`).attr(
						"checked",

						"true"
					);

					$(`.step04 #motivesText`).val(rightData04.item[1].value[0]);

					$(`.step04 #family${rightData04.item[2].value[0]}`).attr(
						"checked",

						"true"
					);

					$(`.step04 #familyText`).val(rightData04.item[3].value[0]);

					$.each(rightData05.item, (diagnosis, subDiagnosis) => {
						$(`.step05 #diagnosis${diagnosis}`).attr("checked", "true");

						if (subDiagnosis.length === 1) {
							$(`.step05 #sub_diagnosis${diagnosis}_${subDiagnosis}`).attr("checked", "true");
						} else if (typeof subDiagnosis === "string" && subDiagnosis !== "") {
							$(`.step05 #sub_diagnosis${diagnosis}`).val(subDiagnosis);
						}
						// 無的勾選會取消其他選項
						$("#diagnosis1").change(function () {
							if ($(this).is(":checked")) {
								// 取消勾選所有其他選項
								$('input[name="diagnosis"]').not(this).prop("checked", false);
							}
						});

						$('input[name="diagnosis"]')
							.not("#diagnosis1")
							.change(function () {
								if ($(this).is(":checked")) {
									// 取消勾選「無」
									$("#diagnosis1").prop("checked", false);
								}
							});
					});

					$(`.step06 #step06text01`).val(rightData06.item[0].value[0]);

					$.each(rightData06.item[1].value, (history, subHistory) => {
						$(`.step06 #history${history}`).attr("checked", "true");

						if (subHistory.length === 1) {
							$(`.step06 #sub_history${history}_${subHistory}`).attr("checked", "true");
						} else if (typeof subHistory === "string" && subHistory !== "") {
							$(`.step06 #sub_history${history}`).val(subHistory);
						}
					});

					// 當 "無" 這個選項被勾選或取消勾選時觸發
					$("#history1").change(function () {
						if ($(this).prop("checked")) {
							// 當 "無" 被勾選時，取消其他所有選項的勾選
							$('input[name="history"]').not("#history1").prop("checked", false);
						}
					});

					// 如果其他選項被勾選時，取消 "無" 的勾選
					$('input[name="history"]')
						.not("#history1")
						.change(function () {
							if ($(this).prop("checked")) {
								$("#history1").prop("checked", false);
							}
						});

					$(`.step06 #step06text02`).val(rightData06.item[2].value[0]);

					$(`.step07 #step07text01`).val(rightData07.item[0].value[0]);

					$(`.step07 #step07text02`).val(rightData07.item[1].value[0]);

					$(`.step07 #step07text03`).val(rightData07.item[2].value[0]);

					$(`.step07 #emoji2-${rightData07.item[3].value[0]}`).attr(
						"checked",

						"true"
					);
				}
			},
		});
	};

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
				if (res.returnCode) {
					if (type != "prev") {
						if (step != "07") {
							$(".title span span").html(`0${Number(step) + 1}`);

							$(`.step0${Number(step)}`).css("display", "none");

							$(`.step0${Number(step) + 1}`).css("display", "block");

							step = `0${Number(step) + 1}`;

							const url = new URL(window.location.href); // Get the current URL

							url.searchParams.set("step", Number(step)); // Update the 'step' parameter value to '2'

							window.history.replaceState(null, "", url);
						} else {
							window.location.href = `../../AssessmentPage/question/Index02.html?workOrderID=${testparams.workOrderID}`;
						}
					} else {
						if (step != "01") {
							$(".title span span").html(`0${Number(step) - 1}`);

							$(`.step0${Number(step)}`).css("display", "none");

							$(`.step0${Number(step) - 1}`).css("display", "block");

							step = `0${Number(step) - 1}`;
						} else {
							window.location.href = `../../AssessmentPage/question/Index.html?workOrderID=${testparams.workOrderID}`;
						}
					}
				}
			},

			error: function () {
				$("#error").text("An error occurred. Please try again later.");
			},
		});
	};

	$(".next").on("click", function () {
		if (step == "01") {
			let newData = [
				{ value: [$("#coachA").val(), $("#coachB").val()] },

				{
					value: [
						$("input[name='sex']:checked").val(),

						$(".step01 .name").val(),

						$(".step01 .name02").val(),

						$(".step01 .birthday").val(),

						$(".step01 .city").val(),

						$(".step01 .county").val(),

						$(".step01 .add").val(),

						$(".step01 .family").val(),

						$(".step01 .caregiver").val(),
					],
				},
			];

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update("next");
		} else if (step == "02") {
			let newData = [
				{ value: [$("input[name='elevator']:checked").val()] },

				{ value: [$("input[name='disability']:checked").val()] },

				{ value: [$("input[name='cms']:checked").val()] },
			];

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update();
		} else if (step == "03") {
			let newData = [{ value: [] }, { value: [$("input[name='emoji']:checked").val()] }];

			$("input[name='obstacle']:checked").each((idx, e) => {
				newData[0].value.push($(e).val());
			});

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update();
		} else if (step == "04") {
			let newData = [
				{ value: [$("input[name='motives']:checked").val()] },

				{ value: [$("#motivesText").val()] },

				{ value: [$("input[name='family']:checked").val()] },

				{ value: [$("#familyText").val()] },
			];

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update();
		} else if (step == "05") {
			let newData = {};

			$("input[name='diagnosis']:checked").each((idx, e) => {
				let diagnosisValue = $(e).val();

				let subDiagnosis = $(`input[name='sub_diagnosis${diagnosisValue}']`);

				let subDiagnosisType = subDiagnosis.attr("type");

				let subDiagnosisValue =
					subDiagnosisType === "text"
						? subDiagnosis.val()
						: $(`input[name='sub_diagnosis${diagnosisValue}']:checked`).val();

				if (subDiagnosisValue === undefined) {
					subDiagnosisValue = "";
				}

				newData[diagnosisValue] = subDiagnosisValue;
			});

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update();
		} else if (step == "06") {
			let newData = [{ value: [$("#step06text01").val()] }, { value: {} }, { value: [$("#step06text02").val()] }];

			$("input[name='history']:checked").each((idx, e) => {
				let historyValue = $(e).val();

				let subHistory = $(`input[name='sub_history${historyValue}']`);

				let subHistoryType = subHistory.attr("type");

				let subHistoryValue =
					subHistoryType === "text" ? subHistory.val() : $(`input[name='sub_history${historyValue}']:checked`).val();

				if (subHistoryValue === undefined) {
					subHistoryValue = "";
				}

				newData[1].value[historyValue] = subHistoryValue;
			});

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update();
		} else if (step == "07") {
			let newData = [
				{ value: [$("#step07text01").val()] },

				{ value: [$("#step07text02").val()] },

				{ value: [$("#step07text03").val()] },

				{ value: [$("input[name='emoji2']:checked").val()] },
			];

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update();
		}
	});

	$(".prev").on("click", function () {
		console.log(params.workOrderID);
		if (step == "01") {
			let newData = [
				{ value: [$("#coachA").val(), $("#coachB").val()] },

				{
					value: [
						$("input[name='sex']:checked").val(),

						$(".step01 .name").val(),

						$(".step01 .name02").val(),

						$(".step01 .birthday").val(),

						$(".step01 .city").val(),

						$(".step01 .county").val(),

						$(".step01 .add").val(),

						$(".step01 .family").val(),

						$(".step01 .caregiver").val(),
					],
				},
			];

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update("prev");
		} else if (step == "02") {
			let newData = [
				{ value: [$("input[name='elevator']:checked").val()] },

				{ value: [$("input[name='disability']:checked").val()] },

				{ value: [$("input[name='cms']:checked").val()] },
			];

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update("prev");
		} else if (step == "03") {
			let newData = [{ value: [] }, { value: [$("input[name='emoji']:checked").val()] }];

			$("input[name='obstacle']:checked").each((idx, e) => {
				newData[0].value.push($(e).val());
			});

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update("prev");
		} else if (step == "04") {
			let newData = [
				{ value: [$("input[name='motives']:checked").val()] },

				{ value: [$("#motivesText").val()] },

				{ value: [$("input[name='family']:checked").val()] },

				{ value: [$("#familyText").val()] },
			];

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update("prev");
		} else if (step == "05") {
			let newData = {};

			$("input[name='diagnosis']:checked").each((idx, e) => {
				let diagnosisValue = $(e).val();

				let subDiagnosis = $(`input[name='sub_diagnosis${diagnosisValue}']`);

				let subDiagnosisType = subDiagnosis.attr("type");

				let subDiagnosisValue =
					subDiagnosisType === "text"
						? subDiagnosis.val()
						: $(`input[name='sub_diagnosis${diagnosisValue}']:checked`).val();

				if (subDiagnosisValue === undefined) {
					subDiagnosisValue = "";
				}

				newData[diagnosisValue] = subDiagnosisValue;
			});

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update("prev");
		} else if (step == "06") {
			let newData = [{ value: [$("#step06text01").val()] }, { value: [] }, { value: [$("#step06text02").val()] }];

			$("input[name='history']:checked").each((idx, e) => {
				newData[1].value.push($(e).val());
			});

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update("prev");
		} else if (step == "07") {
			let newData = [
				{ value: [$("#step07text01").val()] },

				{ value: [$("#step07text02").val()] },

				{ value: [$("#step07text03").val()] },

				{ value: [$("input[name='emoji2']:checked").val()] },
			];

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update("prev");
		}
	});

	// $(".home-box").click(() => {
	//  // console.log(params);

	// });

	$(".home-box").click(() => {
		//window.location.href = `../`
		//console.log(params);
		window.location.href = `../../AssessmentPage/index.html?workOrderID=${testparams.workOrderID}`;
	});
	// $(".button").click(() => {
	//   window.location.href = `../../AssessmentPage/question/question_a01.html?step=1&bigstep=0`
	// })
	// $(".prev").click(() => {
	//   //console.log(params);
	//   //window.location.href = `../`
	//   window.location.href = `../../AssessmentPage/index.html?workOrderID=${testparams.workOrderID}`;
	// })
});
