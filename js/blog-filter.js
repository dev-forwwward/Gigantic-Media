document.addEventListener('DOMContentLoaded', function () {
    let filterBtn = document.querySelector('.list-filter-clear');
    const filterBtnsList = document.querySelectorAll('.list-filter-wrapper-item-radio');
    const container = document.querySelector('.filter-form-block');
    
    // Track manual vs automatic scrolling
    let isAutoScrolling = false;
    let isUserScrolling = false;
    let scrollTimeout;
    
    // Detect manual scrolling (only when it's NOT auto-scrolling)
    if (container) {
        container.addEventListener('scroll', function() {
            if (!isAutoScrolling) {
                isUserScrolling = true;
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    isUserScrolling = false;
                }, 200);
            }
        });
    }

    if (filterBtnsList.length > 0 || filterBtn) {
        filterBtnsList.forEach(function (btn) {
            btn.addEventListener('click', function () {
                filterBtn.classList.remove('clear_active');

                if (window.innerWidth < 991) {
                    scrollToElement(btn);
                }
            });
        });

        filterBtn.addEventListener('click', function () {
            filterBtn.classList.add('clear_active');

            if (window.innerWidth < 991) {
                scrollToElement(filterBtn);
            }
        });
    }

    function scrollToElement(element) {
        if (!container || !element) return;
        
        // Don't scroll if user was recently scrolling manually
        if (isUserScrolling) return;

        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        // calculate horizontal scroll position to center the element
        const elementLeft = elementRect.left - containerRect.left + container.scrollLeft;
        const containerWidth = container.clientWidth;
        const elementWidth = elementRect.width;

        // center the element in the container
        const scrollPosition = elementLeft - (containerWidth / 2) + (elementWidth / 2);

        // Mark as auto-scrolling to prevent interference
        isAutoScrolling = true;
        
        container.scrollTo({
            left: Math.max(0, scrollPosition),
            behavior: 'smooth'
        });
        
        // Reset auto-scrolling flag after animation completes
        setTimeout(() => {
            isAutoScrolling = false;
        }, 800); // Approximate duration of smooth scroll
    }
});