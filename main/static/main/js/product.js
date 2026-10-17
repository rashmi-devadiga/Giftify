document.addEventListener("DOMContentLoaded", function () {

    /* ELEMENTS */
    const drawer =
        document.getElementById("productDrawer");

    const overlay =
        document.getElementById("productDrawerOverlay");

    const closeButton =
        document.getElementById("closeProductDrawer");

    const addProductButtons =
        document.querySelectorAll(".add-product-button");

    const searchInput =
        document.getElementById("productSearch");

    const filterButton =
        document.getElementById("productFilterButton");

    const filterArea =
        document.getElementById("productFilterArea");

    const filterOptions =
        document.querySelectorAll(".product-filter-option");

    const productCards =
        Array.from(
            document.querySelectorAll(".product-card")
        );

    const previousPage =
        document.getElementById("previousPage");

    const nextPage =
        document.getElementById("nextPage");

    const paginationNumbers =
        document.getElementById("paginationNumbers");

    const bagCount =
        document.getElementById("bagCount");


    /* BAG ELEMENTS */
    const productBagButton =
        document.getElementById("productBagButton");

    const productBagPanel =
        document.getElementById("productBagPanel");

    const closeProductBag =
        document.getElementById("closeProductBag");

    const productBagItems =
        document.getElementById("productBagItems");


    /* SETTINGS */
    const productsPerPage = 10;

    let currentPage = 1;

    let currentFilter = "all";

    let productBag = [];


    /* PRODUCT POPUP
       NEW - SINGLE PRODUCT VIEW */
    let productPopup =
        document.getElementById("singleProductPopup");


    /*
       Create popup automatically

       This means you do NOT need to change your existing
       HTML just for the popup
    */
    if (!productPopup) {

        productPopup =
            document.createElement("div");

        productPopup.id =
            "singleProductPopup";

        productPopup.innerHTML = `

            <div
                class="single-product-popup-overlay"
                id="singleProductPopupOverlay"
            ></div>


            <div
                class="single-product-popup"
                role="dialog"
                aria-modal="true"
            >

                <button
                    type="button"
                    class="single-product-popup-close"
                    id="singleProductPopupClose"
                    aria-label="Close"
                >
                    ×
                </button>


                <div
                    class="single-product-popup-image"
                    id="singleProductPopupImage"
                >
                </div>


                <div
                    class="single-product-popup-content"
                >

                    <h2
                        id="singleProductPopupName"
                    ></h2>


                    <div
                        class="single-product-popup-price"
                    >

                        <span
                            id="singleProductPopupSellingPrice"
                        ></span>

                        <span
                            id="singleProductPopupOriginalPrice"
                        ></span>

                    </div>


                    <button
                        type="button"
                        class="single-product-popup-add"
                        id="singleProductPopupAdd"
                    >
                        ADD
                    </button>

                </div>

            </div>

        `;

        document.body.appendChild(
            productPopup
        );

    }


    const singleProductPopupOverlay =
        document.getElementById(
            "singleProductPopupOverlay"
        );

    const singleProductPopupClose =
        document.getElementById(
            "singleProductPopupClose"
        );

    const singleProductPopupImage =
        document.getElementById(
            "singleProductPopupImage"
        );

    const singleProductPopupName =
        document.getElementById(
            "singleProductPopupName"
        );

    const singleProductPopupSellingPrice =
        document.getElementById(
            "singleProductPopupSellingPrice"
        );

    const singleProductPopupOriginalPrice =
        document.getElementById(
            "singleProductPopupOriginalPrice"
        );

    const singleProductPopupAdd =
        document.getElementById(
            "singleProductPopupAdd"
        );


    let selectedProductCard = null;


    /* GET PRODUCT INFORMATION NEW */
    function getProductInformation(card) {

        if (!card) {
            return null;
        }


        /* PRODUCT ID */
        const productId =
            card.dataset.productId ||
            card.getAttribute("data-product-id") ||
            "";


        /* PRODUCT NAME */
        let productName =
            card.dataset.name ||
            card.getAttribute("data-name") ||
            "";


        if (!productName) {

            const nameElement =
                card.querySelector(
                    ".product-name, .product-title, .product-card-name"
                );

            if (nameElement) {

                productName =
                    nameElement.textContent.trim();

            }

        }


        /* SELLING PRICE */
        let sellingPrice =
            card.dataset.price ||
            card.getAttribute("data-price") ||
            "";


        if (!sellingPrice) {

            const priceElement =
                card.querySelector(
                    ".product-price, .selling-price, .price"
                );

            if (priceElement) {

                sellingPrice =
                    priceElement.textContent
                        .replace(/[^\d.]/g, "")
                        .trim();

            }

        }


        /* ORIGINAL PRICE */
        let originalPrice =
            card.dataset.originalPrice ||
            card.getAttribute("data-original-price") ||
            "";


        if (!originalPrice) {

            const originalPriceElement =
                card.querySelector(
                    ".original-price, .old-price, .mrp, .product-original-price, del, s"
                );

            if (originalPriceElement) {

                originalPrice =
                    originalPriceElement.textContent
                        .replace(/[^\d.]/g, "")
                        .trim();

            }

        }


        /* PRODUCT IMAGE */
        let productImage =
            card.dataset.image ||
            card.dataset.productImage ||
            card.getAttribute("data-image") ||
            card.getAttribute("data-product-image") ||
            "";


        if (!productImage) {

            const imageElement =
                card.querySelector(
                    "img"
                );

            if (imageElement) {

                productImage =
                    imageElement.currentSrc ||
                    imageElement.src ||
                    "";

            }

        }


        /* STOCK */
        const productStock =
            card.dataset.stock ||
            card.dataset.productStock ||
            card.getAttribute("data-stock") ||
            card.getAttribute("data-product-stock") ||
            "0";


        /* AVAILABILITY */
        const availability =
            card.dataset.availability ||
            card.getAttribute("data-availability") ||
            "";


        return {

            id: productId,

            name: productName,

            price: sellingPrice,

            originalPrice: originalPrice,

            image: productImage,

            stock: productStock,

            availability: availability

        };

    }


    /* OPEN SINGLE PRODUCT POPUP NEW */
    function openSingleProductPopup(card) {

        const product =
            getProductInformation(card);


        if (!product) {
            return;
        }


        selectedProductCard =
            card;


        /* PRODUCT NAME */
        if (singleProductPopupName) {

            singleProductPopupName.textContent =
                product.name;

        }


        /* SELLING PRICE */
        if (singleProductPopupSellingPrice) {

            const price =
                parseFloat(
                    product.price
                ) || 0;


            singleProductPopupSellingPrice.textContent =
                "₹" + price;

        }


        /* ORIGINAL PRICE */
        if (singleProductPopupOriginalPrice) {

            const originalPrice =
                parseFloat(
                    product.originalPrice
                ) || 0;


            const sellingPrice =
                parseFloat(
                    product.price
                ) || 0;


            if (
                originalPrice > 0 &&
                originalPrice > sellingPrice
            ) {

                singleProductPopupOriginalPrice.textContent =
                    "₹" + originalPrice;

                singleProductPopupOriginalPrice.style.display =
                    "inline";

            } else {

                singleProductPopupOriginalPrice.textContent =
                    "";

                singleProductPopupOriginalPrice.style.display =
                    "none";

            }

        }


        /* PRODUCT IMAGE */
        if (singleProductPopupImage) {

            singleProductPopupImage.innerHTML = "";


            if (product.image) {

                const image =
                    document.createElement("img");


                image.src =
                    product.image;


                image.alt =
                    product.name;


                singleProductPopupImage.appendChild(
                    image
                );

            }

        }


        // ADD BUTTON
        if (singleProductPopupAdd) {

            singleProductPopupAdd.dataset.productId =
                product.id;

            singleProductPopupAdd.dataset.productName =
                product.name;

            singleProductPopupAdd.dataset.productPrice =
                product.price;

            singleProductPopupAdd.dataset.productImage =
                product.image;

            singleProductPopupAdd.dataset.productStock =
                product.stock;


            const alreadyAdded =
                productBag.some(
                    function (item) {

                        return (
                            item.id ===
                            product.id
                        );

                    }
                );


            if (alreadyAdded) {

                singleProductPopupAdd.textContent =
                    "ADDED";

                singleProductPopupAdd.classList.add(
                    "added"
                );

            } else {

                singleProductPopupAdd.textContent =
                    "ADD";

                singleProductPopupAdd.classList.remove(
                    "added"
                );

            }


            // Out of stock
            if (
                product.availability ===
                    "out_of_stock" ||
                (
                    parseInt(
                        product.stock
                    ) <= 0 &&
                    product.stock !== ""
                )
            ) {

                singleProductPopupAdd.textContent =
                    "OUT OF STOCK";

                singleProductPopupAdd.disabled =
                    true;

            } else {

                singleProductPopupAdd.disabled =
                    false;

            }

        }


        /* OPEN */
        productPopup.classList.add(
            "active"
        );


        document.body.style.overflow =
            "hidden";

    }


    /* CLOSE SINGLE PRODUCT POPUP NEW */
    function closeSingleProductPopup() {

        if (!productPopup) {
            return;
        }


        productPopup.classList.remove(
            "active"
        );


        /*
           Only restore scrolling if the main drawer
           is not open.
        */
        if (
            !drawer ||
            !drawer.classList.contains("active")
        ) {

            document.body.style.overflow =
                "";

        }


        selectedProductCard =
            null;

    }


    // PRODUCT CARD CLICK NEW
    productCards.forEach(
        function (card) {

            card.addEventListener(
                "click",
                function (event) {

                    /*
                       Do NOT open popup when clicking
                       buttons inside the product card

                       Existing Add To Bag functionality
                       remains untouched
                    */
                    if (
                        event.target.closest(
                            "button"
                        )
                    ) {

                        return;

                    }


                    if (
                        event.target.closest(
                            "input"
                        )
                    ) {

                        return;

                    }


                    if (
                        event.target.closest(
                            "a"
                        )
                    ) {

                        return;

                    }


                    event.preventDefault();

                    event.stopPropagation();


                    openSingleProductPopup(
                        card
                    );

                }
            );

        }
    );


    // POPUP CLOSE BUTTON NEW
    if (singleProductPopupClose) {

        singleProductPopupClose.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                closeSingleProductPopup();

            }
        );

    }


    // POPUP OVERLAY CLOSE NEW
    if (singleProductPopupOverlay) {

        singleProductPopupOverlay.addEventListener(
            "click",
            function () {

                closeSingleProductPopup();

            }
        );

    }


    // POPUP ADD BUTTON NEW
    if (singleProductPopupAdd) {

        singleProductPopupAdd.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                if (
                    singleProductPopupAdd.disabled
                ) {

                    return;

                }


                const productId =
                    singleProductPopupAdd.dataset.productId;


                const productName =
                    singleProductPopupAdd.dataset.productName;


                const productPrice =
                    parseFloat(
                        singleProductPopupAdd.dataset.productPrice
                    ) || 0;


                const productStock =
                    parseInt(
                        singleProductPopupAdd.dataset.productStock
                    ) || 0;


                const productImage =
                    singleProductPopupAdd.dataset.productImage ||
                    "";


                // Check whether product already exists
                const existingIndex =
                    productBag.findIndex(
                        function (item) {

                            return (
                                item.id ===
                                productId
                            );

                        }
                    );


                // ALREADY ADDED
                if (
                    existingIndex !== -1
                ) {

                    productBag.splice(
                        existingIndex,
                        1
                    );


                    const includedItems =
                        document.getElementById(
                            "includedItems"
                        );


                    if (includedItems) {

                        const existingItem =
                            includedItems.querySelector(
                                `.included-item[data-product-id="${productId}"]`
                            );


                        if (existingItem) {

                            existingItem.remove();

                        }

                    }


                    const productButton =
                        document.querySelector(
                            `.add-to-bag-button[data-product-id="${productId}"]`
                        );


                    updateProductButton(
                        productButton,
                        false
                    );


                    updateBagCount();

                    renderBagItems();


                    singleProductPopupAdd.textContent =
                        "ADD";

                    singleProductPopupAdd.classList.remove(
                        "added"
                    );


                    if (
                        window.updateHamperTotalPrice
                    ) {

                        window.updateHamperTotalPrice();

                    }


                    return;

                }


                /* ADD PRODUCT */
                productBag.push({

                    id:
                        productId,

                    name:
                        productName,

                    price:
                        productPrice,

                    image:
                        productImage

                });


                createIncludedItem(
                    productId,
                    productName,
                    productPrice,
                    productStock
                );


                /*
                   Update original product card
                   Add To Bag button.
                */
                const productButton =
                    document.querySelector(
                        `.add-to-bag-button[data-product-id="${productId}"]`
                    );


                updateProductButton(
                    productButton,
                    true
                );


                updateBagCount();

                renderBagItems();


                // Update popup button
                singleProductPopupAdd.textContent =
                    "ADDED";

                singleProductPopupAdd.classList.add(
                    "added"
                );

            }
        );

    }


    // ESCAPE KEY FOR SINGLE PRODUCT POPUP NEW
    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                productPopup &&
                productPopup.classList.contains("active")
            ) {

                closeSingleProductPopup();

            }

        }
    );


    // OPEN DRAWER
    function openProductDrawer() {

        if (drawer) {
            drawer.classList.add("active");
        }

        if (overlay) {
            overlay.classList.add("active");
        }

        document.body.style.overflow = "hidden";

    }


    // CLOSE DRAWER
    function closeProductDrawer() {

        if (drawer) {
            drawer.classList.remove("active");
        }

        if (overlay) {
            overlay.classList.remove("active");
        }

        if (productBagPanel) {
            productBagPanel.classList.remove("active");
        }

        document.body.style.overflow = "";

    }


    // ADD PRODUCT BUTTON 
    addProductButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            openProductDrawer
        );

    });


    // CLOSE EVENTS
    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeProductDrawer
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeProductDrawer
        );

    }


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                drawer &&
                drawer.classList.contains("active")
            ) {

                if (
                    productBagPanel &&
                    productBagPanel.classList.contains("active")
                ) {

                    productBagPanel.classList.remove("active");

                } else {

                    closeProductDrawer();

                }

            }

        }
    );


    /* FILTER TOGGLE */
    if (filterButton) {

        filterButton.addEventListener(
            "click",
            function () {

                if (filterArea) {

                    filterArea.classList.toggle(
                        "active"
                    );

                }

            }
        );

    }


    /* FILTER OPTIONS */
    filterOptions.forEach(function (option) {

        option.addEventListener(
            "click",
            function () {

                filterOptions.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                option.classList.add(
                    "active"
                );


                currentFilter =
                    option.dataset.filter;

                currentPage = 1;

                renderProducts();

            }
        );

    });


    // SEARCH
    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                currentPage = 1;

                renderProducts();

            }
        );

    }


    // GET FILTERED PRODUCTS
    function getFilteredProducts() {

        const searchTerm =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        let filtered =
            productCards.filter(
                function (card) {

                    const name =
                        (card.dataset.name || "").toLowerCase();

                    const category =
                        (card.dataset.category || "").toLowerCase();

                    const price =
                        parseFloat(
                            card.dataset.price
                        ) || 0;

                    const availability =
                        card.dataset.availability ||
                        "";


                    const matchesSearch =
                        name.includes(searchTerm) ||
                        category.includes(searchTerm);


                    if (!matchesSearch) {
                        return false;
                    }


                    switch (currentFilter) {

                        case "available":

                            return (
                                availability ===
                                "available"
                            );


                        case "out_of_stock":

                            return (
                                availability ===
                                "out_of_stock"
                            );


                        case "low_price":

                            return price <= 500;


                        case "high_price":

                            return price > 500;


                        default:

                            return true;

                    }

                }
            );


        if (
            currentFilter ===
            "low_price"
        ) {

            filtered.sort(
                function (a, b) {

                    return (
                        parseFloat(
                            a.dataset.price
                        ) -
                        parseFloat(
                            b.dataset.price
                        )
                    );

                }
            );

        }


        if (
            currentFilter ===
            "high_price"
        ) {

            filtered.sort(
                function (a, b) {

                    return (
                        parseFloat(
                            b.dataset.price
                        ) -
                        parseFloat(
                            a.dataset.price
                        )
                    );

                }
            );

        }


        return filtered;

    }


    // RENDER PRODUCTS
    function renderProducts() {

        const filteredProducts =
            getFilteredProducts();


        const totalPages =
            Math.ceil(
                filteredProducts.length /
                productsPerPage
            );


        if (
            totalPages > 0 &&
            currentPage > totalPages
        ) {

            currentPage = totalPages;

        }


        if (totalPages === 0) {

            productCards.forEach(
                function (card) {

                    card.style.display = "none";

                }
            );


            if (paginationNumbers) {
                paginationNumbers.innerHTML = "";
            }

            if (previousPage) {
                previousPage.disabled = true;
            }

            if (nextPage) {
                nextPage.disabled = true;
            }

            return;

        }


        const start =
            (currentPage - 1) *
            productsPerPage;


        const end =
            start + productsPerPage;


        const visibleProducts =
            filteredProducts.slice(
                start,
                end
            );


        productCards.forEach(
            function (card) {

                card.style.display = "none";

            }
        );


        visibleProducts.forEach(
            function (card) {

                card.style.display = "";

            }
        );


        renderPagination(
            totalPages
        );

    }


    // PAGINATION
    function renderPagination(totalPages) {

        if (!paginationNumbers) {
            return;
        }


        paginationNumbers.innerHTML = "";


        for (
            let i = 1;
            i <= totalPages;
            i++
        ) {

            const button =
                document.createElement(
                    "button"
                );


            button.type = "button";

            button.textContent = i;


            if (
                i === currentPage
            ) {

                button.classList.add(
                    "active"
                );

            }


            button.addEventListener(
                "click",
                function () {

                    currentPage = i;

                    renderProducts();

                }
            );


            paginationNumbers.appendChild(
                button
            );

        }


        if (previousPage) {

            previousPage.disabled =
                currentPage === 1;

        }


        if (nextPage) {

            nextPage.disabled =
                currentPage === totalPages;

        }

    }


    /* PREVIOUS PAGE */
    if (previousPage) {

        previousPage.addEventListener(
            "click",
            function () {

                if (currentPage > 1) {

                    currentPage--;

                    renderProducts();

                }

            }
        );

    }


    // NEXT PAGE
    if (nextPage) {

        nextPage.addEventListener(
            "click",
            function () {

                const filteredProducts =
                    getFilteredProducts();


                const totalPages =
                    Math.ceil(
                        filteredProducts.length /
                        productsPerPage
                    );


                if (
                    currentPage < totalPages
                ) {

                    currentPage++;

                    renderProducts();

                }

            }
        );

    }


    // UPDATE BAG COUNT
    function updateBagCount() {

        if (bagCount) {

            bagCount.textContent =
                productBag.length;

        }

    }


    // RENDER BAG ITEMS
    function renderBagItems() {

        if (!productBagItems) {
            return;
        }


        productBagItems.innerHTML = "";


        // EMPTY BAG 
        if (productBag.length === 0) {

            productBagItems.innerHTML = `
                <div class="product-bag-empty">
                    No products added
                </div>
            `;

            return;

        }


        // DISPLAY PRODUCTS 
        productBag.forEach(function (item) {

            const bagItem =
                document.createElement("div");


            bagItem.className =
                "product-bag-item";


            bagItem.dataset.productId =
                item.id;


            bagItem.innerHTML = `

                <span class="product-bag-item-name">
                    ${item.name}
                </span>


                <button
                    type="button"
                    class="product-bag-remove"
                    data-product-id="${item.id}"
                >
                    ×
                </button>

            `;


            productBagItems.appendChild(
                bagItem
            );

        });


        // BAG REMOVE BUTTON
        productBagItems
            .querySelectorAll(
                ".product-bag-remove"
            )
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();


                        const productId =
                            button.dataset.productId;


                        const existingIndex =
                            productBag.findIndex(
                                function (item) {

                                    return (
                                        item.id ===
                                        productId
                                    );

                                }
                            );


                        if (
                            existingIndex === -1
                        ) {

                            return;

                        }


                        productBag.splice(
                            existingIndex,
                            1
                        );


                        const includedItems =
                            document.getElementById(
                                "includedItems"
                            );


                        if (includedItems) {

                            const includedItem =
                                includedItems.querySelector(
                                    `.included-item[data-product-id="${productId}"]`
                                );


                            if (includedItem) {

                                includedItem.remove();

                            }

                        }


                        const productButton =
                            document.querySelector(
                                `.add-to-bag-button[data-product-id="${productId}"]`
                            );


                        if (productButton) {

                            updateProductButton(
                                productButton,
                                false
                            );

                        }


                        updateBagCount();

                        renderBagItems();


                        if (
                            window.updateHamperTotalPrice
                        ) {

                            window.updateHamperTotalPrice();

                        }

                    }
                );

            });

    }


    // OPEN BAG
    function openProductBag() {

        if (!productBagPanel) {
            return;
        }


        /* Update latest bag items */
        renderBagItems();


        /* Open bag */
        productBagPanel.classList.add(
            "active"
        );

    }


    // CLOSE BAG
    function closeProductBagPanel() {

        if (!productBagPanel) {
            return;
        }


        productBagPanel.classList.remove(
            "active"
        );

    }


    // BAG BUTTON CLICK - FIXED
    if (productBagButton) {

        productBagButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                if (!productBagPanel) {
                    return;
                }


                /* Check current state */
                const isOpen =
                    productBagPanel.classList.contains(
                        "active"
                    );


                /* Always update bag */
                renderBagItems();


                /* Toggle */
                if (isOpen) {

                    closeProductBagPanel();

                } else {

                    openProductBag();

                }

            }
        );

    }


    // CLOSE BAG BUTTON
    if (closeProductBag) {

        closeProductBag.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                closeProductBagPanel();

            }
        );

    }


    // UPDATE PRODUCT BUTTON
    function updateProductButton(
        button,
        added
    ) {

        if (!button) {
            return;
        }


        if (added) {

            button.textContent =
                "Added to Bag";

            button.classList.add(
                "added"
            );

        } else {

            button.textContent =
                "Add to Bag";

            button.classList.remove(
                "added"
            );

        }

    }


    // CREATE INCLUDED ITEM
    function createIncludedItem(
        productId,
        productName,
        productPrice,
        productStock
    ) {

        const includedItems =
            document.getElementById(
                "includedItems"
            );


        if (!includedItems) {

            return;

        }


        const existingItem =
            includedItems.querySelector(
                `.included-item[data-product-id="${productId}"]`
            );


        if (existingItem) {

            return;

        }


        const item =
            document.createElement("div");


        item.className =
            "included-item";


        item.dataset.productId =
            productId;


        item.dataset.name =
            productName;


        item.dataset.addedProduct =
            "true";


        item.dataset.originalItem =
            "false";


        item.dataset.price =
            productPrice;


        item.dataset.quantity =
            "1";


        item.dataset.stock =
            productStock;


        item.innerHTML = `

            <div class="item-info">

                <span class="item-name">
                    ${productName}
                </span>

            </div>


            <div class="quantity-control">

                <button
                    type="button"
                    class="quantity-button minus"
                >
                    −
                </button>


                <span class="item-quantity">
                    1
                </span>


                <button
                    type="button"
                    class="quantity-button plus"
                >
                    +
                </button>

            </div>


            <span class="item-price">
                ₹${productPrice}
            </span>


            <button
                type="button"
                class="remove-item"
            >
                X
            </button>

        `;


        includedItems.appendChild(
            item
        );


        setupIncludedItem(item);


        if (
            window.updateHamperTotalPrice
        ) {

            window.updateHamperTotalPrice();

        }

    }


    // SETUP NEW INCLUDED ITEM
    function setupIncludedItem(item) {

        const minusButton =
            item.querySelector(".minus");

        const plusButton =
            item.querySelector(".plus");

        const quantityElement =
            item.querySelector(
                ".item-quantity"
            );

        const removeButton =
            item.querySelector(
                ".remove-item"
            );

        const priceElement =
            item.querySelector(
                ".item-price"
            );

        const unitPrice =
            parseFloat(
                item.dataset.price
            ) || 0;


        // PLUS 
        if (plusButton) {

            plusButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();


                    let quantity =
                        parseInt(
                            quantityElement.textContent
                        ) || 1;


                    const maxStock =
                        parseInt(
                            item.dataset.stock
                        ) || 0;


                    if (
                        maxStock > 0 &&
                        quantity >= maxStock
                    ) {

                        return;

                    }


                    quantity++;


                    quantityElement.textContent =
                        quantity;


                    item.dataset.quantity =
                        quantity;


                    priceElement.textContent =
                        "₹" +
                        (
                            unitPrice *
                            quantity
                        );


                    if (
                        window.updateHamperTotalPrice
                    ) {

                        window.updateHamperTotalPrice();

                    }

                }
            );

        }


        // MINUS 
        if (minusButton) {

            minusButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();


                    let quantity =
                        parseInt(
                            quantityElement.textContent
                        ) || 1;


                    if (quantity > 1) {

                        quantity--;


                        quantityElement.textContent =
                            quantity;


                        item.dataset.quantity =
                            quantity;


                        priceElement.textContent =
                            "₹" +
                            (
                                unitPrice *
                                quantity
                            );


                        if (
                            window.updateHamperTotalPrice
                        ) {

                            window.updateHamperTotalPrice();

                        }

                    }

                }
            );

        }


        // REMOVE 
        if (removeButton) {

            removeButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();


                    const productId =
                        item.dataset.productId;


                    item.remove();


                    const existingIndex =
                        productBag.findIndex(
                            function (bagItem) {

                                return (
                                    bagItem.id ===
                                    productId
                                );

                            }
                        );


                    if (
                        existingIndex !== -1
                    ) {

                        productBag.splice(
                            existingIndex,
                            1
                        );

                    }


                    const productButton =
                        document.querySelector(
                            `.add-to-bag-button[data-product-id="${productId}"]`
                        );


                    updateProductButton(
                        productButton,
                        false
                    );


                    updateBagCount();

                    renderBagItems();


                    if (
                        window.updateHamperTotalPrice
                    ) {

                        window.updateHamperTotalPrice();

                    }

                }
            );

        }

    }


    // ADD TO BAG 
    document
        .querySelectorAll(".add-to-bag-button")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();


                    const productId =
                        button.dataset.productId;

                    const productName =
                        button.dataset.productName;

                    const productPrice =
                        parseFloat(
                            button.dataset.productPrice
                        ) || 0;

                    const productStock =
                        parseInt(
                            button.dataset.productStock
                        ) || 0;


                    const existingIndex =
                        productBag.findIndex(
                            function (item) {

                                return (
                                    item.id ===
                                    productId
                                );

                            }
                        );


                    // ALREADY ADDED 
                    if (
                        existingIndex !== -1
                    ) {

                        productBag.splice(
                            existingIndex,
                            1
                        );


                        const includedItems =
                            document.getElementById(
                                "includedItems"
                            );


                        if (includedItems) {

                            const existingItem =
                                includedItems.querySelector(
                                    `.included-item[data-product-id="${productId}"]`
                                );


                            if (existingItem) {

                                existingItem.remove();

                            }

                        }


                        updateProductButton(
                            button,
                            false
                        );


                        updateBagCount();

                        renderBagItems();


                        if (
                            window.updateHamperTotalPrice
                        ) {

                            window.updateHamperTotalPrice();

                        }


                        return;

                    }


                    // ADD TO BAG 
                    productBag.push({

                        id: productId,

                        name: productName,

                        price: productPrice,

                        image:
                            button.dataset.productImage || ""

                    });


                    createIncludedItem(
                        productId,
                        productName,
                        productPrice,
                        productStock
                    );


                    updateProductButton(
                        button,
                        true
                    );


                    updateBagCount();

                    renderBagItems();

                }
            );

        });



    // INITIAL BAG
    updateBagCount();

    renderBagItems();


    // INITIAL PRODUCT RENDER
    renderProducts();

});