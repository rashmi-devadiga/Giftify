document.addEventListener("DOMContentLoaded", function () {

    /* ELEMENTS */
    const searchInput = document.getElementById("productSearch");
    const filterButton = document.getElementById("filterButton");
    const filterMenu = document.getElementById("filterMenu");
    const productGrid = document.getElementById("productsGrid");
    const productCount = document.getElementById("productCount");
    const noResults = document.getElementById("noSearchResults");


    /* PRODUCT SEARCH + FILTER */
    if (productGrid) {

        let products = Array.from(
            productGrid.querySelectorAll(".product-card")
        );


        /* FILTER BUTTON */
        if (filterButton && filterMenu) {

            filterButton.addEventListener("click", function (event) {

                event.stopPropagation();

                filterMenu.classList.toggle("show");
                filterButton.classList.toggle("active");

            });


            document.addEventListener("click", function (event) {

                if (
                    !filterMenu.contains(event.target) &&
                    !filterButton.contains(event.target)
                ) {

                    filterMenu.classList.remove("show");
                    filterButton.classList.remove("active");

                }

            });

        }


        /* SEARCH */
        if (searchInput) {

            searchInput.addEventListener("input", function () {

                const search = searchInput.value
                    .trim()
                    .toLowerCase();

                let visibleCount = 0;

                products.forEach(function (product) {

                    const name =
                        product.dataset.name || "";

                    const category =
                        product.dataset.category || "";

                    const matches =
                        name.includes(search) ||
                        category.includes(search);

                    if (matches) {

                        product.style.display = "";
                        visibleCount++;

                    } else {

                        product.style.display = "none";

                    }

                });


                updateCount(visibleCount);


                if (noResults) {

                    if (
                        visibleCount === 0 &&
                        search !== ""
                    ) {

                        noResults.style.display = "block";

                    } else {

                        noResults.style.display = "none";

                    }

                }

            });

        }


        /* SORTING */
        const filterOptions = filterMenu
            ? filterMenu.querySelectorAll("button")
            : [];


        filterOptions.forEach(function (button) {

            button.addEventListener("click", function () {

                const sortType =
                    button.dataset.sort;

                sortProducts(sortType);


                if (filterMenu) {

                    filterMenu.classList.remove("show");

                }


                if (filterButton) {

                    filterButton.classList.remove("active");

                }

            });

        });


        function sortProducts(type) {

            products.sort(function (a, b) {

                if (type === "az") {

                    return a.dataset.name.localeCompare(
                        b.dataset.name
                    );

                }


                if (type === "price-low") {

                    return (
                        parseFloat(a.dataset.price || 0) -
                        parseFloat(b.dataset.price || 0)
                    );

                }


                if (type === "price-high") {

                    return (
                        parseFloat(b.dataset.price || 0) -
                        parseFloat(a.dataset.price || 0)
                    );

                }


                if (type === "category") {

                    return a.dataset.category.localeCompare(
                        b.dataset.category
                    );

                }


                return 0;

            });


            products.forEach(function (product) {

                productGrid.appendChild(product);

            });


            updateCount(products.length);

        }


        /* PRODUCT COUNT */
        function updateCount(count) {

            if (!productCount) {
                return;
            }

            productCount.textContent =
                count === 1
                    ? "1 product"
                    : `${count} products`;

        }

    }


    /* DELETE PRODUCT */
    const deleteModal =
        document.getElementById("deleteModal");

    const deleteForm =
        document.getElementById("deleteForm");

    const deleteProductName =
        document.getElementById("deleteProductName");

    const cancelDelete =
        document.getElementById("cancelDelete");

    const deleteButtons =
        document.querySelectorAll(".delete-product-btn");


    console.log("=================================");
    console.log("PRODUCT DELETE SYSTEM LOADED");
    console.log("Delete buttons:", deleteButtons.length);
    console.log("Modal:", deleteModal);
    console.log("Form:", deleteForm);
    console.log("=================================");


    /* OPEN DELETE MODAL */
    deleteButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();


            const productName =
                button.dataset.productName;

            const deleteUrl =
                button.dataset.deleteUrl;


            console.log("DELETE CLICKED");
            console.log("Product:", productName);
            console.log("Delete URL:", deleteUrl);


            /* PRODUCT NAME */
            if (deleteProductName) {

                deleteProductName.textContent =
                    `"${productName}"`;

            }


            /* DELETE FORM ACTION */
            if (deleteForm) {

                deleteForm.action = deleteUrl;

                console.log(
                    "Form action:",
                    deleteForm.action
                );

            }


            /* OPEN MODAL */
            if (deleteModal) {

                deleteModal.classList.add("delete-open");

                document.body.classList.add("modal-open");

            }

        });

    });


    /* CANCEL */
    if (cancelDelete) {

        cancelDelete.addEventListener("click", function () {

            closeDeleteModal();

        });

    }


    /* CLICK OUTSIDE */
    if (deleteModal) {

        deleteModal.addEventListener("click", function (event) {

            if (event.target === deleteModal) {

                closeDeleteModal();

            }

        });

    }


    /* ESC KEY */
    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            closeDeleteModal();

        }

    });


    /* CLOSE MODAL */

    function closeDeleteModal() {

        if (!deleteModal) {
            return;
        }

        deleteModal.classList.remove("delete-open");

        document.body.classList.remove("modal-open");

    }

});