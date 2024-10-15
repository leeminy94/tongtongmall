let page = 1;
let swiper_1;
let question_type = ''; // 문의유형
let security = '313'; // 비밀글
let total_question = 0;
let totalCoupon = 0; // 쿠폰할인가격
let couponId = 0; // 쿠폰아이디
let couponData = []; // 쿠폰데이터
let goodsPrice = 0; // 상품가격
let goodsId = 0; // 상품아이디
let categoryId = 0; // 카테고리아이디
let subCategoryId = 0; // 서브카테고리아이디
let interval = '';
let productid ="";
let sort_index = 'new';
let type_inquiry_index = 'all';
let selectInquiryPage = 1
let selectInquiryType = "all"
$(function() {
    $('#spinner_overay').css('display', 'none');
    productid = $('#product-detail').data('productid');
    total_question = parseInt($('#product-detail').data('question'));

    if ($('#courier-desc').length != 0) {
        $('#courier-desc').css('height', document.getElementById("courier-desc").scrollHeight);
    }

    if ($('#return-desc').length != 0) {
        $('#return-desc').css('height', document.getElementById("return-desc").scrollHeight);
    }

    if ($('#prod-serv-desc').length != 0) {
        $('#prod-serv-desc').css('height', document.getElementById("prod-serv-desc").scrollHeight);
    }

    if (getCookie('runapp') == null) {
        if (agent.search('app_iphone') == -1 && agent.search('app_android') == -1) {
            if (navigator.userAgent.match(/android/i)) { // 안드로이드라면
                showRunAppView('android', 'Intent://detail?' + encodeURIComponent(base_url + 'product_detail?productid=' + productid) + '#Intent;scheme=tongtongmall;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.tongtong.tongtongmall1;end');
            } else if (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) { // 아이폰이라면
                var url = encodeURIComponent(base_url + 'product_detail?productid=' + productid);
                showRunAppView('iphone', 'tongtongmall://detail?' + url);
            }
        }
    }

    swiper_1 = new Swiper('#swiper-1', {
        direction: 'horizontal',
        spaceBetween: 5,
        centeredSlides: true,
        pagination: {
            el: '.paging',
            type: 'fraction'
        }
    });

    // 해당 섹션에 따르는 스와이프 정의
    for (var i = 2; i < 9; i++) {
        new Swiper('#swiper-' + i, {
            direction: 'horizontal',
            slidesPerView: 'auto',
            spaceBetween: 9,
            freeMode: true
        });
    }

    var thumb_pos = $('#swiper-1').data('thumb');

    if (page == thumb_pos) {
        $('.coin-event').css('display', 'block');
    }

    swiper_1.on('slideChange', function() {
        page = $('.swiper-pagination-current').text();

        if (page == thumb_pos) {
            $('.coin-event').css('display', 'block');
        } else {
            $('.coin-event').css('display', 'none');
        }
    });

    initVideo();
    initReviewAllVideo();
    initReviewVideo();
    initPopupDialogVideo();


    $('#meta-desc').attr('content', $('#product-detail').data('prodname'));
    $('#meta-keyword').attr('content', $('#product-detail').data('prodname').split(' ').join(','));
    setCookie('meta_title', $('#product-detail').data('prodname'));
    setCookie('meta_content', $('#product-detail').data('prodname').split(' ').join(','));

    // 쿠폰상태
    if ($('#product-detail').data('userid') != '') {
        goodsPrice = $('#product-detail').data('prodprice');
        goodsId = $('#product-detail').data('prodid');
        categoryId = $('#product-detail').data('catid');
        subCategoryId = $('#product-detail').data('subcatid');
        getCouponData();
    }

    if ($('#product-detail').data('salestatus') === 533) {
        interval = setInterval('countTime()', 1000);
    }
    $(document).on("scroll", onScroll);

    
    $(".more-review").each(function() {  
        $('.more-review').click(function(event) {
            event.preventDefault();
            event.stopPropagation(); 
          //  alert('1')
          $('#more-dialog').css("display","block");
        }); 
    }); 
});
function closeReivewMoreDialog(){
    $('#more-dialog').css("display","none");
}
// 상품상세이미지 보기
var swiper_main;

function setShowMainDetailImage(position) {
    $('#swiper-main').css('display', 'block');

    swiper_main = new Swiper('#swiper-main .swiper-container', {
        direction: 'horizontal',
        spaceBetween: 5,
        centeredSlides: true,
        zoom: true,
        pagination: {
            el: '.paging',
            type: 'fraction'
        }
    });

    swiper_main.slideTo(position);
}

// 상품상세이미지 닫기
function setCloseMainDetailImage() {
    $('#swiper-main').css('display', 'none');
    swiper_main.zoom.out();
}

// 환불규정 다이얼로그
function setShowHwanBulDialog() {
    $('body').css('overflow', 'hidden');
    $('body').on('scroll touchmove mousewheel', function(e) {
        return;
    });

    $('.dialog-overlay').fadeIn();
    $('.dialog-normal-return').fadeIn();

    $('#return-desc').css('height', document.getElementById("return-desc").scrollHeight);
}

// 공동구매 다이얼로그
function setShowGroupBuy(content) {
    showDialogWarning('통통몰 공동구매 규정 안내', content, 'center', '확인', 'closeDialog();');
}

// 구매혜택 다이얼로그
function showDialogPurchase(tongtongmail, reward) {
    showDialogWarning('구매 혜택 안내<br><br><span style="color: #de322a;">' + tongtongmail + '통통마일</span> 적립!', '총 결제금액이 3만원 이상 시,<br>결제금액의 ' + reward + '%를 통통마일로<br>적립해드립니다.<br><b>(통통코인/통통머니 결제 시 3%<br>추가 적립)</b><br><br>통통마일은 통통마일몰에서<br>사용이 가능합니다.', 'center', '확인', 'closeDialog();');
}

// 관련동영상 초기설정
function initVideo() {
    var block = $('#swiper-5 > .swiper-wrapper > .swiper-slide');

    $(block).each(function(index) {
        var video = $(this).find('#video');
        video[0].pause();
        video[0].currentTime = 0.1;
        $(this).find('img').css('display', 'block');
        $(this).find('#duration').css('display', 'block');

        setInterval(function() {
            var duration = video[0].duration;
            var minute = addZero(parseInt((duration % 3600) / 60));
            var second = addZero(parseInt(duration) % 60);
            if (minute != undefined && second != undefined) {
                $('#swiper-5 > .swiper-wrapper > .swiper-slide:nth-child(' + (index + 1) + ')').find('#duration').text(minute + ':' + second);
            }
        }, 500);
    });
}

// 관련동영상 플레이 버튼 클릭
function playVideo(element) {
    var block = $('#swiper-5 > .swiper-wrapper > .swiper-slide');

    $(block).each(function(index) {
        var video = $(this).find('#video');
        video[0].pause();
        video[0].currentTime = 0.1;
        $(this).find('img').css('display', 'block');
        $(this).find('#duration').css('display', 'block');
    });

    $(element).css('display', 'none');
    $(element).parent().find('#duration').css('display', 'none');
    var video = $(element).parent().find('#video');
    video[0].play();
}

// 상품설명탭
function setSection(element, index, cnt) {
    setCookie('detail_kind', index);
    $(element).parent().parent().find('.prod-tab').removeClass('active');
    $(element).addClass('active');
    $('#product-explain').css('display', 'none');
    $('#product-caution').css('display', 'none');
    $('#product-review').css('display', 'none');
    $('#product-question').css('display', 'none');

    switch (index) {
        case '0': // 상품설명
            $('#product-explain').css('display', 'block');

            if ($('#prod-serv-desc').length != 0) {
                $('#prod-serv-desc').css('height', document.getElementById("prod-serv-desc").scrollHeight);
            }
            break;
        case '1': // 주의사항
            $('#product-caution').css('display', 'block');

            if ($('#courier-desc').length != 0) {
                $('#courier-desc').css('height', document.getElementById("courier-desc").scrollHeight);
            }

            if ($('#return-desc').length != 0) {
                $('#return-desc').css('height', document.getElementById("return-desc").scrollHeight);
            }
            break;
        case '2': // 후기
            $('#product-review').css('display', 'block');
            initReviewAllVideo();
            initReviewVideo();
            break;
        case '3': // 문의
            $('#product-question').css('display', 'block');
            break;
    }
}

// 구매후기 전체이미지 상세보기
var swiper_detail;

function setReivewAllImage(position) {
    $('#swiper-all-image').css('display', 'block');
    swiper_detail = new Swiper('#swiper-all-image .swiper-container', {
        direction: 'horizontal',
        spaceBetween: 5,
        centeredSlides: true,
        zoom: true,
        on: {
            init: function() {
                getDetailDataSwiper(this, 'all');
            }
        }
    });

    
    swiper_detail.on('slideNextTransitionEnd', function() { 
        getDetailDataSwiper(this, 'all');  
    });
    swiper_detail.on('slidePrevTransitionEnd', function() { 
        getDetailDataSwiper(this, 'all');  
    });
    initReviewAllVideo();
    swiper_detail.slideTo(position);
}

function setPopDialogVideo(position) {
    $('#setPopDialogVideo').css('display', 'block');
    swiper_detail = new Swiper('#setPopDialogVideo .swiper-container', {
        direction: 'horizontal',
        spaceBetween: 5,
        centeredSlides: true,
        zoom: true,
        on: {
            init: function() {
                getDetailDataSwiper(this, 'setPopDialogVideo');
            }
        }
    });

   
    swiper_detail.on('slideNextTransitionEnd', function() { 
         getDetailDataSwiper(this, 'setPopDialogVideo');  
     });
     swiper_detail.on('slidePrevTransitionEnd', function() { 
         getDetailDataSwiper(this, 'setPopDialogVideo');  
     });
    initReviewAllVideo();
    swiper_detail.slideTo(position);
}
function setPopDialogImage(position) {
    $('#setPopDialogImage').css('display', 'block');
    swiper_detail = new Swiper('#setPopDialogImage .swiper-container', {
        direction: 'horizontal',
        spaceBetween: 5,
        centeredSlides: true,
        zoom: true,
        on: {
            init: function() {
                getDetailDataSwiper(this, 'setPopDialogImage');
            }
        }
    });

    
    swiper_detail.on('slideNextTransitionEnd', function() {
      
        getDetailDataSwiper(this, 'setPopDialogImage'); 

    });
    swiper_detail.on('slidePrevTransitionEnd', function() {
    
        getDetailDataSwiper(this, 'setPopDialogImage');  
    });
     
    swiper_detail.slideTo(position);
}
function gotoTop(){
    $('#more-dialog').animate({
        scrollTop: 0
    }, 0);
}
function closeReivewAllImage(){
    $('#swiper-all-image').css('display', 'none');
    $('#setPopDialogVideo').css('display', 'none');
    $('#setPopDialogImage').css('display', 'none');
    $('#swiper-image').css('display', 'none');
    $('.review-image-detail').css('display','none')

}

