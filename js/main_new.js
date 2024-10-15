let lastScrollTop = 0;
let deltaScroll = 5;
let sysSecond;
let interValObj;
let biddingInterval;
let bianliang = [];
let countT = [];
let photocount = "";
let videoCount = "";
let next = document.getElementById('lowest-price-next');
let prev  = document.getElementById('lowest-price-prev');
 
next.onclick=function(e){
      //  alert('a');
        e.preventDefault();
        e.stopPropagation();
    //    console.log(111)
        return false
   };
// prev.onclick=function(e){
//   //  alert('a');
//     e.preventDefault();
//     e.stopPropagation();//console.log(111)
//     return false
//  };
//  next.addEventListener("click",function(e){ alert('a');
//  e.preventDefault();
//  e.stopPropagation();
//  console.log(111)
//  return false
// },false);
//  prev.addEventListener("click",function(e){ alert('a');
//  e.preventDefault();
//  e.stopPropagation();
//  console.log(111) 
//  return false},false);

$(function() {
    $('#spinner_overay').css('display', 'none');

  next.addEventListener("click",function(e){
      console.log("红 冒泡事件");  
      e.preventDefault();
      e.stopPropagation(); 
      e.cancelBubble=true;
      return false 
      console.log("红 冒泡事件"); 
        $('.lowest-price-link').click(function(event) {
            event.preventDefault();
            event.stopPropagation(); 
        }); 

      },false);
  prev.addEventListener("click",function(e){
      console.log("红 冒泡事件"); 
      e.preventDefault();
      e.stopPropagation(); 
      e.cancelBubble=true;
      return false 
      console.log("红 冒泡事件"); 
    $('.lowest-price-link').click(function(event) {
        event.preventDefault();
        event.stopPropagation(); 
    }); 

  },false);
//   $('.swiper-slide .pointer').click(function(event) {
//     alert('찜하기 버튼을 눌렀습니다.')
//     event.preventDefault();
//     event.stopPropagation(); 
// }); 
 
    // $('#main').css('padding-top', '90px');
    // $('#main').css('padding-top', '90px');
    // $('#header-main').css('position',' fixed;');
    // $('#header-main').css('top',' 56px;');
    const st = $(this).scrollTop();
    photocount = $('#main').data('photocount');
    videoCount = $('#main').data('videocount');
    //console.log($('#main').data('videocount'));
   
    // if(st > 30){
    //     // $('#main-header').css('transition:',' all 10s;');
    //     $('#main-header').css('animation','header_top 1s forwards');


    // }else{
    //     $('#main-header').css('animation','header_reset 1s forwards'); 

    // }
 
     initVideo();
     initVideoReview();

     const video = $('.video-review-panel').find('video');
 
     console.log("loading"+video.length);
     let i =1;
     $(video).each(function() { 
        console.log(video[0].muted+"111111111111");
        $('.video-review-panel .sound' + i++).click(function(event) {
            event.preventDefault();
            event.stopPropagation(); 
        }); 
      }); 
    // PC와 모바일웹에서만 푸터 노출시키기
    if (agent.search('app_iphone') == -1 && agent.search('app_android') == -1) {
        $('#footer').css('display', 'block');
        $('#main-content').css('padding-bottom', '15px');
    } else {
        $('#main-content').css('padding-bottom', '65px');
    }

    // 웹브라우저에서 앱으로 보기선택
    if (getCookie('runapp') == null) {
        if (agent.search('app_iphone') == -1 && agent.search('app_android') == -1) {
            if (navigator.userAgent.match(/android/i)) { // 안드로이드라면
                showRunAppView('android', 'Intent://main#Intent;scheme=tongtongmall;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.tongtong.tongtongmall1;end');
            } else if (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) { // 아이폰이라면
                showRunAppView('iphone', 'tongtongmall://main');
            }
        }
    }

    // 푸시알림 클릭 시 해당 푸시알림URL로 리다이렉트
    if (agent.search('app_android') != -1) { // 안드로이드라면
        var url = tongtongmall.getPushUrl();

        if (url != '') {
            tongtongmall.setUrlClear();
            tongtongmall.showToast('페이지 이동중입니다...');

            setTimeout(function() {
                if (url.search('product_detail') != -1) {
                    onClickProdDetail(url);
                } else {
                    window.location.href = url;
                }
            }, 1000);
        }
    } else if (agent.search('app_iphone') != -1) { // 아이폰이라면
        window.webkit.messageHandlers.getPushUrlIphone.postMessage({});
    }

    // 통통몰의 서버URL을 자동 변경 시 앱을 강제종료하고 다시 시작하는 부분
    if (getCookie('change_url') != null) {
        if (parseInt(getCookie('change_url')) >= 9) {
            setCookie('change_url', null);

            if (agent.search('app_android') != -1) { // 안드로이드라면
                tongtongmall.setActivitySetting();
            } else if (agent.search('app_iphone') != -1) { // 아이폰이라면

            }
        } else {
            clearCookie('change_url');
        }
    }

    // 새 버전 체크하여 이전 버전이면 팝업 띄우기(안드로이드만-임시)
    if (agent.search('app_android') != -1) {
        try {
            tongtongmall.getLoginInfo();
        } catch (e) {
            $('.dialog-overlay').attr('onclick', '');
            $('.dialog-header').find('img').css('display', 'none');
            showDialogWarning('업데이트버전이 있습니다.', '', '', '업데이트', 'appVersion();');
        }
    }

    const videoSwiper = new Swiper('.video-swiper', {
        spaceBetween: 5,
        centeredSlides: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        }
    });

    videoSwiper.on('slideChange', function() {
        initVideoReview();
    });

    //add by hj
    $("#menu-wraper").css("display", 'none');

    for (let i = 0; i < 5; i++) {
        new Swiper('#swiper-' + i, {
            direction: 'horizontal',
            slidesPerView: 'auto',
            spaceBetween: 10,
            freeMode: true
        });
    }

    new Swiper('#swiper-main', {
        slidesPerView:1,
        slidesPerGroup: 1,
        direction: 'horizontal',
        spaceBetween: 0,
        centeredSlides: true,
        loop: true,
        navigation: {
           nextEl: '#main-next',
           prevEl: '#main-prev'
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.page-number',
            type: 'fraction'
         },
      
    });

    new Swiper('#swiper-time', {
        direction: 'horizontal',
        slidesPerView: 'auto',
        spaceBetween: 20,
        freeMode: true
    });
    new Swiper('#swiper-photo', {
        direction: 'horizontal',
        slidesPerView: 'auto',
        spaceBetween: 0,
        freeMode: true
    }); 
    new Swiper('#swiper-lowest', {
        slidesPerView:4,
        slidesPerGroup:1,
        direction: 'horizontal',
        spaceBetween: 30,
        loop: true,
        freeMode: true,
        navigation: {
           nextEl: '#lowest-price-next',
           prevEl: '#lowest-price-prev'
        }
    });
    new Swiper('#swiper-time-sale', {
        slidesPerView:4,
        slidesPerGroup:4,
        direction: 'horizontal',
        // preventClicksPropagation : false,
        // slidesPerView: 'auto',
        spaceBetween: 0,
        freeMode: true,
     
        navigation: {
           nextEl: '.swiper-button-next',
           prevEl: '.swiper-button-prev'
        }
    });
    new Swiper('#swiper-new-prod', {
        slidesPerView:4,
        slidesPerGroup:1,
        direction: 'horizontal',
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        navigation: {
           nextEl: '#new-prod-next',
           prevEl: '#new-prod-prev'
        }
    });

    
    new Swiper('#swiper-photo-review', {
        slidesPerView:4,
        slidesPerGroup:1,
        loop:true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false
          },
        speed:1000,
        spaceBetween: 30,
        navigation: {
           nextEl: '#review-next',
           prevEl: '#review-prev'
        }
    });

 
    $('.recommend-product').slick({
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 4,
        arrows: true,
        rows:1,
        draggable:false,
        prevArrow:`<img class="swiper-button-prev" src="${base_url}assets/pc/images/btn_prev.png" style="width:56px;height: 56px !important;position: absolute;top: 45% !important;left: -23px;">
        `,
        nextArrow:`<img class="swiper-button-next" src="${base_url}assets/pc/images/btn_next.png" style="width:56px;height: 56px !important;position: absolute;top: 45% !important;right: -23px;">
        `
   });

    countT = [];

    for (let i = 0; i < parseInt($('#main').data('tcount')); i++) {
        countT['interval' + i] = setInterval('countTime(' + i + ')', 1000);
    }
});

