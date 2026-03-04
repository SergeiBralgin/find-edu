import {removeAllClass} from './utils';

const navList = document.querySelector('.site-nav__list');
const navItems = document.querySelectorAll('.site-nav__item');

const closedMenu = (el) => {
    el.classList.remove('site-nav__item--active');
};

const openedMenu = (el) => {
    removeAllClass(navItems, 'site-nav__item--active')

    el.classList.add('site-nav__item--active');
};

navList.addEventListener('click', (evt) => {
    const navItem = evt.target.closest('.site-nav__item');

    if (!navItem.classList.contains('site-nav__item--active')) {
        openedMenu(navItem);
    } else if (evt.target.closest('.site-nav__item') && !evt.target.matches('.site-nav__sublist')) {
        closedMenu(navItem);
    }
});

document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
        removeAllClass(navItems, 'site-nav__item--active');
    }
})

document.addEventListener('click', (evt) => {
    if (!evt.target.closest('.site-nav__sublist') && !evt.target.closest('.site-nav__item')) {
        removeAllClass(navItems, 'site-nav__item--active');
    }
})