// 구매후기 전체 이미지/동영상 초기화
function initReviewAllVideo() {
    var video_1 = $('#review-all .video-all');
    var video_2 = $('#swiper-all-image > .swiper-container > .swiper-wrapper > .swiper-slide > video');
    var video_3 = $('#review-content video');
    $(video_1).each(function() {
        $(this)[0].pause();
        $(this)[0].currentTime = 0.2;

        setInterval(function() {
            var duration = video_2[0].duration;
            var minute = addZero(parseInt((duration % 3600) / 60));
            var second = addZero(parseInt(duration) % 60);
            if (minute != undefined && second != undefined) {
                $('#review-all > .row').find('.review-duration-1').text(minute + ':' + second);
            }
        }, 500);
    });
    var video_3_1 = $('#review-content video');
    
      $(video_3_1).each(function() {
        $(this)[0].pause();
        $(this)[0].currentTime = 0.2;

        setInterval(function() {
            var duration = video_3[0].duration;
            var minute = addZero(parseInt((duration % 3600) / 60));
            var second = addZero(parseInt(duration) % 60);
            if (minute != undefined && second != undefined) {
                $('#prod-tab-review').find('.review-duration-2').text(minute + ':' + second);
            }
        }, 500);
    });
    $(video_2).each(function() {
        $(this)[0].pause();
        $(this)[0].currentTime = 0.2;
    });
   
}
function initPopupDialogVideo() {
    var video_1 = $('#more-dialog .video-content video');
    // var video_2 = $('#swiper-all-image > .swiper-container > .swiper-wrapper > .swiper-slide > video');

    $(video_1).each(function() {
        $(this)[0].pause();
        $(this)[0].currentTime = 0.2;

        setInterval(function() {
            var duration = video_1[0].duration;
            var minute = addZero(parseInt((duration % 3600) / 60));
            var second = addZero(parseInt(duration) % 60);
            if (minute != undefined && second != undefined) {
                $('#more-dialog .video-duration').text(minute + ':' + second);
            }
        }, 500);
    });
    
}
// 해당 구매후기 동영상 초기화
function initReviewVideo() {
    var video_1 = $('.review-image-detail > .swiper-container > .swiper-wrapper > .swiper-slide > video');
    var video_2 = $('.detail-container .prod-tab-review .review-count-content .review-all-container .review-item').find('video');

    $(video_1).each(function() {
        $(this)[0].pause();
        $(this)[0].currentTime = 0.2;
    });
    $(video_2).each(function() {
        $(this)[0].pause();
        $(this)[0].currentTime = 0.2;

        setInterval(function() {
            var duration = video_2[0].duration;
            var minute = addZero(parseInt((duration % 3600) / 60));
            var second = addZero(parseInt(duration) % 60);
            if (minute != undefined && second != undefined) {
                $('.detail-container .prod-tab-review .review-count-content .review-all-container .review-item').find('#duration').text(minute + ':' + second);
            }
        }, 500);
    });
}

// 해당 구매후기 이미지 상세보기
var swiper_review;

function setReivewDetailImage(element, position) {
    swiper_review = {};
    $(element).parent().parent().find('.review-image-detail').css('display', 'block');
    swiper_review = new Swiper($(element).parent().parent().find('.swiper-container'), {
        direction: 'horizontal',
        spaceBetween: 5,
        centeredSlides: true,
        zoom: true,
        on: {
            init: function() {
                getDetailDataSwiper(this, 'review', element);
            }
        }
    });

    swiper_review.on('slideChange', function() {
        getDetailDataSwiper(this, 'review');
        initReviewVideo();
    });
    initReviewVideo();
    swiper_review.slideTo(position);
}
function setReivewImages(id,position) {
    $(`#swiper-image${id}`).css('display', 'block'); 
    console.log(`#swiper-image${id}`)
    swiper_detail = new Swiper(`#swiper-image${id}  .swiper-container`, {
        direction: 'horizontal',
        spaceBetween: 5,
        centeredSlides: true,
        zoom: true,
        on: {
            init: function() {
                getDetailDataSwiper(this,`swiper-image${id}`,position);
            }
        }
    });
    swiper_detail.on('slideChange', function() {
        getDetailDataSwiper(this, `swiper-image${id}`);
        
    });
   
    swiper_detail.slideTo(position);
}
// 구매후기 상세보기 내용
 
function getDetailDataSwiper(element, index, elem) {
    var html = '';
    let name = '';
    
    console.log(String($(element.$wrapperEl[0]).find('.swiper-slide-active').data('name')))
    console.log("name"+String($(element.$wrapperEl[0]).find('.swiper-slide-active').data('name')).trim())
    console.log("nickname"+String($(element.$wrapperEl[0]).find('.swiper-slide-active').data('nickname')).trim())
    console.log("cdate"+String($(element.$wrapperEl[0]).find('.swiper-slide-active').data('cdate')).trim())
    console.log("rate"+$(element.$wrapperEl[0]).find('.swiper-slide-active').data('rate'))
    console.log("title"+$(element.$wrapperEl[0]).find('.swiper-slide-active').data('title'))
    console.log("content"+$(element.$wrapperEl[0]).find('.swiper-slide-active').data('content'))

    console.log("img"+$(element.$wrapperEl[0]).find('.swiper-slide-active').data('img'))
    let className = '.swiper-slide-next';
        className = '.swiper-slide-active'
    if ($(element.$wrapperEl[0]).find(className).data('nickname') != '') {
        name = String($(element.$wrapperEl[0]).find(className).data('nickname')).trim().slice(0, 1) + '*' + String($(element.$wrapperEl[0]).find(className).data('nickname')).slice(String($(element.$wrapperEl[0]).find(className).data('nickname')).length - 1);
    } else {
        name = String($(element.$wrapperEl[0]).find(className).data('name')).trim().slice(0, 1) + '*' + String($(element.$wrapperEl[0]).find(className).data('name')).slice(String($(element.$wrapperEl[0]).find(className).data('name')).length - 1);
    }

    var date = String($(element.$wrapperEl[0]).find(className).data('cdate')).split('-')[0] + '.' + String($(element.$wrapperEl[0]).find(className).data('cdate')).split('-')[1] + '.' + String($(element.$wrapperEl[0]).find(className).data('cdate')).split('-')[2];
    var rate = $(element.$wrapperEl[0]).find(className).data('rate');
    var title = $(element.$wrapperEl[0]).find(className).data('title');
    var content = $(element.$wrapperEl[0]).find(className).data('content');
  
    html += '<div class="pos-fix font-white-12" style="top: 882px; z-index: 16000;">' + name + '&nbsp;&nbsp;&nbsp;' + date.split(' ')[0] + '</div>';
    html += '<div class="ratebox-4 pos-fix" data-id="1" data-rating="' + rate + '" style="top: 910px; z-index: 16000;"></div>';
    html += '<div class="pos-fix font-white-15 mb-15" style="top: 963px; z-index: 16000; max-width: 470px;">' + title + '</div>';
    html += '<div class="pos-fix font-white-12 mr-10" style="top: 1030px; z-index: 16000; line-height: 1.2; max-width: 470px;">' + content + '</div>';

    if (index == 'all') {
        $('#swiper-content-all').html(html);
    } else if(index == 'setPopDialogVideo') {
        $('#setPopDialogVideo-review').html(html);
     } else if(index == 'setPopDialogImage') {
        $('#setPopDialogImage-review').html(html);
      //
    }else{
        $(`#${index}-review`).html(html);
     }

    $('.ratebox-4').raterater({
        starWidth: 14,
        spaceWidth: 4,
        numStars: 5,
        isStatic: true,
        step: false
    });
}

// 구매후기 상세이미지 닫기
function setCancelReviewDetailImage(element, index) {
    if (index == 'all') {
        initReviewAllVideo();
        swiper_detail.zoom.out();
        $('#swiper-all-image').css('display', 'none');
    } else {
        initReviewVideo();
        swiper_review.zoom.out();
        $(element).parent().parent().css('display', 'none');
    }
}

// 구매후기 댓글클릭
function setViewReviewComment(element) {
    var value = $(element).parent().find('#comment-content').attr('style');
    if (value.search('display: none') != -1) {
        $(element).parent().find('#comment-content').slideDown(200);
    } else {
        $(element).parent().find('#comment-content').slideUp(200);
    }
}

// 구매후기 더보기
// 구매후기 더보기 클릭 시 뷰에 보여지는 오프셋
//var limit = 6;

function setViewMoreReview(productid) {
    $.ajax({
        url: base_url + 'user/product/product_detail/setViewMoreReview',
        type: 'POST',
        data: {
            productid: productid,
            limit: limit + 5
        },
        dataType: 'json',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        success: function(res) {
            $('#image-content').html(initReviewTemplate(res));
            
        }
    });
}

let videoLimit = 6;
// 구매후기 더보기 닫기
function setViewMoreReviewVideo(productid){
    $.ajax({
        url: base_url + 'user/product/product_detail/setViewMoreReviewImage',
        type: 'POST',
        data: {
            productid: productid,
            limit: videoLimit + 6,
            kind : 1
        },
        dataType: 'json',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        success: function(res) {
            $('#video-content').html(initReviewVideoTemplate(res));
          
        }
    });
}
function setViewMoreReviewVideoClose(productid){
    $.ajax({
        url: base_url + 'user/product/product_detail/setViewMoreReviewImage',
        type: 'POST',
        data: {
            productid: productid,
            limit: videoLimit,
            kind : 1
        },
        dataType: 'json',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        success: function(res) {
            $('#video-content').html(initReviewVideoTemplate(res));
           
        }
    });
}
let limit = 24;
function setViewMoreReviewImage(productid) {
    $.ajax({
        url: base_url + 'user/product/product_detail/setViewMoreReviewImage',
        type: 'POST',
        data: {
            productid: productid,
            limit: limit + 6,
            kind : 0
        },
        dataType: 'json',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        success: function(res) {
            $('#image-content').html(initReviewImageTemplate(res));
            
        }
    });
}

