var agent = navigator.userAgent.toLowerCase();

// json데이터를 form데이터로 인코딩
function jsonConvert(jsonObject) {
    var result = '';
    var token = '';

    Object.keys(jsonObject).map((key, idx) => {
        if (idx === 1) {
            token = '&';
        }

        result += `${token}${key}=${jsonObject[key]}`;
    });

    return result;
}

// 쿠키 설정
function setCookie(key, value) {
    $.cookie(key, value, {
        expires: 90,
        path: '/'
    });
}

// 쿠기 얻기
function getCookie(key) {
    return $.cookie(key);
}

// 쿠키삭제
function clearCookie(key) {
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() - 1);

    $.cookie(key, '', {
        expires: expireDate,
        path: '/'
    });
}

// 수자앞붙이에 0 추가하기
function numberPad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

function isMobile() {
    var ret = false;
    var UserAgent = navigator.userAgent;
    if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
        ret = true;
    }
    return ret;
}

// 모바일웹에서 통통몰앱 실행
function runApp(device, redirectUrl) {
    if (device == 'android') {
        if (navigator.userAgent.match(/Chrome/)) { // 크롬브라우저이면
            setTimeout(function() {
                window.location.href = redirectUrl;
            }, 100);
        } else { // 아니면
            callScheme(redirectUrl);
        }
    }

    if (device == 'iphone') {
        setTimeout(function() {
            setTimeout(function() {
                window.location.href = 'https://itunes.apple.com/app/id1471587538?mt=8';
            }, 5000);
            setTimeout(function() {
                window.location.href = redirectUrl;
            }, 100);
        }, 100);
    }
}

// 모바일웹으로 보기
function runWeb() {
    setCookie('runapp', '1');
    closeDialog();
}

// 소수점일 때 두자리, 없을 때 그냥 표기
function calcDecimal(value) {
    var ret;
    if (value == parseInt(value)) {
        ret = value;
    } else {
        ret = parseFloat(value).toFixed(2)
    }

    return ret;
}

function clearBadge(phone) {
    $.ajax({
        url: base_url + 'admin/main_admin/manage_other/notification/admin_notification_add/clearBadge',
        type: 'POST',
        data: {
            phone: phone
        },
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        success: function(res) {}
    });
}

function callScheme(request) {
    try {
        var iframe = document.createElement('IFRAME');
        iframe.setAttribute('src', request);
        document.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
        iframe = null;
    } catch (e) {}
}

function onClickProdDetail(url) {
    if (agent.search('webview_tongtongmall') != -1) {
        callScheme("tongtongmall://mobile?url=" + encodeURIComponent(url));
    } else {
        window.location.href = url;
    }
}

// 메뉴뷰 선택
var ismenu = false;

function setClickMenu() {
    if (ismenu) {
        $('.logout').css('position', 'absolute');
        $('#left-menu-wrapper').animate({
            width: 'toggle'
        }, 200);
        $('.menu-overlay').hide();

        $('body').css('overflow', 'visible');
        $('body').off('scroll touchmove mousewheel');

        ismenu = false;
    } else {
        $('#left-menu-wrapper').animate({
            width: 'toggle'
        }, 200);
        $('.menu-overlay').show();

        $('body').css('overflow', 'hidden');
        $('body').on('scroll touchmove mousewheel', function(e) {});

        ismenu = true;
    }
}

function setSubCategory(element, catid, index) {
    var rows = $(element).parent().parent().find('.menu');

    $(rows).each(function() {
        var image = $(this).find('img').attr('src');
        if (image.split('_')[2].search('selected') != -1) {
            $(this).find('img').attr('src', image.split('_')[0] + '_' + image.split('_')[1] + '_unselected.png');
        }
    });

    $(element).parent().parent().find('.menu').removeClass('active');
    $(element).parent().parent().find('.txt-color-category').removeClass('active-txt');
    $(element).addClass('active');
    $(element).find('.txt-color-category').addClass('active-txt');
    var currimage = $(element).find('img').attr('src');
    $(element).find('img').attr('src', currimage.split('_')[0] + '_' + currimage.split('_')[1] + '_selected.png');

    setTimeout(function() {
        getSubCategory(catid, index);
    }, 50);
}

function getSubCategory(catid, index) {
    $.ajax({
        url: base_url + 'user/main/getSubCategory',
        type: 'POST',
        dataType: 'json',
        data: {
            catid: catid
        },
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        success: function(res) {
            if (index == 'first') {
                $('.sub-category-second').css('display', 'none');
                $('.sub-category-first').css('display', 'block');
            } else {
                $('.sub-category-first').css('display', 'none');
                $('.sub-category-second').css('display', 'block');
            }

            var tmpData = [];
            var tmpProdCnt = [];
            var data = [];
            var prodCount = [];
            var html = '';
            var count = 0;

            for (var i = 0; i < res.category.length; i++) {
                if (count == 2) {
                    data.push(tmpData);
                    prodCount.push(tmpProdCnt);
                    tmpData = [];
                    tmpProdCnt = [];
                    count = 0;
                }

                tmpData.push(res.category[i]);
                tmpProdCnt.push(res.count[i]);
                count++;
            }

            if (tmpData.length != 0) {
                data.push(tmpData);
                prodCount.push(tmpProdCnt);
            }

            for (var i = 0; i < data.length; i++) {
                html += '<div class="row">';

                if (catid == '85') {
                    html += '<div class="col-xs-6 item pointer" onclick="redirectCategoryList(' + "'295'" + ', ' + "'" + catid + "'" + ', ' + "'" + data[i][0].bcodeid + "'" + ', ' + "'" + i + "'" + ');">';
                } else {
                    html += '<div class="col-xs-6 item pointer" onclick="redirectCategoryList(' + "'296'" + ', ' + "'" + catid + "'" + ', ' + "'" + data[i][0].bcodeid + "'" + ', ' + "'" + i + "'" + ');">';
                }

                html += '<div>' + data[i][0].codename + ' (' + prodCount[i][0].length + ')' + '</div>';
                html += '<img src="' + base_url + 'assets/user/images/ico_go.png" alt="">';
                html += '</div>';

                if (data[i][1]) {
                    if (catid == '85') {
                        html += '<div class="col-xs-6 item pointer" onclick="redirectCategoryList(' + "'295'" + ', ' + "'" + catid + "'" + ', ' + "'" + data[i][1].bcodeid + "'" + ', ' + "'" + i + "'" + ');">';
                    } else {
                        html += '<div class="col-xs-6 item pointer" onclick="redirectCategoryList(' + "'296'" + ', ' + "'" + catid + "'" + ', ' + "'" + data[i][1].bcodeid + "'" + ', ' + "'" + i + "'" + ');">';
                    }

                    html += '<div>' + data[i][1].codename + ' (' + prodCount[i][1].length + ')' + '</div>';
                    html += '<img src="' + base_url + 'assets/user/images/ico_go.png" alt="">';
                } else {
                    html += '<div class="col-xs-6 item">';
                    html += '<div>&nbsp;</div>';
                }

                html += '</div></div>';
            }

            $('.sub-category-' + index).html(html);
        }
    });
}

function redirectCategoryList(index, catid, subid, pos) {
    clearCookie('subcatid');
    window.location.href = base_url + 'category_list?index=' + index + '&catid=' + catid + '&subid=' + subid + '&pos=' + pos;
}

function setLogOut() {
    setConnectTongTongApp('main', 'logout', 'new');
}

var lastScrollDetail = 0;