function clickVideoSound(owner,ele){
    // let muted=  document.getElementById(ele).muted;
  
    // if(muted){
    //     document.getElementById(ele).muted=false; 
    //     $(owner).removeClass("off");
    // }else{
    //     document.getElementById(ele).muted=true;
    //     $(owner).addClass("off");
    // }
    let video = $(owner).parent().find('video')[0]
    let muted = video.muted 
    if(muted){
        video.muted = false  
        $(owner).removeClass("off");
    }else{
        video.muted = true
        $(owner).addClass("off");
    }
}
function countTime(i) {
    var second = 1000;
    var minute = second * 60;
    var hour = minute * 60;
    var nowTime = new Date();
    var endTime = new Date($('#bidding_time' + i).data('edate').replace(/-/g, '/'));
    var expireDate = endTime - nowTime;

    if (expireDate <= 0 || isNaN(expireDate)) {
        const saleCnt = $('#bidding_time' + i).closest('.swiper-wrapper').find('.swiper-slide').length;
        clearInterval(countT[i]);
        $('#bidding_time' + i).closest('.swiper-slide').remove();

        if (saleCnt <= 0) {
            $('#time-sale').remove();
        }
    } else {
        var hours = Math.floor(expireDate / hour);
        var minutes = Math.floor((expireDate % hour) / minute);
        var seconds = Math.floor((expireDate % minute) / second);

        $('#bidding_time' + i).html(numberPad(hours, 2) + ':' + numberPad(minutes, 2) + ':' + numberPad(seconds, 2) );
    }
}

