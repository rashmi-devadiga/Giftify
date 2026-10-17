document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("inventorySearch");
    const filterBtn = document.getElementById("filterBtn");
    const filterMenu = document.getElementById("filterMenu");
    const categoryMenu = document.getElementById("categoryMenu");
    const noResults = document.getElementById("noResults");

    let currentFilter = "all";
    let currentCategory = null;


    /* FILTER MENU */
    filterBtn.addEventListener("click", function (event) {

        event.stopPropagation();

        filterMenu.classList.toggle("show");

    });


    /* Prevent menu from closing when clicking inside */
    filterMenu.addEventListener("click", function (event) {
        event.stopPropagation();
    });


    /* Close menu when clicking outside */
    document.addEventListener("click", function () {

        filterMenu.classList.remove("show");
        categoryMenu.classList.remove("show");

    });


    /* CATEGORY MENU */
    const categoryButton = document.querySelector(
        '[data-filter="category"]'
    );

    categoryButton.addEventListener("click", function () {

        categoryMenu.classList.toggle("show");

    });


    /* FILTER BUTTONS */
    const filterButtons = document.querySelectorAll(
        ".filter-menu > button[data-filter]"
    );

    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const filter = this.dataset.filter;

            if (filter === "category") {
                return;
            }

            currentFilter = filter;
            currentCategory = null;

            applyFilters();

            filterMenu.classList.remove("show");

        });

    });


    /* CATEGORY FILTER */
    const categoryButtons = document.querySelectorAll(
        ".category-menu button"
    );

    categoryButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            currentFilter = "category";
            currentCategory = this.dataset.category;

            applyFilters();

            filterMenu.classList.remove("show");
            categoryMenu.classList.remove("show");

        });

    });


    /* SEARCH */
    searchInput.addEventListener("input", function () {

        applyFilters();

    });


    /* NORMALIZE CATEGORY */
    function normalizeCategory(value) {

        return String(value || "")
            .trim()
            .toLowerCase()
            .replace(/\s*&\s*/g, " & ")
            .replace(/\s+/g, " ");

    }


    /* GET ITEM CATEGORIES */
    function getItemCategories(value) {

        value = String(value || "").trim();

        if (!value) {
            return [];
        }

        /*
           Handle JSON-style or Python-style lists.
           Parse quoted category values without splitting
           on commas that belong inside a category name.
        */
        if (
            value.startsWith("[") &&
            value.endsWith("]")
        ) {

            const content = value.slice(1, -1);
            const categories = [];

            const categoryPattern =
                /(['"])(.*?)\1/g;

            let match;

            while ((match = categoryPattern.exec(content)) !== null) {

                categories.push(
                    normalizeCategory(match[2])
                );

            }

            if (categories.length > 0) {
                return categories;
            }

            return content
                .split(",")
                .map(function (item) {
                    return normalizeCategory(item);
                })
                .filter(Boolean);

        }

        return [normalizeCategory(value)];

    }


    /* APPLY FILTERS */
    function applyFilters() {

        const searchValue =
            searchInput.value.trim().toLowerCase();

        const rows = document.querySelectorAll(
            ".inventory-row"
        );

        let visibleCount = 0;


        rows.forEach(function (row) {

            const name =
                (row.dataset.name || "").toLowerCase();

            const category =
                row.dataset.category || "";

            const type =
                (row.dataset.type || "").toLowerCase();

            const stock =
                parseInt(row.dataset.stock) || 0;


            let matchesSearch =
                name.includes(searchValue) ||
                category.toLowerCase().includes(searchValue);


            let matchesFilter = true;


            /* In Stock */
            if (currentFilter === "in-stock") {

                matchesFilter = stock > 0;

            }


            /* Out of Stock */
            else if (currentFilter === "out-of-stock") {

                matchesFilter = stock === 0;

            }


            /* Products */
            else if (currentFilter === "product") {

                matchesFilter = type === "product";

            }


            /* Gift Hampers */
            else if (currentFilter === "hamper") {

                matchesFilter = type === "hamper";

            }


            /* Category */
            else if (currentFilter === "category") {

                const selectedCategory =
                    normalizeCategory(currentCategory);

                const itemCategories =
                    getItemCategories(category);

                matchesFilter =
                    itemCategories.includes(selectedCategory);

            }


            if (matchesSearch && matchesFilter) {

                row.style.display = "";
                visibleCount++;

            } else {

                row.style.display = "none";

            }

        });


        /* Show no results */
        if (visibleCount === 0) {

            noResults.classList.add("show");

        } else {

            noResults.classList.remove("show");

        }

    }


    /* STOCK INCREMENT / DECREMENT */
    document.addEventListener("click", function (event) {

        const increaseBtn =
            event.target.closest(".increase-btn");

        const decreaseBtn =
            event.target.closest(".decrease-btn");


        /* Increase */
        if (increaseBtn) {

            const row =
                increaseBtn.closest(".inventory-row");

            updateStock(row, 1);

        }


        /* Decrease */
        if (decreaseBtn) {

            const row =
                decreaseBtn.closest(".inventory-row");

            updateStock(row, -1);

        }

    });


    function updateStock(row, amount) {

        let stock =
            parseInt(row.dataset.stock) || 0;


        stock += amount;


        /* Don't allow negative stock */
        if (stock < 0) {
            stock = 0;
        }


        row.dataset.stock = stock;


        /* Update number */
        const stockNumber =
            row.querySelector(".stock-number");

        stockNumber.textContent = stock;


        /* Update status */
        const statusBadge =
            row.querySelector(".status-badge");


        if (stock > 0) {

            statusBadge.classList.remove(
                "out-of-stock"
            );

            statusBadge.classList.add(
                "in-stock"
            );

            statusBadge.innerHTML =
                '<span class="status-dot"></span> In Stock';

        } else {

            statusBadge.classList.remove(
                "in-stock"
            );

            statusBadge.classList.add(
                "out-of-stock"
            );

            statusBadge.innerHTML =
                '<span class="status-dot"></span> Out of Stock';

        }

    }


    /* REMOVE ITEM */
    document.addEventListener("click", function (event) {

        const removeBtn =
            event.target.closest(".remove-btn");


        if (!removeBtn) {
            return;
        }


        const row =
            removeBtn.closest(".inventory-row");


        const itemName =
            row.dataset.name;


        const confirmed =
            confirm(
                `Remove "${itemName}" from inventory?`
            );


        if (confirmed) {

            row.remove();

            applyFilters();

        }

    });

});