function setViewMoreReviewImageClose(productid){
    $.ajax({
        url: base_url + 'user/product/product_detail/setViewMoreReviewImage',
        type: 'POST',
        data: {
            productid: productid,
            limit: 24,
            kind : 0
        },
        dataType: 'json',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        success: function(res) {
            $('#image-content').html(initReviewImageTemplate(res)); 
            $('#moreImageView').html('더보기')
            $('#moreImageView').attr('onclick', `setViewMoreReviewImageClose(${productid})`);
            $('#more-dialog').css('height','1180px !important;')
        }
    });
}
// 구매후기 템플릿
function initReviewVideoTemplate(res) {
    var html = '';
     let count = $('#video-content').data('videoposition')
    if(res.image.length == count){
        //all image
        $('#moreVideoView').html('더보기 접기')
        $('#moreVideoView').attr('onclick', `setViewMoreReviewVideoClose(${productid})`);
    }
    for (var i = 0; i < res.image.length; i++) {
             if(i == 6){
                $('#more-dialog').css('height',(parseFloat($('#more-dialog').css('height')) + 142)+'px')
             }
            html +=`  
            <div class="video-item pointer"  onclick="setPopDialogVideo('${i}');">
                <div id="duration" class="pos-ab video-duration">00:00</div> 
                <video autoplay="false" preload="metadata" poster=""  style="width: 100%; height:100%; object-fit: fill;">
                    <source src="${ base_image + res.image[i].url}#t=0.2" type="video/mp4">
                </video>
            </div>
            `;
            
    }

    return html;
}
function initReviewImageTemplate(res) {
    var html = '';
     let count = $('#image-content').data('imageposition')
    if(res.image.length == count){
        //all image
        $('#moreImageView').html('더보기 접기')
        $('#moreImageView').attr('onclick', `setViewMoreReviewImageClose(${productid})`);
    }
    for (var i = 0; i < res.image.length; i++) {
             if(i == 6){
                $('#more-dialog').css('height',(parseFloat($('#more-dialog').css('height')) + 142)+'px')
                // $('more-dialog-container').css('height',(parseFloat($('#more-dialog').css('height')) + 142)+'px')
            }
            html +=`  
                <div class="image-item pointer"  onclick="setPopDialogImage('${i}');"> 
                    <img  src=" ${ base_image + res.image[i].url}"   alt="">
                </div>
            `; 
    }

    return html;
}

// 상품문의 입력창 비노출
function setCancelInputQuestion() {
    $('#btn-quest').css('display', 'block');
    $('#secret').css('display', 'none');
    $('#input-quest').css('display', 'none');
    $('#input-quest > textarea').val('');
    $('#check-security').prop('checked', false);
}

function sendEmail() {
    $.ajax({
        url: base_url + 'user/product/product_detail/sendEmail',
        type: 'POST',
        dataType: 'json',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: true,
        success: function(res) {
            console.log(res);
        }
    });
}

function setDeleteQuestion(questid, productid, userid) {
    $.ajax({
        url: base_url + 'user/product/product_detail/setDeleteQuestion',
        type: 'POST',
        data: {
            questid: questid
        },
        dataType: 'json',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        success: function(res) {
            closeDialog();

            setTimeout(function() {
                setQuestionType()
              
            }, 500);
        }
    });
}

function setSecurity(element, productid, userid) {
    if ($(element).is(':checked')) {
        security = '312';
    } else {
        security = '313';
    }

    setViewQuestion(productid, userid, limit_quest, 'view');
}

function setQuestionType(element, productid, userid) {
    question_type = $(element).val();
    setViewQuestion(productid, userid, limit_quest, 'view');
}

// 상품문의 내용
var limit_quest = 3;

function setViewQuestion(productid, userid, cnt, idx) {
    if (idx == 'more') {
        limit_quest += 5;
    } else {
        limit_quest = cnt;
    }

    $.ajax({
        url: base_url + 'user/product/product_detail/setViewQuestion',
        type: 'POST',
        data: {
            productid: productid,
            limit: limit_quest,
            security: security,
            type: question_type
        },
        dataType: 'json',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        success: function(res) {
            if (res.question.length < 3 || limit_quest >= total_question) {
                $('#more-quest-ready').css('display', 'none');
            } else {
                $('#more-quest-ready').css('display', 'block');
            }
            $('#question-content').html(initQuestionTemplate(res, userid, productid));
        }
    });
}

// 구매후기 템플릿
function initQuestionTemplate(res, userid, productid) {
    var html = '';

    for (var i = 0; i < res.question.length; i++) {
        html += '<div id="question" class="mt-24 border-btm pb-10">';
        html += '<div class="row">';
        if (res.question[i].issecurity == '312') {
            html += '<img class="fl" src="' + base_url + 'assets/user/images/ico_security.png" alt="" style="width: 24px;">';
        } else {
            html += '<img class="fl" src="' + base_url + 'assets/user/images/ico_question.png" alt="" style="width: 24px;">';
        }
        html += '<div class="fl ml-6 font-999-12 mt-5">' + res.question[i].username.trim().slice(0, 1) + '*' + res.question[i].username.trim().slice(res.question[i].username.trim().length - 1, res.question[i].username.trim().length) + '</div>';
        var isexist = false;
        for (var j = 0; j < res.comment.length; j++) {
            if (res.comment[j].parent == res.question[i].pquestionid) {
                isexist = true;
            }
        }
        html += '<div class="fr font-999-12 ml-10 pointer" onclick="showDialogSetting(' + "'삭제하시겠습니까?'" + ', ' + "''" + ', ' + "'취소'" + ', ' + "'삭제'" + ', ' + "'closeDialog();'" + ', ' + "'setDeleteQuestion(" + res.question[i].pquestionid + ", " + productid + ", " + userid + ");'" + ');">삭제</div>';
        if (!isexist) {
            html += '<div class="fr font-222-12 pointer" onclick="window.location.href=' + "'" + base_url + "product_question?productid=" + productid + "&questid=" + res.question[i].pquestionid + "'" + '">수정</div>';
        }
        html += '</div>';
        html += '<div class="font-999-12" style="margin-left: 28px;">' + res.question[i].cdate.replace(/[-]/gi, '.') + '</div>';
        if (res.question[i].userid == userid && res.question[i].issecurity == '312') {
            html += '<div class="font-333-12 mt-15 line-height-2" style="word-break: break-all;"><span class="font-default-12">[' + res.question[i].type_prod + ']</span>&nbsp;비밀글입니다. ' + res.question[i].content + '</div>';
            html += '<div id="quest-comment" style="display: block;">';
        } else if (res.question[i].userid != userid && res.question[i].issecurity == '312') {
            html += '<div class="font-333-12 mt-15 line-height-2" style="word-break: break-all;"><span class="font-default-12">[' + res.question[i].type_prod + ']</span>&nbsp;비밀글입니다.</div>';
            html += '<div id="quest-comment" style="display: none;">';
        } else {
            html += '<div class="font-333-12 mt-15 line-height-2" style="word-break: break-all;"><span class="font-default-12">[' + res.question[i].type_prod + ']</span>&nbsp;' + res.question[i].content + '</div>';
            html += '<div id="quest-comment" style="display: block;">';
        }
        html += '<div id="content">';
        for (var j = 0; j < res.comment.length; j++) {
            if (res.comment[j].parent == res.question[i].pquestionid) {
                html += '<div class="row mt-15">';
                html += '<div class="row">';
                html += '<img class="fl" src="' + base_url + 'assets/user/images/ico_answer.png" alt="" style="width: 39px; height: 24px;">';
                html += '<div class="fl ml-6 font-999-12 mt-5">관리자</div>';
                html += '</div>';
                html += '<div class="font-999-12" style="margin-left: 44px;">' + res.comment[j].cdate.replace(/[-]/gi, '.') + '</div>';
                html += '<div class="font-333-12 mt-15 line-height-2" style="word-break: break-all;">' + res.comment[j].content + '</div>';
                html += '</div>';
            }
        }
        html += '</div>';
        html += '</div>';
        html += '</div>';
    }

    return html;
}

// 구매하기 버튼 클릭
function setBuyingOption(index, prod_kind) {
    if (prod_kind == '509') {
        if (agent.search('app_android') == -1 && agent.search('app_iphone') == -1) { // 안드로이드라면
            showDialogWarning('앱에서 구매가 가능한 상품입니다.', '', '', '확인', 'closeDialog();');
            return;
        }
    }

    if (index == 'show') {
        $('body').css('overflow', 'hidden');
        $('body').on('scroll touchmove mousewheel', function(e) {
            return;
        });

        $('.option-tool').animate({
            bottom: '0%'
        }, 250);
    } else {
        $('body').css('overflow', 'visible');
        $('body').off('scroll touchmove mousewheel');

        $('.option-tool').animate({
            bottom: '-60%'
        }, 250);
    }
}

/***************** 상품선택 *******************/
// 선택된 상품의 총가격 얻기
function getTotalPrice() {
    const rows = $('#product-select-result > #prod-control');

    if (rows.length === 0) {
        goodsPrice = $('#product-detail').data('prodprice');
    } else {
        let tmpPrice = 0;

        $(rows).each(function() {
            tmpPrice += parseInt(removeComma($(this).find('#prod-price').text()));
        });

        goodsPrice = tmpPrice;
    }
}

// 상품 선택
function setProdSelect(element) {
    var value = $(element).parent().find('#prod-select-list').attr('style');
    $(element).find('.pic img')[0].classList.toggle('active')
    if (value.search('display: none') != -1) {
        $(element).parent().find('#prod-select-list').slideDown(200);
        $(element).parent().find('img').attr('src', base_url + 'assets/pc/images/option_tab.png');
    } else {
        $(element).parent().find('#prod-select-list').slideUp(200);
        $(element).parent().find('img').attr('src', base_url + 'assets/pc/images/option_tab.png');
    }
}

