document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* GRID */
        const customizeGrid =
            document.getElementById(
                "customizeGrid"
            );


        if (!customizeGrid) {
            return;
        }


        /* FILTER ELEMENTS */
        const floatingFilterBtn =
            document.getElementById(
                "customizeFloatingFilterBtn"
            );

        const filterPanel =
            document.getElementById(
                "customizeFilterPanel"
            );

        const filterOverlay =
            document.getElementById(
                "customizeFilterOverlay"
            );

        const filterClose =
            document.getElementById(
                "customizeFilterClose"
            );

        const filterOptions =
            document.getElementById(
                "customizeFilterOptions"
            );

        const categoryScreen =
            document.getElementById(
                "customizeCategoryScreen"
            );

        const categoryBtn =
            document.getElementById(
                "customizeCategoryBtn"
            );

        const categoryBack =
            document.getElementById(
                "customizeCategoryBack"
            );

        const lowHighBtn =
            document.getElementById(
                "customizeLowHighBtn"
            );

        const highLowBtn =
            document.getElementById(
                "customizeHighLowBtn"
            );



        if (
            !floatingFilterBtn ||
            !filterPanel ||
            !filterOverlay
        ) {
            return;
        }



        /* OPEN FILTER */
        floatingFilterBtn.addEventListener(
            "click",
            function () {

                filterPanel.classList.add(
                    "active"
                );

                filterOverlay.classList.add(
                    "active"
                );

                document.body.style.overflow =
                    "hidden";

            }
        );



        /* SHOW MAIN FILTER */
        function showMainFilter() {

            if (filterOptions) {

                filterOptions.style.display =
                    "";

            }

            if (categoryScreen) {

                categoryScreen.classList.remove(
                    "active"
                );

            }

        }



        /* SHOW CATEGORY SCREEN */
        function showCategoryScreen() {

            if (filterOptions) {

                filterOptions.style.display =
                    "none";

            }

            if (categoryScreen) {

                categoryScreen.classList.add(
                    "active"
                );

            }

        }



        /* CLOSE FILTER */
        function closeFilterPanel() {

            filterPanel.classList.remove(
                "active"
            );

            filterOverlay.classList.remove(
                "active"
            );

            document.body.style.overflow =
                "";

            showMainFilter();

        }



        /* CLOSE BUTTON */
        if (filterClose) {

            filterClose.addEventListener(
                "click",
                function () {

                    closeFilterPanel();

                }
            );

        }



        /* OVERLAY CLICK */
        filterOverlay.addEventListener(
            "click",
            function () {

                closeFilterPanel();

            }
        );



        /* ESCAPE */
        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape"
                ) {

                    closeFilterPanel();

                }

            }
        );



        /* CATEGORY BUTTON */
        if (categoryBtn) {

            categoryBtn.addEventListener(
                "click",
                function () {

                    showCategoryScreen();

                }
            );

        }



        /* CATEGORY BACK */
        if (categoryBack) {

            categoryBack.addEventListener(
                "click",
                function () {

                    showMainFilter();

                }
            );

        }



        /* GET CARDS */
        function getCards() {

            return Array.from(
                customizeGrid.querySelectorAll(
                    ".customize-card-link"
                )
            );

        }



        /* GET PRICE */
        function getPrice(card) {

            const hamperCard =
                card.querySelector(
                    ".customize-card"
                );


            if (!hamperCard) {

                return 0;

            }


            const price =
                parseFloat(
                    hamperCard.dataset.price ||
                    "0"
                );


            return Number.isFinite(price)
                ? price
                : 0;

        }



        /* GET CATEGORY */
        function getCategory(card) {

            const hamperCard =
                card.querySelector(
                    ".customize-card"
                );


            if (!hamperCard) {

                return [];

            }


            return String(
                hamperCard.dataset.category ||
                ""
            )
            .split("|")
            .map(
                function (category) {

                    return category
                        .trim()
                        .toLowerCase();

                }
            )
            .filter(
                function (category) {

                    return category !== "";

                }
            );

        }



        /* NO RESULTS MESSAGE */
        function showNoResults() {

            removeNoResults();


            const noResults =
                document.createElement(
                    "div"
                );


            noResults.className =
                "customize-no-results";


            noResults.id =
                "customizeNoResults";


            noResults.innerHTML = `

                <div class="customize-no-results-icon">

                    <img
                        src="/static/main/images/account/loginorder.png"
                        alt="No customizable hampers"
                    >

                </div>

                <h3>
                    No Gift Hampers Found
                </h3>

                <p>
                    No customizable gift hampers
                    are available in this category.
                </p>

            `;


            customizeGrid.appendChild(
                noResults
            );

        }



        /* REMOVE NO RESULTS MESSAGE*/
        function removeNoResults() {

            const existing =
                document.getElementById(
                    "customizeNoResults"
                );


            if (existing) {

                existing.remove();

            }

        }



        /* SHOW ALL CARDS */
        function showAllCards() {

            removeNoResults();


            const cards =
                getCards();


            cards.forEach(
                function (card) {

                    card.style.display =
                        "";

                }
            );

        }



        /* LOW - HIGH PRICE */
        if (lowHighBtn) {

            lowHighBtn.addEventListener(
                "click",
                function () {

                    removeNoResults();


                    const cards =
                        getCards();


                    cards.sort(
                        function (a, b) {

                            return (
                                getPrice(a) -
                                getPrice(b)
                            );

                        }
                    );


                    cards.forEach(
                        function (card) {

                            customizeGrid.appendChild(
                                card
                            );

                        }
                    );


                    showAllCards();


                    closeFilterPanel();

                }
            );

        }



        /* HIGH - LOW PRICE */
        if (highLowBtn) {

            highLowBtn.addEventListener(
                "click",
                function () {

                    removeNoResults();


                    const cards =
                        getCards();


                    cards.sort(
                        function (a, b) {

                            return (
                                getPrice(b) -
                                getPrice(a)
                            );

                        }
                    );


                    cards.forEach(
                        function (card) {

                            customizeGrid.appendChild(
                                card
                            );

                        }
                    );


                    showAllCards();


                    closeFilterPanel();

                }
            );

        }



        /* WISHLIST */
        const likeButtons =
            document.querySelectorAll(
                ".customize-like-button"
            );


        likeButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();


                        button.classList.toggle(
                            "liked"
                        );


                        if (
                            button.classList.contains(
                                "liked"
                            )
                        ) {

                            button.textContent =
                                "♥";

                        } else {

                            button.textContent =
                                "♡";

                        }

                    }
                );

            }
        );



        /* CATEGORY FILTER */
        const categoryButtons =
            document.querySelectorAll(
                ".customize-category-list button"
            );


        categoryButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        removeNoResults();


                        const selectedCategory =
                            String(
                                button.dataset.category ||
                                ""
                            )
                            .trim()
                            .toLowerCase();


                        const cards =
                            getCards();


                        let visibleCount =
                            0;


                        cards.forEach(
                            function (card) {

                                const cardCategories =
                                    getCategory(
                                        card
                                    );


                                if (
                                    cardCategories.includes(
                                        selectedCategory
                                    )
                                ) {

                                    card.style.display =
                                        "";

                                    visibleCount++;

                                } else {

                                    card.style.display =
                                        "none";

                                }

                            }
                        );


                        /* NO CATEGORY RESULTS */
                        if (
                            visibleCount === 0
                        ) {

                            showNoResults();

                        }


                        closeFilterPanel();

                    }
                );

            }
        );



        /* INITIAL STATE */
        showAllCards();

    }
);