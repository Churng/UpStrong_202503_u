if (window.consoleToggle) {
    var console = {};
    console.log = function () { };
} else {
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    console = iframe.contentWindow.console;
    window.console = console;
}
$(document).ready(function () {
    //報價單資料
    let quotationData = null
    let eventsData = []
    let quotationID = null
    //個案資料
    const getBasicData = () => {
        $(".nav-box").html('')
        $(".nav-box").append(
            `
                <span class="acc">個案帳號<span>${quotationData.quotationBasicData.account}</span></span>
                <span class="name">個案名稱<span>${quotationData.quotationBasicData.name}</span></span>
            `
        )
    }

    //行事曆活動
    const getQuotationDetail = () => {
        let allEvents = []
        eventsData = []
        for (let i = 0; i < Object.keys(quotationData.quotationDetail).length; i++) {
            allEvents.push({
                date: Object.keys(quotationData.quotationDetail)[i],
                detail: Object.values(quotationData.quotationDetail)[i]
            })
        }
        $(allEvents).each(function (idx, e) {
            $(this.detail).each(function (idxx, ee) {
                if (ee.courseType == '休假') {
                    eventsData.push(
                        {
                            title: ee.courseType,
                            start: e.date,
                            className: 'vacation dnone',
                            detail: ee
                        },
                    )
                } else {
                    eventsData.push(
                        {
                            title: ee.courseType + ' ' + ee.startTime.slice(11, 16) + '-' + ee.endTime.slice(11, 16),
                            start: e.date,
                            className: ee.courseType == '訓練' ? 'training dnone' : ee.courseType == '體驗課程' ? 'training dnone' : ee.courseType == '初評' ? 'evaluate dnone' : ee.courseType == '例行評估' ? 'evaluate dnone' : null,
                            detail: ee
                        },
                    )
                }
            })
        })
    }
    //課程一覽
    const getCourse = () => {
        $(".pc_none").html('')
        $(".mb_none").html('')
        $(".mb_none").append(`
            <li class="header">
                <span class="title">摘要</span>
                <span class="price">單價</span>
                <span class="quantity">數量</span>
                <span class="unit">單位</span>
                <span class="total" style="text-align: center;padding:0;">總計</span>
            </li>`)
        $(quotationData.quotationCourse.courseList).each(function (idx, e) {
            $(".pc_none").append(
                `
                <li>
                    <span>摘要<span>${e.courseName}</span></span>
                    <span>單價<span>${e.price}</span></span>
                    <span>數量<span>${e.amount}</span></span>
                    <span>單位<span>${e.unit}</span></span>
                    <span>總計<span>${e.totalPrice}</span></span>
                </li>
                `
            )
            $(".mb_none").append(
                `
                <li class="content">
                    <span class="title">${e.courseName}</span>
                    <span class="price">${e.price}</span>
                    <span class="quantity">${e.amount}</span>
                    <span class="unit">${e.unit}</span>
                    <span class="total">${e.totalPrice}</span>
                </li>
                `
            )
        })
        $(".pc_none").append(
            `
            <li class="total-box">
                <span class="title">合計</span>
                <span class="total">${quotationData.quotationCourse.totalPrice}</span>
            </li>
            `
        )
        $(".mb_none").append(
            `
            <li class="total-box">
                <span class="title">合計</span>
                <span class="total">${quotationData.quotationCourse.totalPrice}</span>
            </li>
            `
        )
    }

    //注意事項
    const getPrecautions = () => {
        $(".tips-box").html('')
        $(quotationData.quotationPrecautions).each(function (idx, e) {
            $(".tips-box").append(
                ` 
                    <div><span>${idx + 1}. </span><span>${e}</span></div>
                `
            )
        })
    }
    //匯款帳戶
    const getRemitInfo = () => {
        $(".remittance-box").html('')
        $(quotationData.quotationRemitInfo).each(function (idx, e) {
            $(".remittance-box").append(
                ` 
                    <span>${e}</span>
                `
            )
        })
    }
    // 初始化 FullCalendar
    const getFullCalendar = () => {
        $('#calendar').fullCalendar({
            locale: 'zh-tw',
            fixedWeekCount: true,
            height: 'aspectRatio',//組件高度，默認aspectRatio即縱橫比；parent父容器大小；auto自動不帶滾動條；
            contentHeight: 'aspectRatio',//組件中的內容高度，默認aspectRatio即縱橫比；auto自動不帶滾動條；支持數字和函數返回像素；
            dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
            monthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], //月份自定義命名
            buttonText: {
                today: '今天',
            },
            views: {
                month: {
                    titleFormat: 'YYYY年 MMMM',
                }
            },
            //events: eventsData,
            events: function (start, end, timezone, callback) {
                let selectData = $('#calendar').fullCalendar('getDate').format('YYYY-MM')
                let formData = new FormData()
                let session_id = sessionStorage.getItem('sessionId');
                let action = 'getQuotationByTime'
                let chsm = 'upStrongQuotationApi'; // api文件相關
                let data = { "startTime": selectData }
                chsm = $.md5(session_id + action + chsm);

                formData.append('session_id', session_id);
                formData.append('action', action)
                formData.append('chsm', chsm)
                formData.append('data', JSON.stringify(data))
                $.ajax({
                    url: `${window.apiUrl}${window.apiquotation}`,
                    type: "POST",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (res) {
                        if (res.returnCode == '1') {
                            quotationData = res.returnData
                            quotationID = null
                            if (res.returnData.quotationBasicData) {
                                quotationID = res.returnData.quotationBasicData.id
                                $('.send').attr('disabled', false);
                                getBasicData()
                            } else {
                                $('.send').attr('disabled', true);
                                $(".nav-box").html('')
                                $(".nav-box").append(
                                    `
                                        <span class="acc">個案帳號<span></span></span>
                                        <span class="name">個案名稱<span></span></span>
                                    `
                                )
                            }
                            if (res.returnData.quotationDetail) {
                                getQuotationDetail()
                                $('.fc-day').each(function (idx, e) {
                                    $(this).append(
                                        `
                                            <div class="even-box">
                                            </div>
                                        `
                                    )
                                })
                                $('.fc-day').each(function (idx, e) {
                                    $(eventsData).each(function (idxx, ee) {
                                        if ($(e).data('date') == ee.start) {
                                            $(e).children().append(
                                                `
                                                    <a class="fc-day-grid-event fc-event ${ee.className.slice(0, 8)}">
                                                    <div class="fc-content">
                                                        <span class="fc-title">${ee.title}</span>
                                                    </div>
                                                    </a>
                                                `
                                            )
                                        }
                                    })
                                })
                            }
                            if (res.returnData.quotationCourse) {
                                getCourse()
                            } else {
                                $(".pc_none").html('')
                                $(".mb_none").html('')
                            }
                            if (res.returnData.quotationPrecautions) {
                                getPrecautions()
                            }
                            if (res.returnData.quotationRemitInfo) {
                                getRemitInfo()
                            }
                            $('.right-box').hide()
                            callback(eventsData);
                        } else {
                            alert(res.returnMessage)
                        }
                    },
                    error: function () {
                        $("#error").text("An error occurred. Please try again later.");
                    },
                });
            },

            dayClick: function (date, allDay, jsEvent, view) {
                $('.fc-day-top').each(function (idx, e) {
                    if ($(e).data('date') == date.format('YYYY-MM-DD')) {
                        $(this).addClass('today');
                    } else {
                        $(this).removeClass('today');
                    }
                })
                //課程內容
                $('.right-box').css("display", "block")
                var eventsCount = 0;
                var year = date.format('YYYY')
                var date = date.format('YYYY-MM-DD');
                $.ajax({
                    url: `../../js/TaiwanCalendar/${year}.json`,
                    type: "get",
                    success: function (res) {
                        $(res).each(function (idx, e) {
                            let resDate = e.date.slice(0, 4) + '-' + e.date.slice(4, 6) + '-' + e.date.slice(6, 8)
                            if (resDate == date) {
                                $('.date-bar').html('')
                                $('.date-bar').append(
                                    `
                                        <span class="date">${date} 星期${e.week}</span>
                                        <span class="date-tag">${e.description}</span>
                                    `
                                )
                            }
                        })
                    }
                });

                $('.detail-box').remove()
                $('#calendar').fullCalendar('clientEvents', function (event) {
                    var start = moment(event.start).format("YYYY-MM-DD");
                    var end = moment(event.end).format("YYYY-MM-DD");
                    if (date == start) {
                        if (event.detail.courseType == '休假') {
                            $('.right-box .detail').append(
                                `
                                <div class="detail-box vacation">
                                    <span class="tag">${event.detail.courseType}</span>
                                </div>
                                `
                            )
                        } else {
                            $('.right-box .detail').append(
                                `
                                <div class="detail-box ${event.detail.courseType == '訓練' ? 'training' : event.detail.courseType == '體驗課程' ? 'training' : event.detail.courseType == '初評' ? 'evaluate' : event.detail.courseType == '例行評估' ? 'evaluate' : null}">
                                    <span class="tag">${event.detail.courseType}</span>
                                    <span class="title">${event.detail.courseName}</span>
                                    <span class="coach">教練：${event.detail.courseCoach || ''}</span>
                                    <span class="date">課程時間：</span>
                                    <span class="date">${event.detail.startTime} ～</span>
                                    <span class="date">${event.detail.endTime}</span>
                                </div>
                                `
                            )
                        }
                    }
                });
            },
        });
    }
    getFullCalendar()

    //送出
    $('.send').click(function () {
        if (quotationID) {
            let formData = new FormData()
            let session_id = sessionStorage.getItem('sessionId');
            let action = 'approveQuotationById'
            let chsm = 'upStrongQuotationApi'; // api文件相關
            let data = { "id": quotationID }
            chsm = $.md5(session_id + action + chsm);

            formData.append('session_id', session_id);
            formData.append('action', action)
            formData.append('chsm', chsm)
            formData.append('data', JSON.stringify(data))
            $.ajax({
                url: `${window.apiUrl}${window.apiquotation}`,
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function (res) {
                },
                error: function () {
                    $("#error").text("An error occurred. Please try again later.");
                },
            });
        }
    })

    //匯款日曆

    const zh = {
        days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        daysShort: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
        daysMin: ['日', '一', '二', '三', '四', '五', '六'],
        months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthsShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        today: '今天',
        clear: '清空'
    }

    $(function () {
        new AirDatepicker('#birthDate', {
            locale: zh, // 上方定義中文化，在此引用才能成功，跟以前用法不同，依據新API文件教學
            dateFormat: 'yyyy/MM/dd',
            firstDay: 1,
            isMobile: false,
            weekends: [6, 0],
            toggleSelected: true,
            keyboardNav: true
        });
    }); // end ready
});