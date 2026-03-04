import Swiper from 'swiper';

let swiper = null;

const createSwiper = () => {
    swiper = new Swiper('.promo-banner__slider', {
        slidesPerView: 'auto',
        slidesPerGroup: 1,
        spaceBetween: 10,
        speed: 400,
        loop: true,
        slidesOffsetBefore: 20,
        slidesOffsetAfter: 20,
        breakpoints: {
            768: {
                spaceBetween: 15,
                slidesOffsetBefore: 45,
                slidesOffsetAfter: 45
            }
        }
    });
}

const destroySwiper = () => {
    swiper.destroy(true, true);
    swiper = null;
}

// Медиа-запрос: мобильный = max-width 1023px
const mediaQuery = window.matchMedia('(max-width: 1023px)');

const handleMediaChange = (element) => {
    if (element.matches) {
        if (!swiper) {
            createSwiper();
        }
    } else {
        if (swiper) {
            destroySwiper();
        }
    }
}

mediaQuery.addEventListener('change', handleMediaChange);
handleMediaChange(mediaQuery);

const section = document.querySelector('.promo-banner');
const buttonPrev = section.querySelector('.slider-navigation__button--prev');
const buttonNext = section.querySelector('.slider-navigation__button--next');

buttonPrev.addEventListener('click', () => swiper.slidePrev());
buttonNext.addEventListener('click', () => swiper.slideNext());
