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

function formatDateToYYYYMMDD(date) {
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); // 月份從 0 開始，需要加 1
    let day = String(date.getDate()).padStart(2, '0'); // 確保日期為兩位數
    return `${year}-${month}-${day}`;
}





$(document).ready(function () {
    console.log("test")
    $('#MyTrainingSearch').click();

    let eventsData = null



    $('.model_to_01').click(() => {

        $('.model01').css('display', 'block')

        $('.model02').css('display', 'none')

    })

    $('.model_to_02').click(() => {
        $('.model01').css('display', 'none')
        $('.model02').css('display', 'block')
        let birthDate = $('#birthDate').val();//服務日期搜尋
        let rangeDates = birthDate.split(' ~ ');
        let startDateStr = rangeDates[0].substring(0, 7) + '-01'; 
        
        $('#calendar').fullCalendar('destroy'); // 銷毀現有日曆再重新載入

        //行事曆
        $('#calendar').fullCalendar({
            locale: 'zh-tw',
            fixedWeekCount: true,
            defaultDate: startDateStr,
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

            events: function (start, end, timezone, callback) {
                let formData = new FormData()
                let session_id = sessionStorage.getItem('sessionId');
                let action = 'getTraining'
                let chsm = 'upStrongTrainingApi'; // api文件相關
                chsm = $.md5(session_id + action + chsm);

                // 根據當前月份動態計算開始和結束日期
                const formatDate = (date) => {
                    const yyyy = date.getFullYear();
                    const mm = String(date.getMonth() + 1).padStart(2, '0');
                    const dd = String(date.getDate()).padStart(2, '0');;
                    return `${yyyy}-${mm}-${dd}`;
                };

                // start 和 end 是 FullCalendar 傳遞過來的時間範圍，代表當前顯示月份的開始和結束
                let startDate = formatDate(start.toDate());  
                let endDate = new Date(end.toDate());  
                endDate.setDate(endDate.getDate() - 1);  
                endDate = formatDate(endDate);  

                // 將日期範圍放入 data 物件
                let data = { "startTime": startDate, "endTime": endDate };

                formData.append('session_id', session_id);
                formData.append('action', action)
                formData.append('chsm', chsm)
                formData.append('data', JSON.stringify(data))
                console.log(data)
                $.ajax({
                    url: `${window.apiUrl}${window.apitraining}`,
                    type: "POST",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (res) {
                        getWorkDetail()
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

                        callback(eventsData);

                    },

                    error: function () {

                        $("#error").text("An error occurred. Please try again later.");

                    },

                })

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

                    console.log('1');

                    var start = moment(event.start).format("YYYY-MM-DD");

                    var end = moment(event.end).format("YYYY-MM-DD");

                    if (date == start) {

                        console.log('1');

                        if (event.detail.courseTypeId == 3) {

                            $('.right-box .detail').append(

                                `

                                <div class="detail-box vacation">

                                    <span class="tag">${event.detail.courseType}</span>

                                </div>

                                `

                            )

                        } else {

                            console.log('2');

                            $('.right-box .detail').append(

                                `

                                <div class="detail-box ${event.detail.Status == 1 ? 'status01' : event.detail.Status == 2 ? 'status02' : event.detail.Status == 3 ? 'status03' : event.detail.Status == 4 ? 'status04' : event.detail.Status == 5 ? 'status05' : null}" data-orderid="${event.detail.WorkOrderId}">

                                    <span class="tag status">${event.detail.StatusName}</span>

                                    <span class="title">${event.detail.ServiceTypeName}</span>

                                    <span class="name">個案：${event.detail.CaseName}</span>

                                    <span class="coach">A級教練：${event.detail.AutonomousApplicationCoach || ''}</span>

                                    <span class="coach">B級教練：${event.detail.ProfessionalAssessmentCoach || ''}</span>

                                    <span class="date">服務日期：${event.detail.ServiceDate}</span>

                                    <span class="add">服務地點：${event.detail.ServiceArea}</span>

                                </div>

                                `

                            )

                        }

                    }

                });

            },

        }, 2000);

    })



    $('.hidden-btn img').click(() => {

        $('.fc-view-container').toggleClass('min')

        $('.hidden-btn').toggleClass('min')

    })



    //取得data

    let workOrderData = null

    function getWorkOrder(){
        let formData = new FormData()

        let session_id = sessionStorage.getItem('sessionId');

        let action = 'getTraining'

        let chsm = 'upStrongTrainingApi'; // api文件相關

        chsm = $.md5(session_id + action + chsm);


        //搜尋起訖
        var birthDate =$("#birthDate").val()
        var rangeDates = birthDate.split(' ~ ');
        var startDate = new Date(rangeDates[0]);  
        var endDate = new Date(rangeDates[1]);    

        formatDateToYYYYMMDD(startDate);
        formatDateToYYYYMMDD(endDate);


        //預設起訖日期(當月)
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth(); 
        var firstDay = new Date(year, month, 1);// 當月第一天
        var lastDay = new Date(year, month + 1, 0); // 下個月的第 0 天( 當月最後一天)
        
        var formatDate = (date) => {
            var yyyy = date.getFullYear();
            var mm = String(date.getMonth() + 1).padStart(2, '0');
            var dd = String(date.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        };

        var firstDay = birthDate != "" ? formatDateToYYYYMMDD(startDate) : formatDate(firstDay);
        var lastDay = birthDate != "" ? formatDateToYYYYMMDD(endDate) : formatDate(lastDay);
        let data = { "startTime": firstDay, "endTime": lastDay }


        if (firstDay, lastDay) {
            data = { "startTime": firstDay, "endTime": lastDay }
        }

        formData.append('session_id', session_id);

        formData.append('action', action)

        formData.append('chsm', chsm)

        formData.append('data', JSON.stringify(data))

        $.ajax({

            url: `${window.apiUrl}${window.apitraining}`,

            type: "POST",

            data: formData,

            processData: false,

            contentType: false,

            success: function (res) {

                workOrderData = res.returnData.trainingData
                console.log(workOrderData)

                changePage(1)

                getWorkDetail()

                getPage()

                getSelectData()

            },

            error: function () {

                $("#error").text("An error occurred. Please try again later.");

            },

        })

        
    }
    
    // const getWorkOrder = (startTime, endTime) => {

    //     let formData = new FormData()

    //     let session_id = sessionStorage.getItem('sessionId');

    //     let action = 'getTraining'

    //     let chsm = 'upStrongTrainingApi'; // api文件相關

    //     chsm = $.md5(session_id + action + chsm);


    //    //搜尋起訖
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

    //         url: `${window.apiUrl}${window.apitraining}`,

    //         type: "POST",

    //         data: formData,

    //         processData: false,

    //         contentType: false,

    //         success: function (res) {

    //             workOrderData = res.returnData.trainingData
    //             console.log(workOrderData)

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

        eventsData = []

        $(workOrderData).each(function (idx, e) {

            eventsData.push(

                {

                    title: e.StatusName,

                    start: e.ServiceDate.slice(0, 4) + '-' + e.ServiceDate.slice(5, 7) + '-' + e.ServiceDate.slice(8, 10),

                    className: e.Status == 1 ? 'status01 dnone' : e.Status == 2 ? 'status02 dnone' : e.Status == 3 ? 'status03 dnone' : e.Status == 4 ? 'status04 dnone' : e.Status == 5 ? 'status05 dnone' : null,

                    detail: e

                },

            )

        })

    }

   

    getWorkOrder()

    //頁數

    const getPage = () => {

        total = Math.ceil(workOrderData.length / 10)

        changePage(1)

        nowPage = 1

        $('.total-text').html(`共 ${workOrderData.length} 筆`)

        $('.page').html(`1/${total}`)

    

        $('.page-box div').html('')

        for (i = 0; i < total; i++) {
            if (i == 0) {

                $('.page-box div').append(`<span class="active" data-page="${[i + 1]}">${[i + 1]}</span>`)

            } else {

                $('.page-box div').append(`<span data-page="${[i + 1]}">${[i + 1]}</span>`)

            }

        }

    }



    const changePage = (num) => {
          //每頁十筆
          let newData = JSON.parse(JSON.stringify(workOrderData));

          newData = newData.slice(10 * num - 10, 10 * num)

        $(".mb_none table tbody").html('')

        $(".pc_none .content").html('')
    
        let select = $('.select').val(); //教練下拉選單
        let birthDate = $('#birthDate').val();//服務日期範圍
        let search = $('.search').val().toLowerCase();  //關鍵字搜尋
        $(newData).each((idx, item) => {
            let formattedItemDateStr = item.ServiceDate.replace(/(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2})/, '$1-$2-$3T$4:$5:00');
            let itemDate = new Date(formattedItemDateStr);
            if (
                (search.trim() === '' || 
                    (item.AutonomousApplicationCoach && item.AutonomousApplicationCoach.toLowerCase().includes(search)) ||
                    (item.CaseName && item.CaseName.toLowerCase().includes(search)) ||
                    (item.ProfessionalAssessmentCoach && item.ProfessionalAssessmentCoach.toLowerCase().includes(search)) ||
                    (item.ServiceArea && item.ServiceArea.toLowerCase().includes(search)) ||
                    (item.ServiceTypeName && item.ServiceTypeName.toLowerCase().includes(search)) ||
                    (item.StatusName && item.StatusName.toLowerCase().includes(search))
                ) &&
                // (
                //     (!validStartDate || itemDate >= startDate) && 
                //     (!validEndDate || itemDate <= endDate)       
                // ) &&
                (
                    select == "0" || 
                    (item.CaseName && item.CaseName.toLowerCase().includes(select))
                
                ) 
            ) {
                $('.mb_none table tbody').append(`

                    <tr data-orderid="${item.WorkOrderId}">

                    <td><span>${idx + 1}</span></td>

                    <td><span>${item.CaseName}</span></td>

                    <td>
                        <span class="${item.ProfessionalAssessmentCoach ? (item.TrainingType == 1 ? 'active-coach' : '') : 'hidden'}">
                                    ${item.ProfessionalAssessmentCoach || ''}
                        </span>
                    </td>

                    <td>
                        <span class="${item.AutonomousApplicationCoach ? (item.TrainingType == 2 ? 'active-coach' : '') : 'hidden'}">
                                    ${item.AutonomousApplicationCoach || ''}
                        </span>
                    </td>

                    <td><span>${item.ServiceDate}</span></td>

                    <td><span>${item.ServiceArea}</span></td>

                    <td><span class="text type ${item.Status == 1 ? 'type01' : item.Status == 2 ? 'type02' : item.Status == 3 ? 'type03' : item.Status == 4 ? 'type04' : item.Status == 5 ? 'type05' : ''}">${item.StatusName}</span></td>

                    <td><span>${item.ServiceTypeName}</span></td>

                    </tr>

                `)

                $(".pc_none .content").append(`

                <div class="box" data-orderid="${item.WorkOrderId}">

                    <div class="text-box">

                        <span class="title">個案名稱</span>

                        <span class="text">${item.CaseName}</span>

                    </div>





                    <div class="text-box">

                        <span class="title">專業評估教練</span>
                        <span class="text">
                            <div class="coach">
                                <span class="${item.ProfessionalAssessmentCoach ? (item.TrainingType == 1 ? 'active-coach' : '') : 'hidden'}">
                                    ${item.ProfessionalAssessmentCoach || ''}
                                </span>
                            </div>
                        </span>
                    </div>

                    <div class="text-box">

                        <span class="title">自主應用教練</span>
                        <span class="text">
                            <div class="coach">
                                <span class="${item.AutonomousApplicationCoach ? (item.TrainingType == 2 ? 'active-coach' : '') : 'hidden'}">
                                    ${item.AutonomousApplicationCoach || ''}
                                </span>
                            </div>
                        </span>

                    </div>

                    <div class="text-box">

                        <span class="title">服務日期</span>

                        <span class="text">${item.ServiceDate}</span>

                    </div>

                    <div class="text-box">

                        <span class="title">狀態</span>

                        <span class="text type ${item.Status == 1 ? 'type01' : item.Status == 2 ? 'type02' : item.Status == 3 ? 'type03' : item.Status == 4 ? 'type04' : item.Status == 5 ? 'type05' : ''}">${item.StatusName}</span>

                    </div>

                    <div class="text-box">

                        <span class="title">服務類型</span>

                        <span class="text">${item.ServiceTypeName}</span>

                    </div>

                </div>

                `)
            }
            
        })