$(window).on('scroll', function() {
    $('.sort_list').slideUp(200); // sort 숨기기

    if ($(this).scrollTop() > 200) {
        $('.btn-top').fadeIn(); // 위로 올리기 버튼 현시
        $('.btn-bottom').fadeIn(); 
    } else {
        $('.btn-top').fadeOut(); // 위로 올리기 버튼 숨기기
        $('.btn-bottom').fadeOut(); 
    }

    if ($('.coupon-list').length !== 0) {
        $('.coupon-list').slideUp(200);
    }


    // 일반상품 상품상세헤더
    if ($('#header-detail').length != 0) {
        var header = $('#header-detail')[0].offsetHeight;

        // 상품설명탭위치가 헤더에 도달했다면 헤더를 비노출시킨다.
        if (window.scrollY > $('#product-detail')[0].offsetHeight - $('#prod-content')[0].offsetHeight - header) {
            $('#header-detail').removeClass('show');
        }

        // 상품설명탭위치가 뷰의 상단에 도달했다면
        if (window.scrollY >= $('#product-detail')[0].offsetHeight - $('#prod-content')[0].offsetHeight) {
            if (window.scrollY < lastScrollDetail) { // 위로 스크롤하기
                $('#header-detail').addClass('show');

                // 상품설명탭을 뷰의 상단에 고정시킨다(노출되는 헤더의 높이만큼 위치시킨다)
                $('#product-tab').css({
                    'position': 'fixed',
                    'top': header + 'px',
                    'width': '100%',
                    'max-width': '500px',
                    'z-index': '100',
                    'background-color': '#fff',
                    'transition': 'top .35s'
                });
            } else { // 밑으로 스크롤하기
                $('#header-detail').removeClass('show');

                // 상품설명탭의 위치를 맨 상단에 위치시킨다
                $('#product-tab').css({
                    'position': 'fixed',
                    'top': '0px',
                    'width': '100%',
                    'max-width': '500px',
                    'z-index': '100',
                    'background-color': '#fff',
                    'transition': 'top .02s'
                });
            }

            if ($('#product-explain')) {
                if ($('#product-explain').attr('style').search('display: block;') != -1) {
                    $('#product-explain').css({
                        'padding-top': '84px',
                        'padding-bottom': '18px',
                        'display': 'block'
                    });
                }
            }

            if ($('#product-caution')) {
                if ($('#product-caution').attr('style').search('display: block;') != -1) {
                    $('#product-caution').css({
                        'padding-top': '54px',
                        'display': 'block'
                    });
                }
            }

            if ($('#product-review')) {
                if ($('#product-review').attr('style').search('display: block;') != -1) {
                    $('#product-review').css({
                        'padding-top': '84px',
                        'padding-bottom': '18px',
                        'display': 'block'
                    });
                }
            }

            if ($('#product-question')) {
                if ($('#product-question').attr('style').search('display: block;') != -1) {
                    $('#product-question').css({
                        'padding-top': '84px',
                        'padding-bottom': '18px',
                        'display': 'block'
                    });
                }
            }
        }

        // 상품설명탭이 상단에 벗어날 위치에 있는 경우 뷰의 상단에 고정시키는 값을 초기화한다.
        if (window.scrollY < $('#product-detail')[0].offsetHeight - $('#prod-content')[0].offsetHeight - header) {
            $('#product-tab').attr('style', '');

            if ($('#product-explain')) {
                if ($('#product-explain').attr('style').search('display: block;') != -1) {
                    $('#product-explain').css({
                        'padding-top': '30px',
                        'padding-bottom': '18px',
                        'display': 'block'
                    });
                }
            }

            if ($('#product-caution')) {
                if ($('#product-caution').attr('style').search('display: block;') != -1) {
                    $('#product-caution').css({
                        'display': 'block'
                    });
                }
            }

            if ($('#product-review')) {
                if ($('#product-review').attr('style').search('display: block;') != -1) {
                    $('#product-review').css({
                        'padding-top': '30px',
                        'padding-bottom': '18px',
                        'display': 'block'
                    });
                }
            }

            if ($('#product-question')) {
                if ($('#product-question').attr('style').search('display: block;') != -1) {
                    $('#product-question').css({
                        'padding-top': '30px',
                        'padding-bottom': '18px',
                        'display': 'block'
                    });
                }
            }
        }

        if (window.scrollY < $('#product-detail')[0].offsetHeight - $('#prod-content')[0].offsetHeight - 65 || window.scrollY < lastScrollDetail) {
            $('#header-detail').addClass('show');
        }

        lastScrollDetail = window.scrollY;
    }

    // 통통마일 상품상세헤더
    if ($('#header-gtc').length != 0) {
        if ($('#product-detail').length == 0) {
            return;
        }

        var header = $('#header-gtc')[0].offsetHeight;

        // 상품설명탭위치가 헤더에 도달했다면 헤더를 비노출시킨다.
        if (window.scrollY > $('#product-detail')[0].offsetHeight - $('#prod-content')[0].offsetHeight - header) {
            $('#header-gtc').removeClass('show');
        }

        // 상품설명탭위치가 뷰의 상단에 도달했다면
        if (window.scrollY >= $('#product-detail')[0].offsetHeight - $('#prod-content')[0].offsetHeight) {
            if (window.scrollY < lastScrollDetail) { // 위로 스크롤하기
                $('#header-gtc').addClass('show');

                // 상품설명탭을 뷰의 상단에 고정시킨다(노출되는 헤더의 높이만큼 위치시킨다)
                $('#product-tab').css({
                    'position': 'fixed',
                    'top': header + 'px',
                    'width': '100%',
                    'max-width': '500px',
                    'z-index': '100',
                    'background-color': '#fff',
                    'transition': 'top .35s'
                });
            } else { // 밑으로 스크롤하기
                $('#header-gtc').removeClass('show');

                // 상품설명탭의 위치를 맨 상단에 위치시킨다
                $('#product-tab').css({
                    'position': 'fixed',
                    'top': '0px',
                    'width': '100%',
                    'max-width': '500px',
                    'z-index': '100',
                    'background-color': '#fff',
                    'transition': 'top .02s'
                });
            }

            if ($('#product-explain').attr('style').search('display: block;') != -1) {
                $('#product-explain').css({
                    'padding-top': '84px',
                    'padding-bottom': '18px',
                    'display': 'block'
                });
            }

            if ($('#product-caution').attr('style').search('display: block;') != -1) {
                $('#product-caution').css({
                    'padding-top': '54px',
                    'display': 'block'
                });
            }

            if ($('#product-review').attr('style').search('display: block;') != -1) {
                $('#product-review').css({
                    'padding-top': '84px',
                    'padding-bottom': '18px',
                    'display': 'block'
                });
            }

            if ($('#product-question').attr('style').search('display: block;') != -1) {
                $('#product-question').css({
                    'padding-top': '84px',
                    'padding-bottom': '18px',
                    'display': 'block'
                });
            }
        }

        // 상품설명탭이 상단에 벗어날 위치에 있는 경우 뷰의 상단에 고정시키는 값을 초기화한다.
        if (window.scrollY < $('#product-detail')[0].offsetHeight - $('#prod-content')[0].offsetHeight - header) {
            $('#product-tab').attr('style', '');

            if ($('#product-explain').attr('style').search('display: block;') != -1) {
                $('#product-explain').css({
                    'padding-top': '30px',
                    'padding-bottom': '18px',
                    'display': 'block'
                });
            }

            if ($('#product-caution').attr('style').search('display: block;') != -1) {
                $('#product-caution').css({
                    'display': 'block'
                });
            }

            if ($('#product-review').attr('style').search('display: block;') != -1) {
                $('#product-review').css({
                    'padding-top': '30px',
                    'padding-bottom': '18px',
                    'display': 'block'
                });
            }

            if ($('#product-question').attr('style').search('display: block;') != -1) {
                $('#product-question').css({
                    'padding-top': '30px',
                    'padding-bottom': '18px',
                    'display': 'block'
                });
            }
        }

        if (window.scrollY < $('#product-detail')[0].offsetHeight - $('#prod-content')[0].offsetHeight - 65 || window.scrollY < lastScrollDetail) {
            $('#header-gtc').addClass('show');
        }

        lastScrollDetail = window.scrollY;
    }


    
});

// 탑버튼 클릭시 스크롤 맨위로 올리기
function setViewTop() {
    $('html, body').animate({
        scrollTop: 0
    }, 0);
}
function setViewDown() {
    $('html, body').animate({
        scrollTop:$('.scrolll_bottom').offset().top - $(window).height()
    }, 0);
}


