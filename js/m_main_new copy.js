$(function() {

    /*메인배너*/
    var swiper33 = new Swiper("#mbm_swiper", {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {    
            delay: 3000, // 시간 설정
            disableOnInteraction: false, // false-스와이프 후 자동 재생
          },
        pagination: {
          el: "#mbm_sp",
          clickable: "true",
          type: "fraction",
        },
      });

    /*중간배너1*/
    var swiper5 = new Swiper("#banner_m2_sub", {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      autoplay: {    
          delay: 3000, // 시간 설정
          disableOnInteraction: false, // false-스와이프 후 자동 재생
        },
    });

     /*중간배너2*/
     var swiper6 = new Swiper("#banner_m3_sub", {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      autoplay: {    
          delay: 3000, // 시간 설정
          disableOnInteraction: false, // false-스와이프 후 자동 재생
        },
    });

    /*통통몰 추천상품*/
    const  newprodswiper = new Swiper('.new-prod-swiper', {
      slidesPerView: 2.2,
      spaceBetween: 10,
      centeredSlides: false,
      loopedSlides: 2,
      loop: true,
      // autoplay: {
      //    delay: 5000,
      //    disableOnInteraction: false
      // },
   });

    newprodswiper.on('touchStart', function() {
      if (agent.search('app_android') !== -1) {
         try {
            tongtongmall.setSwiperRefreshLayout('START');
         } catch (e) {}
      }
   });

    newprodswiper.on('touchEnd', function() {
      if (agent.search('app_android') !== -1) {
         try {
            tongtongmall.setSwiperRefreshLayout('END');
         } catch (e) {}
      }
   });

   $('img.lazy').lazyload({
      effect: "fadeIn"
   });

   /*인기 상품 모음전*/
    var swiper111 = new Swiper(".mySwiper111", {
    loop: true,
    spaceBetween: 5,
    slidesPerView: 4.5,
    freeMode: true,
    watchSlidesProgress: true,
  });

  var swiper2525 = new Swiper(".mySwiper2525", {
    loop: true,
    thumbs: {
      swiper: swiper111,
    },
  });

/*고객후기*/
var swiper66 = new Swiper('#swiper-photo2', {
  slidesPerView:2.4,
  spaceBetween: 10,
  slidesPerGroup:1,
  loop:true,
  autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
  speed:1000,
 
});



});