// 상품옵션리스트에서 옵션상품 선택
function setProdContent(element, productid, attrid, prodoption, prodname, prodprice, isbuy, limit, prodcount, quantity, prod_kind) {
    var old_elem = $('#product-select-result > div:nth-child(1)').attr('style');

    if (old_elem != undefined) {
        if (old_elem.search('display: none;') != -1) {
            $('#product-select-result').html('');
        }
    }

    var name = $(element).find('.title-width').text();
    $(element).parent().parent().find('#prod-select-title').text(name);
    $(element).closest('#prod-select-list').slideUp(200);
    $(element).parent().parent().find('img').attr('src', base_url + 'assets/pc/images/option_tab.png');

    if (prodoption == '') { // 옵션상품이 없다면
        var exist = false;
        var rows = $('#product-select-result > #prod-control');

        $(rows).each(function() {
            var prodattrid = $(this).data('attrid');
            if (prodattrid == attrid) {
                exist = true;
            }
        });

        if (!exist) {
            $('#product-select-result').append(setResultProductTemplete(productid, attrid, prodoption, prodname, prodprice, isbuy, limit, prodcount, quantity, prod_kind));
            getTotalPrice();
            couponSelectTemplate();
            //$('#product-select-result').html('')

        }
    } else { // 옵션상품이 있다면
        setTimeout(function() {
            getProdOptionData(productid);
            couponSelectTemplate();
           
            $('#product-select-result').html('')
        }, 200);
    }
    $(element).parent().parent().find('.pic img')[0].classList.remove('active')

}
/*********************************************/
/****************** 상품옵션선택 ***************/

// 옵션 선택
function setOptionSelect(element) {
    $(element).find('.option-kind-title .pic img')[0].classList.toggle('active')
    var value = $(element).parent().find('#prod-option-list').attr('style');
    if (value.search('display: none;') != -1) {
        $(element).parent().find('#prod-option-list').slideDown(200);
        $(element).parent().find('img').attr('src', base_url + 'assets/pc/images/option_tab.png');
    } else {
        $(element).parent().find('#prod-option-list').slideUp(200);
        $(element).parent().find('img').attr('src', base_url + 'assets/pc/images/option_tab.png');
    }
}

// 옵션리스트
function setOptionContent(element, productid, attrid, prodoption, prodname, prodprice, isbuy, limit, quantity, prod_kind) {
    $(element).parent().parent().find('.option-kind-title .pic img')[0].classList.toggle('active')
    var old_elem = $('#product-select-result > div:nth-child(1)').attr('style');

    if (old_elem != undefined) {
        if (old_elem.search('display: none') != -1) {
            $('#product-select-result').html('');
        }
    }

    var exist = false;
    var rows = $('#product-select-result > #prod-control');

    $(rows).each(function() {
        var prodattrid = $(this).data('attrid');
        if (prodattrid == attrid) {
            exist = true;
        }
    });

    if (!exist) {
        $('#product-select-result').append(setResultProductTemplete(productid, attrid, prodoption, prodname, prodprice, isbuy, limit, '', quantity, prod_kind));
        getTotalPrice();
        couponSelectTemplate();
    }

    var name = $(element).find('.title-width').text();
    $(element).parent().parent().find('#prod-option-title').text(name);
    $(element).closest('#prod-option-list').slideUp(200);
    $(element).parent().parent().find('img').attr('src', base_url + 'assets/pc/images/option_tab.png');
}

// 옵션 데이터 얻기
function getProdOptionData(productid) {
    $.ajax({
        url: base_url + 'user/product/product_detail/getProdOptionData',
        type: 'POST',
        data: {
            productid: productid
        },
        dataType: 'json',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        success: function(res) {
            $('#select-option-content').html(setOptionTemplete(res));
        }
    });
}

// 옵션리스트 템블릿
function setOptionTemplete(res) {
    var html = '';
    html +=  `<div class="option-kind"> 
                <div class="product-select pointer" onclick="setOptionSelect(this);"> 
                <div class="row option-kind-title" > 
                    <div class="fl font-222-13 title-width" id="prod-option-title"  style="width:93%">옵션을 선택해주세요.</div> 
                    <div class="pic ml-5">
                        <img class="" src="${base_url}assets/pc/images/option_tab.png" style="width: 14px; height: 14px;" alt=""> 
                    </div>
                    </div> 
                </div> 
                <div id="prod-option-list" style="display: none;">`
    for (var i = 0; i < res.length; i++) {
      
     html +=  ` <div class="product-select pointer product-select-item" onclick="setOptionContent(this, ' ${res[i].subproductid } ', '${ res[i].attrid} ', '${ res[i].prod_others }', '${ res[i].product_name } ', '${res[i].sale_price }', '${res[i].isbuy } ', ' ${res[i].buy_condition }', ' ${res[i].quantity }', ' ${ res[i].prod_kind } ');" style="border-top: none;">
                     <div class=" title-width" style="width: 70%;height:18px;">  ${ res[i].prod_others }</div>
                     <div class="font-222-13 fr" id="prod-option-price" style="height:18px;">   ${ addComma(res[i].sale_price) }   원</div>
                </div>`
    }
    html += `</div> 
    </div>`

    return html;
}
/********************************************/
/**************** 선택된 상품 결과 *************/

// 선택된 상품결과아이템 삭제
function setCancelProdItem(element) {
    $(element).closest('#prod-control').remove();
    getTotalPrice();
    couponSelectTemplate();
}

// 상품선택결과 템플릿
function setResultProductTemplete(productid, attrid, prodoption, prodname, prodprice, isbuy, limit, prodcount, quantity, prod_kind) {
    var html = '';
    
     html += '<div id="prod-control" class="padding-15 border-btm" data-productid="' + productid + '" data-attrid="' + attrid + '" style="display: block;">';
    html += '<div class="row mb-15">';

    if (prodoption != '') {
        html += '<div class="font-222-14   title-width mt-5" style="width: 93%;">' + prodname + '/' + prodoption + '</div>';
    } else {
        html += '<div class="font-222-14   title-width mt-5" style="width: 93%;">' + prodname + '</div>';
    }

    if (prodoption != '' || parseInt(prodcount) > 2) {
        html += '<img class="mt-5 pointer" src="' + base_url + 'assets/user/images/ico_cancel_1.png" style="width: 25px;height:12px; " alt="" onclick="setCancelProdItem(this);">';
    }

    html += '</div>';
    html += `
    <div class="btn-container">
        <div class="setting-quantity">
            <div class="tag-number">
                <input id="tag-number" class="text-center" type="text" name="" value="1" style="border: none; height: 29px; padding: 0;" onkeyup="setInputCount(this, '${prodprice} ', '${ isbuy }', ' ${ limit } ', '${ quantity } ');">
            </div>
            <div class="tag-container">
                <div class="tag-plus pointer" onclick="setProdCount(this, '${ prodprice }', '${ isbuy } ', '${ limit }', '${ quantity } ', 'plus');">
                    <img src="${base_url}assets/pc/images/up.png"/>
                </div>
                <div class="tag-minuse pointer" onclick="setProdCount(this,'${ prodprice } ', ' ${ isbuy }', ' ${ limit}', ' ${ quantity }', 'minuse');">
                    <img src="${base_url}assets/pc/images/down.png"/>
                </div> 
            </div>
        </div>
    </div>
   <div class="row">`

    if (prod_kind == '508') {
        if (isbuy == '353') {
            html += `<div class="font-adad-13 mt-9 fl">구매제한 없음</div> `
        } else {
            html += `<div class="font-adad-13 mt-9 fl">1인당 ${limit}개 구매가능</div> `
        }
    }

html += `<div class="fr mt-2">
            <span class="font-222-21 font-weight" id="prod-price">${addComma(prodprice)}</span>  
            <span class="font-222-15"> 원</span> 
        </div>
    </div>
 </div>
    ` 

    return html;
}

// 상품갯수 입력 필터
function setInputCount(element, prodprice, isbuy, limit, quantity) {
    $(element).val($(element).val().replace(/[^0-9]/g, ''));

    if ($(element).val() === '') {
        $(element).parent().parent().parent().find('#prod-price').text(addComma(parseInt(prodprice) * 1) + '원');
        return;
    }

    if ($(element).val() === '0') {
        $(element).val('1');
        $(element).parent().parent().parent().find('#prod-price').text(addComma(parseInt(prodprice) * 1) + '원');
        return;
    }

    if (parseInt($(element).val()) >= parseInt(limit) && parseInt(limit) != 0) {
        $(element).val(limit);
    }

    if (parseInt($(element).val()) >= parseInt(quantity)) {
        $(element).val(quantity);
    }

    $(element).closest('#prod-control').find('#prod-price').text(addComma(parseInt(prodprice) * parseInt($(element).val())));
    goodsPrice = parseInt(prodprice) * parseInt($(element).val());
    couponSelectTemplate();
}

window.addEventListener('focusout', function(element) {
    if (element.target.id === 'tag-number') {
        if (element.target.value === '' || element.target.value === '0') {
            element.target.value = 1;
        }
    }
});

// 상품갯수 증가/감소
function setProdCount(element, prodprice, isbuy, limit, quantity, index) {
    var value = parseInt($('#tag-number').val()); // 상품갯수
    switch (index) {
        case 'minuse':
            if (value == 1) {
                return;
            }
            var count = value - 1;
            $('#tag-number').val(count);
            break;
        case 'plus':
            if (value >= parseInt(limit) && parseInt(limit) != 0) {
                return;
            }
            if (value >= parseInt(quantity)) {
                return;
            }
            var count = value + 1;
            $('#tag-number').val(count);
            break;
    }

    $(element).closest('#prod-control').find('#prod-price').text(addComma(parseInt(prodprice) * count));
    getTotalPrice();
    couponSelectTemplate();
}
/*********************************************/

// 이벤트아이콘 클릭시 관리자로부터 해당 통통코인 지급받기
function setPayCoinEvent(walletaddress, balance, walletname, walletpassword) {
    var request = new XMLHttpRequest();
    var data = {
        walletaddress: walletaddress,
        balance: balance,
        walletname: walletname,
        walletpassword: walletpassword,
        productid: $('#product-detail').data('productid'),
        prodname: $('#product-detail').data('prodname')
    }

    request.responseType = 'json';
    request.open('POST', base_url + 'user/product/product_detail/setPayCoinEvent');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.addEventListener('readystatechange', function(event) {
        $('#spinner_overay').css('display', 'none');

        if (event.target.status == 200 || event.target.status == 201) {
            if (event.target.response.out) {
                window.location.replace(base_url + 'logout?kind=product_detail_setPayCoinEvent');
                return;
            }
            if (event.target.response.length == 0) {
                setResultEventCoin('fail');
            } else {
                if (!event.target.response.check) {
                    showDialogWarning('존재하지 않는 지갑주소입니다.', '', '', '확인', 'closeDialog();');
                    return;
                }
                if (!event.target.response.send) {
                    showDialogWarning('코인받기 실패하였습니다.', '', '', '확인', 'closeDialog();');
                    return;
                }
                setResultEventCoin('success');
            }
        } else {
            showDialogWarning('네트워크상태가 불안정합니다.<br>다시 시도해주세요.', '', '', '확인', 'closeDialog();');
        }
    });

    request.send(jsonConvert(data));
}