// 숫자 1000단위에 콤마 추가
function addComma(num) {
    var parts = num.toString().split('.');
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parts[1] ? '.' + parts[1] : '');
}

// 문자열에서 콤마 삭제
function removeComma(str) {
    var num = parseInt(str.replace(/,/g, ""));
    return num;
}

function removeCommaOther(str) {
    var num = parseFloat(str.replace(/,/g, ""));
    return num;
}

// 숫자앞붙이에 0을 추가
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

// 이메일형식인가를 체크
function validateEmail(val) {
    var ret = false;
    var filter = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (filter.test(val)) {
        return true
    }

    return ret;
}

// 영문, 숫자, 특수문자 조합 체크
function checkPassword(password) {
    if (!/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,15}$/.test(password)) {
        return 1;
    }
    var checkNumber = password.search(/[0-9]/g);
    var checkEnglish = password.search(/[a-z]/ig);
    if (checkNumber < 0 || checkEnglish < 0) {
        return 2;
    }
    if (/(\w)\1\1\1/.test(password)) {
        return 3;
    }
}

function clipboardData(value, index) {
    var element = document.createElement('textarea');
    document.body.appendChild(element);
    element.value = value;
    element.select();
    document.execCommand('copy');
    document.body.removeChild(element);
    if (index == 'group') {
        showToast('success', 'URL?? 복사?�었?�니??.', 220);
    }
}

// 웹토스트 띄우기
function showToast(index, text, width) {
    $.toast.config.align = 'center';
    $.toast.config.width = width;

    switch (index) {
        case 'warning':
            $.toast(text, {
                duration: 2000,
                type: 'danger'
            });
            break;
        case 'info':
            $.toast(text, {
                duration: 2000,
                type: 'info'
            });
            break;
        case 'success':
            $.toast(text, {
                duration: 2000,
                type: 'success'
            });
            break;
        case 'normal':
            $.toast(text, {
                duration: 2000
            });
            break;
    }
}

// 관리자페이지 warning 다이얼로그
function showWarningForAdmin(text) {
    $('#warning-dialog').modal();
    $('#warning-content').html(text);
}

// 관리자페이지 확인 다이얼로그
function showConfirmForAdmin(text, value) {
    $('#confirm-dialog').modal();
    $('#confirm-content').html(text);
    $('#btn-confirm').attr('onclick', value);
}

// 모든 다이얼로그 닫기
function closeDialog() {
    $('body').css('overflow', 'visible');
    $('body').off('scroll touchmove mousewheel');

    $('.dialog-overlay').attr('onclick', 'closeDialog();');
    $('.dialog-overlay').fadeOut();
    $('.dialog-normal').fadeOut();
    $('.dialog-setting').fadeOut();
    $('.dialog-cart').fadeOut();
    $('.dialog-coupon').fadeOut();
    $('.event-coin-res').fadeOut();
    $('.dialog-card').fadeOut();

    $('.run-app-view').fadeOut();

    $('.dialog-normal-gtc').fadeOut();
    $('.dialog-setting-gtc').fadeOut();
    $('.dialog-cart-gtc').fadeOut();
    $('.dialog-normal-return').fadeOut();

    $('#dialog-ehong').fadeOut();
}

// 통통몰앱으로 이동 팝업
function showRunAppView(device, url) {
    $('body').css('overflow', 'hidden');
    $('body').on('scroll touchmove mousewheel', function(e) {});

    $('.dialog-overlay').fadeIn();
    $('.run-app-view').fadeIn();
    $('.dialog-overlay').attr('onclick', '');
    $('#run-app').attr('onclick', 'runApp(' + "'" + device + "'" + ', ' + "'" + url + "'" + ');');
}

// 다이얼로그 쿠폰 설정
function showDialogCoupon(disc_rate, apply_part) {
    $('body').css('overflow', 'hidden');
    $('body').on('scroll touchmove mousewheel', function(e) {});

    $('.dialog-overlay').fadeIn();
    $('.dialog-coupon').fadeIn();
    $('.disc-rate').text(disc_rate);
    $('#apply-part').text(apply_part);
}

// 디폴트 다이얼로그 설정
function showDialogWarning(title, content, align, text, value) {
    $('body').css('overflow', 'hidden');
    $('body').on('scroll touchmove mousewheel', function(e) {});

    $('.dialog-overlay').fadeIn();
    $('.dialog-normal').fadeIn();
    $('.dialog-normal .tag-title').html(title);
    if (content == '') {
        $('.dialog-normal .dialog-content').css('display', 'none');
    } else {
        $('.dialog-normal .dialog-content').css('display', 'block');
        $('.dialog-normal .dialog-content').html(content);
        $('.dialog-normal .dialog-content').css('text-align', align);
    }
    $('.dialog-normal .dialog-footer > .btn').text(text);
    $('.dialog-normal .dialog-footer > .btn').attr('onclick', value);
}

function showDialogGtcWarning(title, content, align, text, value) {
    $('body').css('overflow', 'hidden');
    $('body').on('scroll touchmove mousewheel', function(e) {});

    $('.dialog-overlay').fadeIn();
    $('.dialog-normal-gtc').fadeIn();
    $('.dialog-normal-gtc .tag-title').html(title);
    if (content == '') {
        $('.dialog-normal-gtc .dialog-content').css('display', 'none');
    } else {
        $('.dialog-normal-gtc .dialog-content').css('display', 'block');
        $('.dialog-normal-gtc .dialog-content').html(content);
        $('.dialog-normal-gtc .dialog-content').css('text-align', align);
    }
    $('.dialog-normal-gtc .dialog-footer > .btn-gtc').text(text);
    $('.dialog-normal-gtc .dialog-footer > .btn-gtc').attr('onclick', value);
}

// 설정 다이얼로그 설정
function showDialogSetting(title, content, text1, text2, value1, value2) {
    $('body').css('overflow', 'hidden');
    $('body').on('scroll touchmove mousewheel', function(e) {});

    $('.dialog-overlay').fadeIn();
    $('.dialog-setting').fadeIn();
    $('.dialog-setting .tag-title').html(title);
    if (content == '') {
        $('.dialog-setting .dialog-content').css('display', 'none');
    } else {
        $('.dialog-setting .dialog-content').css({
            'display': 'block',
            'text-align': 'center'
        });
        $('.dialog-setting .dialog-content').html(content);
    }
    $('.dialog-setting .dialog-footer .btn-layout > div:nth-child(1)').text(text1);
    $('.dialog-setting .dialog-footer .btn-layout > div:nth-child(2)').text(text2);
    $('.dialog-setting .dialog-footer .btn-layout > div:nth-child(1)').attr('onclick', value1);
    $('.dialog-setting .dialog-footer .btn-layout > div:nth-child(2)').attr('onclick', value2);
}

function showDialogGtcSetting(title, content, text1, text2, value1, value2) {
    $('body').css('overflow', 'hidden');
    $('body').on('scroll touchmove mousewheel', function(e) {});

    $('.dialog-overlay').fadeIn();
    $('.dialog-setting-gtc').fadeIn();
    $('.dialog-setting-gtc .tag-title').html(title);
    if (content == '') {
        $('.dialog-setting-gtc .dialog-content').css('display', 'none');
    } else {
        $('.dialog-setting-gtc .dialog-content').css({
            'display': 'block',
            'text-align': 'center'
        });
        $('.dialog-setting-gtc .dialog-content').html(content);
    }
    $('.dialog-setting-gtc .dialog-footer .row > div:nth-child(1)').text(text1);
    $('.dialog-setting-gtc .dialog-footer .row > div:nth-child(2)').text(text2);
    $('.dialog-setting-gtc .dialog-footer .row > div:nth-child(1)').attr('onclick', value1);
    $('.dialog-setting-gtc .dialog-footer .row > div:nth-child(2)').attr('onclick', value2);
}

