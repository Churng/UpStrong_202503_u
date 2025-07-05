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

		let data01 = res.returnData.item[3].item[0];

		$(".step01 .select-box").html("");

		$(data01.item).each((idx, e) => {
			if (idx <= 2) {
				$($(".step01 .select-box")[0]).append(`

	                        <div class="box">

	                        <span class="title">${e.title}</span>

	                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">

	                            <path d="M9.3335 18L15.3335 12L9.3335 6" stroke="#999999" stroke-linecap="round" stroke-linejoin="round"/>

	                        </svg>

	                        <div class="checkbox-box" data-idx="${idx}">

	                            <div class="title-box">

	                                <span>項目</span>

	                                <span>左</span>

	                                <span>右</span>

	                            </div>

	                        </div>

	                    </div>

	                    `);

				$(e.question).each((idxx, ee) => {
					$(`[data-idx="${idx}`).append(`

	                            <div class="checkbox" data-checkbox="${idxx}">

	                                <span>${ee.title}</span>

	                                <div>

	                                    <input type="checkbox" id="${ee.title}left" name="${ee.title}" value="1">

	                                    <label for="${ee.title}left"></label>

	                                </div>

	                                <div>

	                                    <input type="checkbox" id="${ee.title}right" name="${ee.title}" value="2">

	                                    <label for="${ee.title}right"></label>

	                                </div>

	                                </div>

	                            `);
				});
			}
		});

		getCheckListRecord();

		$(".box").on("click", function () {
			$(this).toggleClass("active");
		});

		$(".box .checkbox-box").on("click", function (e) {
			e.stopPropagation();
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

					let data01 = res.returnData.item[3];

					console.log(data01);

					$.each(data01.item[0].item, (section, sectionValue) => {
						$.each(sectionValue.value, (subIndex, questionValue) => {
							$(`input[value=${questionValue}][data-section-id=${section}][data-sub-id=${subIndex}]`).attr(
								"checked",
								true
							);
						});
					});
				}
			},
		});
	};

	getStep();

	getCheckListRecord();

	$(".box").on("click", function () {
		$(this).toggleClass("active");
	});

	$(".box .checkbox-box").on("click", function (e) {
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
				console.log(res);

				if (res.returnCode) {
					if (type == "prev") {
						window.location.href = `../../AssessmentPage/question/Index04.html?workOrderID=${testparams.workOrderID}`;
					} else {
						window.location.href = `../../AssessmentPage/question/Index05.html?workOrderID=${testparams.workOrderID}`;
					}
				}
			},

			error: function () {
				$("#error").text("An error occurred. Please try again later.");
			},
		});
	};

	$(".next").on("click", function () {
		let newData = {};

		for (let i = 0; i < 10; i++) {
			let questionValues = {};

			$(`input[data-section-id=${i}]`).each((inx, e) => {
				if ($(e).is(":checked")) {
					let subId = $(e).data("sub-id");

					if (!questionValues[subId]) {
						questionValues[subId] = [];
					}

					questionValues[subId].push($(e).val());
				}
			});

			if (Object.keys(questionValues).length !== 0) {
				newData[i] = { value: questionValues };
			}
		}

		oldData.item[paramBigStep].item[0].item = newData;
		oldData.item[paramBigStep].item[0].if_complete = true;

		console.log(oldData.item[paramBigStep].item[0].item);

		update();
	});

	$(".prev").on("click", function () {
		let newData = [];

		$(".select-box .checkbox-box").each((idx, e) => {
			newData.push({ value: [] });

			$(`[data-idx=${idx}] .checkbox`).each((idxx, ee) => {
				if ($(`[data-idx=${idx}] [data-checkbox=${idxx}] input:checked`).length > 0) {
					newData[idx].value.push([]);
				}

				$(`[data-idx=${idx}] [data-checkbox=${idxx}] input:checked`).each((idxxx, eee) => {
					if ($(eee).val()) {
						newData[idx].value[idxx].push(Number($(eee).val()));
					}
				});
			});
		});

		oldData.item[paramBigStep].item[0].item = newData;

		oldData.item[paramBigStep].item[0].if_complete = true;

		update("prev");
	});

	$(".home-box").click(() => {
		window.location.href = `../../AssessmentPage/index.html?workOrderID=${testparams.workOrderID}`;
	});
});
