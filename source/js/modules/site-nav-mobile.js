const navToggle = document.querySelector('.site-nav__toggle');
const nav = document.querySelector('.site-nav');
const headerWrapper = document.querySelector('.header__wrapper');
const overlay = document.querySelector('.overlay');
const body = document.querySelector('body');

const openedMenu = () => {
    nav.classList.add('site-nav--opened');
    headerWrapper.classList.add('header__wrapper--opened-menu');
    overlay.classList.add('overlay--active');
    body.style.overflow = 'hidden';
}

const closedMenu = () => {
    nav.classList.remove('site-nav--opened');
    headerWrapper.classList.remove('header__wrapper--opened-menu');
    overlay.classList.remove('overlay--active');
    body.style.overflow = '';
}

navToggle.addEventListener('click', () => {
    if (!nav.classList.contains('site-nav--opened')) {
        openedMenu();
    } else {
        closedMenu();
    }
})

overlay.addEventListener('click', () => {
    closedMenu();
})