// 장바구니 다이얼로그 설정
function showDialogCart(value1, value2) {
    $('body').css('overflow', 'hidden');
    $('body').on('scroll touchmove mousewheel', function(e) {});

    $('.dialog-overlay').fadeIn();
    $('.dialog-cart').fadeIn();
    $('.dialog-cart .dialog-footer .row > div:nth-child(1)').attr('onclick', value1);
    $('.dialog-cart .dialog-footer .row > div:nth-child(2)').attr('onclick', value2);
}

function showDialogGtcCart(value1, value2) {
    $('body').css('overflow', 'hidden');
    $('body').on('scroll touchmove mousewheel', function(e) {});

    $('.dialog-overlay').fadeIn();
    $('.dialog-cart-gtc').fadeIn();
    $('.dialog-cart-gtc .dialog-footer .row > div:nth-child(1)').attr('onclick', value1);
    $('.dialog-cart-gtc .dialog-footer .row > div:nth-child(2)').attr('onclick', value2);
}

// 다음주소 다이얼로그 노출
function showDialogAddress() {
    $('body').css('overflow', 'hidden');
    $('body').on('scroll touchmove mousewheel', function(e) {});

    $('.dialog-overlay-address').fadeIn();
    $('.dialog-address').fadeIn();
    daumPostcode();
    $('#wrap > div:nth-child(1)').css({
        'overflow': 'auto',
        '-webkit-overflow-scrolling': 'touch'
    });
    $('#wrap > div:nth-child(1) > iframe').css({
        'height': '101%',
        'overflow': 'auto'
    });
}

// 배송주소 다이얼로그 노출
function showDialogShipping(title, name, phone, address, memo) {
    $('body').css('overflow', 'hidden');
    $('body').on('scroll touchmove mousewheel', function(e) {});

    $('.dialog-overlay-shipping').fadeIn();
    $('.dialog-shipping').fadeIn();
    $('.dialog-shipping .tag-title').text(title);

    $('#name').text(name);
    $('#phone').text(phone);
    $('#address').text(address);
    $('#memo').text(memo);
}

// 배송주소 다이얼로그 취소
function closeDialogShipping() {
    $('body').css('overflow', 'visible');
    $('body').off('scroll touchmove mousewheel');

    $('.dialog-overlay-shipping').fadeOut();
    $('.dialog-shipping').fadeOut();
}

// 다음주소 다이얼로그 취소
function closeDialogAddress() {
    $('body').css('overflow', 'visible');
    $('body').off('scroll touchmove mousewheel');

    $('.dialog-overlay-address').fadeOut();
    $('.dialog-address').fadeOut();
    element_wrap.style.display = 'none';
}

function goBack(url) {
    var referrer = document.referrer;

    if (referrer.search('password_input?type=all') != -1) {
        window.location.href = url + 'main';
        return;
    }

    if (referrer.search('cancel') != -1) {
        window.location.href = url + 'order_list';
        return;
    }

    callScheme("tongtongmall://close?url=" + encodeURIComponent(url));
    window.history.go(-1);
}

function redirectLogin(url) {
    window.location.href = url + 'login';
}

function redirectMain(url) {
    window.location.href = url + 'main';
}

function redirectGtc(url) {
    window.location.href = url + 'gtc';
}

function redirectCart(url) {
    window.location.href = url + 'basket';
}

function redirectGtcCart(url) {
    window.location.href = url + 'gtc_basket';
}

function redirectException() {
    window.location.href = base_url + 'exception_list';
}

// 모바일웹일 때 통통몰앱으로 유도
function redirectTongtongmallApp() {
    if (navigator.userAgent.match(/android/i)) { // 안드로이드라면
        runApp('android', 'Intent://main#Intent;scheme=tongtongmall;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.tongtong.tongtongmall1;end');
    } else if (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) { // 아이폰이라면
        runApp('iphone', 'tongtongmall://main');
    } else {
        closeDialog();
    }
}

// 지갑생성/복구페이지로 리다이렉트
function redirectWalletPage(kind) {
    closeDialog();
    setTimeout(function() {
        window.location.href = base_url + 'wallet_main?kind=' + kind;
    }, 300);
}

function showCoinDialog(index, kind, status) {
    if (index == 'create') {
        if (status == 'ttc') {
            showDialogSetting('통통지갑 만들기', '지갑을 만들면 많은 혜택을<br>받을 수 있습니다.', '다음에', '지갑만들기', 'setWalletDialogStatus();', 'redirectWalletPage(' + "'" + kind + "'" + ');');
        } else {
            showDialogGtcSetting('통통지갑 만들기', '지갑을 만들면 많은 혜택을<br>받을 수 있습니다.', '다음에', '지갑만들기', 'setWalletDialogStatus();', 'redirectWalletPage(' + "'" + kind + "'" + ');');
        }
    }

    if (index == 'recovery') {
        if (status == 'ttc') {
            showDialogSetting('통통지갑 복구하기', '지갑을 복구하면 많은 혜택을<br>받을 수 있습니다.', '다음에', '지갑복구', 'setWalletDialogStatus();', 'redirectWalletPage(' + "'" + kind + "'" + ');');
        } else {
            showDialogGtcSetting('통통지갑 복구하기', '지갑을 복구하면 많은 혜택을<br>받을 수 있습니다.', '다음에', '지갑복구', 'setWalletDialogStatus();', 'redirectWalletPage(' + "'" + kind + "'" + ');');
        }
    }
}

// 지갑생성/지갑복구팝업에서 '다음에' 클릭 시 처리되는 함수
function setWalletDialogStatus() {
    closeDialog();
    var today = new Date();
    var timestamp = new Date(today.getFullYear() + '-' + numberPad((today.getMonth() + 1), 2) + '-' + numberPad(today.getDate(), 2)).getTime();
    setCookie('wallet_alert', timestamp);
}

/************통통앱을 통한 자동로그인***********/

var phoneNumber = ''; // 통통앱에서 받는 사용자폰번호
var userKey = ''; // 통통앱에서 받는 사용자키
var nickName = ''; // 통통앱에서 받는 사용자닉네임

// 통통앱 자동로그인 체크
function showDialogAutoLogin(view) {
    // 7일 이내이면 통통앱 자동로그인을 진행하지 않고 통통몰 로그인 진행
    if (getCookie('expire_date') && view != 'login') {
        window.location.href = base_url + 'login';
        return;
    }

     // 앱에서 호출한다면 통통앱 자동로그인 팝업 띄우기
     if (agent.search('app_android') != -1 || agent.search('app_iphone') != -1) { // 안드로이드, 아이폰이라면
        showDialogSetting('One-ID 자동 로그인을<br>진행하시겠습니까?', '', '취소', '확인', 'closeLoginByTongtongApp();', 'checkLoginByTongtongApp();');
        $('.dialog-overlay').attr('onclick', '');
        $('.dialog-setting img').css('display', 'none');
    } else { // 모바일웹이라면
        if (view === '') {
            window.location.href = base_url + 'login';
        } else {
            showDialogWarning('앱에서 이용 가능한 서비스입니다.', '', '', '확인', 'closeDialog();');
        }
    }
}

// 통통앱 자동로그인
function checkLoginByTongtongApp() {
    closeDialog();
    $('#spinner_overay').css('display', 'block');

    if (agent.search('app_android') != -1) { // 안드로이드라면
        var res = tongtongmall.getTongtongAppInfo();
        setLoginByTongtongApp(res);
    } else if (agent.search('app_iphone') != -1) { // 아이폰이라면
        window.webkit.messageHandlers.getPhoneNumberFromApp.postMessage({});
    }
}

// 통통앱 정보를 얻은 후 값을 넘겨주기 위해 아이폰에서 호출하는 함수
function setTongtongInfoForIphone(res) {
    setLoginByTongtongApp(res);
}