/**
 * 아이폰이 호출하는 함수
 * 
 * @param {phone + push_url} value 
 */
function setPushUrlIphone(value) {
    const phone = value.split('-')[0];
    const url = value.split('-')[1];

    if (url !== '' && url !== '0') {
        window.webkit.messageHandlers.clearPushUrlIphone.postMessage({});
        window.webkit.messageHandlers.showToast.postMessage({
            message: '페이지 이동중입니다...'
        });

        setTimeout(function() {
            if (url.search('product_detail') != -1) {
                onClickProdDetail(url);
            } else {
                window.location.href = url;
            }
        }, 1000);
    }
}

function appVersion() {
    window.location.href = 'market://details?id=com.tongtong.tongtongmall1';
}

function setMarketVersion(version) {
    window.webkit.messageHandlers.showToast.postMessage({ message: version });
}

// 공지팝업
function closeNoticeDialog(index) {
    initVideo();
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() - 1);

    $('.dialog-overlay-notice').fadeOut();
    $('.dialog-notice').fadeOut();
    $('html,body').css('overflow-x', 'visible');

    if (index == 'day') {
        setCookie('show_date', moment().format("YYYY-MM-DD"));
    }
}
// 공지팝업 비디오 초기화
function initVideo() {
    var video = $('.dialog-notice > .dialog-day > .notice-content').find('video');
    $(video).each(function() {
        $(this)[0].pause();
        $(this)[0].currentTime = 0.2;
    });
}
function  timeTranslate(t) {  
    let minutes = parseInt(t / 60, 10);
    let seconds = parseInt(t % 60);
    return minutes+":"+seconds;
} 