// 이벤트 통통코인 지급 결과 상태
function setResultEventCoin(status) {
    $('body').css('overflow', 'hidden');
    $('body').on('scroll touchmove mousewheel', function(e) {
        return;
    });

    $('.dialog-overlay').fadeIn();
    $('.event-coin-res').fadeIn();

    if (status == 'success') {
        $('.event-coin-res').html('<img src="' + base_url + 'assets/user/images/event_coin_success.png" style="width: 54%; margin-left: 25%;">');
    } else {
        $('.event-coin-res').html('<img src="' + base_url + 'assets/user/images/event_coin_fail.png" style="width: 54%; margin-left: 25%;">');
    }
}


// 장바구니 담기
function setAddCart(prodid, prod_kind) {
    var count = [];
    var productid = [];
    var prodattrid = [];
    var element = $('#product-select-result > div:nth-child(1)').attr('style');

    // if (element == undefined) {
    //     showDialogWarning('상품을 선택해주세요', '', '', '확인', 'closeDialog();');
    //     return;
    // }

    // if (element.search('display: none') != -1) {
    //     showDialogWarning('상품을 선택해주세요', '', '', '확인', 'closeDialog();');
    //     return;
    // }
    if($('#prod-select-title').text() == '상품을 선택해주세요.'){
        showDialogWarning('상품을 선택해주세요', '', '', '확인', 'closeDialog();');
        return;
    }
    if($('#select-option-content').html() != ''){
        if($('#prod-option-title').text()=='옵션을 선택해주세요.'){
            showDialogWarning('옵션을 선택해주세요.', '', '', '확인', 'closeDialog();');
            return;
        }
    }
    // if($('#select-option-content').html != ''){
    //     if($('#prod-control').html() == ''){
    //         if($('#prod-option-title').text()!='옵션을 선택해주세요.'){
    //             showDialogWarning('옵션을 다시 선택해주세요.', '', '', '확인', 'closeDialog();');
    //             return;
    //         }
    //     }
    // }
    if($('#select-option-content').html() != ''){
        if($('#prod-option-title').text() !='옵션을 선택해주세요.'){
            if($('#prod-control').html() == undefined){
                showDialogWarning('옵션을 다시 선택해주세요.', '', '', '확인', 'closeDialog();');
                return;
            }
            
        }
    }
    //if (couponId === 0 && couponData.length !== 0) {
    //    showDialogWarning('쿠폰을 잊으시지 않으셨나요?', '', '', '확인', 'closeDialog();');
    //    return;
    //}

    var rows = $('#product-select-result > #prod-control');

    $(rows).each(function() {
        count.push($(this).find('#tag-number').val());
        productid.push($(this).data('productid'));
        prodattrid.push($(this).data('attrid'));
    });

    $('#spinner_overay').css('display', 'block');

    setTimeout(function() {
        $.ajax({
            url: base_url + 'user/product/product_detail/setAddCart',
            type: 'POST',
            data: {
                productid: productid,
                prodattrid: prodattrid,
                count: count,
                prodid: prodid,
                prod_kind: prod_kind,
                couponid: couponId,
                total_coupon: totalCoupon
            },
            dataType: 'json',
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            async: false,
            success: function(res) {
                $('#spinner_overay').css('display', 'none');
                if (res.success == 'ok') {
                    if (prod_kind == '508') {
                        showDialogCart('redirectMain(' + "'" + base_url + "'" + ');', 'redirectCart(' + "'" + base_url + "'" + ');');
                    } else {
                        showDialogCart('redirectFirstOrderPage();', 'redirectCart(' + "'" + base_url + "'" + ');');
                    }
                } else if (res.success == 'out') {
                    window.location.replace(base_url + 'logout?kind=product_detail_setAddCart');
                } else if (res.success == 'change') {
                    showDialogWarning('상품 중 변경사항이 있습니다.', '', '', '확인', 'reloadPage();');
                    $('.dialog-normal').find('img').css('display', 'none');
                    $('.dialog-overlay').attr('onclick', '');
                } else if (res.success == 'event') {
                    showDialogWarning('구매 불가한 상품입니다.', '', '', '확인', 'redirectMain(' + "'" + base_url + "'" + ');');
                    $('.dialog-normal').find('img').css('display', 'none');
                    $('.dialog-overlay').attr('onclick', '');
                }
            }
        });
    }, 500);
}

function redirectFirstOrderPage() {
    window.location.href = base_url + 'buying_event';
}

// 구매하기
function setPreBuying(group_status, shipping_kind, shipping_fee, shipping_condition, groupbuy_mini, group_bonus, delivery_kind, prodid) {
    var count = [];
    var productid = [];
    var prodattrid = [];

    var element = $('#product-select-result > div:nth-child(1)').attr('style');

    // if (element == undefined) {
    //     showDialogWarning('상품을 선택해주세요.', '', '', '확인', 'closeDialog();');
    //     return;
    // }

    // if (element.search('display: none') != -1) {
    //     showDialogWarning('상품을 선택해주세요.', '', '', '확인', 'closeDialog();');
    //     return;
    // }
    if($('#prod-select-title').text() == '상품을 선택해주세요.'){
        showDialogWarning('상품을 선택해주세요', '', '', '확인', 'closeDialog();');
        return;
    }
    if($('#select-option-content').html() != ''){
        if($('#prod-option-title').text()=='옵션을 선택해주세요.'){
            showDialogWarning('옵션을 선택해주세요.', '', '', '확인', 'closeDialog();');
            return;
        }
    }
    if($('#select-option-content').html() != ''){
        if($('#prod-option-title').text() !='옵션을 선택해주세요.'){
            if($('#prod-control').html() == undefined){
                showDialogWarning('옵션을 다시 선택해주세요.', '', '', '확인', 'closeDialog();');
                return;
            }
            
        }
    }
    // if($('#prod-control').html() == ''){
    //     showDialogWarning('옵션을 다시 선택해주세요.', '', '', '확인', 'closeDialog();');
    //     return;
    // }

    //if (couponId === 0 && couponData.length !== 0) {
    //    showDialogSetting('쿠폰을 잊으시지 않으셨나요?', '', '아니오', '네', 'setFinalPreBuying(' + "'" + group_status + "'" + ', ' + "'" + shipping_kind + "'" + ', ' + "'" + shipping_fee + "'" + ', ' + "'" + shipping_condition + "'" + ', ' + "'" + groupbuy_mini + "'" + ', ' + "'" + group_bonus + "'" + ', ' + "'" + delivery_kind + "'" + ', ' + "'" + prodid + "'" + ');', 'showCouponList();');
    //    return;
    //}

    var total_price = 0; // 선택한 상품 총금액
    var rows = $('#product-select-result > #prod-control');

    $(rows).each(function() {
        productid.push($(this).data('productid'));
        prodattrid.push($(this).data('attrid'));
        count.push($(this).find('#tag-number').val());
        total_price += removeComma($(this).find('#prod-price').text().replace('원', ''));
    });

    var shipping_price = 0;

    if (shipping_kind == '110') { // 유료배송
        shipping_price = shipping_fee;
    } else if (shipping_kind == '111') { // 조건부유료배송
        if (total_price < shipping_condition) { // 선택한 상품금액이 조건부유료보다 작으면 배송비 적용
            shipping_price = shipping_fee;
        }
    }

    $('#spinner_overay').css('display', 'block');

    setTimeout(function() {
        $.ajax({
            url: base_url + 'user/product/product_detail/setPreBuying',
            type: 'POST',
            data: {
                productid: productid,
                prodattrid: prodattrid,
                count: count,
                shipping_price: shipping_price,
                groupbuy_mini: groupbuy_mini,
                group_bonus: group_bonus,
                group_status: group_status,
                delivery_kind: delivery_kind,
                prodid: prodid,
                couponid: couponId,
                total_coupon: totalCoupon
            },
            dataType: 'json',
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            async: false,
            success: function(res) {
                if (res.success == "ok") {
                    setTimeout(function() {
                        $('#spinner_overay').css('display', 'none');
                    }, 3000);
                    window.location.href = base_url + 'order';
                } else if (res.success == 'out') {
                    window.location.replace(base_url + 'logout?kind=product_detail_setPreBuying');
                } else if (res.success == 'change') {
                    $('#spinner_overay').css('display', 'none');
                    showDialogWarning('주문 상품 중 변경사항이 있습니다.', '', '', '확인', 'reloadPage();');
                    $('.dialog-normal').find('img').css('display', 'none');
                    $('.dialog-overlay').attr('onclick', '');
                }
            }
        });
    }, 500);
}

function setFinalPreBuying(group_status, shipping_kind, shipping_fee, shipping_condition, groupbuy_mini, group_bonus, delivery_kind, prodid) {
    closeDialog();

    var count = [];
    var productid = [];
    var prodattrid = [];
    var total_price = 0; // 선택한 상품 총금액
    var rows = $('#product-select-result > #prod-control');

    $(rows).each(function() {
        productid.push($(this).data('productid'));
        prodattrid.push($(this).data('attrid'));
        count.push($(this).find('#tag-number').val());
        total_price += removeComma($(this).find('#prod-price').text().replace('원', ''));
    });

    var shipping_price = 0;

    if (shipping_kind == '110') { // 유료배송
        shipping_price = shipping_fee;
    } else if (shipping_kind == '111') { // 조건부유료배송
        if (total_price < shipping_condition) { // 선택한 상품금액이 조건부유료보다 작으면 배송비 적용
            shipping_price = shipping_fee;
        }
    }

    $('#spinner_overay').css('display', 'block');

    setTimeout(function() {
        $.ajax({
            url: base_url + 'user/product/product_detail/setPreBuying',
            type: 'POST',
            data: {
                productid: productid,
                prodattrid: prodattrid,
                count: count,
                shipping_price: shipping_price,
                groupbuy_mini: groupbuy_mini,
                group_bonus: group_bonus,
                group_status: group_status,
                delivery_kind: delivery_kind,
                prodid: prodid,
                couponid: couponId,
                total_coupon: totalCoupon
            },
            dataType: 'json',
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            async: false,
            success: function(res) {
                if (res.success == "ok") {
                    setTimeout(function() {
                        $('#spinner_overay').css('display', 'none');
                    }, 3000);
                    window.location.href = base_url + 'order';
                } else if (res.success == 'out') {
                    window.location.replace(base_url + 'logout?kind=product_detail_setFinalPreBuying');
                } else if (res.success == 'change') {
                    $('#spinner_overay').css('display', 'none');
                    showDialogWarning('주문 상품 중 변경사항이 있습니다.', '', '', '확인', 'reloadPage();');
                    $('.dialog-normal').find('img').css('display', 'none');
                    $('.dialog-overlay').attr('onclick', '');
                }
            }
        });
    }, 500);
}