// 통통앱 로그인 후 안드로이드에서 호출하는 함수
function getPhoneNumberByAppAndrond(value) {
    var data = value.split('~');

    if (data[4]) {
        phoneNumber = data[2].replace(/-/g, ''); // 사용자폰번호
        nickName = data[3]; // 사용자명
        userKey = data[4]; // 통통앱유저키
    } else {
        phoneNumber = data[0].replace(/-/g, ''); // 사용자폰번호
        nickName = data[1]; // 사용자명
        userKey = data[2]; // 통통앱유저키
    }

    var device = 0;
    var push_token = tongtongmall.getPushToken();

    getUserInfoTongtongmall(push_token, device);
}

// 통통앱 로그인 후 아이폰에서 호출하는 함수
function setPhoneNumberByAppIphone(value) {
    var data = value.split('~');

    if (data[4]) {
        phoneNumber = data[2].replace(/-/g, ''); // 사용자폰번호
        nickName = data[3]; // 사용자명
        userKey = data[4]; // 통통앱유저키
    } else {
        phoneNumber = data[0].replace(/-/g, ''); // 사용자폰번호
        nickName = data[1]; // 사용자명
        userKey = data[2]; // 통통앱유저키
    }

    window.webkit.messageHandlers.getDevicePushToken.postMessage({});
}

// 아이폰에서 서버 호출
function setDevicePushToken(push) {
    var device = 1;
    var push_token = push;

    getUserInfoTongtongmall(push_token, device);
}

// 통통앱 자동로그인 프로세스
function setLoginByTongtongApp(value) {
    if (value == '') { // 통통앱 호출 시 리턴값이 없으면 통통앱 실행
        $('#spinner_overay').css('display', 'none');

        if (agent.search('app_android') != -1) { // 안드로이드라면
            tongtongmall.getPhoneNumberFromApp();
        } else if (agent.search('app_iphone') != -1) { // 아이폰이라면
            window.webkit.messageHandlers.getPhoneNumberFromApp.postMessage({});
        }
    } else { // 리턴값이 존재하면 통통앱에 로그인이 되었다고 판정을 하고 통통앱 자동로그인 진행
        var data = value.split('~');

        if (data[4]) {
            phoneNumber = data[2].replace(/-/g, ''); // 사용자폰번호
            nickName = data[3]; // 사용자명
            userKey = data[4]; // 통통앱유저키
        } else {
            phoneNumber = data[0].replace(/-/g, ''); // 사용자폰번호
            nickName = data[1]; // 사용자명
            userKey = data[2]; // 통통앱유저키
        }

        if (agent.search('app_android') != -1) { // 안드로이드라면 폰에서 푸시토큰값 얻어오기
            var device = 0;
            setTimeout(function() {
                var push_token = tongtongmall.getPushToken();
                getUserInfoTongtongmall(push_token, device);
            }, 50);
        } else if (agent.search('app_iphone') != -1) { // 아이폰이라면 폰에서 푸시토큰값 얻어오기
            window.webkit.messageHandlers.getDevicePushToken.postMessage({});
        }
    }
}

// 통통앱 자동로그인 취소
function closeLoginByTongtongApp() {
    closeDialog();
    // 통통앱 자동로그인을 하지 않으면 7일동안 통통앱자동로그인 유도팝업 띄우지 않음
    setCookie('expire_date', 'autologin');
    window.location.href = base_url + 'login';
}


// 통통몰 사용자정보 조회
function getUserInfoTongtongmall(push_token, device) {
    $('#spinner_overay').css('display', 'block');

    setTimeout(function() {
        $.ajax({
            url: base_url + 'user/oneid/login_tongtong/getUserInfo',
            type: 'POST',
            dataType: 'json',
            data: {
                phone: phoneNumber,
                userkey: userKey,
                token: push_token,
                device: device,
                name: nickName
            },
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            async: false,
            success: function(res) {
                if (res.out) { // 탈퇴회원이면
                    $('#spinner_overay').css('display', 'none');
                    showDialogWarning('통통몰 관리자에 의해<br>탈퇴된 회원입니다.', res.out + '일 이후에<br>재가입을 할수 있습니다.', 'center', '확인', 'redirectMain(' + "'" + base_url + "'" + ');');
                    $('.dialog-overlay').attr('onclick', '');
                    $('.dialog-normal img').css('display', 'none');
                    return;
                }

                if (res.tongtong) { // 회원가입이면
                    setTimeout(function() {
                        $('#spinner_overay').css('display', 'none');
                    }, 5000);
                    setCookie('name', nickName);
                    setCookie('phone', phoneNumber);
                    window.location.href = base_url + 'policy_tongtongmall';
                    return;
                }

                // 로그인상태여부 폰에 저장
                if (agent.search('app_android') != -1) { // 안드로이드라면
                    tongtongmall.setLoginInfo(phoneNumber);
                } else if (agent.search('app_iphone') != -1) { // 아이폰이라면
                    window.webkit.messageHandlers.setLoginInfo.postMessage({
                        phone: phoneNumber
                    });
                }

                $('#spinner_overay').css('display', 'none');
                showDialogWarning('로그인이 완료되었습니다.', '', 'center', '확인', 'redirectMain(' + "'" + base_url + "'" + ');');
                $('.dialog-overlay').attr('onclick', '');
                $('.dialog-normal img').css('display', 'none');
            }
        });
    }, 100);
}

/************통통지갑 연동 부분****************/

/**
 *
 * 통통지갑 연동 프로세스
 *
 * 해당 통통앱연동 때 이 메서드를 호출
 *
 * index: 해당 페이지 인덱스
 * kind: 통통코인연동타겟
 *
 */
function setConnectTongTongApp(index, kind, status) {
    $('#spinner_overay').css('display', 'block');

    switch (kind) {
        case 'ctc': // 결제페이지에서 CTC결제
        case 'gtc': // GTC결제
        case 'review_write': // 구매후기작성
        case 'coin': // 통통코인관리
        case 'gtc_coin': // 통통마일관리
        case 'ctc_coin': // 통통머니관리
        case 'ttcoin': // 결제페이지에서 통통코인결제
        case 'group': // 공동구매상품예약
        case 'event': // 상품이벤트
        case 'purchase': // 구매혜택
            closeDialog();

            if (status == 'old') {
                if (agent.search('app_android') != -1) { // 안드로이드라면
                    setTimeout(function() {
                        setTongTongConnectForAndroid(index, kind);
                    }, 500);
                } else if (agent.search('app_iphone') != -1) { // 아이폰이라면
                    setTimeout(function() {
                        setTongTongConnectForIphone(index, kind);
                    }, 500);
                } else { // 모바일웹이라면
                    setTimeout(function() {
                        $('#spinner_overay').css('display', 'none');

                        if (kind == 'gtc' && index != 'milemall') {
                            showDialogGtcWarning('앱에서 이용 가능한 서비스입니다.', '', '', '확인', 'redirectTongtongmallApp();');
                        } else {
                            showDialogWarning('앱에서 이용 가능한 서비스입니다.', '', '', '확인', 'redirectTongtongmallApp();');
                        }

                        if (kind == 'ttcoin' || kind == 'ctc') {
                            $('.btn-ttcoin').removeClass('active');
                            $('#ttcoin-check').prop('checked', false);
                            $('#ctc-check').prop('checked', false);
                        }
                    }, 500);
                }
            } else {
                setTimeout(function() {
                    setCoinConnectAll(index, kind);
                }, 500);
            }
            break;
        case 'logout': // 로그아웃
            if (agent.search('app_android') != -1) { // 안드로이드라면
                tongtongmall.setClearLoginInfo();
            } else if (agent.search('app_iphone') != -1) { // 아이폰이라면
                window.webkit.messageHandlers.setClearWalletInfo.postMessage({});
            } else {
                clearCookie('tomatoid');
            }

            setIndexProcess('', '', '', '', index, kind, '', '');
            break;
    }
}

// 통통몰에서 코인지갑연동을 할 때 이용
function setCoinConnectAll(index, kind) {
    var info = getWalletAddress('', '').split('-');
    var walletaddress = info[0]; // 지갑주소
    var balance_ttcoin = info[1]; // 통통코인잔고
    var balance_gtc = info[2]; // 통통마일잔고
    var balance_ctc = info[3]; // 통통머니잔고
    var walletname = info[4]; // 지갑명
    var walletpassword = info[5]; // 지갑비번

    setIndexProcess(walletaddress, balance_ttcoin, walletname, walletpassword, index, kind, balance_gtc, balance_ctc);
}