//  $(workOrderData).each(function (idx, item) {
//             // 將服務日期格式轉換成ISO 8601 格式
//             let formattedItemDateStr = item.ServiceDate.replace(/(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2})/, '$1-$2-$3T$4:$5:00');
//             let itemDate = new Date(formattedItemDateStr);
//             if (
//                 (search.trim() === '' || 
//                     (item.AutonomousApplicationCoach && item.AutonomousApplicationCoach.toLowerCase().includes(search)) ||
//                     (item.CaseName && item.CaseName.toLowerCase().includes(search)) ||
//                     (item.ProfessionalAssessmentCoach && item.ProfessionalAssessmentCoach.toLowerCase().includes(search)) ||
//                     (item.ServiceArea && item.ServiceArea.toLowerCase().includes(search)) ||
//                     (item.ServiceTypeName && item.ServiceTypeName.toLowerCase().includes(search)) ||
//                     (item.StatusName && item.StatusName.toLowerCase().includes(search))
//                 ) &&
//                 // (
//                 //     (!validStartDate || itemDate >= startDate) && 
//                 //     (!validEndDate || itemDate <= endDate)       
//                 // ) &&
//                 (
//                     select == "0" || 
//                     (item.AutonomousApplicationCoach && item.AutonomousApplicationCoach.toLowerCase().includes(select)) || 
//                     (item.ProfessionalAssessmentCoach && item.ProfessionalAssessmentCoach.toLowerCase().includes(select))      
//                 )
                    
