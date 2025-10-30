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

	const currentUserType = sessionStorage.getItem("userType");
	console.log(params);
	console.log(typeof currentUserType);

	//設定返回按鈕
	if (currentUserType === "1") {
		$("#prevBtn")
			.show()
			.on("click", function () {
				window.history.back();
			});
		$("#submit").hide();
	} else if (currentUserType === "2") {
		$("#prevBtn").hide();
		$("#submit").show();
	} else {
		$("#prevBtn").hide();
		$("#submit").hide();
	}

	//送出按鈕設定
	$(".box02 .record-box .type-box span").on("click", function () {
		$(this).toggleClass("active");
	});

	const getOrderData = () => {
		let formData = new FormData();

		let session_id = sessionStorage.getItem("sessionId");

		let action = "getWorkOrderServiceDetailById";

		let chsm = "upStrongWorkOrderApi"; // api文件相關

		chsm = $.md5(session_id + action + chsm);

		let data = { workOrderId: params.workOrderID };

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

				if (res.returnCode == "1" && res.returnData) {
					let data = res.returnData;
					let item = data.workOrderServiceDetailData;

					$("#SR-ActivitySummary").val(item.ActivitySummary);
					$("#SR-DiscomfortReported").val(item.DiscomfortReported);
					$("#SR-AdjustmentSuggestion").val(item.AdjustmentSuggestion);
					$("#SR-CommunicationNotes").val(item.CommunicationNotes);
				}
			},

			error: function () {
				$("#error").text("An error occurred. Please try again later.");
			},
		});
	};

	getOrderData();

	//送出
	$("#submit").on("click", function (e) {
		e.preventDefault();
		let formData = new FormData();

		let session_id = sessionStorage.getItem("sessionId");

		let action = "setWorkOrderServiceDetailById";

		let chsm = "upStrongWorkOrderApi"; // api文件相關

		chsm = $.md5(session_id + action + chsm);

		let data = {
			workOrderId: params.workOrderID,
			ActivitySummary: $("#SR-ActivitySummary").val(),
			DiscomfortReported: $("#SR-DiscomfortReported").val(),
			AdjustmentSuggestion: $("#SR-AdjustmentSuggestion").val(),
			CommunicationNotes: $("#SR-CommunicationNotes").val(),
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
				console.log(res);
				handleResponse(res);
				if (res.returnCode == "1" && res.returnData) {
					successResponse(res);
					setTimeout(() => {
						window.history.back();
					}, 2000);
				}
			},

			error: function () {
				$("#error").text("An error occurred. Please try again later.");
			},
		});
	});
});