/**
 *
 * 통통코인지갑 프로세스
 *
 * encrypt: 암호화 된 지갑명과 지갑비번 얻기
 * index: 페이지 인덱스
 * kind: 통통코인연동타겟
 *
 */
function setTongTongProcess(encrypt, index, kind) {
    if (kind == 'charge') return; // 통통코인충전이라면 통통앱 실행시키고 return

    // 안드로이드, 아이폰에서 AES256으로 인코딩된 지갑명과 지갑비번을 받아온다.
    if (encrypt == '-1' || encrypt == '') { // 지갑정보가 빈문자열이거나 -1이면 지갑정보 얻기 실패(지갑개설전이거나 지갑복귀전)
        $('#spinner_overay').css('display', 'none');

        if (kind == 'gtc') {
            showDialogGtcWarning('지갑정보가 없습니다.<br>통통 월렛앱에서 확인해 주세요.', '', '', '확인', 'closeDialog();');
        } else {
            showDialogWarning('지갑정보가 없습니다.<br>통통 월렛앱에서 확인해 주세요.', '', '', '확인', 'closeDialog();');
        }

        if (kind == 'ttcoin' || kind == 'ctc') {
            $('.btn-ttcoin').removeClass('active');
            $('#ttcoin-check').prop('checked', false);
            $('#ctc-check').prop('checked', false);
        }

        return;
    }

    var walletinfo = setAESDecrypt(encrypt.split('-')[0], encrypt.split('-')[1]);
    var walletname = walletinfo.split('-')[0]; // 복호화된 통통코인 지갑명
    var walletpassword = walletinfo.split('-')[1]; // 복호화된 통통코인 지갑비번
    var info = getWalletAddress(walletname, walletpassword);
    var walletaddress = info.split('-')[0]; // 지갑주소
    var balance_ttcoin = info.split('-')[1]; // 통통코인잔고
    var balance_gtc = info.split('-')[2]; // GTC잔고
    var balance_ctc = info.split('-')[3]; // CTC잔고

    setIndexProcess(walletaddress, balance_ttcoin, walletname, walletpassword, index, kind, balance_gtc, balance_ctc);
}

/**
 *
 * 안드로이드용 통통지갑 연동 프로세스
 *
 * index: 페이지 인덱스
 * kind: 통통코인연동타겟
 *
 */
function setTongTongConnectForAndroid(index, kind) {
    var walletinfo = tongtongmall.setConnectTongTongInfo();

    if (walletinfo != '') { // 통통앱과 연동이 되었다면
        var walletname = walletinfo.split('-')[0];
        var walletpassword = walletinfo.split('-')[1];
        var info = getWalletAddress(walletname, walletpassword);
        var walletaddress = info.split('-')[0]; // 지갑주소
        var balance_ttcoin = info.split('-')[1]; // 통통코인잔고
        var balance_gtc = info.split('-')[2]; // GTC잔고
        var balance_ctc = info.split('-')[3]; // CTC잔고

        setIndexProcess(walletaddress, balance_ttcoin, walletname, walletpassword, index, kind, balance_gtc, balance_ctc);
    } else { // 통통앱과의 연동에 실패 한 경우
        $('#spinner_overay').css('display', 'none');

        if (kind == 'gtc') {
            showDialogGtcWarning('지갑정보가 없습니다.<br>통통 월렛앱에서 확인해 주세요.', '', '', '확인', 'closeDialog();');
        } else {
            showDialogWarning('지갑정보가 없습니다.<br>통통 월렛앱에서 확인해 주세요.', '', '', '확인', 'closeDialog();');
        }

        if (kind == 'ttcoin' || kind == 'ctc') {
            $('.btn-ttcoin').removeClass('active');
            $('#ttcoin-check').prop('checked', false);
            $('#ctc-check').prop('checked', false);
        }
    }
}

/**
 *
 * 아이폰용 통통지갑 연동 프로세스
 *
 * index: 페이지 인덱스
 * kind: 통통코인연동타겟
 *
 */
function setTongTongConnectForIphone(index, kind) {
    window.webkit.messageHandlers.checkTongTongApp.postMessage({
        index: index,
        kind: kind
    });
}

/**
 *
 * 아이폰용 통통앱 유무체크
 *
 * res: 통통앱설치여부 판단(0: 설치되지 않은 경우, 1: 설지되어있는 경우)
 * index: 페이지 인덱스
 * kind: 통통코인연동타겟
 *
 */
function setCheckTongTongApp(res, index, kind) {
    if (res == 1) { // 통통앱이 존재한다면
        window.webkit.messageHandlers.runTongTongApp.postMessage({
            status: 1,
            index: index,
            kind: kind
        });
    } else { // 통통앱이 존재하지 않는다면
        $('#spinner_overay').css('display', 'none');

        if (kind == 'gtc') {
            showDialogGtcWarning('통통지갑연동에 실패하였습니다.<br>통통앱을 설치하시거나 코인지갑을<br>만들어주세요.', '', 'left', '연동하기', 'setRunTongTongApp(' + "'" + index + "'" + ', ' + "'" + kind + "'" + ');');
        } else {
            showDialogWarning('통통지갑연동에 실패하였습니다.<br>통통앱을 설치하시거나 코인지갑을<br>만들어주세요.', '', 'left', '연동하기', 'setRunTongTongApp(' + "'" + index + "'" + ', ' + "'" + kind + "'" + ');');
        }

        if (kind == 'ttcoin' || kind == 'ctc') {
            $('.btn-ttcoin').removeClass('active');
            $('#ttcoin-check').prop('checked', false);
            $('#ctc-check').prop('checked', false);
        }
    }
}

/**
 *
 * 통통앱 존재하지 않을 시 앱스토어로 이동
 * index: 통통앱설치여부 판단(0: 설치되지 않은 경우, 1: 설지되어있는 경우)
 *
 */
function setRunTongTongApp(index, kind) {
    closeDialog();

    setTimeout(function() {
        window.webkit.messageHandlers.runTongTongApp.postMessage({
            status: 0,
            index: index,
            kind: kind
        });
    }, 500);
}

/**
 *
 * AES256 복호화
 *
 * walletname: 통통지갑명
 * walletpassword: 통통지갑비번
 *
 */
function setAESDecrypt(walletname, walletpassword) {
    var ret = '';

    $.ajax({
        url: base_url + 'manage_coin/setAESDecrypt',
        type: 'POST',
        dataType: 'json',
        data: {
            name: walletname,
            password: walletpassword
        },
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        success: function(res) {
            if (res.length != 0) {
                ret = res.name + '-' + res.password;
            }
        }
    });

    return ret;
}

/**
 *
 * 통통코인 지갑주소, 코인잔고, 통통코인시세가격 얻기
 *
 * walletname: 통통지갑명
 * flag: 이미 연동되었는지 체크하는 플래그
 * kind: 통통코인연동타겟
 *
 */
function getWalletAddress(walletname, walletpassword) {
    var ret = '';

    $.ajax({
        url: base_url + 'manage_coin/getWalletAddress',
        type: 'POST',
        dataType: 'json',
        data: {
            walletname: walletname,
            walletpassword: walletpassword
        },
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        success: function(res) {
            if (res.out) {
                window.location.replace(base_url + 'logout?kind=getWalletAddress');
            } else {
                ret = res.wallet_address + '-' + res.tongtong_amount + '-' + res.gtc_amount + '-' + res.ctc_amount + '-' + res.walletname + '-' + res.walletpassword;
            }
        }
    });

    return ret;
}

/**
 *
 * 해당 페이지 인덱스에 따라 리다이렉트
 *
 * walletaddress: 통통지갑주소
 * balance_ttcoin: 통통코인 잔고
 * walletname: 통통코인지갑명
 * walletpassword: 통통코인지갑비번
 * index: 페이지 인덱스
 * kind: 통통코인연동타겟
 * balance_ctc: 통통머니 잔고
 * balance_gtc: 통통마일몰 잔고
 *
 */
