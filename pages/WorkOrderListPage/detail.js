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
				handleResponse(res);
				let data = res.returnData.workOrderDetailData;
				$(".main-box").html("");

				$(".main-box").append(`
					<div class="printerbutton">
						<button class="printerbutton-toggle">列印</button>
						<ul class="printerbutton-menu">
							<li id="printServiceRecord">服務紀錄</li>
							<li id="printTrainingGuide">訓練指引</li>
							<li id="printInitialAssessmentForm">初評評估量表</li>
							<li id="printDailyFunctionAssessmentForm">生活功能評估表</li>
						</ul>
					</div>
             <div class="banner">
      <img src="../../assets/workOrderListPage-detail/banner_0.png" alt="">
    </div>
    <div class="content">

      <div class="title-box">

        <span class="title text-start fw-bold">${data.ServiceTypeName}</span>

        <div class="text-start my-3">
          <span class=" type ${
						data.Status == 1
							? " type01"
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
        </div>

        <div class="text-start border-bottom">
          <span class="text">${data.CaseName}</span>
        </div>


      </div>

      <div class="box01">

        <div class="detail">

          <!-- <span class="name">個案名稱：${data.CaseName}</span> -->

          <div class="button-box">

            <span>個案資料</span>

            <span>聯絡簿</span>

          </div>

        </div>

      </div>

      <div class="box02">

        <div class="serve-box">

          <span class="date fw-bolder mb-2">預約時間</span>
          <div class="border border-2 rounded text-center mb-2">${data.ServiceDate}</div>

          <span class="add fw-bolder mb-2">服務地點</span>
          <div class="border border-2 rounded text-center mb-2">${data.ServiceArea}</div>

        </div>

        <div class="coach-box">


          <span class="d-block fw-bolder mb-2">

            專業評估教練

          </span>

          <div class="border border-2 rounded text-center mb-2">${
						data.ProfessionalAssessmentCoach ? data.ProfessionalAssessmentCoach : "尚無專業評估教練"
					}</div>


          <span class="d-block fw-bolder mb-2">

            自主應用教練

          </span>
          <div class="border border-2 rounded text-center mb-2">${data.AutonomousApplicationCoach}</div>


        </div>


        <div class="record-box mt-5">

          <div class="type-box">

            <span class="ServiceCheckInlink${data.SignComplete == true ? " active" : ""}">服務簽到</span>

            <span class="ServiceRecordlink ${data.RecordComplete == true ? " active" : ""}">服務紀錄</span>

            <span class="AssessmentPagelink ${data.AssessmentScale == true ? " active" : ""}">評估量表</span>


            <span class="AssessmentRecommendation ${
							data.TrainingRecommendation == true ? " active" : ""
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

				//四個頁面連結
				$(".AssessmentPagelink").click(() => {
					console.log(params);
					window.location.href = `../AssessmentPage/index.html?workOrderID=${params.orderid}`;
				});

				$(".ServiceRecordlink").click(() => {
					console.log(params);
					window.location.href = `../ServiceRecord/index.html?workOrderID=${params.orderid}`;
				});

				$(".ServiceCheckInlink").click(() => {
					console.log(params);
					window.location.href = `../ServiceCheckIn/index.html?workOrderID=${params.orderid}`;
				});

				//列印toggle

				$(".printerbutton-toggle").on("click", function () {
					$(this).toggleClass("active");
					$(this).closest(".printerbutton").toggleClass("open");
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

	// 列印服務紀錄
	$(".main-box").on("click", "#printServiceRecord", function () {
		let formData = new FormData();
		let session_id = sessionStorage.getItem("sessionId");
		let action = "printServiceRecordById";
		let chsm = "upStrongWorkOrderApi";
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
				console.log("後端回傳", res);
				console.log("typeof res", typeof res);
				console.log(res.returnData.pdfUrl);

				if (typeof res === "object" && res.returnCode === "1" && res.returnData && res.returnData.pdfUrl) {
					try {
						window.open(res.returnData.pdfUrl, "_blank");
					} catch (e) {
						console.error("處理 PDF 失敗", e);
						alert("列印服務紀錄失敗，可能是 PDF 格式錯誤。");
					}
				} else {
					alert("無效的 PDF 資料，請稍後再試。");
				}
			},
			error: function () {
				alert("An error occurred. Please try again later.");
			},
		});
	});

	// 列印訓練指引
	$(".main-box").on("click", "#printTrainingGuide", function () {
		let formData = new FormData();
		let session_id = sessionStorage.getItem("sessionId");
		let action = "printTrainingGuideById";
		let chsm = "upStrongWorkOrderApi";
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
				console.log("後端回傳", res);
				console.log("typeof res", typeof res);

				if (typeof res === "object" && res.returnCode === "1" && res.returnData && res.returnData.pdfUrl) {
					try {
						window.open(res.returnData.pdfUrl, "_blank");
					} catch (e) {
						console.error("處理 PDF 失敗", e);
						alert("列印服務紀錄失敗，可能是 PDF 格式錯誤。");
					}
				} else {
					alert("無效的 PDF 資料，請稍後再試。");
				}
			},
			error: function () {
				alert("An error occurred. Please try again later.");
			},
		});
	});

	// 列印初評表單
	$(".main-box").on("click", "#printInitialAssessmentForm", function () {
		let formData = new FormData();
		let session_id = sessionStorage.getItem("sessionId");
		let action = "printInitialAssessmentFormById";
		let chsm = "upStrongWorkOrderApi";
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
				console.log("後端回傳", res);
				console.log("typeof res", typeof res);

				if (typeof res === "object" && res.returnCode === "1" && res.returnData && res.returnData.pdfUrl) {
					try {
						window.open(res.returnData.pdfUrl, "_blank");
					} catch (e) {
						console.error("處理 PDF 失敗", e);
						alert("列印服務紀錄失敗，可能是 PDF 格式錯誤。");
					}
				} else {
					alert("無效的 PDF 資料，請稍後再試。");
				}
			},
			error: function () {
				alert("An error occurred. Please try again later.");
			},
		});
	});

	// 列印訓練指引
	$(".main-box").on("click", "#printDailyFunctionAssessmentForm", function () {
		let formData = new FormData();
		let session_id = sessionStorage.getItem("sessionId");
		let action = "printDailyFunctionAssessmentFormById";
		let chsm = "upStrongWorkOrderApi";
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
				console.log("後端回傳", res);
				console.log("typeof res", typeof res);

				if (typeof res === "object" && res.returnCode === "1" && res.returnData && res.returnData.pdfUrl) {
					try {
						window.open(res.returnData.pdfUrl, "_blank");
					} catch (e) {
						console.error("處理 PDF 失敗", e);
						alert("列印服務紀錄失敗，可能是 PDF 格式錯誤。");
					}
				} else {
					alert("無效的 PDF 資料，請稍後再試。");
				}
			},
			error: function () {
				alert("An error occurred. Please try again later.");
			},
		});
	});
});
