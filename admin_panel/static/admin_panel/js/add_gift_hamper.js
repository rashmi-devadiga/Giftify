document.addEventListener("DOMContentLoaded", function () {

    const addItemBtn = document.getElementById("addItemBtn");
    const itemsContainer = document.getElementById("itemsContainer");

    const totalItemsElement = document.getElementById("totalItems");
    const itemsTotalElement = document.getElementById("itemsTotal");
    const sellingPriceElement = document.getElementById("sellingPrice");
    const finalPriceElement = document.getElementById("finalPrice");

    const discountInput = document.getElementById("discount");
    const deliveryInput = document.getElementById("deliveryCharge");

    const imageInput = document.getElementById("hamperImage");
    const imageName = document.getElementById("imageName");


    /* ADD NEW ITEM */
    if (addItemBtn) {

        addItemBtn.addEventListener("click", function () {

            const itemRow = document.createElement("div");

            itemRow.className = "item-row";

            itemRow.innerHTML = `
                <div class="item-input">

                    <input
                        type="text"
                        name="item_name[]"
                        placeholder="Enter item name"
                        required
                    >

                </div>


                <div class="item-input">

                    <input
                        type="number"
                        name="item_price[]"
                        class="item-price"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                    >

                </div>


                <div class="item-input">

                    <input
                        type="number"
                        name="item_quantity[]"
                        class="item-quantity"
                        value="1"
                        min="1"
                        required
                    >

                </div>


                <div class="item-total">

                    ₹<span>0.00</span>

                </div>


                <button
                    type="button"
                    class="remove-item"
                    title="Remove item"
                >
                    ×
                </button>
            `;

            itemsContainer.appendChild(itemRow);

            attachItemEvents(itemRow);

            updateTotals();

            itemRow.querySelector("input").focus();

        });

    }


    /* ITEM EVENTS */
    function attachItemEvents(row) {

        const priceInput =
            row.querySelector(".item-price");

        const quantityInput =
            row.querySelector(".item-quantity");

        const removeButton =
            row.querySelector(".remove-item");


        if (priceInput) {

            priceInput.addEventListener(
                "input",
                updateTotals
            );

        }


        if (quantityInput) {

            quantityInput.addEventListener(
                "input",
                updateTotals
            );

        }


        if (removeButton) {

            removeButton.addEventListener(
                "click",
                function () {

                    const allRows =
                        itemsContainer.querySelectorAll(".item-row");


                    /* Keep at least one row */
                    if (allRows.length === 1) {

                        const inputs =
                            allRows[0].querySelectorAll("input");

                        inputs.forEach(function (input) {

                            if (
                                input.classList.contains("item-quantity")
                            ) {

                                input.value = 1;

                            } else {

                                input.value = "";

                            }

                        });

                    } else {

                        row.remove();

                    }


                    updateTotals();

                }
            );

        }

    }


    /* INITIALIZE EXISTING ITEM */
    const existingRows =
        itemsContainer.querySelectorAll(".item-row");


    existingRows.forEach(function (row) {

        attachItemEvents(row);

    });


    /* UPDATE ALL TOTALS */
    function updateTotals() {

        const rows =
            itemsContainer.querySelectorAll(".item-row");


        let itemsTotal = 0;

        let totalItems = 0;


        rows.forEach(function (row) {

            const priceInput =
                row.querySelector(".item-price");

            const quantityInput =
                row.querySelector(".item-quantity");

            const totalSpan =
                row.querySelector(".item-total span");


            const price =
                parseFloat(priceInput?.value) || 0;

            const quantity =
                parseInt(quantityInput?.value) || 0;


            const itemTotal =
                price * quantity;


            if (totalSpan) {

                totalSpan.textContent =
                    itemTotal.toFixed(2);

            }


            itemsTotal += itemTotal;

            totalItems += quantity;

        });


        /* Items summary */
        if (itemsTotalElement) {

            itemsTotalElement.textContent =
                itemsTotal.toFixed(2);

        }


        if (totalItemsElement) {

            totalItemsElement.textContent =
                totalItems;

        }


        /* Selling price */
        if (sellingPriceElement) {

            sellingPriceElement.textContent =
                itemsTotal.toFixed(2);

        }


        updateFinalPrice(itemsTotal);

    }


    /* FINAL PRICE
       
       Selling Price
       - Discount
       + Delivery Charge */
    function updateFinalPrice(sellingPrice) {

        const discount =
            parseFloat(discountInput?.value) || 0;

        const delivery =
            parseFloat(deliveryInput?.value) || 0;


        const discountAmount =
            sellingPrice * discount / 100;

        let finalPrice =
            sellingPrice - discountAmount + delivery;


        /* Prevent negative price */
        if (finalPrice < 0) {

            finalPrice = 0;

        }


        if (finalPriceElement) {

            finalPriceElement.textContent =
                finalPrice.toFixed(2);

        }

    }


    /* DISCOUNT */
    if (discountInput) {

        discountInput.addEventListener(
            "input",
            function () {

                const currentTotal =
                    calculateItemsTotal();

                updateFinalPrice(currentTotal);

            }
        );

    }


    /* DELIVERY CHARGE */
    if (deliveryInput) {

        deliveryInput.addEventListener(
            "input",
            function () {

                const currentTotal =
                    calculateItemsTotal();

                updateFinalPrice(currentTotal);

            }
        );

    }


    /* CALCULATE ITEMS TOTAL */
    function calculateItemsTotal() {

        const rows =
            itemsContainer.querySelectorAll(".item-row");


        let total = 0;


        rows.forEach(function (row) {

            const price =
                parseFloat(
                    row.querySelector(".item-price")?.value
                ) || 0;


            const quantity =
                parseInt(
                    row.querySelector(".item-quantity")?.value
                ) || 0;


            total += price * quantity;

        });


        return total;

    }


    /* IMAGE FILE NAME */
    if (imageInput) {

        imageInput.addEventListener(
            "change",
            function () {

                if (
                    imageInput.files &&
                    imageInput.files.length > 0
                ) {

                    imageName.textContent =
                        "Selected: " +
                        imageInput.files[0].name;

                } else {

                    imageName.textContent = "";

                }

            }
        );

    }


    /* INITIAL CALCULATION */
    updateTotals();

});