function initVideoReview() {
    const video = $('.video-review-containter').find('video');
    const playIcons = $('.video-review-containter').find('.play-icon');
    const coundyIcons = $('.video-review-containter').find('.sound');
 
    //console.log(video);
    let i =1;
    $(video).each(function() {
      //  console.log(video);
        $(this)[0].pause();
        $(this)[0].muted = false;
        $(this)[0].currentTime = 0.2;
        console.log("each----");
        $(this)[0].addEventListener('loadedmetadata', () => {  
            console.log("loadedmetadata----");

            let duration = timeTranslate($(this)[0].duration)
            console.log("---"+ duration);
            $('.video-review-containter .time' + i++).html(duration);
        })
        $(this)[0].addEventListener('canplaythrough',function(){
            console.log("canplaythrough----");

            let duration = timeTranslate($(this)[0].duration)
            console.log("-canplaythrough--"+ duration);
            $('.video-review-containter .time' + i++).html(duration);
        });
   
    });

    $(playIcons).each(function() {
        $(this).css('display', 'block');
    })
    $(coundyIcons).each(function() {
        $(this).removeClass("off");
    })
}

function setVideoTag(element) { 
    const video = $(element).find('video');
    video[0].pause();
    $(element).parent().find('img').css('display', 'block');
}

function setPlayVideo(element) {
    initVideoReview();

    const video = $(element).parent().find('video');
    video[0].play();
    $(element).css('display', 'none');
}

// 상품 찜하기
function setLikeProduct(element, productid, likestatus) {
    $.ajax({
        url: base_url + 'user/main/setLikeProduct',
        type: 'POST',
        dataType: 'json',
        data: {
            productid: productid,
            likestatus: likestatus
        },
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        success: function(res) {
            if (likestatus == '1') {
                $(element).attr('src', base_url + 'assets/user/images/ico_heart_selected.png');
                $(element).attr('onclick', 'setLikeProduct(this, ' + "'" + productid + "'" + ', ' + "'0'" + ');');
            } else {
                $(element).attr('src', base_url + 'assets/user/images/ico_heart_unselected.png');
                $(element).attr('onclick', 'setLikeProduct(this, ' + "'" + productid + "'" + ', ' + "'1'" + ');');
            }
        }
    });
}

// 스크롤 이벤트
/*$(window).on('scroll', function() {
    // console.log("top"+ $(this).scrollTop());
    // console.log("lastScrollTop"+ lastScrollTop);

    if ($('#main').length !== 0) {
        const st = $(this).scrollTop();
        
        if (Math.abs(lastScrollTop - st) <= deltaScroll) {
            return;
        }

        if (st > lastScrollTop && st > $('#header-main').outerHeight()) {
            $('#header-main').removeClass('collapsed');
            // $('#main-header').css('transition:',' all 10s;');
            console.log("header_change");
           // $('#main-header').css('animation','header_change 1s forwards');
           $('#main-header').css('animation','header_top 1s forwards');
            if ($('#footer-menu').length !== 0) {
                $('#footer-menu').removeClass('collapsed');
            }

            if ($('.divTomato').length !== 0) {
                $('.divTomato').removeClass('collapsed');
            }

        } else {
            $('#header-main').addClass('collapsed');
            // $('#header-main').css('position',' fixed;');
            // if(document.getElementById('header-main').getBoundingClientRect().top < 0){
            //     console.log("--00");
            // }else if(document.getElementById('header-main').getBoundingClientRect().top == 0){
            //     console.log("+++++++");
            // }
            if(st > 30){
                // $('#main-header').css('transition:',' all 10s;');
                $('#main-header').css('animation','header_top 1s forwards');

                console.log("st > 30");
            }else{
                $('#main-header').css('animation','header_reset 1s forwards'); 
                console.log("st <<>>> 30");
            }

            if ($('#footer-menu').length !== 0) {
                $('#footer-menu').addClass('collapsed');
            }

            if ($('.divTomato').length !== 0) {
                $('.divTomato').addClass('collapsed');
            }
        }

        lastScrollTop = st;
    }
});
// */
// $(document).ready(function() {
    
