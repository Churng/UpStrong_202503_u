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
		$(".model01").css("display", "none");
		$(".model02").css("display", "block");

		var now = new Date();
		var year = now.getFullYear();
		var month = now.getMonth();
		var firstDay = new Date(year, month, 1); // 當月第一天

		$("#calendar").fullCalendar("destroy"); // 銷毀現有日曆再重新載入

		//行事曆
		$("#calendar").fullCalendar(
			{
				locale: "zh-tw",
				fixedWeekCount: true,
				defaultDate: firstDay,
				height: "aspectRatio", //組件高度，默認aspectRatio即縱橫比；parent父容器大小；auto自動不帶滾動條；
				contentHeight: "aspectRatio", //組件中的內容高度，默認aspectRatio即縱橫比；auto自動不帶滾動條；支持數字和函數返回像素；
				dayNamesShort: ["日", "一", "二", "三", "四", "五", "六"],
				monthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], //月份自定義命名
				buttonText: {
					today: "今天",
				},
				views: {
					month: {
						titleFormat: "YYYY年 MMMM",
					},
				},
				events: function (start, end, timezone, callback) {
					let formData = new FormData();
					let session_id = sessionStorage.getItem("sessionId");
					let action = "getWorkOrder";
					let chsm = "upStrongWorkOrderApi"; // api文件相關
					chsm = $.md5(session_id + action + chsm);

					// 根據當前月份動態計算開始和結束日期
					const formatDate = (date) => {
						const yyyy = date.getFullYear();
						const mm = String(date.getMonth() + 1).padStart(2, "0");
						const dd = String(date.getDate()).padStart(2, "0");
						return `${yyyy}-${mm}-${dd}`;
					};

					// start 和 end 是 FullCalendar 傳遞過來的時間範圍，代表當前顯示月份的開始和結束
					let startDate = formatDate(start.toDate());
					let endDate = new Date(end.toDate());
					endDate.setDate(endDate.getDate() - 1);
					endDate = formatDate(endDate);

					// 將日期範圍放入 data 物件
					let data = { startTime: startDate, endTime: endDate };

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
							getWorkDetail();
							$(".fc-day").each(function (idx, e) {
								$(this).append(
									`
                                    <div class="even-box">
                                    </div>
                                `
								);
							});

							$(".fc-day").each(function (idx, e) {
								$(eventsData).each(function (idxx, ee) {
									if ($(e).data("date") == ee.start) {
										$(e)
											.children()
											.append(
												`
                                            <a class="fc-day-grid-event fc-event ${ee.className.slice(0, 8)}">
                                            <div class="fc-content">
                                                <span class="fc-title">${ee.detail.CaseName} - ${
													ee.detail.ServiceTypeName
												}</span>
                                            </div>
                                            </a>
                                        `
											);
									}
								});
							});
							callback(eventsData);
						},
						error: function () {
							$("#error").text("An error occurred. Please try again later.");
						},
					});
				},
				dayClick: function (date, allDay, jsEvent, view) {
					// $('.fc-day-top').each(function (idx, e) {
					//     if ($(e).data('date') == date.format('YYYY-MM-DD')) {
					//         $(this).addClass('today');
					//     } else {
					//         $(this).removeClass('today');
					//     }
					// })
					//課程內容
					$(".right-box").css("display", "block");
					var eventsCount = 0;
					var year = date.format("YYYY");
					var date = date.format("YYYY-MM-DD");
					$.ajax({
						url: `../../js/TaiwanCalendar/${year}.json`,
						type: "get",
						success: function (res) {
							$(res).each(function (idx, e) {
								let resDate = e.date.slice(0, 4) + "-" + e.date.slice(4, 6) + "-" + e.date.slice(6, 8);
								if (resDate == date) {
									$(".date-bar").html("");
									$(".date-bar").append(
										`
                                        <span class="date">${date} 星期${e.week}</span>
                                        <span class="date-tag">${e.description}</span>
                                    `
									);
								}
							});
						},
					});

					$(".detail-box").remove();
					$("#calendar").fullCalendar("clientEvents", function (event) {
						var start = moment(event.start).format("YYYY-MM-DD");
						var end = moment(event.end).format("YYYY-MM-DD");
						if (date == start) {
							if (event.detail.courseTypeId == 3) {
								$(".right-box .detail").append(
									`
                                <div class="detail-box vacation">
                                    <span class="tag">${event.detail.courseType}</span>
                                </div>
                                `
								);
							} else {
								$(".right-box .detail").append(
									`
                                <div class="detail-box ${
																	event.detail.Status == 1
																		? "status01"
																		: event.detail.Status == 2
																		? "status02"
																		: event.detail.Status == 3
																		? "status03"
																		: event.detail.Status == 4
																		? "status04"
																		: event.detail.Status == 5
																		? "status05"
																		: null
																}" data-orderid="${event.detail.WorkOrderId}">
                                    <span class="tag status">${event.detail.StatusName}</span>
                                    <span class="title">${event.detail.ServiceTypeName}</span>
                                    <span class="name">個案：${event.detail.CaseName}</span>
                                    <span class="coach">專業評估教練：${
																			event.detail.ProfessionalAssessmentCoach || ""
																		}</span>
                                    <span class="coach">自主應用教練：${
																			event.detail.AutonomousApplicationCoach || ""
																		}</span>
                                    <span class="date">服務日期：${event.detail.ServiceDate}</span>
                                    <span class="add">服務地點：${event.detail.ServiceArea}</span>
                                </div>
                                `
								);
							}
						}
					});
				},
			},
			2000
		);
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

	// const getWorkOrder = (startTime, endTime) => {
	//     let formData = new FormData()
	//     let session_id = sessionStorage.getItem('sessionId');
	//     let action = 'getWorkOrder'
	//     let chsm = 'upStrongWorkOrderApi'; // api文件相關
	//     chsm = $.md5(session_id + action + chsm);

	//     //搜尋起訖
	//     var birthDate =$("#birthDate").val()
	//     var rangeDates = birthDate.split(' ~ ');
	//     var startDate = new Date(rangeDates[0]);
	//     var endDate = new Date(rangeDates[1]);

	//     formatDateToYYYYMMDD(startDate);
	//     formatDateToYYYYMMDD(endDate);

	//     //預設起訖日期(當月)
	//     var now = new Date();
	//     var year = now.getFullYear();
	//     var month = now.getMonth();
	//     var firstDay = new Date(year, month, 1);// 當月第一天
	//     var lastDay = new Date(year, month + 1, 0); // 下個月的第 0 天( 當月最後一天)

	//     var formatDate = (date) => {
	//         var yyyy = date.getFullYear();
	//         var mm = String(date.getMonth() + 1).padStart(2, '0');
	//         var dd = String(date.getDate()).padStart(2, '0');
	//         return `${yyyy}-${mm}-${dd}`;
	//     };

	//     var firstDay = birthDate != "" ? formatDateToYYYYMMDD(startDate) : formatDate(firstDay);
	//     var lastDay = birthDate != "" ? formatDateToYYYYMMDD(endDate) : formatDate(lastDay);
	//     let data = { "startTime": firstDay, "endTime": lastDay }

	//     if (firstDay, lastDay) {
	//         data = { "startTime": firstDay, "endTime": lastDay }
	//     }

	//     formData.append('session_id', session_id);
	//     formData.append('action', action)
	//     formData.append('chsm', chsm)
	//     formData.append('data', JSON.stringify(data))

	//     $.ajax({
	//         url: `${window.apiUrl}${window.apiworkOrder}`,
	//         type: "POST",
	//         data: formData,
	//         processData: false,
	//         contentType: false,
	//         success: function (res) {
	//             workOrderData = res.returnData.workOrderData
	//             changePage(1)
	//             getWorkDetail()
	//             getPage()
	//             getSelectData()

	//         },
	//         error: function () {
	//             $("#error").text("An error occurred. Please try again later.");
	//         },
	//     })
	// }

	//行事曆活動
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

	//頁數
	const getPage = (page) => {
		console.log(page);
		total = Math.ceil(workOrderData.length / 10); // 計算總頁數
		nowPage = page ?? 1; // 使用傳入的頁數，若未傳入則預設為第 1 頁

		// 更新頁數顯示
		$(".total-text").html(`共 ${workOrderData.length} 筆`);
		$(".page").html(`${nowPage}/${total}`);

		// 清空頁碼區域
		$(".page-box div").html("");

		// 生成頁碼按鈕
		for (let i = 0; i < total; i++) {
			// 根據當前頁數，為當前頁碼加上 active 樣式
			if (i === nowPage - 1) {
				$(".page-box div").append(`<span class="active" data-page="${i + 1}">${i + 1}</span>`);
			} else {
				$(".page-box div").append(`<span data-page="${i + 1}">${i + 1}</span>`);
			}
		}
		// 更新資料顯示
		changePage(nowPage); // 根據當前頁數顯示資料
	};

	// 點擊頁碼時的處理
	$(".page-box").on("click", "span", function () {
		const page = $(this).data("page");
		if (page !== nowPage) {
			getPage(page); // 更新頁數顯示並載入該頁資料
		}
	});

	// //頁數
	// const getPage = () => {
	//     total = Math.ceil(workOrderData.length / 10)
	//     changePage(1)
	//     nowPage = 1
	//     $('.total-text').html(`共 ${workOrderData.length} 筆`)
	//     $('.page').html(`1/${total}`)
	//     $('.page-box div').html('')
	//     for (i = 0; i < total; i++) {
	//         if (i == 0) {
	//             $('.page-box div').append(`<span class="active" data-page="${[i + 1]}">${[i + 1]}</span>`)
	//         } else {
	//             $('.page-box div').append(`<span data-page="${[i + 1]}">${[i + 1]}</span>`)
	//         }
	//     }
	// }

	const changePage = (num) => {
		//每頁十筆
		let newData = JSON.parse(JSON.stringify(workOrderData));
		newData.sort((a, b) => {
			//按照服務日期排序
			let dateA = new Date(a.ServiceDate.replace(/(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2})/, "$1-$2-$3T$4:$5:00"));
			let dateB = new Date(b.ServiceDate.replace(/(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2})/, "$1-$2-$3T$4:$5:00"));
			return dateA - dateB;
		});
		newData = newData.slice(10 * num - 10, 10 * num);
		$(".mb_none table tbody").html("");
		$(".pc_none .content").html("");
		let select = $(".select").val(); //教練下拉選單
		let search = $(".search").val().toLowerCase(); //關鍵字搜尋
		$(newData).each(function (idx, item) {
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
				$(".mb_none table tbody").append(`
                    <tr data-orderid="${item.WorkOrderId}">
                    <td><span>${idx + 1}</span></td>
                    <td><span>${item.CaseName}</span></td>
                    <td>
                        <div class="coach"><span class="${item.WorkOrderType == 1 ? "active-coach" : ""}">${
					item.ProfessionalAssessmentCoach
				}</span></div>
                    </td>
                    <td>
                        <div class="coach"><span class="${item.WorkOrderType == 2 ? "active-coach" : ""}">${
					item.AutonomousApplicationCoach
				}</span></div>
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
                    <div class="text-box">
                        <span class="title">個案名稱</span>
                        <span class="text">${item.CaseName}</span>
                    </div>
                    <div class="text-box">
                        <span class="title">專業評估教練</span>
                        <span class="text">
                            <div class="coach"><span class="${item.WorkOrderType == 1 ? "active-coach" : ""}">${
					item.ProfessionalAssessmentCoach
				}</span></div>
                        </span>
                    </div>
                    <div class="text-box">
                        <span class="title">自主應用教練</span>
                        <span class="text">
                            <div class="coach"><span class="${item.WorkOrderType == 2 ? "active-coach" : ""}">${
					item.AutonomousApplicationCoach
				}</span></div>
                        </span>
                    </div>
                    <div class="text-box">
                        <span class="title">服務日期</span>
                        <span class="text">${item.ServiceDate}</span>
                    </div>

                    <div class="text-box">
                        <span class="title">狀態</span>
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
                    <div class="text-box">
                        <span class="title">服務類型</span>
                        <span class="text">${item.ServiceTypeName}</span>
                    </div>
                </div>
                `);
			}
		});

		// $(newData).each((idx, item) => {
		//     $('.mb_none table tbody').append(`
		//         <tr data-orderid="${item.WorkOrderId}">
		//         <td><span>${idx + 1}</span></td>
		//         <td><span>${item.CaseName}</span></td>
		//         <td>
		//             <div class="coach"><span class="${item.WorkOrderType == 1 ? 'active-coach' : ''}">${item.ProfessionalAssessmentCoach}</span></div>
		//         </td>
		//         <td>
		//             <div class="coach"><span class="${item.WorkOrderType == 2 ? 'active-coach' : ''}">${item.AutonomousApplicationCoach}</span></div>
		//         </td>
		//         <td><span>${item.ServiceDate}</span></td>
		//         <td><span>${item.ServiceArea}</span></td>
		//         <td><span class="text type ${item.Status == 1 ? 'type01' : item.Status == 2 ? 'type02' : item.Status == 3 ? 'type03' : item.Status == 4 ? 'type04' : item.Status == 5 ? 'type05' : ''}">${item.StatusName}</span></td>
		//         <td><span>${item.ServiceTypeName}</span></td>
		//         </tr>
		//     `)

		//     $(".pc_none .content").append(`
		//     <div class="box" data-orderid="${item.WorkOrderId}">
		//         <div class="text-box">
		//             <span class="title">個案名稱</span>
		//             <span class="text">${item.CaseName}</span>
		//         </div>
		//         <div class="text-box">
		//             <span class="title">專業評估教練</span>
		//             <span class="text">
		//                 <div class="coach"><span class="${item.WorkOrderType == 1 ? 'active-coach' : ''}">${item.ProfessionalAssessmentCoach}</span></div>
		//             </span>
		//         </div>
		//         <div class="text-box">
		//             <span class="title">自主應用教練</span>
		//             <span class="text">
		//                 <div class="coach"><span class="${item.WorkOrderType == 2 ? 'active-coach' : ''}">${item.AutonomousApplicationCoach}</span></div>
		//             </span>
		//         </div>
		//         <div class="text-box">
		//             <span class="title">服務日期</span>
		//             <span class="text">${item.ServiceDate}</span>
		//         </div>
		//         <div class="text-box">
		//             <span class="title">狀態</span>
		//             <span class="text type ${item.Status == 1 ? 'type01' : item.Status == 2 ? 'type02' : item.Status == 3 ? 'type03' : item.Status == 4 ? 'type04' : item.Status == 5 ? 'type05' : ''}">${item.StatusName}</span>
		//         </div>

		//         <div class="text-box">
		//             <span class="title">服務類型</span>
		//             <span class="text">${item.ServiceTypeName}</span>
		//         </div>
		//     </div>
		//     `)
		// })
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

	//搜尋
	$("#MyTrainingSearch").on("click", function () {
		$(".mb_none table tbody").html("");
		$(".pc_none .content").html("");
		getWorkOrder();
		// $(workOrderData).each(function (idx, item) {
		//     if (
		//         (search.trim() === '' ||
		//             (item.AutonomousApplicationCoach && item.AutonomousApplicationCoach.toLowerCase().includes(search)) ||
		//             (item.CaseName && item.CaseName.toLowerCase().includes(search)) ||
		//             (item.ProfessionalAssessmentCoach && item.ProfessionalAssessmentCoach.toLowerCase().includes(search)) ||
		//             (item.ServiceArea && item.ServiceArea.toLowerCase().includes(search)) ||
		//             (item.ServiceTypeName && item.ServiceTypeName.toLowerCase().includes(search)) ||
		//             (item.StatusName && item.StatusName.toLowerCase().includes(search))
		//         ) &&
		//         (
		//             select == "0" ||
		//             (item.AutonomousApplicationCoach && item.AutonomousApplicationCoach.toLowerCase().includes(select)) ||
		//             (item.ProfessionalAssessmentCoach && item.ProfessionalAssessmentCoach.toLowerCase().includes(select))
		//         )
		//     )  {
		//         $('.mb_none table tbody').append(`
		//             <tr data-orderid="${item.WorkOrderId}">
		//             <td><span>${idx + 1}</span></td>
		//             <td><span>${item.CaseName}</span></td>
		//             <td>
		//                 <div class="coach"><span class="${item.WorkOrderType == 1 ? 'active-coach' : ''}">${item.ProfessionalAssessmentCoach}</span></div>
		//             </td>
		//             <td>
		//                 <div class="coach"><span class="${item.WorkOrderType == 2 ? 'active-coach' : ''}">${item.AutonomousApplicationCoach}</span></div>
		//             </td>
		//             <td><span>${item.ServiceDate}</span></td>
		//             <td><span>${item.ServiceArea}</span></td>
		//             <td><span class="text type ${item.Status == 1 ? 'type01' : item.Status == 2 ? 'type02' : item.Status == 3 ? 'type03' : item.Status == 4 ? 'type04' : item.Status == 5 ? 'type05' : ''}">${item.StatusName}</span></td>
		//             <td><span>${item.ServiceTypeName}</span></td>
		//             </tr>
		//         `)

		//         $(".pc_none .content").append(`
		//         <div class="box" data-orderid="${item.WorkOrderId}">
		//             <div class="text-box">
		//                 <span class="title">個案名稱</span>
		//                 <span class="text">${item.CaseName}</span>
		//             </div>
		//             <div class="text-box">
		//                 <span class="title">專業評估教練</span>
		//                 <span class="text">
		//                     <div class="coach"><span class="${item.WorkOrderType == 1 ? 'active-coach' : ''}">${item.ProfessionalAssessmentCoach}</span></div>
		//                 </span>
		//             </div>
		//             <div class="text-box">
		//                 <span class="title">自主應用教練</span>
		//                 <span class="text">
		//                     <div class="coach"><span class="${item.WorkOrderType == 2 ? 'active-coach' : ''}">${item.AutonomousApplicationCoach}</span></div>
		//                 </span>
		//             </div>
		//             <div class="text-box">
		//                 <span class="title">服務日期</span>
		//                 <span class="text">${item.ServiceDate}</span>
		//             </div>

		//             <div class="text-box">
		//                 <span class="title">狀態</span>
		//                 <span class="text type ${item.Status == 1 ? 'type01' : item.Status == 2 ? 'type02' : item.Status == 3 ? 'type03' : item.Status == 4 ? 'type04' : item.Status == 5 ? 'type05' : ''}">${item.StatusName}</span>
		//             </div>
		//             <div class="text-box">
		//                 <span class="title">服務類型</span>
		//                 <span class="text">${item.ServiceTypeName}</span>
		//             </div>
		//         </div>
		//         `)
		//     }
		// })
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

	// $('.select').on('change', function (e) {
	//     $('.search').val('')
	//     let vm = this
	//     $(".mb_none table tbody").html('')
	//     $(".pc_none .content").html('')
	//     $(workOrderData).each(function (idx, item) {
	//         if (JSON.stringify(item).includes($(vm).val().trim())) {
	//             $('.mb_none table tbody').append(`
	//                 <tr data-orderid="${item.WorkOrderId}">
	//                 <td><span>${idx + 1}</span></td>
	//                 <td><span>${item.CaseName}</span></td>
	//                 <td>
	//                     <div class="coach"><span class="${item.WorkOrderType == 1 ? 'active-coach' : ''}">${item.ProfessionalAssessmentCoach}</span></div>
	//                 </td>
	//                 <td>
	//                     <div class="coach"><span class="${item.WorkOrderType == 2 ? 'active-coach' : ''}">${item.AutonomousApplicationCoach}</span></div>
	//                 </td>
	//                 <td><span>${item.ServiceDate}</span></td>
	//                 <td><span>${item.ServiceArea}</span></td>
	//                 <td><span class="text type ${item.Status == 1 ? 'type01' : item.Status == 2 ? 'type02' : item.Status == 3 ? 'type03' : item.Status == 4 ? 'type04' : item.Status == 5 ? 'type05' : ''}">${item.StatusName}</span></td>
	//                 <td><span>${item.ServiceTypeName}</span></td>
	//                 </tr>
	//             `)

	//             $(".pc_none .content").append(`
	//             <div class="box" data-orderid="${item.WorkOrderId}">
	//                 <div class="text-box">
	//                     <span class="title">個案名稱</span>
	//                     <span class="text">${item.CaseName}</span>
	//                 </div>
	//                 <div class="text-box">
	//                     <span class="title">專業評估教練</span>
	//                     <span class="text">
	//                         <div class="coach"><span class="${item.WorkOrderType == 1 ? 'active-coach' : ''}">${item.ProfessionalAssessmentCoach}</span></div>
	//                     </span>
	//                 </div>

	//                 <div class="text-box">
	//                     <span class="title">自主應用教練</span>
	//                     <span class="text">
	//                         <div class="coach"><span class="${item.WorkOrderType == 2 ? 'active-coach' : ''}">${item.AutonomousApplicationCoach}</span></div>
	//                     </span>
	//                 </div>

	//                 <div class="text-box">
	//                     <span class="title">服務日期</span>
	//                     <span class="text">${item.ServiceDate}</span>
	//                 </div>

	//                 <div class="text-box">
	//                     <span class="title">狀態</span>
	//                     <span class="text type ${item.Status == 1 ? 'type01' : item.Status == 2 ? 'type02' : item.Status == 3 ? 'type03' : item.Status == 4 ? 'type04' : item.Status == 5 ? 'type05' : ''}">${item.StatusName}</span>
	//                 </div>

	//                 <div class="text-box">
	//                     <span class="title">服務類型</span>
	//                     <span class="text">${item.ServiceTypeName}</span>
	//                 </div>
	//             </div>

	//             `)

	//         }

	//     })

	// })

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

					const a = document.createElement("a");
					a.href = fileUrl;
					a.download = "";
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
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
