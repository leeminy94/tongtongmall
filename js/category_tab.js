window.addEventListener('load', function(){
    // nav
    const pageEl = document.querySelectorAll('[class*="page-scroll"]');
    const item = document.querySelectorAll('.depth .swiper-wrapper .swiper-slide')
    const nav = document.querySelector('.nav_area').clientHeight;
    let arr = [];

    for(let i = 0;i < pageEl.length; i++) {
        arr.push(pageEl[i].offsetTop - nav);
    }
    arr[0] = 0;

    item.forEach(function(el, idx){
        el.addEventListener('click', function(){
            let top = arr[idx];
            window.scroll({ top: top, left: 0, behavior: 'smooth' });
        })
    })

    const depth = new Swiper(".depth", {
        slidesPerView:'auto',
        // spaceBetween:15,
        slidesOffsetAfter: 30,
        preventClicks: true,
        preventClicksPropagation: false,
        observer: true,
        observeParents: true
    });
    // tab selected
    window.addEventListener('scroll', function(){
        pageEl.forEach(function(el, idx){
            const tegTop = el.getBoundingClientRect().top - (nav + 1);
            const tegBottom = el.getBoundingClientRect().bottom;
            if (0 > tegTop && 0 < tegBottom) {
                item.forEach(function(_el){
                    _el.classList.remove('on');
                })
                item[idx].classList.add('on');
                muCenter(item[idx]);
            }
        })
        
    });

    const muCenter = function(target) {
        const depthWrap = document.querySelector('.depth .swiper-wrapper');
        const box = document.querySelector('.depth');
        let targetPos = target.offsetLeft + target.offsetWidth/2;
        let boxHalf = box.offsetWidth/2;
        let pos;
        let listWidth=0;
        
        depthWrap.querySelectorAll('.swiper-slide').forEach(function(el){ listWidth += el.offsetWidth; })
        
        if (targetPos <= boxHalf) pos = 0; //left
        else if ((listWidth - targetPos) <= boxHalf) pos = listWidth-box.offsetWidth; //right
        else pos = targetPos - boxHalf;
        
        depthWrap.style.transform = "translate3d("+ (pos*-1) +"px, 0, 0)";
        depthWrap.style.transitionDuration = "300ms";
    }

    const nav_offset = document.querySelector('.nav_area').offsetTop;
    const scrollPos = function() {
        const winSc = window.pageYOffset || document.documentElement.scrollTop;
        const height = document.querySelector('.nav_area').offsetHeight;
        if(winSc > nav_offset){
            document.querySelector('.nav_area').classList.add('fixed');
        }else{
            document.querySelector('.nav_area').classList.remove('fixed');
        }
    }
    scrollPos();
    window.addEventListener('scroll', function(){
        scrollPos();
    });
});
