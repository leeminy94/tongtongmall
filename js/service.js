var kind = '';
var isClick = false;

$(function() {
    $('#spinner_overay').css('display', 'none');

    if ($('#answer-content').length != 0) {
        $('#answer-content').css('height', document.getElementById("answer-content").scrollHeight);
    }
});

// 臾몄쓽醫낅쪟 �좏깮
function setKind(element) {
    var value = $(element).parent().find('#kind-content').attr('style');
    if (value.search('display: none;') != -1) {
        $(element).parent().find('#kind-content').slideDown(200);
        $(element).parent().find('#icon').attr('src', base_url + 'assets/user/images/ico_up.png');
    } else {
        $(element).parent().find('#kind-content').slideUp(200);
        $(element).parent().find('#icon').attr('src', base_url + 'assets/user/images/ico_down.png');
    }
}

// 臾몄쓽醫낅쪟由ъ뒪�몄뿉�� �꾩씠�� �좏깮
function setKindItem(element, bcodeid, kindname, index) {
    $(element).closest('#service-kind').find('#kind-title').text(kindname);
    $(element).closest('#kind-content').slideUp(200);
    $(element).closest('#service-kind').find('#icon').attr('src', base_url + 'assets/user/images/ico_down.png');

    if (index == 'write') {
        kind = bcodeid;
    } else {
        getServiceData(bcodeid);
    }
}

// �쒕퉬�� �깅줉�섍린
function setRegisterService() {
    if (isClick) {
        return;
    }

    if ($('#title').val() == '') {
        showDialogWarning('�쒕ぉ�� �낅젰�댁＜�몄슂.', '', '', '�뺤씤', 'closeDialog();');
        return;
    }
    if (kind == '') {
        showDialogWarning('臾몄쓽�좏삎�� �좏깮�댁＜�몄슂.', '', '', '�뺤씤', 'closeDialog();');
        return;
    }
    if ($('#service-content').val() == '') {
        showDialogWarning('�댁슜�� �낅젰�댁＜�몄슂.', '', '', '�뺤씤', 'closeDialog();');
        return;
    }

    $('#spinner_overay').css('display', 'block');
    isClick = true;

    setTimeout(function() {
        $.ajax({
            url: base_url + 'user/other/service/service_write/setRegisterService',
            type: 'POST',
            dataType: 'json',
            data: {
                title: $('#title').val(),
                kind: kind,
                content: $('#service-content').val()
            },
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            async: false,
            success: function(res) {
                isClick = false;

                if (res.success) {
                    sendEmail();

                    $('#spinner_overay').css('display', 'none');
                    $('#service-info').css('display', 'none');
                    $('#service-success').css('display', 'block');
                } else {
                    window.location.replace(base_url + 'logout?kind=service_setRegisterService');
                }
            }
        });
    }, 50);
}

function sendEmail() {
    $.ajax({
        url: base_url + 'user/other/service/service_write/sendEmail',
        type: 'POST',
        dataType: 'json',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: true,
        success: function(res) {
            console.log(res);
        }
    });
}

// 臾몄쓽醫낅쪟蹂꾩뿉 �곕Ⅴ�� �곗씠�� �산린
function getServiceData(kind) {
    $('#spinner_overay').css({
        'top': '174px',
        'background-color': '#fff',
        'display': 'block'
    });
    $('.spinner').css('margin', '50% auto');

    setTimeout(function() {
        $.ajax({
            url: base_url + 'user/other/service/service/getServiceData',
            type: 'POST',
            dataType: 'json',
            data: {
                kind: kind
            },
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            async: false,
            success: function(res) {
                $('#spinner_overay').css('display', 'none');
                if (res.out) {
                    window.location.replace(base_url + 'logout?kind=service_getServiceData');
                    return;
                }

                var html = '';
                if (res.length == 0) {
                    html += '<div id="empty-shopping-product" class="text-center back-default" style="padding: 45% 0;">';
                    html += '<img class="mb-15" src="' + base_url + 'assets/user/images/ico_fail_search.png" alt="" style="width: 42px;">';
                    html += '<div class="font-999-15 font-weight">�댁슜�� �놁뒿�덈떎.</div>';
                    html += '</div>';
                }
                for (var i = 0; i < res.length; i++) {
                    html += '<div id="servie-item" class="border-btm" style="padding: 18px 15px;" onclick="window.location.href=' + "'" + base_url + "service_detail?serviceid=" + res[i].postid + "'" + '">';
                    html += '<div class="row mb-15">';
                    html += '<div class="service-kind-mark fl">' + res[i].kind_name + '</div>';
                    html += '<div class="font-222-15 fl ml-6 mt-4 title-width" style="width: 77%;">' + res[i].title + '</div>';
                    html += '</div>';
                    html += '<div class="row">';
                    html += '<div class="font-999-12 fl mt-1">' + res[i].cdate.split(' ')[0].replace(/[-]/gi, '.') + '</div>';
                    if (res[i].answerid == null) {
                        html += '<div class="font-999-12 ml-15 fl">�듬���湲�</div>';
                    } else {
                        html += '<div class="font-default-12 ml-15 fl">�듬��꾨즺</div>';
                    }
                    html += '</div>';
                    html += '</div>';
                }
                $('#service-content').html(html);
            }
        });
    }, 250);
}