function reloadPage() {
    window.location.reload();
}

// 공동구매상품 예약하기
function showDialogAppoint(index) {
    showDialogWarning('해당 공동구매 제품을<br>예약하시겠습니까?<br>예약 시 보증금 10 통통코인이<br>통통지갑에서 차감됩니다.', '', '', '확인', 'setConnectTongTongApp(' + "'product_detail'" + ', ' + "'group'" + ', ' + "'" + index + "'" + ');');
}

//공동구매예약시 예약코인 지불
function setPayCoinGroup(walletaddress, balance, walletname, walletpassword) {
    if (parseInt(balance) < 10) {
        showDialogWarning('코인잔고가 부족합니다.', '', '', '확인', 'closeDialog();');
        return;
    }
    $.ajax({
        url: base_url + 'user/product/product_detail/setPayCoinGroup',
        type: 'POST',
        data: {
            walletaddress: walletaddress,
            balance: balance,
            walletname: walletname,
            walletpassword: walletpassword,
            productid: $('#product-detail').data('productid'),
            prodname: $('#product-detail').data('prodname'),
            attrid: $('#product-detail').data('attrid')
        },
        dataType: 'json',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        success: function(res) {
            $('#spinner_overay').css('display', 'none');

            if (!res.check) {
                showDialogWarning('존재하지 않는 지갑주소입니다.', '', '', '확인', 'closeDialog();');
                return;
            }

            if (!res.send) {
                showDialogWarning('코인받기 실패하였습니다.', '', '', '확인', 'closeDialog();');
                return;
            }

            showDialogWarning('10코인이 전송되었습니다.', '', '', '확인', 'closeDialog();');
            $('.btn-submit-2').text('예약완료');
        }
    });
}

// 상품 찜하기
function setLikeProduct(element, productid, status) {
    $.ajax({
        url: base_url + 'user/product/product_detail/setLikeProduct',
        type: 'POST',
        data: {
            productid: productid,
            status: status
        },
        dataType: 'json',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        success: function(res) {
            if (agent.search('app_android') != -1) {
                try {
                    tongtongmall.setReloadMainPage();
                } catch (e) {}
            } else if (agent.search('app_iphone') !== -1) { // 아이폰이라면
                try {
                    window.webkit.messageHandlers.setLikeProduct.postMessage({})
                } catch (e) {}
            }

            if (status != '0') {
                $(element).attr('src', base_url + 'assets/user/images/ico_heart_unselected.png');
                $(element).attr('onclick', 'setLikeProduct(this, ' + "'" + productid + "'" + ', ' + "'0'" + ');');
            } else {
                $(element).attr('src', base_url + 'assets/user/images/ico_heart_selected.png');
                $(element).attr('onclick', 'setLikeProduct(this, ' + "'" + productid + "'" + ', ' + "'1'" + ');');
            }
        }
    });
}

// 상품 공유
function setSharingURL(url) {
    clipboardData(url, 'product_detail');
    showDialogWarning('URL 복사 완료', '클립보드에 복사되었습니다.<br>공유하고 싶은 곳에 붙여넣기 하세요.', 'center', '확인', 'closeDialog();');
}

function setReport(previewid) {
    $.ajax({
        url: base_url + 'user/product/product_detail/setReport',
        type: 'POST',
        data: {
            previewid: previewid
        },
        dataType: 'json',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        success: function(res) {
            if (res.success) {
                showDialogWarning('신고되었습니다.', '', '', '확인', 'closeDialog();');
            } else {
                showDialogWarning('이미 신고되었습니다.', '', '', '확인', 'closeDialog();');
            }
        }
    });
}

function setBlock(previewid, index) {
    $.ajax({
        url: base_url + 'user/product/product_detail/setBlock',
        type: 'POST',
        data: {
            previewid: previewid,
            index: index
        },
        dataType: 'json',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        success: function(res) {
            window.location.reload();
        }
    });
}

function showCouponList() {
    closeDialog();
    $('.coupon-list').slideDown(200);
    $('#img-arrow').attr('src', base_url + 'assets/user/images/option_tab.png');
}

// 쿠폰 리스트 노출
function setCoupon() {
    
    if ($('.coupon-list').attr('style')) {
        if ($('.coupon-list').attr('style').search('block') !== -1) {
              $('.coupon-list').slideUp(200);
            $('#img-arrow').attr('src', base_url + 'assets/pc/images/option_tab.png');
         

        } else { 
            $('.coupon-list').slideDown(200);
            $('#img-arrow').attr('src', base_url + 'assets/pc/images/option_tab.png');
        }
    } else {
         $('.coupon-list').slideDown(200);
        
                $('#img-arrow').attr('src', base_url + 'assets/pc/images/option_tab.png');
    }
    $('#img-arrow')[0].classList.toggle('active')
}

// 적용쿠폰 선택
function setCouponItem(element, couponid, coupon_price) {
    couponId = couponid;
    totalCoupon = coupon_price;
    $(element).parent().find('input').prop('checked', false);
    $(element).find('input').prop('checked', true);

    $('.coupon-list').slideUp(200);
    $('#img-arrow').attr('src', base_url + 'assets/pc/images/option_tab.png');
    $('#coupon-select-name').text($(element).find('#coupon-name').text());
    $('#coupon-apply-price').text(addComma(goodsPrice - coupon_price));
    $('#img-arrow')[0].classList.toggle('active')

}

// 쿠폰정보 얻기
function getCouponData() {
    $.ajax({
        url: base_url + 'user/product/product_detail/getCouponData',
        type: 'POST',
        dataType: 'json',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        success: function(res) {
            couponData = res;
            couponSelectTemplate();
        }
    });
}

/*
 * 쿠폰가격 계산 함수
 * 
 * kind: 혜택종류(할인금액, 할인율)
 * disc_price: 쿠폰적용금액
 * disc_rate: 할인율
 * disc_max: 최대할인금액(원)
 * cut_unit: 절사단위값
 * 
 * */
function calcCouponPrice(kind, disc_price, disc_rate, disc_max, cut_unit) {
    // 쿠폰혜택이 할인금액이라면
    if (kind === '241') {
        return parseInt(disc_price);
    }

    // 쿠폰혜택이 할인율이라면
    if (kind === '242') {
        if (parseInt(cut_unit) === 0) { // 절사안함이면
            // 주문상품가격에 할인율을 적용한 값이 최대할인금액보다 크면 최대할인금액 대입, 아니면 계산된 할인금액 대비
            return Math.floor((parseInt(goodsPrice) * parseFloat(disc_rate)) / 100) > parseInt(disc_max) ? parseInt(disc_max) : Math.floor((parseInt(goodsPrice) * parseFloat(disc_rate)) / 100);
        } else { // 절사를 도입했으면
            return Math.floor(((parseInt(goodsPrice) * parseFloat(disc_rate)) / 100) / parseInt(cut_unit)) * 100 > parseInt(disc_max) ? parseInt(disc_max) : Math.floor(((parseInt(goodsPrice) * parseFloat(disc_rate)) / 100) / parseInt(cut_unit)) * 100;
        }
    }
}

