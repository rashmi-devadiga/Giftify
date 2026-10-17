document.addEventListener("DOMContentLoaded", function () {

    /* IMAGE INPUT */
    const imageInput =
        document.getElementById("product_image");


    if (imageInput) {

        imageInput.addEventListener(
            "change",
            function () {

                if (
                    imageInput.files &&
                    imageInput.files.length > 0
                ) {

                    const file =
                        imageInput.files[0];


                    /* Show selected file name */
                    let fileName =
                        document.getElementById(
                            "productImageFileName"
                        );


                    if (!fileName) {

                        fileName =
                            document.createElement(
                                "div"
                            );

                        fileName.id =
                            "productImageFileName";

                        fileName.style.marginTop =
                            "5px";

                        fileName.style.fontSize =
                            "9px";

                        fileName.style.color =
                            "#9e5963";

                        imageInput.parentElement
                            .appendChild(fileName);

                    }


                    fileName.textContent =
                        "Selected: " + file.name;


                    /* IMAGE PREVIEW */
                    const reader =
                        new FileReader();


                    reader.onload =
                        function (event) {

                            const currentImage =
                                document.querySelector(
                                    ".current-image"
                                );


                            if (currentImage) {

                                const image =
                                    currentImage.querySelector(
                                        "img"
                                    );


                                if (image) {

                                    image.src =
                                        event.target.result;

                                }

                            }

                        };


                    reader.readAsDataURL(file);

                }

            }
        );

    }


    /* AVAILABILITY */
    const quantityInput =
        document.getElementById("quantity");

    const availabilityInputs =
        document.querySelectorAll(
            'input[name="availability"]'
        );


    /* If quantity becomes 0,
       automatically select Out of Stock.
    */
    if (quantityInput) {

        quantityInput.addEventListener(
            "input",
            function () {

                const quantity =
                    parseInt(
                        quantityInput.value
                    ) || 0;


                if (quantity === 0) {

                    availabilityInputs.forEach(
                        function (input) {

                            if (
                                input.value ===
                                "out_of_stock"
                            ) {

                                input.checked =
                                    true;

                            }

                        }
                    );

                }

            }
        );

    }


    /* FORM SUBMIT PROTECTION */
    const form =
        document.querySelector(
            ".edit-product-card form"
        );


    if (form) {

        form.addEventListener(
            "submit",
            function (event) {

                const productName =
                    document.getElementById(
                        "product_name"
                    );


                const price =
                    document.getElementById(
                        "price"
                    );


                const quantity =
                    document.getElementById(
                        "quantity"
                    );


                if (
                    !productName ||
                    !price ||
                    !quantity
                ) {
                    return;
                }


                /* Prevent negative values */
                if (
                    parseFloat(price.value) < 0
                ) {

                    event.preventDefault();

                    alert(
                        "Product price cannot be negative."
                    );

                    price.focus();

                    return;

                }


                if (
                    parseInt(quantity.value) < 0
                ) {

                    event.preventDefault();

                    alert(
                        "Product quantity cannot be negative."
                    );

                    quantity.focus();

                    return;

                }


                /* Prevent blank product name */
                if (
                    productName.value.trim() === ""
                ) {

                    event.preventDefault();

                    alert(
                        "Please enter a product name."
                    );

                    productName.focus();

                    return;

                }

            }
        );

    }


    /* INPUT CLEANUP */
    const textInputs =
        document.querySelectorAll(
            'input[type="text"]'
        );


    textInputs.forEach(
        function (input) {

            input.addEventListener(
                "blur",
                function () {

                    input.value =
                        input.value.trim();

                }
            );

        }
    );

});