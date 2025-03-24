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
				newData.value[mainValue] = "1";
			} else {
				let payload = [];

				$(`.lv${mainValue}-sub-list-content:checked`).each((index, subValue) => {
					payload.push($(subValue).val());
				});

				newData.value[mainValue] = payload;
			}

			console.log(newData);

			oldData.item[paramBigStep].item[Number(step) - 1].item[1] = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].item[2].value[5] = $("[name='cognition']:checked").val();

			oldData.item[paramBigStep].item[Number(step) - 1].item[2].value[6] = $("[name='vision']:checked").val();

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update();
		} else if (step == "02") {
			let newData = [];

			for (let i = 0; i < $(`[data-sort]`).length; i++) {
				newData.push({ value: [] });
			}

			$(`[data-sort]`).each((idx, e) => {
				$(`[data-sort=${idx + 1}] select`).each((idxx, ee) => {
					newData[idx].value.push(Number($(ee).val()));
				});
			});

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

			for (let i = 0; i < $(`[data-sort]`).length; i++) {
				newData.push({ value: [] });
			}

			$(`[data-sort]`).each((idx, e) => {
				$(`[data-sort=${idx + 1}] select`).each((idxx, ee) => {
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

	const getList = () => {
		let formData = new FormData();

		let session_id = sessionStorage.getItem("sessionId");

		let action = "getCheckListByStep";

		let chsm = "upStrongCheckListApi"; // api文件相關

		let data = { data: "8" };

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

				let data02 = res.returnData.item[5].item[1];

				$(".step02 .list-box").html("");

				$(data02.item).each((idx, e) => {
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
    
                <div class="btm-box" data-sort="${e.sort}">
    
                </div>
    
            </div>
    
          `);

					$(e.question).each((idxx, ee) => {
						$(`[data-sort="${e.sort}"]`).append(`
    
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

				getCheckListRecord();

				$(".step02 .list-box .list").on("click", function () {
					$(this).toggleClass("active");
				});

				$(".step02 .list-box .btm-box").on("click", function (e) {
					e.stopPropagation();
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
					oldData = res.returnData;

					let data01 = res.returnData.item[paramBigStep].item[0];
					let data02 = res.returnData.item[paramBigStep].item[1];
					$(".user-detail .name").html(data01.item[0].value[0]);

					$(".user-detail .id").html(data01.item[0].value[1]);

					let responseRadioIndex = Object.keys(data01.item[1].value)[0];

					let radioValues = data01.item[1].value[responseRadioIndex];

					$(`#lv${responseRadioIndex}`).attr("checked", true);

					if (typeof radioValues === "object") {
						$.each(radioValues, (level, checkedItem) => {
							$(`#lv${responseRadioIndex}_${checkedItem}`).attr("checked", true);
						});
					}

					$(data01.item[2].value).each((idx, e) => {
						$(".other-box .text").each((idxx, ee) => {
							if (idx == idxx) {
								$(ee).text(e);
							}
						});
					});

					// console.log(data01.item[2].value[5]);

					$(`#cognition${data01.item[2].value[5]}`).attr("checked", true);

					$(`#vision${data01.item[2].value[6]}`).attr("checked", true);

					$("[data-sort] select").each((idx, e) => {
						$(data02.item).each((idxx, ee) => {
							$(ee.value).each((idxxx, eee) => {
								if ($(`[data-sort=${idxx + 1}] select`)[idxxx]) {
									if (idxx == idxx) {
										$($(`[data-sort=${idxx + 1}] select`)[idxxx]).val(eee);
									}
								}
							});
						});
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