function setIndexProcess(walletaddress, balance_ttcoin, walletname, walletpassword, index, kind, balance_gtc, balance_ctc) {
    switch (index) {
        case 'coin_view':
            setTimeout(function() {
                $('#spinner_overay').css('display', 'none');
            }, 4000);

            $('#coin-info').css('display', 'block');
            $('#req-coin').css('display', 'none');
            $('#ttc-amount').html(addComma(parseFloat(balance_ttcoin).toFixed(2)));
            $('#ctc-amount').html(addComma(parseFloat(balance_ctc).toFixed(2)));
            $('#gtc-amount').html(addComma(parseFloat(balance_gtc).toFixed(2)));
            break;
        case 'milemall':
            setTimeout(function() {
                $('#spinner_overay').css('display', 'none');
            }, 4000);

            window.location.href = base_url + 'gtc_main';
            break;
        case 'gtc_order':
            $('#spinner_overay').css('display', 'none');
            setPayment(walletaddress, balance_ttcoin, walletname, walletpassword, balance_gtc);
            break;
        case 'wallcom_order':
            setPayment(walletaddress, walletname, walletpassword, balance_gtc);
            break;
        case 'wallcom_roulette':
            $('#spinner_overay').css('display', 'none');
            setPaymentCoin(walletaddress, walletname, walletpassword, balance_gtc);
            break;
        case 'coin_manage':
            $('#spinner_overay').css('display', 'none');

            if (kind == 'gtc_coin') {
                setCoinBalance(balance_gtc);
            }

            if (kind == 'ctc_coin') {
                setCoinBalance(balance_ctc);
            }

            if (kind == 'coin') {
                setCoinBalance(balance_ttcoin);
            }
            break;
        case 'product_detail':
            if (kind == 'event') {
                setPayCoinEvent(walletaddress, balance_ttcoin, walletname, walletpassword);
            }

            if (kind == 'group') {
                setPayCoinGroup(walletaddress, balance_ttcoin, walletname, walletpassword);
            }
            break;
        case 'order':
            $('#spinner_overay').css('display', 'none');

            if (kind == 'ttcoin') {
                setTongtongCoinType(walletaddress, balance_ttcoin, walletname, walletpassword, '330');
            }

            if (kind == 'ctc') {
                setCtcCoinType(walletaddress, balance_ctc, walletname, walletpassword, '466');
            }
            break;
        case 'main':
            setTimeout(function() {
                $('#spinner_overay').css('display', 'none');
            }, 5000);

            window.location.replace(base_url + 'logout?kind=utility_main');
            break;
    }
}
function clickmenu(ele){ 
    $(ele)[0].classList.toggle("menu-active")
    $('#collapseMenu')[0].classList.toggle('hidden-menu')
}

function overCateItem(ele){
    $(ele).parent().find('.active').removeClass('active')
    $(ele).parent().find('.show_icon').removeClass('show_icon')
    $(ele).parent().find('.icon').addClass('hidden_icon')
    $(ele).find('.category-name').addClass('active')  
    $(ele).find('.icon').removeClass('hidden_icon')  
    $(ele).find('.icon').addClass('show_icon')  
    let id = $(ele).attr('id')
    $(ele).parent().parent().find('.sub-category').css('display','none')
    $(`.sub-category-${id}`).css('display','block')
}
 


let lately_view_item_expiration_date = 1;
//최근본 아이템 최대 저장 개수
let lately_view_item_max_save_count = 16;
//최근본 아이템 페이징 사이즈
let lately_view_item_page_size = 4;

function isNull(obj){

    if(obj == '' || obj == null || obj == undefined || obj == NaN){ 
        return true;
    }else{
        return false;
    }
}
function setLocalStorage(name,obj){
    localStorage.setItem(name, obj);
}

function removeLocalStorage(name){
    localStorage.removeItem(name);
}

function getItemLocalStorage(name){
    return localStorage.getItem(name);
}
$(document).ready(function(){
 
    initLatelyViewItemList();
});

function initLatelyViewItemList(){
    //로컬스토리지에서 latelyViewItemList 로 저장된 정보가 있는지 확인후
    if(isNull(getItemLocalStorage('latelyViewItemList'))){ 
        //없을경우 공간 생성
        setLocalStorage('latelyViewItemList',null);
        //상품을 표시할 ul에 없을경우 화면 표시
        $(".recent-body").html('<div style="display: flex;justify-content: center;align-items: center;height: inherit;"> 찾아본<br><br>상품이<br><br>없습니다.</div>');
        //기존 정보가 있을 경우
    }else{
        //저장된 정보를 가져오고
        let latelyViewItemListJson = getItemLocalStorage('latelyViewItemList');
        //실제 저장된 데이터가 있는경우 
        if(latelyViewItemListJson != "null" || isNull(latelyViewItemListJson)){

            let nowDate = new Date();
            //문자열을 javascript 객체로 변환
            let latelyViewItemList = JSON.parse(latelyViewItemListJson);

            //일정시간 경과된 아이템을 제외하고 다시 넣기 위한 새로운 Array
            let latelyViewItemListNew = new Array();

            //상품 리스트를 돌면서 상품별 저장된 시간이 현재 시간보다 클경우만
            //다시 latelyViewItemListNew  에 추가
            for(let i in latelyViewItemList){
                let viewTime = new Date(latelyViewItemList[i].viewTime);
                //시간이 경과된경우 를 제외하고 재 저장
                if(nowDate.getTime() < viewTime.getTime()){
                    latelyViewItemListNew.push(latelyViewItemList[i]);
                }
            }

            //시간이 모두 경과된 경우 담긴 새로운 배열요소가 없으므로 로컬 스토                
            //리지를 비워줌.
            if(latelyViewItemListNew.length == 0){
                setLocalStorage('latelyViewItemList',null);
              //재저장
            }else{
                setLocalStorage('latelyViewItemList',JSON.stringify(latelyViewItemListNew));
            }

        }
            //화면 을 그리는 함수호출
        latelyViewItemRender(1);
    }
}

/**
 * 최근 본 상품 화면 셋팅(페이징)
 * @param list
 * @returns
 */
function latelyViewItemRender(ele){
   // alert(1)
    let page = 1;
    if($(ele).hasClass("lately_prev")){
        if($(".recent-footer .current_page").text() == "1"){
            return ;
        }else{
            page= +$(".recent-footer .current_page").text()-1
        }
    }
    if($(ele).hasClass("lately_next")){
        if($(".recent-footer .max_pages").text() == $(".recent-footer .current_page").text()){
            return ;
        }else{
            page= +$(".recent-footer .current_page").text() + 1
        }
    }
    //기본적으로 일단 상품리스트를 비움
    $(".recent-body").html("");

    //로컬스토리지에서 latelyViewItemList 값 확인
    if(getItemLocalStorage('latelyViewItemList') != "null" || isNull(getItemLocalStorage('latelyViewItemList'))){

        let latelyViewItemList = JSON.parse(getItemLocalStorage('latelyViewItemList'));

        //페이징을 해야하기때문에 전체 개수가 필요함
        let length = latelyViewItemList.length;
                    
        //최대 나올수 있는 페이지를 셋팅.
        let maxPage = length / lately_view_item_page_size;

        //페이징 처리부분 레이어 노출시킴
      //  $(".recent-body").css("display","block");
        $(".recently .prod_count").text(length);
        //함수호출시 전달받은 페이지 값으로 현재페이지 셋팅.
        $(".recent-footer .current_page").text(page);

        //최대 페이지 개수 셋팅
        $(".recent-footer .max_pages").text(Math.ceil(maxPage))


        //가져온 최근본상품리스트에서 노출해야할 인덱스을 구해서 노출
        for(let i = ((page-1) * lately_view_item_page_size); i < (page*lately_view_item_page_size); i++){
                            
            if(!isNull(latelyViewItemList[i])){
                //상품 그리는 부분
                if(latelyViewItemList[i].shoppingmall_kind =='447'){
                    $(".recent-body").append(
                        $("<div class='pic'>").append( 
                            $("<a>").attr("href", `${base_url}product_detail?productid=${latelyViewItemList[i].productid}&catid=${latelyViewItemList[i].catid}`)
                            .append($("<img>").attr("src",latelyViewItemList[i].image)
                            .attr("alt","최근본상품"))));
                }
                if(latelyViewItemList[i].shoppingmall_kind =='537'){
                    $(".recent-body").append(
                        $("<div class='pic'>").append( 
                            $("<a>").attr("href", `${base_url}ttc_product_detail?productid=${latelyViewItemList[i].productid}`)
                            .append($("<img>").attr("src",latelyViewItemList[i].image)
                            .attr("alt","최근본상품"))));
                }
                
            }
      }

    }else{
        //상품이 없을경우
        $(".recent-body").html('<div style="display: flex;justify-content: center;align-items: center;height: inherit;width: 74px;"> 찾아본<br><br>상품이<br><br>없습니다.</div>');
      //  $(".recently .prod_count").text(0);
        //함수호출시 전달받은 페이지 값으로 현재페이지 셋팅.
        $(".recent-footer .current_page").text(0);

        //최대 페이지 개수 셋팅
        $(".recent-footer .max_pages").text(0)
        //$("div#latelyViewItemListPageing_div").css("display","none");
    }

}