//     // grab the initial top offset of the navigation 
//        var stickyNavTop = $('#main-header').offset().top;
       
//        // our function that decides weather the navigation bar should have "fixed" css position or not.
//        var stickyNav = function(){
//         var scrollTop = $(window).scrollTop(); // our current vertical position from the top
             
//         // if we've scrolled more than the navigation, change its position to fixed to stick to top,
//         // otherwise change it back to relative
//         if (scrollTop > stickyNavTop) { 
//             $('#main-header').addClass('sticky');
//         } else {
//             $('#main-header').removeClass('sticky'); 
//         }
//     };

//     stickyNav();
//     // and run it again every time you scroll
//     $(window).scroll(function() {
//         stickyNav();
//     });
// });
//add by hj
function slideMenu(element) {
    if ($("#morecate").css("display") == 'none') {
        $("#morecate").slideDown(200);
        $(element).removeClass('active');
        $(element).css('display', 'none');
        $(element).css('cursor', 'pointer');
        $("#hidemore").css('display', 'block');
    } else {
        $("#morecate").slideUp(200);
        $(element).addClass('active');
        $(element).css('display', 'none');
        $("#showmore").css('display', 'block');
        $(element).css('cursor', 'pointer');
    }
}

// 상품 찜하기
function setLikeProductN(element, productid, likestatus) {
    $.ajax({
        url: base_url + 'user/main/setLikeProduct',
        type: 'POST',
        dataType: 'json',
        data: {
            productid: productid,
            likestatus: likestatus
        },
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        success: function(res) {
            if (likestatus == '1') {
                $(element).attr('src', base_url + 'assets/pc/images/line_icon_on.png');
                $(element).attr('onclick', 'setLikeProductN(this, ' + "'" + productid + "'" + ', ' + "'0'" + ');');
            } else {
                $(element).attr('src', base_url + 'assets/pc/images/line_icon_off.png');
                $(element).attr('onclick', 'setLikeProductN(this, ' + "'" + productid + "'" + ', ' + "'1'" + ');');
            }
        }
    });
}
$(".like-icon img").on('click',(e)=>{ 
    e.stopPropagation()
})
var Conclave=(function(){
    var buArr =[],arlen;
    return {
      init:function(){
        this.addCN();this.clickReg();
      },
      addCN:function(){
        var buarr = [];
        for(var i = 1; i<= photocount ; i++){ 
            if(i==1){
                buarr.push("holder_bu_awayL2");
            }else if(i==2){
                buarr.push("holder_bu_awayL1");
            }
            else if(i==3){
                buarr.push("holder_bu_center");
            }
            else if(i==4){
                buarr.push("holder_bu_awayR1");
            }
            else if(i==5){
                buarr.push("holder_bu_awayR2");
            }else{
                buarr.push("holder_bu_awayR2");
            }
        }
        // var buarr=["holder_bu_awayL2","holder_bu_awayL1","holder_bu_center","holder_bu_awayR1","holder_bu_awayR2"
        //           ,"holder_bu_awayL2","holder_bu_awayL2","holder_bu_awayL2","holder_bu_awayL2","holder_bu_awayL2"];
        for(var i=1;i<=buarr.length;++i){
          $("#bu"+i).removeClass().addClass(buarr[i-1]+" holder_bu");
        }
      },
      clickReg:function(){
        $(".holder_bu").each(function(){
          buArr.push($(this).attr('class'))
        });
        arlen=buArr.length;
        for(var i=0;i<arlen;++i){
          buArr[i]=buArr[i].replace(" holder_bu","")
        };
        $(".holder_bu").click(function(buid){
          var me=this,id=this.id||buid,joId=$("#"+id),joCN=joId.attr("class").replace(" holder_bu","");
          var cpos=buArr.indexOf(joCN),mpos=buArr.indexOf("holder_bu_center");
          if(cpos!=mpos){
              tomove=cpos>mpos?arlen-cpos+mpos:mpos-cpos;
              while(tomove){
                var t=buArr.shift();
                buArr.push(t);
                for(var i=1;i<=arlen;++i){
                  $("#bu"+i).removeClass().addClass(buArr[i-1]+" holder_bu");
                }
                --tomove;
              }
          }
        })
      },
      auto:function(){
        for(i=1;i<=1;++i){
          $(".holder_bu").delay(4000).trigger('click',"bu"+i).delay(4000);
          console.log("called");
        }
      }
    };
})();

