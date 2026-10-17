document.addEventListener("DOMContentLoaded", function () {

    /* HERO SLIDER */
    const slides =
        document.querySelectorAll(".hero-slide");

    const prevBtn =
        document.getElementById("prevBtn");

    const nextBtn =
        document.getElementById("nextBtn");

    if (slides.length) {

        let currentSlide = 0;

        let slideTimer;

        const slideDuration = 5000;

        /* SHOW SLIDE */
        function showSlide(index) {

            slides.forEach(function (slide) {
                slide.classList.remove(
                    "active-slide"
                );
            });

            if (index >= slides.length) {
                currentSlide = 0;
            }

            if (index < 0) {
                currentSlide =
                    slides.length - 1;
            }

            slides[currentSlide].classList.add(
                "active-slide"
            );
        }

        /* NEXT */
        function nextSlide() {

            currentSlide++;

            if (currentSlide >= slides.length) {
                currentSlide = 0;
            }

            showSlide(currentSlide);
        }

        /* PREVIOUS */
        function previousSlide() {

            currentSlide--;

            if (currentSlide < 0) {
                currentSlide =
                    slides.length - 1;
            }

            showSlide(currentSlide);
        }

        /* AUTO SLIDE */
        function startSlider() {

            clearInterval(slideTimer);

            slideTimer =
                setInterval(
                    nextSlide,
                    slideDuration
                );
        }

        function stopSlider() {

            clearInterval(slideTimer);
        }

        /* BUTTONS */
        if (nextBtn) {

            nextBtn.addEventListener(
                "click",
                function () {

                    nextSlide();
                    startSlider();

                }
            );
        }

        if (prevBtn) {

            prevBtn.addEventListener(
                "click",
                function () {

                    previousSlide();
                    startSlider();

                }
            );
        }

        /* PAUSE WHEN HOVERING */
        const slider =
            document.querySelector(
                ".hero-slider"
            );

        if (slider) {

            slider.addEventListener(
                "mouseenter",
                stopSlider
            );

            slider.addEventListener(
                "mouseleave",
                startSlider
            );
        }

        /* MOBILE SWIPE */
        let touchStartX = 0;
        let touchEndX = 0;

        if (slider) {

            slider.addEventListener(
                "touchstart",
                function (event) {

                    touchStartX =
                        event.changedTouches[0].screenX;

                },
                {
                    passive: true
                }
            );

            slider.addEventListener(
                "touchend",
                function (event) {

                    touchEndX =
                        event.changedTouches[0].screenX;

                    const difference =
                        touchStartX -
                        touchEndX;

                    if (Math.abs(difference) < 45) {
                        return;
                    }

                    if (difference > 0) {

                        nextSlide();

                    } else {

                        previousSlide();

                    }

                    startSlider();

                },
                {
                    passive: true
                }
            );
        }

        /* START */
        showSlide(currentSlide);

        startSlider();
    }


    /* PRODUCT CARD STAGGER ANIMATION */
    const productCards =
        document.querySelectorAll(
            ".product-card"
        );

    productCards.forEach(
        function (card, index) {

            card.style.animationDelay =
                `${index * 0.06}s`;

        }
    );


    /* CATEGORY HOVER */
    const categoryItems =
        document.querySelectorAll(
            ".category-item"
        );

    categoryItems.forEach(
        function (item) {

            item.addEventListener(
                "mouseenter",
                function () {

                    item.classList.add(
                        "category-hover"
                    );

                }
            );

            item.addEventListener(
                "mouseleave",
                function () {

                    item.classList.remove(
                        "category-hover"
                    );

                }
            );

        }
    );


    /* MOST POPULAR GIFTS SLIDER */
    const popularContainer =
        document.getElementById(
            "popularContainer"
        );

    const popularPrev =
        document.getElementById(
            "popularPrev"
        );

    const popularNext =
        document.getElementById(
            "popularNext"
        );

    if (popularContainer) {

        const popularCards =
            popularContainer.querySelectorAll(
                ".popular-card"
            );


        /* GET ONE CARD SCROLL AMOUNT */
        function getScrollAmount() {

            if (!popularCards.length) {
                return 0;
            }

            const card =
                popularCards[0];

            const cardWidth =
                card.offsetWidth;

            const gap = 20;

            return cardWidth + gap;
        }


        /* NEXT BUTTON */
        if (popularNext) {

            popularNext.addEventListener(
                "click",
                function () {

                    popularContainer.scrollBy({

                        left:
                            getScrollAmount(),

                        behavior:
                            "smooth"

                    });

                }
            );
        }


        /* PREVIOUS BUTTON */
        if (popularPrev) {

            popularPrev.addEventListener(
                "click",
                function () {

                    popularContainer.scrollBy({

                        left:
                            -getScrollAmount(),

                        behavior:
                            "smooth"

                    });

                }
            );
        }


        /* MOBILE SWIPE */
        let popularTouchStartX = 0;

        let popularTouchEndX = 0;


        popularContainer.addEventListener(
            "touchstart",
            function (event) {

                popularTouchStartX =
                    event.changedTouches[0].screenX;

            },
            {
                passive: true
            }
        );


        popularContainer.addEventListener(
            "touchend",
            function (event) {

                popularTouchEndX =
                    event.changedTouches[0].screenX;

                const difference =
                    popularTouchStartX -
                    popularTouchEndX;


                /* Ignore small movement */
                if (Math.abs(difference) < 45) {
                    return;
                }


                /* Swipe LEFT */
                if (difference > 0) {

                    popularContainer.scrollBy({

                        left:
                            getScrollAmount(),

                        behavior:
                            "smooth"

                    });

                }


                /* Swipe RIGHT */
                else {

                    popularContainer.scrollBy({

                        left:
                            -getScrollAmount(),

                        behavior:
                            "smooth"

                    });

                }

            },
            {
                passive: true
            }
        );

    }

});