function closeAdvert(){
    $('.advert').css("display","none");
}
let html = document.documentElement
let html_client_width = 500;
window.addEventListener('resize',function(){
    if(html_client_width < html.clientWidth){
        return 
    }
    if(html.clientWidth <= 500){
        if(isMobile()){
            window.location.reload();
        }
    }
})
 
$(document).ready(function() {
    $('#favorite').on('click', function(e) {
        var bookmarkURL = window.location.href;
        var bookmarkTitle = document.title;
        var triggerDefault = false;

        if (window.sidebar && window.sidebar.addPanel) {
            // Firefox version < 23
            window.sidebar.addPanel(bookmarkTitle, bookmarkURL, '');
        } else if ((window.sidebar && (navigator.userAgent.toLowerCase().indexOf('firefox') > -1)) || (window.opera && window.print)) {
            // Firefox version >= 23 and Opera Hotlist
            var $this = $(this);
            $this.attr('href', bookmarkURL);
            $this.attr('title', bookmarkTitle);
            $this.attr('rel', 'sidebar');
            $this.off(e);
            triggerDefault = true;
        } else if (window.external && ('AddFavorite' in window.external)) {
            // IE Favorite
            window.external.AddFavorite(bookmarkURL, bookmarkTitle);
        } else {
            // WebKit - Safari/Chrome
            showDialogWarning((navigator.userAgent.toLowerCase().indexOf('mac') != -1 ? 'Cmd' : 'Ctrl') + '+D 키를 눌러 즐겨찾기에 등록하실 수 있습니다.', '', '', '확인', 'closeDialog();');
        }

        return triggerDefault;
    });
    let collapseMenu = document.querySelector('#collapseMenu')
    if(collapseMenu != undefined){ 
        collapseMenu.addEventListener('mouseleave',function(){
            $('.sec_nav .left p a')[0].classList.remove("menu-active")
            $('#collapseMenu')[0].classList.add('hidden-menu')
        })
    }
});
 
// 검색결과 리다이렉트
function redirectSearchResult() {
    if ($('#search-value').val().trim() == '') {
        showDialogWarning('검색어를 입력해주세요.', '', '', '확인', 'closeDialog();');
        return;
    }

    setAddNewSearchData();
}

// 최근검색어데이터 등록
function setAddNewSearchData() {
    var words = $('#search-value').val().trim();

    $.ajax({
        url: base_url + 'user/product/search_view/setAddNewSearchData',
        type: 'POST',
        data: {
            word: words
        },
        dataType: 'json',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        success: function(res) {
            // if (!res.success) {
            //     window.location.replace(base_url + 'logout?kind=search_view_setAddNewSearchData');
            //     return;
            // } else {
                //$('#recent-content').html(setInitNewSearch(res.success));
                window.location.href = base_url + 'search_result?word=' + words;
            // }
        }
    });
}
$(document).ready(function(){
   let memnus =  document.querySelectorAll('.my-info-menu')
   if(memnus.length!=0){ 
        document.querySelectorAll('.my-info-menu')[0].addEventListener('mouseenter',function(e){
            memnus[0].style ='display: none'

            memnus[1].style ='display:block' 
        })
        document.querySelectorAll('.my-info-menu')[1].addEventListener('mouseleave',function(e){
            memnus[1].style ='display: none'

            memnus[0].style ='display:block' 
        })
    }
});



function redirtProdDetail(shoppingmall_kind,prodid, imgurl, product_name, old_price, price_visible, sale_price, ttc_price, ttc_count, prod_rate, review_count, shipping_kind){
    let latelyViewItemListJson = getItemLocalStorage('latelyViewItemList');
    let viewTime = new Date();
    //최근 본 상품이 아얘 없을경우 무조건 저장
    if(latelyViewItemListJson == "null" || isNull(latelyViewItemListJson)){

        //사로 저장될 
        let latelyViewItemListNew = new Array();

        let latelyViewItem = {
            "productid" : prodid ,
            "image" : imgurl ,
            "viewTime" :viewTime.setDate(viewTime.getDate() + Number(lately_view_item_expiration_date)),
            "product_name" : product_name,
            "old_price" : old_price,
            "price_visible" : price_visible,
            "sale_price" : sale_price,
            "ttc_price" : ttc_price,
            "ttc_count" : ttc_count,
            "prod_rate" : prod_rate,
            "review_count" : review_count,
            "shipping_kind" : shipping_kind,
            'shoppingmall_kind':shoppingmall_kind, 
            'catid':$("#category-list").data('catid')
        }
        latelyViewItemListNew.unshift(latelyViewItem);
        setLocalStorage('latelyViewItemList',JSON.stringify(latelyViewItemListNew));
        //있을경우 
        }else{
            let latelyViewItemList = JSON.parse(latelyViewItemListJson);
            let isExistsItem = false;
            

            breakPoint :
            for(let i in latelyViewItemList){
                if(Number(latelyViewItemList[i].productid) == Number(prodid)){
                    isExistsItem = true; 
                    break breakPoint;
                }
            }
            //새로본 상품일경우만 저장
            if(!isExistsItem){
            
                //최대 16개 일경우 마지막꺼 삭제 후제일 앞에 저장
                if(latelyViewItemList.length == Number(lately_view_item_max_save_count)) {
                    latelyViewItemList.pop();
                }
                    
                
                let latelyViewItem = {
                    "productid" : prodid ,
                    "image" : imgurl ,
                    "viewTime" :viewTime.setDate(viewTime.getDate() + Number(lately_view_item_expiration_date)),
                    "product_name" : product_name,
                    "old_price" : old_price,
                    "price_visible" : price_visible,
                    "sale_price" : sale_price,
                    "ttc_price" : ttc_price,
                    "ttc_count" : ttc_count,
                    "prod_rate" : prod_rate,
                    "review_count" : review_count,
                    "shipping_kind" : shipping_kind,
                    'shoppingmall_kind':shoppingmall_kind, 
                    'catid':$("#category-list").data('catid')
                }
                latelyViewItemList.unshift(latelyViewItem);
                setLocalStorage('latelyViewItemList',JSON.stringify(latelyViewItemList));
            }
        
        }
        if(shoppingmall_kind == '447'){
            window.location.href=`${base_url}product_detail?productid=${prodid}&catid=${$("#category-list").data('catid')}` 

        }else if(shoppingmall_kind == '537'){
            window.location.href=`${base_url}ttc_product_detail?productid=${prodid}`  
        }
}

/*
function voids() {
    window.location.href=`${base_url}personal_policy`;
}
*/