//             ) {
//                 $(".mb_none table tbody").empty();
//                 $('.mb_none table tbody').append(`
//                 <tr data-orderid="${item.WorkOrderId}">
//                     <td><span>${idx + 1}</span></td>
//                     <td><span>${item.CaseName}</span></td>
//                     <td>
//                         <div class="coach"><span class="${item.TrainingType == 1 ? 'active-coach' : ''}">${item.ProfessionalAssessmentCoach}</span></div>
//                     </td>
//                     <td>
//                         <div class="coach"><span class="${item.TrainingType == 2 ? 'active-coach' : ''}">${item.AutonomousApplicationCoach}</span></div>
//                     </td>
//                     <td><span>${item.ServiceDate}</span></td>
//                     <td><span>${item.ServiceArea}</span></td>
//                     <td><span class="text type ${item.Status == 1 ? 'type01' : item.Status == 2 ? 'type02' : item.Status == 3 ? 'type03' : item.Status == 4 ? 'type04' : item.Status == 5 ? 'type05' : ''}">${item.StatusName}</span></td>
//                     <td><span>${item.ServiceTypeName}</span></td>
//                     </tr>
//                 `)
//                 $(".pc_none .content").empty();
//                 $(".pc_none .content").append(`
//                 <div class="box" data-orderid="${item.WorkOrderId}">
//                     <div class="text-box">
//                         <span class="title">個案名稱</span>
//                         <span class="text">${item.CaseName}</span>
//                     </div>
//                     <div class="text-box">
//                         <span class="title">專業評估教練</span>
//                           <span class="${item.ProfessionalAssessmentCoach ? (item.TrainingType == 1 ? 'active-coach' : '') : 'hidden'}">
//                                 ${item.ProfessionalAssessmentCoach || ''}
//                         </span>
//                     </div>
//                     <div class="text-box">
//                         <span class="title">自主應用教練</span>
//                         <span class="text">
//                            <span class="${item.AutonomousApplicationCoach ? (item.TrainingType == 2 ? 'active-coach' : '') : 'hidden'}">
//                                 ${item.AutonomousApplicationCoach || ''}
//                         </span>
//                             <div class="coach"><span class="${item.TrainingType == 2 ? 'active-coach' : ''}">${item.AutonomousApplicationCoach}</span></div>
//                         </span>
//                     </div>
//                     <div class="text-box">
//                         <span class="title">服務日期</span>
//                         <span class="text">${item.ServiceDate}</span>
//                     </div>
//                     <div class="text-box">
//                         <span class="title">狀態</span>
//                         <span class="text type ${item.Status == 1 ? 'type01' : item.Status == 2 ? 'type02' : item.Status == 3 ? 'type03' : item.Status == 4 ? 'type04' : item.Status == 5 ? 'type05' : ''}">${item.StatusName}</span>
//                     </div>