$(document).ready(function(){
    window['conclave']=Conclave;
    Conclave.init();
})

function redirect(e,productid,url,reviewimageid){
   
    if(e.getAttribute('class')=="holder_bu_center holder_bu"){
        $.ajax({
            url: base_url + 'user/main/setVisited',
            type: 'POST',
            dataType: 'json',
            data: { 
                reviewimageid: reviewimageid
            },
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            async: false,
            success: function(res) {
               
            }
        });

        if(url != ''){
            window.location.href = url;
        }else{
            window.location.href =  base_url + 'product_detail?productid='+productid;
        }
        
    }
}

 function redirectVideo(ele,shoppingmall_kind,productid, imgurl, product_name, old_price, price_visible, sale_price, ttc_price, ttc_count, prod_rate, review_count, shipping_kind,url,reviewimageid){
   
        $.ajax({
        url: base_url + 'user/main/setVisited',
        type: 'POST',
        dataType: 'json',
        data: { 
            reviewimageid: reviewimageid
        },
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        success: function(res) {
            
        }
    });

    if(url != ''){
        window.location.href = url;
    }else{
        redirectProductdetal(ele,shoppingmall_kind,productid, imgurl, product_name, old_price, price_visible, sale_price, ttc_price, ttc_count, prod_rate, review_count, shipping_kind)
       // window.location.href =  base_url + 'product_detail?productid='+productid;
    }
        
 }
 function redirectProductdetal(ele,shoppingmall_kind,prodid, imgurl, product_name, old_price, price_visible, sale_price, ttc_price, ttc_count, prod_rate, review_count, shipping_kind){

     ele.addEventListener("click",function(e){ 
        e.preventDefault();
        e.stopPropagation(); 
        e.cancelBubble=true;
        return false;
    },false);

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
 
 
/*메인배너 스크립트 추가 230426 */
// document.querySelector('#swiper-main').addEventListener('mouseenter', () => {
//     var sm = document.getElementById('main-next');
//     var sm2 = document.getElementById('main-prev');

//     sm.style.opacity ="1";
//     sm2.style.opacity ="1";
// });

// document.querySelector('#swiper-main').addEventListener('mouseleave', () => {
//     var sm = document.getElementById('main-next');
//     var sm2 = document.getElementById('main-prev');

//     sm.style.opacity ="0";
//     sm2.style.opacity ="0";
// });


/*카테고리*/
const tabCategory = document.querySelectorAll(".tab-category");
const tabSections = document.querySelector(".tab-sections");
const tabSection = document.querySelectorAll(".tab-section")[0];
const tabIndicator = document.querySelector(".tab-indicator");
const tabContainer = document.querySelector(".tab-container");

let active = 0;

const updateTab = () => {
  tabCategory.forEach((category) => {
    if (category.classList.contains("active")) {
      category.classList.remove("active");
    }
  });

  tabIndicator.setAttribute(
    "style",
    `width: ${tabCategory[active].clientWidth}px; left: ${
      tabCategory[active].getBoundingClientRect().left -
      tabContainer.getBoundingClientRect().left
    }px;`
  );

  tabCategory[active].classList.add("active");

  tabSections.style.transform = `translateX(-${
    tabSection.clientWidth * active
  }px)`;
};

tabCategory.forEach((category, idx) => {
  category.addEventListener("click", () => {
    active = idx;
    updateTab();
  });
});

document.addEventListener("DOMContentLoaded", updateTab);


/*찜 아이콘 변경*/
$(".img1").on('click', function() {
   $(this).attr({
        src:"./images/heart_on.png"
   });
});