// 쿠폰선택 템플릿
function couponSelectTemplate() {
    let html = '';
    let subHtml = '';
    let couponPrice = 0;
    let disc_max = '';
    couponId = 0;

    for (let i = 0; i < couponData.length; i++) {
        let isVisible = false; // 노출상태
        let isActive = false; // 액티브상태

        // 적용분류선택이 전체적용이라면
        if (couponData[i].apply_part_kind === '408') {
            // 사용가능 기준금액이 제한이 없다면
            if (couponData[i].criti_kind === '247') {
                couponPrice = calcCouponPrice(couponData[i].kind, couponData[i].disc_price, couponData[i].disc_rate, couponData[i].disc_max, couponData[i].cut_unit);
                isActive = true;
            }

            // 사용가능 기준금액이 상품금액기준이라면
            if (couponData[i].criti_kind === '249') {
                if (goodsPrice >= parseInt(couponData[i].criti_price)) {
                    couponPrice = calcCouponPrice(couponData[i].kind, couponData[i].disc_price, couponData[i].disc_rate, couponData[i].disc_max, couponData[i].cut_unit);
                    isActive = true;
                }
            }

            isVisible = true;
        }

        // 적용분류선택이 상품적용이라면
        if (couponData[i].apply_part_kind === '407') {
            if (parseInt(goodsId) === parseInt(couponData[i].productid)) {
                // 사용가능 기준금액이 제한이 없다면
                if (couponData[i].criti_kind === '247') {
                    couponPrice = calcCouponPrice(couponData[i].kind, couponData[i].disc_price, couponData[i].disc_rate, couponData[i].disc_max, couponData[i].cut_unit);
                    isActive = true;
                }

                // 사용가능 기준금액이 상품금액기준이라면
                if (couponData[i].criti_kind === '249') {
                    if (goodsPrice >= parseInt(couponData[i].criti_price)) {
                        couponPrice = calcCouponPrice(couponData[i].kind, couponData[i].disc_price, couponData[i].disc_rate, couponData[i].disc_max, couponData[i].cut_unit);
                        isActive = true;
                    }
                }

                isVisible = true;
            }
        }

        // 적용분류선택이 선택분류포함이라면
        if (couponData[i].apply_part_kind === '246') {
            if (couponData[i].subcatid) {
                if (parseInt(categoryId) === parseInt(couponData[i].catid) && parseInt(subCategoryId) === parseInt(couponData[i].subcatid)) {
                    // 사용가능 기준금액이 제한이 없다면
                    if (couponData[i].criti_kind === '247') {
                        couponPrice = calcCouponPrice(couponData[i].kind, couponData[i].disc_price, couponData[i].disc_rate, couponData[i].disc_max, couponData[i].cut_unit);
                        isActive = true;
                    }

                    // 사용가능 기준금액이 상품금액기준이라면
                    if (couponData[i].criti_kind === '249') {
                        if (goodsPrice >= parseInt(couponData[i].criti_price)) {
                            couponPrice = calcCouponPrice(couponData[i].kind, couponData[i].disc_price, couponData[i].disc_rate, couponData[i].disc_max, couponData[i].cut_unit);
                            isActive = true;
                        }
                    }

                    isVisible = true;
                }
            } else {
                if (parseInt(categoryId) === parseInt(couponData[i].catid)) {
                    // 사용가능 기준금액이 제한이 없다면
                    if (couponData[i].criti_kind === '247') {
                        couponPrice = calcCouponPrice(couponData[i].kind, couponData[i].disc_price, couponData[i].disc_rate, couponData[i].disc_max, couponData[i].cut_unit);
                        isActive = true;
                    }

                    // 사용가능 기준금액이 상품금액기준이라면
                    if (couponData[i].criti_kind === '249') {
                        if (goodsPrice >= parseInt(couponData[i].criti_price)) {
                            couponPrice = calcCouponPrice(couponData[i].kind, couponData[i].disc_price, couponData[i].disc_rate, couponData[i].disc_max, couponData[i].cut_unit);
                            isActive = true;
                        }
                    }

                    isVisible = true;
                }
            }
        }

        // 적용분류선택이 선택분류제외이라면
        if (couponData[i].apply_part_kind === '245') {
            if (parseInt(categoryId) !== parseInt(couponData[i].catid)) {
                // 사용가능 기준금액이 제한이 없다면
                if (couponData[i].criti_kind === '247') {
                    couponPrice = calcCouponPrice(couponData[i].kind, couponData[i].disc_price, couponData[i].disc_rate, couponData[i].disc_max, couponData[i].cut_unit);
                    isActive = true;
                }

                // 사용가능 기준금액이 상품금액기준이라면
                if (couponData[i].criti_kind === '249') {
                    if (goodsPrice >= parseInt(couponData[i].criti_price)) {
                        couponPrice = calcCouponPrice(couponData[i].kind, couponData[i].disc_price, couponData[i].disc_rate, couponData[i].disc_max, couponData[i].cut_unit);
                        isActive = true;
                    }
                }

                isVisible = true;
            }
        }

        if (isVisible) {
            if (isActive) {
                subHtml += '<div class="coupon-item mt-15 pointer" onclick="setCouponItem(this, ' + "'" + couponData[i].couponid + "'" + ', ' + "'" + couponPrice + "'" + ');">';
            } else {
                subHtml += '<div class="coupon-item mt-15 disable" onclick="">';
            }

            subHtml += '<div class="left">';

            if (isActive) {
                subHtml += '<input id="coupon-check-' + (i + 1) + '" type="radio" name="" value="">';
                subHtml += '<label class="pointer" for="coupon-check-' + (i + 1) + '" style="width: 18px; height: 18px;"></label>';
            } else {
                subHtml += '<img src="' + base_url + 'assets/user/images/ico_radiobox_unselected.png" alt="" style="width: 18px; height: 18px;">';
            }

            subHtml += '</div>';
            subHtml += '<div class="right">';
            subHtml += '<p id="coupon-name">' + couponData[i].coupon_name + '</p>';

            if (couponData[i].kind === '241') {
                subHtml += '<p id="coupon-price" data-couponprice="">' + addComma(couponData[i].disc_price) + '원 할인</p>';
            } else {
                subHtml += '<p id="coupon-price">' + addComma(couponData[i].disc_rate) + '% 할인</p>';
            }
            if(couponData[i].kind === '242') {
                disc_max = '/ 최대 ' + addComma(couponData[i].disc_max) + ' 원 ';
            }
            if (couponData[i].criti_kind === '249') {
                subHtml += '<p id="coupon-policy">' + addComma(couponData[i].criti_price) + '원 이상 구매시 사용가능' + disc_max + '</p>';
            } else if (couponData[i].criti_kind === '247') {
                subHtml += '<p id="coupon-policy">제한 없음' + disc_max + '</p>';
            }

            subHtml += '</div>';
            subHtml += '</div>';
        }
    }

    if (subHtml !== '') {
        html += '<div class="font-222-15 font-weight pb-15">쿠폰</div>';
        html += '<div class="coupon-select pointer" onclick="setCoupon(this);">';
        html += '<p id="coupon-select-name" class="mb-0 title-width"  >적용하실 쿠폰을 선택하세요.</p>';
        html += '<img id="img-arrow" src="' + base_url + 'assets/pc/images/option_tab.png" alt="" style="width: 12px; height: 6px;">';
        html += '</div>';
        html += '<div class="coupon-list">';
        html += '<div class="coupon-item pointer" onclick="setCouponItem(this, ' + "'-1'" + ', ' + "'0'" + ');">';
        html += '<div class="left">';
        html += '<input id="coupon-check-0" type="radio" name="" value="">';
        html += '<label for="coupon-check-0" class="pointer" style="width: 18px; height: 18px;"></label>';
        html += '</div>';
        html += '<div class="right">';
        html += '<p id="coupon-name" class="mb-0">선택 없음</p>';
        html += '</div>';
        html += '</div>';
        html += subHtml;
        html += '</div>';
        html += '<div class="mt-20">';
        html += '<p class="font-222-15 text-right">쿠폰적용가: <span id="coupon-apply-price">0</span>원</p>';
        html += '</div>'
    }

    $('#coupon-content').html(html);
}


function countTime() {
    var second = 1000;
    var minute = second * 60;
    var hour = minute * 60;

    var nowTime = new Date();
    var endTime = new Date($('.bidding_time').data('edate').replace(/-/g, '/'));

    var expireDate = endTime - nowTime;
    if (expireDate <= 0 || isNaN(expireDate)) {
        clearInterval(interval);
        $('.detail-count-time').remove();
    } else {
        var hours = Math.floor(expireDate / hour);
        var minutes = Math.floor((expireDate % hour) / minute);
        var seconds = Math.floor((expireDate % minute) / second);

        $('.bidding_time').html(numberPad(hours, 2) + ':' + numberPad(minutes, 2) + ':' + numberPad(seconds, 2) + ' 남음');
    }
} 
let selectPage = 1;
// 페이징에 따르는 데이터 얻기
function setPage(element ,  page) {
    selectPage = page
    getTongtongReview();
}


function  getTongtongReview(){
    $.ajax({
        url: base_url + 'user/product/product_detail/getReviewData/'+ selectPage,
        type: 'POST',
        data: {
            sort: sort_index, 
            page: selectPage,  
            productid : productid,
            pagesize : 5
        },
        dataType: 'json',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        success: function(res) {
           
            $('#review-content').html(setInitTongtongMall(res));
             

            $('#total-cnt').text(res.total);
            $('#pagination').html(res.pagination);

            $('.ratebox-2').raterater({
                starWidth: 14,
                spaceWidth: 3,
                numStars: 1,
                isStatic: true,
                step: false
            });

            $('img.lazy').lazyload({
                effect: "fadeIn"
            });

             
        }
    });
}

// 통통몰 템플릿
function setInitTongtongMall(res) {
    let html = '';
    let userid = $('#product-detail').data('userid');
    let review_username = "";
    images = res.images
    res = res.review
    let id = 0
    for (var i = 0; i < res.length; i++) { 
        // pc 
        html += `<div class="review-content">
        <div class="review-content-header review-pannel">`;
   
            if(res[i].nickname) {
                review_username =  res[i].nickname.trim().slice(0, 1) + '*' + res[i].nickname.trim().slice(res[i].nickname.trim().length - 1, res[i].nickname.trim().length)   
            }else{
                review_username =  res[i].username.trim().slice(0, 1) + '*' + res[i].username.trim().slice(res[i].username.trim().length - 1, res[i].username.trim().length)   
            }
            html += ` <div class="review-name"> ${  review_username }</div>
            <div class="review-action">`;
            if (userid != null) { 
                if (userid != res[i].blockid ) {  
                    html += ` 
                    <div><a href="javascript:void(0)" onclick="setReport('<?php echo $review['previewid']; ?>');">신고하기</a> <span>|</span></div>
                    <div class="pointer"  onclick="showDialogSetting('후기를 차단하시겠습니까?', '', '취소', '확인', 'closeDialog();', 'setBlock(${res[i].previewid}, 0);');">차단하기</div>`;
                } else{  
                    html += 
                    ` <div  class="pointer"  onclick="showDialogSetting('차단을 해제하시겠습니까?', '', '취소', '확인', 'closeDialog();', 'setBlock(${res[i].previewid}, 1);');">차단해제</div>`;
               } 
            }  
            html += `</div>
        </div>
        <div class="review-content-rate-panel review-pannel"> 
            <div class="ratebox-2" data-id="1" data-rating=" ${res[i].rate}"></div> 
            <div class="ratebox-txt"> ${res[i].rate} </div>  
            <div class="cdate">   ${res[i].cdate} </div>
        </div>`
       
        if (images[res[i].previewid] != undefined ) {  
            html += ` <div class="review-image review-pannel">  ` 
                for(let j=0;j < images[res[i].previewid].length ; j++ ){
                    if (images[res[i].previewid][j].kind == "0") { 
                    html += `   <div class="review-image-item pointer"  onclick="setReivewImages('${id}','${j}')">
                      <img  src=" ${base_url +images[res[i].previewid][j].url } " alt="">
                    </div>`
                        } else {  
                    html += ` <div class="review-image-item pointer"  onclick="setReivewImages('${id}','${j}')">
                            <img class="play-video pointer pos-ab" src="${base_url }assets/pc/images/ico_play_1.png" alt=""> 
                            <div id="duration" class="pos-ab review-duration-2 pos-ab">00:00</div>
                            <video class="video-detail product-review-thumb-2" autoplay="false" preload="metadata" poster="" style="object-fit: cover;">
                               <source src="${base_url+ images[res[i].previewid][j].url} #t=0.1" type="video/mp4">
                            </video>
                        </div>`
                      }  
                 } 
        html += `     </div>`
        } 
        html += `<div class="content  review-pannel">${res[i].content}</div>
        </div>`
       
         html += `<div id="swiper-image${id}"  class="review-image-detail" style="display: none;"> 
            <div class="swiper-container mod_slider_viewer" style="margin-left: -15px;">
                <div class="swiper-wrapper"> ` 
                if (images[res[i].previewid] != undefined ) {  
                    for(let j=0;j < images[res[i].previewid].length ; j++ ){
                        if (images[res[i].previewid][j].kind == "0") { 
                html += `<div class="swiper-slide" data-name="${images[res[i].previewid][j].username}" data-cdate="${images[res[i].previewid][j].cdate}" data-rate="${images[res[i].previewid][j].prod_rate}" data-title="${images[res[i].previewid][j].product_name}" data-content="${images[res[i].previewid][j].content}" data-nickname="${images[res[i].previewid][j].nickname == null ? "":images[res[i].previewid][j].nickname}">
                                <div class="swiper-zoom-container">
                                <img src=" ${base_url +images[res[i].previewid][j].url}" style="width: 100%; height: 500px; object-fit: fill;" alt="">
                                <img class="close_btn pointer" onclick="closeReivewAllImage()" src="${base_url }assets/pc/images/btn_close.png" alt=""/>
                                </div>
                            </div>`
                        } else { 
                html +=  `<div class="swiper-slide" style="display: flex; align-items: center;" data-name="${images[res[i].previewid][j].username}" data-cdate="${images[res[i].previewid][j].cdate}" data-rate="${images[res[i].previewid][j].prod_rate}" data-title="${images[res[i].previewid][j].product_name}" data-content="${images[res[i].previewid][j].content}" data-nickname="${images[res[i].previewid][j].nickname == null ? "":images[res[i].previewid][j].nickname}">
                                <video autoplay="false" preload="metadata" poster="" controls style="width: 100%; height: 500px; object-fit: fill;">
                                <source src=" ${base_url +images[res[i].previewid][j].url}#t=0.2" type="video/mp4">
                                </video>
                                <img  class="close_btn pointer"  onclick="closeReivewAllImage()"  src="${base_url }assets/pc/images/btn_close.png" alt=""/>
                            </div>`
                        } 
                    }  
                }
        html +=  `</div> 
            </div>
            <div class="mod_slider_mask"></div>
            <div id="swiper-image${id}-review"></div>`
        html += ` </div>` 
       ++id
    }

    return html;
}


