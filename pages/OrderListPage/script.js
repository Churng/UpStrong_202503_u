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

    let orderData = null

    let total = null

    let nowPage = null

    const getOrderData = () => {

        let formData = new FormData()

        let session_id = sessionStorage.getItem('sessionId');

        let action = 'getOrderListByUser'

        let chsm = 'upStrongOrderApi'; // api文件相關

        chsm = $.md5(session_id + action + chsm);



        formData.append('session_id', session_id);

        formData.append('action', action)

        formData.append('chsm', chsm)

        $('.table tbody').html('')

        $.ajax({

            url: `${window.apiUrl}${window.apiorder }`,

            type: "POST",

            data: formData,

            processData: false,

            contentType: false,

            success: function (res) {

                if (res.returnCode == '1') {

                    orderData = res.returnData

                    getPage()

                } else {

                    alert(res.returnMessage)

                }

            },

            error: function (e) {

                alert(e)

            },

        })

    }



    const getPage = () => {

        total = Math.ceil(orderData.length / 10)

        changePage(1)

        nowPage = 1

        $('.total-text').html(`共 ${orderData.length} 筆`)

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

        let newData = JSON.parse(JSON.stringify(orderData));

        newData = newData.slice(10 * num - 10, 10 * num)

        $('.table tbody').html('')

        $('.table-box.pc_none .content').html('')

        $(newData).each(function (idx, e) {

            $('.table tbody').append(`

                <tr data-idx="${idx}" data-starttime="${e.quotationStartTime}">

                    <td><span>${e.orderNo}</span></td>

                    <td><span>${e.createOrderOperator}</span></td>

                    <td><span>${e.caseName}</span></td>

                    <td><span class="responsibleBase"><span>${e.responsibleBase}</span></td>

                    <td><span class="serviceBase"><span>${e.serviceBase}</span></td>

                    <td><span>${e.orderAmount}</span></td>

                    <td><span>${e.startTime}~<br />${e.endTime}</span></span></td>

                    <td><span class="text type ${e.status == '未受理' ? 'type01' : e.status == '已付款' ? 'type02' : e.status == '已受理' ? 'type03' : e.status == '可派案' ? 'type04' : 'type05'}">${e.status}</span></td>

                    <td><span>${e.paymentTime.slice(0, 10)}<br/>${e.paymentTime.slice(10, 20)}</span></span></td>

                </tr>

            `)



            $('.table-box.pc_none .content').append(`

                <div class="box" data-idx="${idx}" data-starttime="${e.quotationStartTime}">

                    <div class="text-box">

                        <span class="title">訂單編號</span>

                        <span class="text">${e.orderNo}</span>

                    </div>

                    <div class="text-box">

                        <span class="title">開單人員</span>

                        <span class="text">${e.createOrderOperator}</span>

                    </div>

                    <div class="text-box">

                        <span class="title">個案名稱</span>

                        <span class="text">${e.caseName}</span>

                    </div>

                    <div class="text-box">

                        <span class="title">負責據點</span>

                        <span class="text">${e.responsibleBase}</span>

                    </div>

                    <div class="text-box">

                        <span class="title">服務地點</span>

                        <span class="text">${e.serviceBase}</span>

                    </div>

                    <div class="text-box">

                        <span class="title">付款金額</span>

                        <span class="text">${e.orderAmount}</span>

                    </div>

                    <div class="text-box">

                        <span class="title">有效使用期間</span>

                        <span class="text">${e.startTime}~${e.endTime}</span>

                    </div>

                    <div class="text-box">

                        <span class="title">狀態</span>

                        <span class="text type ${e.status == '未受理' ? 'type01' : e.status == '已付款' ? 'type02' : e.status == '已受理' ? 'type03' : e.status == '可派案' ? 'type04' : 'type05'}">${e.status}</span>

                    </div>

                    <div class="text-box">

                    <span class="title">付款時間</span>

                    <span class="text">${e.paymentTime}</span>

                    </div>

                </div>

            `)

        })

    }



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



    $(document).on("click", "tbody tr", function () {

        $(location).attr('href', `../QuotationPage/index.html?starttime=${$(this).data('starttime')}`);

    });



    $(document).on("click", ".table-box.pc_none .box", function () {

        $(location).attr('href', `../QuotationPage/index.html?starttime=${$(this).data('starttime')}`);

    });



    getOrderData()

});