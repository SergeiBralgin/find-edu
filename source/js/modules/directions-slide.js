import {removeAllClass} from './utils';

const slider = document.querySelector('.directions__slider');
const slides = document.querySelectorAll('.directions__slide');

slider.addEventListener('click', (evt) => {
    const currentSlide = evt.target.closest('.directions__slide');
    console.log(currentSlide)

    if (!currentSlide.classList.contains('directions__slide--active')) {
        removeAllClass(slides, 'directions__slide--active');
        currentSlide.classList.add('directions__slide--active');
    }
})
