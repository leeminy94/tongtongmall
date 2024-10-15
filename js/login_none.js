$(function() {
    $('#spinner_overay').css('display', 'none');
    $('#phone-number').trigger('focus');

    // 외부에서 통통몰을 호출한 경우 외부에서 들어온 폰번호를 자동으로 입력
    if (getCookie('other_index') != null) {
        $('#phone-number').val(getCookie('other_index'));
    }

    // 안드로이드라면 폰에서 폰번호 얻기
    /* if (agent.search('app_android') != -1) {
        var phone_number = tongtongmall.getPhoneNumber();
        $('#phone-number').val(phone_number);
    } */

    if ($('#phone-number').val().length >= 10) {
        $('.btn-45-none').addClass('active');
        $('.btn-45-none').addClass('pointer');
        $('.btn-45-none').attr('onclick', 'getUserInfo();');
    }
});

/*비회원 기능 */
$(function() {
    $('#spinner_overay').css('display', 'none');
    $('#phone-number2').trigger('focus');

    // 외부에서 통통몰을 호출한 경우 외부에서 들어온 폰번호를 자동으로 입력
    if (getCookie('other_index') != null) {
        $('#phone-number2').val(getCookie('other_index'));
    }

    // 안드로이드라면 폰에서 폰번호 얻기
    /* if (agent.search('app_android') != -1) {
        var phone_number = tongtongmall.getPhoneNumber();
        $('#phone-number2').val(phone_number);
    } */

    if ($('#phone-number2').val().length >= 10) {
        $('.btn-45-none2').addClass('active');
        $('.btn-45-none2').addClass('pointer');
        $('.btn-45-none2').attr('onclick', 'getUserInfo2();');
    }
});

// 폰번호 입력시 해당 버튼 활성화
function setInputValue(element) {
    $(element).val($(element).val().replace(/[^0-9]/g, '').substr(0, 11));

    if ($(element).val().length >= 10) {
        $('.btn-45-none').addClass('active');
        $('.btn-45-none').addClass('pointer');
        $('.btn-45-none').attr('onclick', 'getUserInfo();');
    } else {
        $('.btn-45-none').removeClass('active');
        $('.btn-45-none').removeClass('pointer');
        $('.btn-45-none').attr('onclick', '');
    }
}

// 비회원 폰번호 입력시 해당 버튼 활성화
function setInputValue2(element) {
    $(element).val($(element).val().replace(/[^0-9]/g, '').substr(0, 11));

    if ($(element).val().length >= 10) {
        $('.btn-45-none2').addClass('active');
        $('.btn-45-none2').addClass('pointer');
        $('.btn-45-none2').attr('onclick', 'getUserInfo2();');
    } else {
        $('.btn-45-none2').removeClass('active');
        $('.btn-45-none2').removeClass('pointer');
        $('.btn-45-none2').attr('onclick', '');
    }
}


// 회원정보 얻기
function getUserInfo() {
    var phone_number = '';
    var regExp = /^\d{2,3}\d{3,4}\d{4}$/;

    if (regExp.test($('#phone-number').val())) {
        if ($('#phone-number').val().slice(0, 1) != 0) {
            phone_number = '0' + $('#phone-number').val();
        } else {
            phone_number = $('#phone-number').val();
        }
    } else {
        showDialogWarning('유효하지 않은 전화번호 입니다.', '', '', '확인', 'closeDialog();');
        return;
    }

    $('#phone-number').val(phone_number);
    $('#spinner_overay').css('display', 'block');

    setTimeout(function() {
        $.ajax({
            url: base_url + 'user/oneid/login/getUserInfo',
            type: 'POST',
            dataType: 'json',
            data: {
                phone: phone_number
            },
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            async: false,
            success: function(res) {
                setCookie('phone', phone_number);

                // 탈퇴회원이라면
                if (res.out) {
                    $('#spinner_overay').css('display', 'none');
                    showDialogWarning('통통몰 관리자에 의해<br>탈퇴된 회원입니다.', res.out + '일 이후에<br>재가입을 할수 있습니다.', 'center', '확인', 'closeDialog();');
                    return;
                }

                // 통통몰과 통통앱에 가입되어있지 않다면 회원가입으로 이동
                if (res.tongtong.length == 0 && res.mall.length == 0) {
                    $('#spinner_overay').css('display', 'none');
                    showDialogWarning('일치하는 회원정보가 없습니다.', '통통몰에 가입하고<br>다양한 상품을 만나보세요!', 'center', '회원가입하기', 'redirectRegister();');
                    return;
                }

                // 통통몰에 가입되어있고 통통앱에 가입되어 있지 않다면 통통몰의 사용자명을 쿠키에 보관
                if (res.tongtong.length == 0 && res.mall.length != 0) {
                    setTimeout(function() {
                        $('#spinner_overay').css('display', 'none');
                    }, 3000);

                    window.location.href = base_url + 'policy_agree?type=login&index=';
                }

                // 통통몰에 가입되어있지 않고 통통앱에 가입되어 있다면 통통앱의 유저키를 쿠키에 보관
                if (res.tongtong.length != 0 && res.mall.length == 0) {
                    setTimeout(function() {
                        $('#spinner_overay').css('display', 'none');
                    }, 3000);

                    window.location.href = base_url + 'policy_tongtongmall';
                }

                // 통통앱과 통통몰에 가입되어 있다면 통통앱의 유저키와 닉네임을 쿠키에 보관
                if (res.tongtong.length != 0 && res.mall.length != 0) {
                    setTimeout(function() {
                        $('#spinner_overay').css('display', 'none');
                    }, 3000);
                    window.location.href = base_url + 'password_input?type=all';
                }
            }
        });
    }, 50);
}