//                     <div class="text-box">
//                         <span class="title">服務類型</span>
//                         <span class="text">${item.ServiceTypeName}</span>
//                     </div>
//                 </div>
//                 `)

//             }
//         })









    }



    //手機板日曆縮放

    $(document).on("click", ".page-box div span", function () {

        changePage($(this).data('page'))

        nowPage = $(this).data('page')

    });

    $(document).on("click", ".next", function () {

        console.log('next');

        if (nowPage < total) {

            changePage(nowPage + 1)

            $('.page').html(`${nowPage + 1}/${total}`)    

        }

    });

    $(document).on("click", ".prev", function () {

        console.log('perv');

        if (nowPage > 1) {

            changePage(nowPage - 1)

            $('.page').html(`${nowPage - 1}/${total}`)

        }

    });



    //搜尋
    $('#MyTrainingSearch').on('click', function () {
    
        let select = $('.select').val(); //教練下拉選單
        let birthDate = $('#birthDate').val();//服務日期範圍
        let search = $('.search').val().toLowerCase();  //關鍵字搜尋
    
        // 搜尋開始和结束日期
        let rangeDates = birthDate.split(' ~ ');
        let startDate = new Date(rangeDates[0]);  
        let endDate = new Date(rangeDates[1]);    

        let validStartDate = !isNaN(startDate.getTime()); // 檢查是否是有效的日期
        let validEndDate = !isNaN(endDate.getTime());  // 檢查是否是有效的日期

   
        $(".mb_none table tbody").html('')
        $(".pc_none .content").html('')

        getWorkOrder()

        // $(workOrderData).each(function (idx, item) {
        //     // 將服務日期格式轉換成ISO 8601 格式
        //     let formattedItemDateStr = item.ServiceDate.replace(/(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2})/, '$1-$2-$3T$4:$5:00');
        //     let itemDate = new Date(formattedItemDateStr);
        //     if (
        //         (search.trim() === '' || 
        //             (item.AutonomousApplicationCoach && item.AutonomousApplicationCoach.toLowerCase().includes(search)) ||
        //             (item.CaseName && item.CaseName.toLowerCase().includes(search)) ||
        //             (item.ProfessionalAssessmentCoach && item.ProfessionalAssessmentCoach.toLowerCase().includes(search)) ||
        //             (item.ServiceArea && item.ServiceArea.toLowerCase().includes(search)) ||
        //             (item.ServiceTypeName && item.ServiceTypeName.toLowerCase().includes(search)) ||
        //             (item.StatusName && item.StatusName.toLowerCase().includes(search))
        //         ) &&
        //         // (
        //         //     (!validStartDate || itemDate >= startDate) && 
        //         //     (!validEndDate || itemDate <= endDate)       
        //         // ) &&
        //         (
        //             select == "0" || 
        //             (item.AutonomousApplicationCoach && item.AutonomousApplicationCoach.toLowerCase().includes(select)) || 
        //             (item.ProfessionalAssessmentCoach && item.ProfessionalAssessmentCoach.toLowerCase().includes(select))      
        //         )
                    
        //     ) {
        //         $(".mb_none table tbody").empty();
        //         $('.mb_none table tbody').append(`
        //         <tr data-orderid="${item.WorkOrderId}">
        //             <td><span>${idx + 1}</span></td>
        //             <td><span>${item.CaseName}</span></td>
        //             <td>
        //                 <div class="coach"><span class="${item.TrainingType == 1 ? 'active-coach' : ''}">${item.ProfessionalAssessmentCoach}</span></div>
        //             </td>
        //             <td>
        //                 <div class="coach"><span class="${item.TrainingType == 2 ? 'active-coach' : ''}">${item.AutonomousApplicationCoach}</span></div>
        //             </td>
        //             <td><span>${item.ServiceDate}</span></td>
        //             <td><span>${item.ServiceArea}</span></td>
        //             <td><span class="text type ${item.Status == 1 ? 'type01' : item.Status == 2 ? 'type02' : item.Status == 3 ? 'type03' : item.Status == 4 ? 'type04' : item.Status == 5 ? 'type05' : ''}">${item.StatusName}</span></td>
        //             <td><span>${item.ServiceTypeName}</span></td>
        //             </tr>
        //         `)
        //         $(".pc_none .content").empty();
        //         $(".pc_none .content").append(`
        //         <div class="box" data-orderid="${item.WorkOrderId}">
        //             <div class="text-box">
        //                 <span class="title">個案名稱</span>
        //                 <span class="text">${item.CaseName}</span>
        //             </div>
        //             <div class="text-box">
        //                 <span class="title">專業評估教練</span>
        //                   <span class="${item.ProfessionalAssessmentCoach ? (item.TrainingType == 1 ? 'active-coach' : '') : 'hidden'}">
        //                         ${item.ProfessionalAssessmentCoach || ''}
        //                 </span>
        //             </div>
        //             <div class="text-box">
        //                 <span class="title">自主應用教練</span>
        //                 <span class="text">
        //                    <span class="${item.AutonomousApplicationCoach ? (item.TrainingType == 2 ? 'active-coach' : '') : 'hidden'}">
        //                         ${item.AutonomousApplicationCoach || ''}
        //                 </span>
        //                     <div class="coach"><span class="${item.TrainingType == 2 ? 'active-coach' : ''}">${item.AutonomousApplicationCoach}</span></div>
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


       
    })



    //選擇器

    const getSelectData = () => {

        let coachArr = []

        $(workOrderData).each(function (idx, e) {
            coachArr.push(e.CaseName)
        })

        coachArr = coachArr.filter((element, index, arr) => {

            return arr.indexOf(element) === index;

        })

        $(coachArr).each(function (idx, e) {

            $('.select').append(`

                <option value="${e}">${e}</option>

            `)

        })

    }

    // $('.select').on('change', function (e) {

    //     $('.search').val('')



    //     let vm = this

    //     $(".mb_none table tbody").html('')

    //     $(".pc_none .content").html('')

    //     $(workOrderData).each(function (idx, item) {

    //         if (JSON.stringify(item).includes($(vm).val().trim())) {

    //             $('.mb_none table tbody').append(`

    //             <tr data-orderid="${item.WorkOrderId}">

    //                 <td><span>${idx + 1}</span></td>

    //                 <td><span>${item.CaseName}</span></td>

    //                 <td>

    //                     <div class="coach"><span class="${item.TrainingType == 1 ? 'active-coach' : ''}">${item.ProfessionalAssessmentCoach}</span></div>

    //                 </td>

    //                 <td>

    //                     <div class="coach"><span class="${item.TrainingType == 2 ? 'active-coach' : ''}">${item.AutonomousApplicationCoach}</span></div>

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

    //                         <div class="coach"><span class="${item.TrainingType == 1 ? 'active-coach' : ''}">${item.ProfessionalAssessmentCoach}</span></div>

    //                     </span>

    //                 </div>

    //                 <div class="text-box">

    //                     <span class="title">自主應用教練</span>

    //                     <span class="text">

    //                         <div class="coach"><span class="${item.TrainingType == 2 ? 'active-coach' : ''}">${item.AutonomousApplicationCoach}</span></div>

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

    const datepicker = new AirDatepicker('#myDatepicker');

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

        new AirDatepicker('.date-box', {

            locale: zh, // 上方定義中文化，在此引用才能成功，跟以前用法不同，依據新API文件教學

            dateFormat: 'yyyy-MM-dd',

            firstDay: 1,

            isMobile: false,

            weekends: [6, 0],

            toggleSelected: true,

            keyboardNav: true,

            autoClose: true,

            range: true,

            multipleDatesSeparator: ' ~ ',

            onSelect: function (date, formattedDate, datepicker) {

                $('.search').val('')

                let startT = date.formattedDate[0]

                let startE = date.formattedDate[1]

                if (startT, startE) {

                    getWorkOrder(startT, startE)

                }
            }

        });

    }); // end ready

    //預設起訖日期(當月)
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); 

    const firstDay = new Date(year, month, 1);// 當月第一天
    const lastDay = new Date(year, month + 1, 0); // 下個月的第 0 天( 當月最後一天)
    const formatDate = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };
    $('.date-box').val(`${formatDate(firstDay)} ~ ${formatDate(lastDay)}`);



    $(document).on("click", ".table-box tbody tr", function () {

        $(location).attr('href', `../WorkOrderListPage/detail.html?orderid=${$(this).data('orderid')}`);

    });



    $(document).on("click", ".table-box.pc_none .box", function () {

        $(location).attr('href', `../WorkOrderListPage/detail.html?orderid=${$(this).data('orderid')}`);

    });



    $(document).on("click", ".detail-box", function () {

        $(location).attr('href', `../WorkOrderListPage/detail.html?orderid=${$(this).data('orderid')}`);

    });

});