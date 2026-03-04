import {removeAllClass} from './utils';

const controlsBanner = document.querySelector('.promo-banner__controls');
const controls = controlsBanner.querySelectorAll('.banner-control');
const slides = document.querySelectorAll('.banner-slide');

// Создает список родителей слайдов (Родитель - li)
const parentSlides = [];
slides.forEach((slide) => {
    parentSlides.push(slide.parentElement);
});

console.log(parentSlides);

controlsBanner.addEventListener('click', (evt) => {
    const currentControl = evt.target.closest('.promo-banner__button');

    if (currentControl.classList.contains('banner-control--active')) return;

    // Убирает у всех элементов активные свойства. То есть делает сброс.
    controls.forEach((control) => {
        control.classList.remove('banner-control--active');
        control.setAttribute('aria-disabled', 'false');
    })

    // Добавляет активные свойства для кликнутой кнопки.
    currentControl.classList.add('banner-control--active');
    currentControl.setAttribute('aria-disabled', 'true');

    // Добавляет активные свойства для слайда кликнутой кнопки
    for (let slide = 0; slide < slides.length; slide++) {
        if (slides[slide].dataset.theme === currentControl.dataset.theme) {
            // Убирает активные свойства у всех слайдов
            removeAllClass(parentSlides, 'promo-banner__slide--active')

            parentSlides[slide].classList.add('promo-banner__slide--active');
            break;
        }
    }
});
