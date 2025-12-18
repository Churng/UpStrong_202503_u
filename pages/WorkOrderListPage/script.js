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

function formatDateToYYYYMMDD(date) {
	let year = date.getFullYear();
	let month = String(date.getMonth() + 1).padStart(2, "0"); // 月份從 0 開始，需要加 1
	let day = String(date.getDate()).padStart(2, "0"); // 確保日期為兩位數
	return `${year}-${month}-${day}`;
}

$(document).ready(function () {
	getWorkOrder();

	let eventsData = null;
	//列表tab
	$(".model_to_01").click(() => {
		$(".model01").css("display", "block");
		$(".model02").css("display", "none");
	});

	//日曆tab

	$(".model_to_02").click(() => {
		$(".model01").hide();
		$(".model02").show();

		// 拿目前月份
		const now = new Date();
		const year = now.getFullYear();
		const month = now.getMonth();
		const firstDay = new Date(year, month, 1);

		$("#calendar").fullCalendar("destroy");

		$("#calendar").fullCalendar({
			locale: "zh-tw",
			fixedWeekCount: true,
			defaultDate: firstDay,
			height: "auto",
			dayNamesShort: ["日", "一", "二", "三", "四", "五", "六"],
			monthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
			buttonText: {
				today: "今天",
			},
			views: {
				month: {
					titleFormat: "YYYY年 MMMM",
				},
			},

			// ✅ 直接從篩選後資料生成事件
			events: function (start, end, timezone, callback) {
				// 沒資料就空
				if (!filteredWorkOrderData || filteredWorkOrderData.length === 0) {
					callback([]);
					return;
				}

				// 只取目前顯示月份範圍的資料
				const eventsData = filteredWorkOrderData
					.filter((e) => {
						const date = new Date(e.ServiceDate);
						return date >= start.toDate() && date <= end.toDate();
					})
					.map((e) => ({
						title: e.StatusName,
						start: e.ServiceDate.slice(0, 10), // 轉成 "YYYY-MM-DD"
						className:
							e.Status == 1
								? "status01"
								: e.Status == 2
								? "status02"
								: e.Status == 3
								? "status03"
								: e.Status == 4
								? "status04"
								: e.Status == 5
								? "status05"
								: null,
						detail: e,
					}));

				// ✅ 先回傳給 FullCalendar（讓 dayClick、clientEvents 可以用）
				callback(eventsData);

				// ✅ 然後立刻把 FullCalendar 自己畫的事件清掉，改成自訂樣式
				setTimeout(() => {
					// 移除預設的事件內容（避免重複顯示）
					$(".fc-event").remove();

					// 先確保每個日期格都有 even-box
					$(".fc-day").each(function () {
						if (!$(this).find(".even-box").length) {
							$(this).append(`<div class="even-box"></div>`);
						}
					});

					// 自己根據 eventsData append
					$(".fc-day").each(function () {
						const $dayCell = $(this);
						const cellDate = $dayCell.data("date");

						eventsData.forEach((ee) => {
							if (cellDate === ee.start) {
								$dayCell.find(".even-box").append(`
							<a class="fc-day-grid-event fc-event ${ee.className}">
								<div class="fc-content">
									<span class="fc-title">${ee.detail.CaseName} - ${ee.detail.ServiceTypeName}</span>
								</div>
							</a>
						`);
							}
						});
					});
				}, 150);
			},
			eventRender: function (event, element) {
				// 阻止 FullCalendar 自動插入標題，清空內文
				element.html("");

				// 找到該日期格（fc-day），在其中 append 我們自己的結構
				const cell = $(`.fc-day[data-date='${event.start.format("YYYY-MM-DD")}']`);

				if (cell.length > 0) {
					if (!cell.find(".even-box").length) {
						cell.append(`<div class="even-box"></div>`);
					}

					cell.find(".even-box").append(`
			<a class="fc-day-grid-event fc-event ${event.className}">
				<div class="fc-content">
					<span class="fc-title">${event.detail.CaseName} - ${event.detail.ServiceTypeName}</span>
				</div>
			</a>
		`);
				}

				// return false 告訴 FullCalendar：不要幫我顯示這個 event
				return false;
			},

			// ✅ 點擊日期顯示詳細資料
			dayClick: function (date, allDay, jsEvent, view) {
				$(".right-box").show();
				const clickedDate = date.format("YYYY-MM-DD");

				// 顯示日期資訊（抓台灣行事曆 JSON）
				// 每年需要更新，目前只放到2026年不然會顯示錯誤資料
				const year = date.format("YYYY");
				$.getJSON(`../../js/TaiwanCalendar/${year}.json`, (res) => {
					const match = res.find((e) => {
						const resDate = `${e.date.slice(0, 4)}-${e.date.slice(4, 6)}-${e.date.slice(6, 8)}`;
						return resDate === clickedDate;
					});

					$(".date-bar").html(
						`<span class="date">${clickedDate} 星期${match?.week || ""}</span>
                     <span class="date-tag">${match?.description || ""}</span>`
					);
				});

				// 顯示該日期的工單詳情
				$(".right-box .detail").html("");

				const todayEvents = $("#calendar").fullCalendar("clientEvents", function (event) {
					return moment(event.start).format("YYYY-MM-DD") === clickedDate;
				});

				todayEvents.forEach((event) => {
					const e = event.detail;
					if (e.courseTypeId == 3) {
						$(".right-box .detail").append(`
						<div class="detail-box vacation">
							<span class="tag">${e.courseType}</span>
						</div>
					`);
					} else {
						$(".right-box .detail").append(`
						<div class="detail-box ${
							e.Status == 1
								? "status01"
								: e.Status == 2
								? "status02"
								: e.Status == 3
								? "status03"
								: e.Status == 4
								? "status04"
								: e.Status == 5
								? "status05"
								: ""
						}" data-orderid="${e.WorkOrderId}">
							<span class="tag status">${e.StatusName}</span>
							<span class="title">${e.ServiceTypeName}</span>
							<span class="name">個案：${e.CaseName}</span>
							<span class="coach">專業評估教練：${e.ProfessionalAssessmentCoach || ""}</span>
							<span class="coach">自主應用教練：${e.AutonomousApplicationCoach || ""}</span>
							<span class="date">服務日期：${e.ServiceDate}</span>
							<span class="add">服務地點：${e.ServiceArea}</span>
						</div>
					`);
					}
				});
			},
		});
	});

	$(".hidden-btn img").click(() => {
		$(".fc-view-container").toggleClass("min");
		$(".hidden-btn").toggleClass("min");
	});

	//取得資料
	let workOrderData = null;
	function getWorkOrder() {
		let formData = new FormData();
		let session_id = sessionStorage.getItem("sessionId");
		let action = "getWorkOrder";
		let chsm = "upStrongWorkOrderApi"; // api文件相關
		chsm = $.md5(session_id + action + chsm);

		//搜尋起訖
		var birthDate = $("#birthDate").val();
		var rangeDates = birthDate.split(" ~ ");
		var startDate = new Date(rangeDates[0]);
		var endDate = new Date(rangeDates[1]);

		formatDateToYYYYMMDD(startDate);
		formatDateToYYYYMMDD(endDate);

		//預設起訖日期(當月)
		var now = new Date();
		var year = now.getFullYear();
		var month = now.getMonth();
		var firstDay = new Date(year, month, 1); // 當月第一天
		var lastDay = new Date(year, month + 1, 0); // 下個月的第 0 天( 當月最後一天)

		var formatDate = (date) => {
			var yyyy = date.getFullYear();
			var mm = String(date.getMonth() + 1).padStart(2, "0");
			var dd = String(date.getDate()).padStart(2, "0");
			return `${yyyy}-${mm}-${dd}`;
		};

		var firstDay = birthDate != "" ? formatDateToYYYYMMDD(startDate) : formatDate(firstDay);
		var lastDay = birthDate != "" ? formatDateToYYYYMMDD(endDate) : formatDate(lastDay);
		let data = { startTime: firstDay, endTime: lastDay };

		if ((firstDay, lastDay)) {
			data = { startTime: firstDay, endTime: lastDay };
		}

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
				workOrderData = res.returnData.workOrderData;
				console.log(workOrderData);
				handleResponse(res);

				changePage(1);

				getWorkDetail();
				getPage();
				getSelectData();
			},
			error: function () {
				$("#error").text("An error occurred. Please try again later.");
			},
		});
	}

	const getWorkDetail = () => {
		eventsData = [];
		$(workOrderData).each(function (idx, e) {
			eventsData.push({
				title: e.StatusName,
				start: e.ServiceDate.slice(0, 4) + "-" + e.ServiceDate.slice(5, 7) + "-" + e.ServiceDate.slice(8, 10),
				className:
					e.Status == 1
						? "status01 dnone"
						: e.Status == 2
						? "status02 dnone"
						: e.Status == 3
						? "status03 dnone"
						: e.Status == 4
						? "status04 dnone"
						: e.Status == 5
						? "status05 dnone"
						: null,
				detail: e,
			});
		});
	};

	//手機板日曆縮放
	$(document).on("click", ".page-box div span", function () {
		changePage($(this).data("page"));
		nowPage = $(this).data("page");
	});

	$(document).on("click", ".next", function () {
		console.log("next");
		if (nowPage < total) {
			nowPage += 1;
			changePage(nowPage);
			$(".page").html(`${nowPage}/${total}`);
		}
	});

	$(document).on("click", ".prev", function () {
		console.log("perv");
		if (nowPage > 1) {
			nowPage -= 1;
			changePage(nowPage);
			$(".page").html(`${nowPage}/${total}`);
		}
	});

	//搜尋關鍵字
	let workOrderData_search = [];
	let filteredWorkOrderData = []; // 篩選後要顯示的資料
	let nowPage = 1; // 當前頁數
	let total = 1; // 總頁數

	function getWorkOrderSearch() {
		let formData = new FormData();
		let session_id = sessionStorage.getItem("sessionId");
		let action = "getWorkOrder";
		let chsm = "upStrongWorkOrderApi"; // api文件相關
		chsm = $.md5(session_id + action + chsm);

		//搜尋起訖

		var birthDate = $("#birthDate").val();
		var rangeDates = birthDate.split(" ~ ");
		var startDate = new Date(rangeDates[0]);
		var endDate = new Date(rangeDates[1]);

		formatDateToYYYYMMDD(startDate);
		formatDateToYYYYMMDD(endDate);

		//預設起訖日期(當月)
		var now = new Date();
		var year = now.getFullYear();
		var month = now.getMonth();
		var firstDay = new Date(year, month, 1); // 當月第一天
		var lastDay = new Date(year, month + 1, 0); // 當月最後一天

		var formatDate = (date) => {
			var yyyy = date.getFullYear();
			var mm = String(date.getMonth() + 1).padStart(2, "0");
			var dd = String(date.getDate()).padStart(2, "0");
			return `${yyyy}-${mm}-${dd}`;
		};

		var firstDay = birthDate != "" ? formatDateToYYYYMMDD(startDate) : formatDate(firstDay);
		var lastDay = birthDate != "" ? formatDateToYYYYMMDD(endDate) : formatDate(lastDay);
		let data = { startTime: firstDay, endTime: lastDay };

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
				workOrderData_search = res.returnData.workOrderData;
				console.log(workOrderData_search);
				handleResponse(res);

				// 🔥 資料回來後再篩選顯示
				renderFilteredWorkOrder();
			},
			error: function () {
				$("#error").text("An error occurred. Please try again later.");
			},
		});
	}

	// 🧩 抽出來的函式：用於篩選與顯示資料

	function renderFilteredWorkOrder() {
		$(".mb_none table tbody").html("");
		$(".pc_none .content").html("");

		let select = $(".select").val(); //教練下拉選單
		let search = $(".search").val().toLowerCase(); //關鍵字搜尋

		filteredWorkOrderData = workOrderData_search.filter((item, idx) => {
			console.log(filteredWorkOrderData);

			if (
				(search.trim() === "" ||
					(item.AutonomousApplicationCoach && item.AutonomousApplicationCoach.toLowerCase().includes(search)) ||
					(item.CaseName && item.CaseName.toLowerCase().includes(search)) ||
					(item.ProfessionalAssessmentCoach && item.ProfessionalAssessmentCoach.toLowerCase().includes(search)) ||
					(item.ServiceArea && item.ServiceArea.toLowerCase().includes(search)) ||
					(item.ServiceTypeName && item.ServiceTypeName.toLowerCase().includes(search)) ||
					(item.StatusName && item.StatusName.toLowerCase().includes(search))) &&
				(select == "0" ||
					(item.AutonomousApplicationCoach && item.AutonomousApplicationCoach.toLowerCase().includes(select)) ||
					(item.ProfessionalAssessmentCoach && item.ProfessionalAssessmentCoach.toLowerCase().includes(select)))
			) {
				return $(".mb_none table tbody").append(`
				<tr data-orderid="${item.WorkOrderId}">
					<td><span>${idx + 1}</span></td>
					<td><span>${item.CaseName}</span></td>
					<td>
						<div class="coach"><span class="${item.WorkOrderType == 1 ? "active-coach" : ""}">
							${item.ProfessionalAssessmentCoach}
						</span></div>
					</td>
					<td>
						<div class="coach"><span class="${item.WorkOrderType == 2 ? "active-coach" : ""}">
							${item.AutonomousApplicationCoach}
						</span></div>
					</td>
					<td><span>${item.ServiceDate}</span></td>
					<td><span>${item.ServiceArea}</span></td>
					<td><span class="text type ${
						item.Status == 1
							? "type01"
							: item.Status == 2
							? "type02"
							: item.Status == 3
							? "type03"
							: item.Status == 4
							? "type04"
							: item.Status == 5
							? "type05"
							: ""
					}">${item.StatusName}</span></td>
					<td><span>${item.ServiceTypeName}</span></td>
				</tr>
			`);
			}
		});

		getPage(1);
	}

	// 建立分頁
	function getPage(page) {
		total = Math.ceil(filteredWorkOrderData.length / 10);
		nowPage = page ?? 1;

		$(".total-text").html(`共 ${filteredWorkOrderData.length} 筆`);
		$(".page").html(`${nowPage}/${total}`);
		$(".page-box div").html("");

		for (let i = 0; i < total; i++) {
			let active = i + 1 === nowPage ? "active" : "";
			$(".page-box div").append(`<span class="${active}" data-page="${i + 1}">${i + 1}</span>`);
		}

		changePage(nowPage);
	}

	// 切換頁面時顯示對應的資料
	function changePage(page) {
		let start = (page - 1) * 10;
		let end = start + 10;
		let pageData = filteredWorkOrderData.slice(start, end);

		$(".mb_none table tbody").html("");
		$(".pc_none .content").html("");

		pageData.forEach((item, idx) => {
			let globalIndex = start + idx + 1; // 全域編號（非頁內）
			$(".mb_none table tbody").append(`
			<tr data-orderid="${item.WorkOrderId}">
				<td><span>${globalIndex}</span></td>
				<td><span>${item.CaseName}</span></td>
				<td>
					<div class="coach"><span class="${item.WorkOrderType == 1 ? "active-coach" : ""}">
						${item.ProfessionalAssessmentCoach}
					</span></div>
				</td>
				<td>
					<div class="coach"><span class="${item.WorkOrderType == 2 ? "active-coach" : ""}">
						${item.AutonomousApplicationCoach}
					</span></div>
				</td>
				<td><span>${item.ServiceDate}</span></td>
				<td><span>${item.ServiceArea}</span></td>
				<td><span class="text type ${
					item.Status == 1
						? "type01"
						: item.Status == 2
						? "type02"
						: item.Status == 3
						? "type03"
						: item.Status == 4
						? "type04"
						: item.Status == 5
						? "type05"
						: ""
				}">${item.StatusName}</span></td>
				<td><span>${item.ServiceTypeName}</span></td>
			</tr>
		`);

			$(".pc_none .content").append(`
			<div class="box text-center" data-orderid="${item.WorkOrderId}">
				<div class="text-box"><span class="title">個案名稱</span><span class="text">${item.CaseName}</span></div>
				<div class="text-box"><span class="title">專業評估教練</span>
					<span class="text">
						<div class="coach"><span class="${item.WorkOrderType == 1 ? "active-coach" : ""}">
							${item.ProfessionalAssessmentCoach}
						</span></div>
					</span>
				</div>
				<div class="text-box"><span class="title">自主應用教練</span>
					<span class="text">
						<div class="coach"><span class="${item.WorkOrderType == 2 ? "active-coach" : ""}">
							${item.AutonomousApplicationCoach}
						</span></div>
					</span>
				</div>
				<div class="text-box"><span class="title">服務日期</span><span class="text">${item.ServiceDate}</span></div>
				<div class="text-box"><span class="title">狀態</span>
					<span class="text type ${
						item.Status == 1
							? "type01"
							: item.Status == 2
							? "type02"
							: item.Status == 3
							? "type03"
							: item.Status == 4
							? "type04"
							: item.Status == 5
							? "type05"
							: ""
					}">${item.StatusName}</span>
				</div>
				<div class="text-box"><span class="title">服務類型</span><span class="text">${item.ServiceTypeName}</span></div>
			</div>
		`);
		});

		// 綁定頁碼點擊事件
		$(".page-box span")
			.off("click")
			.on("click", function () {
				let pageNum = $(this).data("page");
				getPage(pageNum);
			});
	}

	// 🔘 點擊搜尋按鈕事件
	$("#MyTrainingSearch").on("click", function () {
		getWorkOrderSearch();
	});

	//選擇器

	const getSelectData = () => {
		let coachArr = [];
		$(workOrderData).each(function (idx, e) {
			coachArr.push(e.AutonomousApplicationCoach);
			coachArr.push(e.ProfessionalAssessmentCoach);
		});

		coachArr = coachArr.filter((element, index, arr) => {
			return arr.indexOf(element) === index;
		});

		$(coachArr).each(function (idx, e) {
			$(".select").append(`
                <option value="${e}">${e}</option>
            `);
		});
	};

	//日曆

	const datepicker = new AirDatepicker("#myDatepicker");
	const zh = {
		days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
		daysShort: ["週日", "週一", "週二", "週三", "週四", "週五", "週六"],
		daysMin: ["日", "一", "二", "三", "四", "五", "六"],
		months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
		monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
		today: "今天",
		clear: "清空",
	};

	$(function () {
		new AirDatepicker(".date-box", {
			locale: zh, // 上方定義中文化，在此引用才能成功，跟以前用法不同，依據新API文件教學
			dateFormat: "yyyy-MM-dd",
			firstDay: 1,
			isMobile: false,
			weekends: [6, 0],
			toggleSelected: true,
			keyboardNav: true,
			autoClose: true,
			range: true,
			multipleDatesSeparator: " ~ ",
			onSelect: function (date, formattedDate, datepicker) {
				let startT = date.formattedDate[0];
				let startE = date.formattedDate[1];
				// if (startT, startE) {
				//     getWorkOrder(startT, startE)
				// }
			},
		});
	}); // end ready

	//預設起訖日期(當月)
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth();

	const firstDay = new Date(year, month, 1); // 當月第一天
	const lastDay = new Date(year, month + 1, 0); // 下個月的第 0 天( 當月最後一天)
	const formatDate = (date) => {
		const yyyy = date.getFullYear();
		const mm = String(date.getMonth() + 1).padStart(2, "0");
		const dd = String(date.getDate()).padStart(2, "0");
		return `${yyyy}-${mm}-${dd}`;
	};
	$(".date-box").val(`${formatDate(firstDay)} ~ ${formatDate(lastDay)}`);

	$(document).on("click", ".table-box tbody tr", function () {
		$(location).attr("href", `../WorkOrderListPage/detail.html?orderid=${$(this).data("orderid")}`);
	});

	$(document).on("click", ".table-box.pc_none .box", function () {
		$(location).attr("href", `../WorkOrderListPage/detail.html?orderid=${$(this).data("orderid")}`);
	});

	// $(document).on("click", ".detail-box", function () {

	//     $(location).attr('href', `../WorkOrderListPage/detail.html?orderid=${$(this).data('orderid')}`);

	// });

	// 下載當月值班表
	$("#downloadMonthPDF").click(function () {
		let selectedDate = $(".date-box").val().trim();

		if (!selectedDate) {
			alert("請先選擇日期喔 🗓️");
			return;
		}

		// 支援格式：YYYY-MM-DD 或 YYYY/MM/DD
		let dateParts = selectedDate.includes("-") ? selectedDate.split("-") : selectedDate.split("/");

		if (dateParts.length < 2) {
			alert("日期格式不正確，請重新選擇！");
			return;
		}

		let year = dateParts[0];
		let month = dateParts[1].padStart(2, "0");

		// console.log(`📅 準備下載 ${year} 年 ${month} 月 的排班表...`)

		getMonthlyPDF(year, month);
	});

	function getMonthlyPDF(workOrderYear, workOrderMonth) {
		let session_id = sessionStorage.getItem("sessionId");
		let action = "getRoster";
		let chsm = "upStrongWorkOrderApi";
		chsm = $.md5(session_id + action + chsm);

		let formData = new FormData();
		let data = { workOrderYear, workOrderMonth };

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
				if (res.returnCode === "1" && res.returnData?.fileUrl) {
					let fileUrl = res.returnData.fileUrl;
					// console.log("✅ 取得檔案連結：", fileUrl);

					const a = document.createElement("a");
					a.href = fileUrl;
					a.download = "";
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);

					// console.log("📎 檔案下載已觸發");
				} else {
					alert("目前沒有可下載的排班表 😢");
				}
			},
			error: function (err) {
				console.error(err);
				alert("下載失敗，請稍後再試 🥲");
			},
		});
	}
});
