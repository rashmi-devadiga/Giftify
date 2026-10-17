document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("searchInput");
    const filterBtn = document.getElementById("filterBtn");
    const filterMenu = document.getElementById("filterMenu");
    const hamperContainer = document.getElementById("hamperContainer");
    const noResults = document.getElementById("noResults");

    if (!hamperContainer) {
        return;
    }


    /* GET HAMPER CARDS */
    let hampers = Array.from(
        hamperContainer.querySelectorAll(".hamper-card")
    );


    /* FILTER MENU TOGGLE */
    if (filterBtn && filterMenu) {

        filterBtn.addEventListener("click", function (event) {

            event.stopPropagation();

            filterMenu.classList.toggle("show");

            filterBtn.classList.toggle("active");

        });


        document.addEventListener("click", function (event) {

            if (
                !filterMenu.contains(event.target) &&
                !filterBtn.contains(event.target)
            ) {

                filterMenu.classList.remove("show");

                filterBtn.classList.remove("active");

            }

        });

    }


    /* SEARCH */
    if (searchInput) {

        searchInput.addEventListener("input", function () {

            const searchValue =
                searchInput.value.trim().toLowerCase();

            let visibleCount = 0;


            hampers.forEach(function (hamper) {

                const name =
                    hamper.dataset.name || "";

                const category =
                    hamper.dataset.category || "";


                const matches =
                    name.includes(searchValue) ||
                    category.includes(searchValue);


                if (matches) {

                    hamper.style.display = "";

                    visibleCount++;

                } else {

                    hamper.style.display = "none";

                }

            });


            showNoResults(
                visibleCount === 0 && searchValue !== ""
            );

        });

    }


    /* FILTER / SORT OPTIONS */
    if (filterMenu) {

        const filterOptions =
            filterMenu.querySelectorAll("button");


        filterOptions.forEach(function (button) {

            button.addEventListener("click", function () {

                const filterType =
                    button.dataset.filter;


                sortHampers(filterType);


                filterMenu.classList.remove("show");

                filterBtn.classList.remove("active");

            });

        });

    }


    /* SORT HAMPERS */
    function sortHampers(type) {

        hampers.sort(function (a, b) {

            const nameA =
                a.dataset.name || "";

            const nameB =
                b.dataset.name || "";


            const priceA =
                parseFloat(a.dataset.price || 0);

            const priceB =
                parseFloat(b.dataset.price || 0);


            const categoryA =
                a.dataset.category || "";

            const categoryB =
                b.dataset.category || "";


            if (type === "az") {

                return nameA.localeCompare(nameB);

            }


            if (type === "za") {

                return nameB.localeCompare(nameA);

            }


            if (type === "low") {

                return priceA - priceB;

            }


            if (type === "high") {

                return priceB - priceA;

            }


            if (type === "category") {

                return categoryA.localeCompare(categoryB);

            }


            return 0;

        });


        hampers.forEach(function (hamper) {

            hamperContainer.appendChild(hamper);

        });


        applyCurrentSearch();

    }


    /* SEARCH AFTER SORTING */
    function applyCurrentSearch() {

        if (!searchInput) {
            return;
        }


        const searchValue =
            searchInput.value.trim().toLowerCase();


        let visibleCount = 0;


        hampers.forEach(function (hamper) {

            const name =
                hamper.dataset.name || "";

            const category =
                hamper.dataset.category || "";


            const matches =
                name.includes(searchValue) ||
                category.includes(searchValue);


            if (matches) {

                hamper.style.display = "";

                visibleCount++;

            } else {

                hamper.style.display = "none";

            }

        });


        showNoResults(
            visibleCount === 0 && searchValue !== ""
        );

    }


    /* NO RESULTS MESSAGE */
    function showNoResults(show) {

        if (!noResults) {
            return;
        }


        noResults.style.display =
            show ? "block" : "none";

    }


    /* ESC KEY CLOSE FILTER MENU */
    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            if (filterMenu) {
                filterMenu.classList.remove("show");
            }

            if (filterBtn) {
                filterBtn.classList.remove("active");
            }

        }

    });

});

/* DELETE GIFT HAMPER */
document.addEventListener("DOMContentLoaded", function () {

    const deleteModal = document.getElementById("deleteModal");
    const deleteForm = document.getElementById("deleteForm");
    const deleteHamperName = document.getElementById("deleteHamperName");
    const cancelDelete = document.getElementById("cancelDelete");

    const deleteButtons =
        document.querySelectorAll(".delete-btn");


    /* OPEN DELETE MODAL */
    deleteButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const hamperId =
                button.dataset.hamperId;

            const hamperName =
                button.dataset.hamperName;


            /* Show hamper name */
            if (deleteHamperName) {

                deleteHamperName.textContent =
                    `"${hamperName}"`;
            }


            /* Set delete URL */
            deleteForm.action =
                `/admin-panel/gift-hamper/${hamperId}/delete/`;


            /* Open modal */
            deleteModal.classList.add("delete-open");

        });

    });


    /* CANCEL DELETE */
    if (cancelDelete) {

        cancelDelete.addEventListener("click", function () {

            deleteModal.classList.remove("delete-open");

        });

    }


    /* CLICK OUTSIDE MODAL */
    if (deleteModal) {

        deleteModal.addEventListener("click", function (event) {

            if (event.target === deleteModal) {

                deleteModal.classList.remove("delete-open");

            }

        });

    }


    /* ESC KEY */
    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            deleteModal.classList.remove("delete-open");

        }

    });

});