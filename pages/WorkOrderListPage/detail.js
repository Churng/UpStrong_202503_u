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
	const urlSearchParams = new URLSearchParams(window.location.search);

	const params = Object.fromEntries(urlSearchParams.entries());

	const getOrderData = () => {
		let formData = new FormData();

		let session_id = sessionStorage.getItem("sessionId");

		let action = "getWorkOrderDetailById";

		let chsm = "upStrongWorkOrderApi"; // api文件相關

		chsm = $.md5(session_id + action + chsm);

		let data = { workOrderId: params.orderid };

		formData.append("session_id", session_id);

		formData.append("action", action);

		formData.append("chsm", chsm);

		formData.append("data", JSON.stringify(data));

		$.ajax({
			url: `${window.apiUrl}${window.apiworkOrder}`,

			type: "POST",

			data: formData,

			processData: false,

			contentType: false,

			success: function (res) {
				console.log(res);

				let data = res.returnData.workOrderDetailData;
				$(".main-box").html("");

				$(".main-box").append(`
            <div class="content">
                <div class="title-box">

                    <span class="title">開案評估</span>

                    <span class="text">${data.WorkOrderId}</span>

                </div>

                <div class="box01">

                    <span class="type ${
											data.Status == 1
												? "type01"
												: data.Status == 2
												? "type02"
												: data.Status == 3
												? "type03"
												: data.Status == 4
												? "type04"
												: data.Status == 5
												? "type05"
												: ""
										}">${data.StatusName}</span>

                    <div class="detail">

                    <span class="name">個案名稱：${data.CaseName}</span>

                    <div class="button-box">

                        <span>個案資料</span>

                        <span>聯絡簿</span>

                    </div>

                    </div>

                </div>

                <div class="box02">

                    <div class="serve-box">

                    <span class="date">預約時間：${data.ServiceDate}</span>

                    <span class="add">服務地點：${data.ServiceArea}</span>

                    </div>

                    <div class="coach-box">

                    <span>

                        <div class="img">

                            <img src="${data.ProfessionalAssessmentCoachPhoto}" />

                        </div>

                        <span>

                        專業評估教練：${data.ProfessionalAssessmentCoach}

                        </span>

                    </span>

                    <span>

                        <div class="img">

                            <img src="${data.AutonomousApplicationCoachPhoto}" />

                        </div>

                        <span>

                        自主應用教練：${data.AutonomousApplicationCoach}

                        </span>

                    </span>

                    </div>

                    <div class="singin">

                    <span class="title">簽到完成：${data.SignComplete == true ? "是" : "否"}</span>

                    <div class="reason-box">

                        <span>原因：</span>

                        <input class="reason" type="text" value="${data.SignCompleteReason}" disabled>

                        <span class="save-button edit">

                        <svg style="margin-top: -3px;" width="16" height="16" viewBox="0 0 16 16"

                            xmlns="http://www.w3.org/2000/svg">

                            <path

                            d="M15.665 2.513 13.488.337A1.14 1.14 0 0 0 12.677 0h-.001a1.14 1.14 0 0 0-.811.336L1.056 11.145c-.119.1-.21.237-.246.401L.018 15.1a.739.739 0 0 0 .882.882l3.554-.792a.733.733 0 0 0 .403-.248L15.665 4.135a1.148 1.148 0 0 0 0-1.622zm-5.153 1.266 1.709 1.71-6.656 6.655-1.709-1.709 6.656-6.656zm-8.308 8.308.607-.607 1.709 1.71-.607.606-2.2.49.491-2.2zm11.062-7.644-1.71-1.709 1.12-1.12 1.71 1.71-1.12 1.12z"

                            fill="#1654B9" fill-rule="nonzero" />

                        </svg>

                        編輯

                        </span>

                        <span class="save-button save" style="display:none">

                        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">

                            <path

                            d="M13.547 3.028a.563.563 0 0 0-.808 0L5.893 10.02 3.26 7.332a.563.563 0 0 0-.808 0 .592.592 0 0 0 0 .826l3.036 3.1a.563.563 0 0 0 .808 0l7.25-7.405a.592.592 0 0 0 0-.825z"

                            fill="#1654B9" fill-rule="evenodd" />

                        </svg>

                        儲存

                        </span>

                    </div>

                    </div>

                    <div class="record-box">

                    <span class="title">記錄完成：${data.RecordComplete == true ? "是" : "否"}</span>

                    <div class="type-box">

                        <span class="${data.PhotoSign == true ? "active" : ""}">照片簽到</span>

                        <span class="link ${data.AssessmentScale == true ? "active" : ""}">評估量表</span>


                        <span class="AssessmentRecommendation ${
													data.AssessmentRecommendation == true ? "active" : ""
												}">訓練指引</span>
                    

                    </div>

                    </div>
                  </div>
                </div>

                `);

				$(".edit").on("click", function () {
					$(".edit").css("display", "none");

					$(".save").css("display", "block");

					$(".reason").attr("disabled", false);
				});

				$(".save").on("click", function () {
					$(".save").css("display", "none");

					$(".edit").css("display", "block");

					$(".reason").attr("disabled", true);

					let formData = new FormData();

					let session_id = sessionStorage.getItem("sessionId");

					let action = "setWorkOrderSignCompleteReasonById";

					let chsm = "upStrongWorkOrderApi"; // api文件相關

					chsm = $.md5(session_id + action + chsm);

					let data = {
						workOrderId: params.orderid,

						signCompleteReason: $(".reason").val(),
					};

					formData.append("session_id", session_id);

					formData.append("action", action);

					formData.append("chsm", chsm);

					formData.append("data", JSON.stringify(data));

					$.ajax({
						url: `${window.apiUrl}${window.apiworkOrder}`,

						type: "POST",

						data: formData,

						processData: false,

						contentType: false,

						success: function (res) {
							$(".save").css("display", "none");

							$(".edit").css("display", "block");

							$(".reason").attr("disabled", true);

							getOrderData();
						},

						error: function () {
							$("#error").text("An error occurred. Please try again later.");
						},
					});
				});

				$(".link").click(() => {
					console.log(params);
					window.location.href = `../AssessmentPage/index.html?workOrderID=${params.orderid}`;
				});
				$(".AssessmentRecommendation").click(() => {
					window.location.href = `../AssessmentRecommendation/index.html?workOrderID=${params.orderid}`;
				});
			},

			error: function () {
				$("#error").text("An error occurred. Please try again later.");
			},
		});
	};

	getOrderData();
});