// 통통몰 템플릿
function setInitTongtongMallInquiry(date) {
    let html = '';
    let userid = $('#product-detail').data('userid'); 
    let res = date.questions;
    let quest_comment = date.quest_comment
    let isexist = false
    for (let i = 0; i < res.length; i++) { 
        // pc  
    html += `<div class="list-item">
                <div class="inquiry-item">
                    <div class="item-header">
                        <div class="pic">
                            <img src="${base_url}assets/pc/images/inquiry_icon.png" />  
                        </div>
                        <div class="txt-content"> 
                            <div class="username-pannel"> 
                            ${review_username =  res[i].username.trim().slice(0, 1) + '*' + res[i].username.trim().slice(res[i].username.trim().length - 1, res[i].username.trim().length)}`
                            if(userid == res[i].userid){
                       html += `<div class="my-inquiry"> 내 문의  </div>`       
                            } 
                     html += `  <div class="action-nav">`
                     for (let comment of quest_comment) { 
                        if (comment['parent'] ==  res[i].pquestionid ) {  
                            isexist = true
                        }
                     }
                    if(userid != ''){
                         
                        if (!isexist) {
                            html += `  <a href="javascript:void(0)" onclick="updateUI('${productid}','${res[i].pquestionid} ','${res[i].issecurity}' )">수정</a>`
                        }
                        html += `     <a href="javascript:void(0)" onclick="showDialogSetting('삭제하시겠습니까?', '', '취소', '삭제', 'closeDialog();', 'setDeleteQuestion(${res[i].pquestionid},  ${productid},${userid});');">삭제</a>`
                    }
                    html += `              </div>
                            </div>
                            <div class="cdate"> ${res[i].cdate}</div>
                        </div>  
                    </div>
                    <div class="item-body">
                       ${res[i].content} 
                    </div>
                </div>`;
                for (let comment of quest_comment) { 
                    if (comment['parent'] ==  res[i].pquestionid ) {  
           html += `<div class="reply-item">
                        <div class="item-header">
                            <div class="pic">
                                <img src="${base_url}assets/pc/images/reply_icon.png" />  
                            </div>
                            <div class="txt-content"> 
                                <div class="username">관리자</div>
                                <div class="cdate"> ${comment.cdate}</div>
                            </div> 
                        </div>
                        <div class="item-body">
                                ${comment.content }
                        </div>
                    </div>` 
                    }
                }
    html += `</div>`;
         
    }

    return html;
}
function  selectDetailTab(ele){
    $(ele).parent().parent().find(".active").removeClass("active");
    $(ele).addClass("active");
 }
function productInfo(ele){
    if($(ele).text() == "상품정보 열기"){
        $('.detail-container  .prod-tab-detail .pic').addClass("show-detail-img")

        $(ele).html(`상품정보 접기<img src='${base_url}assets/pc/images/off_icon.png'/>`);
    }else{
        $('.detail-container  .prod-tab-detail .pic').removeClass("show-detail-img")
        $(ele).html(`상품정보 열기<img src='${base_url}assets/pc/images/icon_on.png'/>`);
    }
}


// sort 아이템 클릭
function setSortItem(element, sort ) {
    sort_index = sort; 

    $('#prod-tab-review .review-sorting a').removeClass('sort-active');
    $(element).addClass('sort-active'); 

    setTimeout(function() {
        getTongtongReview()
    }, 250);
}
// 페이징에 따르는 데이터 얻기
function setInquiryPage(element ,  page) {
    selectInquiryPage = page
    getTongtongInquiry();
}

function  getTongtongInquiry(){
    $.ajax({
        url: base_url + 'user/product/product_detail/getInquiryData/'+ selectInquiryPage,
        type: 'POST',
        data: {
            type: type_inquiry_index, 
            page: selectInquiryPage,  
            productid : productid,
            pagesize : 5,
            selectInquiryType : selectInquiryType
        },
        dataType: 'json',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        success: function(res) {
           
            $('#list-container').html(setInitTongtongMallInquiry(res));
             

            $('#questions_pagination').html(res.pagination);
            $('.select-type').val(selectInquiryType)
           
        }
    });
}

// sort 아이템 클릭
function setInquiryType(element, type ) {
    type_inquiry_index = type; 
    selectInquiryPage = 1
    selectInquiryType = $(".select-type").val()
    $('#prod-tab-inquiry .type2 a').removeClass('active');
    $(element).addClass('active'); 

    setTimeout(function() {
        getTongtongInquiry()
    }, 250);
}

function setQuestionType(){ 
    selectInquiryPage = 1
    selectInquiryType = $(".select-type").val()
    setTimeout(function() {
        getTongtongInquiry()
    }, 250);
}
let tab_content_class = Array.from(document.querySelectorAll('.prod-tab-detail,.prod-tab-review,.prod-tab-inquiry,.prod-tab-exchange'));
 
function onScroll(event){
    var scrollPos = $(document).scrollTop()+10;
    $('#product-tab .nav a').each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
        console.log("================="+refElement)
        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
            $(".product-tab .nav").find(".prod-tab").removeClass("active") 
            currLink.find(".prod-tab").addClass("active");
        }
        else{
            currLink.find(".prod-tab").removeClass("active");
        }
    });
}

function registerInquiryUI(){
    $('.dialog-overlay-inquiry').fadeIn();
    $('.dialog-inquiry').fadeIn();
}
function closeInquiryUI(){
    $('.dialog-overlay-inquiry').fadeOut();
    $('.dialog-inquiry').fadeOut();
    $('#inquery-select').val('all');
    
    $('#check-security').prop('checked',false);
    $('#content').val("");
    $('#content').attr("placeholder", "* 개인정보(주민번호, 연락처, 주소, 계좌번호, 카드번호 등)가 포함되지 않도록 유의해주세요.");
}

function setQuestion(productid, questid) {
    let security = $('#check-security').val();
    let sel_kind =  $('#inquery-select').val();
    if (sel_kind == 'all') {
        showDialogWarning('문의유형을 선택해주세요.', '', '', '확인', 'closeDialog();');
        return;
    }
    if ($('#content').val().trim() === '') {
        showDialogWarning('문의내용을 입력해주세요.', '', '', '확인', 'closeDialog();');
        return;
    }
    if ($('#content').val().length < 10 || $('#content').val().length > 500) {
        showDialogWarning('문의내용은 최소 10자,<br>최대 500자까지 작성해주세요.', '', '', '확인', 'closeDialog();');
        return;
    }

    if ($('#check-security').is(':checked')) {
        security = '312';
    } else {
        security = '313';
    }

   $('#spinner_overay').css('display', 'block');
     isclick = true;

    setTimeout(function() {
        $.ajax({
            url: base_url + 'user/product/product_question/setQuestion',
            type: 'POST',
            data: {
                productid: productid,
                kind: sel_kind,
                content: $('#content').val(),
                security: security,
                questid: questid
            },
            dataType: 'json',
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            async: false,
            success: function(res) {
                  isclick = false;
                  closeInquiryUI()
                  sendEmail();
            

                 setTimeout(function() {
                   $('#spinner_overay').css('display', 'none');
                }, 5000);
              
                 setInquiryType(this, 'all' );
               
             }
        });
    }, 50);
}
function updateUI(productid,questid,issecurity){
  
    
    setTimeout(function() {
        $.ajax({
            url: base_url + 'user/product/product_detail/getetQuestion',
            type: 'POST',
            data: {
                productid: productid,
                // kind: sel_kind,
                content: $('#content').val(),
                security: security,
                questid: questid
            },
            dataType: 'json',
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            async: false,
            success: function(res) {
                $('.dialog-overlay-inquiry').fadeIn();
                $('.dialog-inquiry').fadeIn();
            
                console.log(res.question)   
                let question = res.question
                $('#inquery-select').val(question.type)
                if(question.issecurity == "312"){
                    $('#check-security').prop("checked",true)
                    $('#check-security').val("312")
                }else{
                    $('#check-security').prop("checked",false)
                    $('#check-security').val("313")
                }
                $('#content').val(question.content)
                $('.inquiry-dialog-footer').html(`
                <div class="cancel pointer" onclick="closeInquiryUI();">취소</div>
                <div class="register pointer" onclick="setQuestion(${productid}, ${questid});">수정</div> `)
            }
        });
    }, 50);
}