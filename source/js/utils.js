export const removeAllClass = (list, removeClass) => {
    list.forEach((item) => {
        item.classList.remove(removeClass);
    })
}
