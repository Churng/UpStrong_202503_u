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

        url: `${window.apiUrl}${window.apiorder}`,

        type: "POST",

        data: formData,

        processData: false,

        contentType: false,

        success: function (res) {

            if (res.returnCode == '1') {

                $(res.returnData).each(function (idx, e) {

                    $('.table tbody').append(`

                        <tr data-idx="${idx}" data-starttime="${e.startTime}">

                            <td><span>${e.orderNo}</span></td>

                            <td><span>${e.createOrderOperator}</span></td>

                            <td><span>${e.caseName}</span></td>

                            <td><span class="responsibleBase"><span>${e.responsibleBase}</span></td>

                            <td><span class="serviceBase"><span>${e.serviceBase}</span></td>

                            <td><span>${e.orderAmount}</span></td>

                            <td><span>${e.startTime}~<br />${e.endTime}</span></span></td>

                            <td><span>${e.status}</span></td>

                            <td><span>${e.paymentTime.slice(0, 10)}<br/>${e.paymentTime.slice(10, 20)}</span></span></td>

                        </tr>

                    `)

                    if ($('.table tbody tr').data('idx') == idx) {

                    }

                })

            } else {

                alert(res.returnMessage)

            }

        },

        error: function (e) {

            alert(e)

        },

    })



    $(document).on("click", "tbody tr", function () {

        console.log($(this).data('starttime'));

        $(location).attr('href', `./upStrongAdmin/upStrongWeb/pages/OrderListPage/index.html?starttime=${$(this).data('starttime')}`);



    });

});