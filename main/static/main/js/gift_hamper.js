document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* GET HAMPER GRID */
        const hamperGrid =
            document.getElementById(
                "hamperGrid"
            );


        if (!hamperGrid) {
            return;
        }



        /* GET CATEGORY TABS */
        const hamperTabs =
            document.querySelectorAll(
                ".hamper-tab"
            );



        /* GET HAMPER CARDS */
        function getHamperCards() {

            return Array.from(
                hamperGrid.querySelectorAll(
                    ".hamper-card-link"
                )
            );

        }



        /* CATEGORY FILTER */
        hamperTabs.forEach(
            function (tab) {


                tab.addEventListener(
                    "click",
                    function () {


                        /* GET SELECTED FILTER */
                        const selectedFilter =
                            (
                                this.dataset.filter ||
                                ""
                            )
                            .trim()
                            .toLowerCase();



                        /* CHANGE ACTIVE TAB */
                        hamperTabs.forEach(
                            function (item) {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        this.classList.add(
                            "active"
                        );



                        /* FILTER HAMPERS */
                        const hamperCards =
                            getHamperCards();


                        hamperCards.forEach(
                            function (cardLink) {


                                const hamperCard =
                                    cardLink.querySelector(
                                        ".hamper-card"
                                    );


                                if (!hamperCard) {
                                    return;
                                }



                                const isCustomizable =
                                    getCustomizationValue(
                                        hamperCard
                                    );



                                /* ALL */
                                if (
                                    selectedFilter ===
                                    "all"
                                ) {

                                    cardLink.style.display =
                                        "block";

                                    return;
                                }



                                /* CUSTOMIZABLE */
                                if (
                                    selectedFilter ===
                                    "customizable"
                                ) {


                                    if (
                                        isCustomizableCard(
                                            hamperCard
                                        )
                                    ) {

                                        cardLink.style.display =
                                            "block";

                                    } else {

                                        cardLink.style.display =
                                            "none";

                                    }


                                    return;
                                }



                                /* NON-CUSTOMIZABLE */
                                if (
                                    selectedFilter ===
                                    "non-customizable"
                                ) {


                                    if (
                                        !isCustomizableCard(
                                            hamperCard
                                        )
                                    ) {

                                        cardLink.style.display =
                                            "block";

                                    } else {

                                        cardLink.style.display =
                                            "none";

                                    }

                                }


                            }
                        );


                    }
                );

            }
        );



        /* WISHLIST BUTTON */
        const likeButtons =
            document.querySelectorAll(
                ".like-button"
            );


        likeButtons.forEach(
            function (button) {


                button.addEventListener(
                    "click",
                    function (event) {


                        /*
                            Prevent opening
                            gift hamper page
                        */

                        event.preventDefault();

                        event.stopPropagation();



                        /* TOGGLE LIKE */

                        button.classList.toggle(
                            "liked"
                        );



                        /* CHANGE HEART */
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



        /* GIFTIFY FLOATING FILTER */
        const floatingFilterBtn =
            document.getElementById(
                "floatingFilterBtn"
            );


        const filterPanel =
            document.getElementById(
                "giftifyFilterPanel"
            );


        const filterOverlay =
            document.getElementById(
                "giftifyFilterOverlay"
            );


        const filterClose =
            document.getElementById(
                "giftifyFilterClose"
            );


        const filterOptions =
            document.getElementById(
                "giftifyFilterOptions"
            );


        const categoryBtn =
            document.getElementById(
                "giftifyCategoryBtn"
            );


        const categoryScreen =
            document.getElementById(
                "giftifyCategoryScreen"
            );


        const categoryBack =
            document.getElementById(
                "giftifyCategoryBack"
            );



        /* CHECK FILTER ELEMENTS */
        if (
            !floatingFilterBtn ||
            !filterPanel ||
            !filterOverlay
        ) {
            return;
        }



        /* OPEN FILTER PANEL */
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



        /* CLOSE FILTER PANEL */
        function closeFilterPanel() {

            filterPanel.classList.remove(
                "active"
            );

            filterOverlay.classList.remove(
                "active"
            );


            if (categoryScreen) {

                categoryScreen.classList.remove(
                    "active"
                );

            }


            if (filterOptions) {

                filterOptions.style.display =
                    "";

            }


            document.body.style.overflow =
                "";

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



        /* CLICK OUTSIDE FILTER */
        filterOverlay.addEventListener(
            "click",
            function () {

                closeFilterPanel();

            }
        );



        /* ESCAPE KEY */
        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closeFilterPanel();

                }

            }
        );



        /* SHOW CATEGORY SCREEN */
        if (
            categoryBtn &&
            categoryScreen &&
            filterOptions
        ) {

            categoryBtn.addEventListener(
                "click",
                function () {

                    filterOptions.style.display =
                        "none";

                    categoryScreen.classList.add(
                        "active"
                    );

                }
            );

        }



        /* BACK FROM CATEGORY */
        if (
            categoryBack &&
            categoryScreen &&
            filterOptions
        ) {

            categoryBack.addEventListener(
                "click",
                function () {

                    categoryScreen.classList.remove(
                        "active"
                    );

                    filterOptions.style.display =
                        "";

                }
            );

        }



        /* GET CUSTOMIZATION VALUE */
        function getCustomizationValue(
            hamperCard
        ) {

            if (!hamperCard) {
                return "";
            }


            return String(
                hamperCard.dataset.customizable ||
                ""
            )
            .trim()
            .toLowerCase();

        }



        /* CHECK IF CUSTOMIZABLE */
        function isCustomizableCard(
            hamperCard
        ) {

            const value =
                getCustomizationValue(
                    hamperCard
                );


            /*
                These values mean CUSTOMIZABLE.
            */
            if (
                value === "true" ||
                value === "yes" ||
                value === "1" ||
                value === "customizable"
            ) {

                return true;

            }


            /*
                Everything else is treated
                as READY-MADE.
            */
            return false;

        }



        /* FILTER HAMPERS FUNCTION */
        function filterHampersByCustomizable(
            customizableValue
        ) {

            const hamperCards =
                getHamperCards();


            hamperCards.forEach(
                function (cardLink) {

                    const hamperCard =
                        cardLink.querySelector(
                            ".hamper-card"
                        );


                    if (!hamperCard) {
                        return;
                    }


                    const isCustomizable =
                        isCustomizableCard(
                            hamperCard
                        );


                    /* CUSTOMIZE HAMPER */
                    if (
                        customizableValue ===
                        "true"
                    ) {

                        if (
                            isCustomizable
                        ) {

                            cardLink.style.display =
                                "block";

                        } else {

                            cardLink.style.display =
                                "none";

                        }


                        return;

                    }



                    /* READY-MADE HAMPERS */
                    if (
                        customizableValue ===
                        "false"
                    ) {

                        if (
                            !isCustomizable
                        ) {

                            cardLink.style.display =
                                "block";

                        } else {

                            cardLink.style.display =
                                "none";

                        }

                    }

                }
            );

        }



        /* SHOW ALL HAMPERS */
        function showAllHampers() {

            const hamperCards =
                getHamperCards();


            hamperCards.forEach(
                function (cardLink) {

                    cardLink.style.display =
                        "block";

                }
            );

        }



        /* PRICE VALUE */
        function getHamperPrice(
            cardLink
        ) {

            const hamperCard =
                cardLink.querySelector(
                    ".hamper-card"
                );


            if (!hamperCard) {
                return 0;
            }


            let price =
                hamperCard.dataset.price;


            /* Fallback 1 */
            if (
                price === undefined ||
                price === null ||
                price === ""
            ) {

                price =
                    hamperCard.dataset.finalPrice;

            }


            /* Fallback 2 */
            if (
                price === undefined ||
                price === null ||
                price === ""
            ) {

                price =
                    hamperCard.dataset.sellingPrice;

            }


            /*
                Remove ₹, commas,
                spaces and other characters.
            */
            price =
                String(
                    price || ""
                )
                .replace(
                    /[^0-9.]/g,
                    ""
                );


            const numericPrice =
                parseFloat(
                    price
                );


            return isNaN(
                numericPrice
            )
                ? 0
                : numericPrice;

        }



        /* SORT PRICE LOW - HIGH */
        function sortLowToHigh() {

            const cards =
                getHamperCards();


            cards.sort(
                function (a, b) {

                    return (
                        getHamperPrice(a) -
                        getHamperPrice(b)
                    );

                }
            );


            cards.forEach(
                function (card) {

                    hamperGrid.appendChild(
                        card
                    );

                }
            );


            showAllHampers();

        }



        /* SORT PRICE HIGH - LOW */
        function sortHighToLow() {

            const cards =
                getHamperCards();


            cards.sort(
                function (a, b) {

                    return (
                        getHamperPrice(b) -
                        getHamperPrice(a)
                    );

                }
            );


            cards.forEach(
                function (card) {

                    hamperGrid.appendChild(
                        card
                    );

                }
            );


            showAllHampers();

        }



        /* CATEGORY FILTER */
        function filterByCategory(
            selectedCategory
        ) {

            const hamperCards =
                getHamperCards();


            const wantedCategory =
                String(
                    selectedCategory || ""
                )
                .trim()
                .toLowerCase();


            hamperCards.forEach(
                function (cardLink) {

                    const hamperCard =
                        cardLink.querySelector(
                            ".hamper-card"
                        );


                    if (!hamperCard) {
                        return;
                    }


                    /* GET ALL CATEGORIES */
                    const cardCategories =
                        String(
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


                    /* CHECK CATEGORY */
                    if (
                        cardCategories.includes(
                            wantedCategory
                        )
                    ) {

                        cardLink.style.display =
                            "block";

                    } else {

                        cardLink.style.display =
                            "none";

                    }

                }
            );

        }



        /* MAIN FILTER OPTIONS */
        const filterButtons =
            document.querySelectorAll(
                ".giftify-filter-option[data-filter]"
            );


        filterButtons.forEach(
            function (option) {

                option.addEventListener(
                    "click",
                    function () {


                        const selectedFilter =
                            (
                                this.dataset.filter ||
                                ""
                            )
                            .trim()
                            .toLowerCase();



                        /* READY-MADE HAMPERS */
                        if (
                            selectedFilter ===
                            "ready-made"
                        ) {

                            filterHampersByCustomizable(
                                "false"
                            );

                            closeFilterPanel();

                            return;

                        }



                        /* CUSTOMIZE HAMPER */
                        if (
                            selectedFilter ===
                            "customize"
                        ) {

                            filterHampersByCustomizable(
                                "true"
                            );

                            closeFilterPanel();

                            return;

                        }



                        /* LOW - HIGH */
                        if (
                            selectedFilter ===
                            "low-high"
                        ) {

                            sortLowToHigh();

                            closeFilterPanel();

                            return;

                        }



                        /* HIGH - LOW */
                        if (
                            selectedFilter ===
                            "high-low"
                        ) {

                            sortHighToLow();

                            closeFilterPanel();

                            return;

                        }

                    }
                );

            }
        );



        /* CATEGORY SELECTION */
        const categoryItems =
            document.querySelectorAll(
                ".giftify-category-list button"
            );


        categoryItems.forEach(
            function (category) {

                category.addEventListener(
                    "click",
                    function () {


                        const selectedCategory =
                            this.dataset.category;


                        if (
                            !selectedCategory
                        ) {

                            return;

                        }


                        filterByCategory(
                            selectedCategory
                        );


                        closeFilterPanel();

                    }
                );

            }
        );


    }
);