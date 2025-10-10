export const handlePageScroller = (fetchNextPage) => {

    const innerHeight = window.innerHeight;
    const scrollTop = document.documentElement.scrollTop;
    const offsetHeight = document.documentElement.offsetHeight;
    const scrollBottom = innerHeight + scrollTop;

    if (scrollBottom >= offsetHeight) {
        setTimeout(() => {
            fetchNextPage();
        }, 150);
    }

};