// 비회원정보 얻기
function getUserInfo2() {
    var phone_number2 = '';
    var regExp = /^\d{2,3}\d{3,4}\d{4}$/;

    if (regExp.test($('#phone-number2').val())) {
        if ($('#phone-number2').val().slice(0, 1) != 0) {
            phone_number2 = '0' + $('#phone-number2').val();
        } else {
            phone_number2 = $('#phone-number2').val();
        }
    } else {
        showDialogWarning('유효하지 않은 전화번호 입니다.', '', '', '확인', 'closeDialog();');
        return;
    }

    $('#phone-number2').val(phone_number2);
    $('#spinner_overay').css('display', 'block');

    setTimeout(function() {
        $.ajax({
            url: base_url + 'user/oneid/login/getUserInfo',
            type: 'POST',
            dataType: 'json',
            data: {
                phone: phone_number2
            },
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            async: false,
            success: function(res) {
                setCookie('phone', phone_number2);

                // 탈퇴회원이라면
                if (res.out) {
                    $('#spinner_overay').css('display', 'none');
                    showDialogWarning('통통몰 관리자에 의해<br>탈퇴된 회원입니다.', res.out + '일 이후에<br>재가입을 할수 있습니다.', 'center', '확인', 'closeDialog();');
                    return;
                }

                // 통통몰과 통통앱에 가입되어있지 않다면 회원가입으로 이동
                if (res.tongtong.length == 0 && res.mall.length == 0) {
                    $('#spinner_overay').css('display', 'none');
                    showDialogWarning('일치하는 회원정보가 없습니다.', '통통몰에 가입하고<br>다양한 상품을 만나보세요!', 'center', '회원가입하기', 'redirectRegister();');
                    return;
                }

                // 통통몰에 가입되어있고 통통앱에 가입되어 있지 않다면 통통몰의 사용자명을 쿠키에 보관
                if (res.tongtong.length == 0 && res.mall.length != 0) {
                    setTimeout(function() {
                        $('#spinner_overay').css('display', 'none');
                    }, 3000);

                    window.location.href = base_url + 'policy_agree?type=login&index=';
                }

                // 통통몰에 가입되어있지 않고 통통앱에 가입되어 있다면 통통앱의 유저키를 쿠키에 보관
                if (res.tongtong.length != 0 && res.mall.length == 0) {
                    setTimeout(function() {
                        $('#spinner_overay').css('display', 'none');
                    }, 3000);

                    window.location.href = base_url + 'policy_tongtongmall';
                }

                // 통통앱과 통통몰에 가입되어 있다면 통통앱의 유저키와 닉네임을 쿠키에 보관
                if (res.tongtong.length != 0 && res.mall.length != 0) {
                    setTimeout(function() {
                        $('#spinner_overay').css('display', 'none');
                    }, 3000);
                    window.location.href = base_url + 'password_input?type=all';
                }
            }
        });
    }, 50);
}



// 인증번호요청페이지에로 리다이렉트
function redirectRegister() {
    window.location.href = base_url + 'auth_request?type=register&index=';
}

function setRegister(element) {
    $(element).addClass('active');
    window.location.href = base_url + 'auth_request?type=register&index=';
}