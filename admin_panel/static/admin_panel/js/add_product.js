document.addEventListener("DOMContentLoaded", function () {

    /* IMAGE UPLOAD */
    const imageInput = document.getElementById("product_image");
    const imagePreview = document.getElementById("imagePreview");
    const previewImage = document.getElementById("previewImage");
    const removeImage = document.getElementById("removeImage");
    const uploadBox = document.getElementById("uploadBox");


    if (imageInput) {

        imageInput.addEventListener("change", function () {

            const file = this.files[0];

            if (!file) {
                return;
            }

            /* Check image type */
            if (!file.type.startsWith("image/")) {

                alert("Please select a valid image file.");

                imageInput.value = "";
                return;
            }


            /* Check file size - 5MB */
            if (file.size > 5 * 1024 * 1024) {

                alert("Image size must be less than 5MB.");

                imageInput.value = "";
                return;
            }


            /* Create preview */
            const reader = new FileReader();

            reader.onload = function (event) {

                previewImage.src = event.target.result;

                imagePreview.classList.add("show");

                if (uploadBox) {
                    uploadBox.style.display = "none";
                }

            };

            reader.readAsDataURL(file);

        });

    }


    /* REMOVE IMAGE */
    if (removeImage) {

        removeImage.addEventListener("click", function () {

            imageInput.value = "";

            previewImage.src = "";

            imagePreview.classList.remove("show");

            if (uploadBox) {
                uploadBox.style.display = "flex";
            }

        });

    }


    /* DESCRIPTION CHARACTER COUNT */
    const description = document.getElementById("description");
    const charCount = document.getElementById("charCount");


    if (description && charCount) {

        description.addEventListener("input", function () {

            charCount.textContent = this.value.length;

        });

    }


    /* CATEGORY MODAL */
    const categoryModal =
        document.getElementById("categoryModal");

    const openCategoryModal =
        document.getElementById("openCategoryModal");

    const closeCategoryModal =
        document.getElementById("closeCategoryModal");

    const cancelCategory =
        document.getElementById("cancelCategory");

    const categoryForm =
        document.getElementById("categoryForm");

    const newCategory =
        document.getElementById("newCategory");

    const categorySelect =
        document.getElementById("category");


    /* OPEN MODAL */
    if (openCategoryModal) {

        openCategoryModal.addEventListener("click", function () {

            categoryModal.classList.add("show");

            setTimeout(function () {

                if (newCategory) {
                    newCategory.focus();
                }

            }, 100);

        });

    }


    /* CLOSE MODAL */
    function closeModal() {

        categoryModal.classList.remove("show");

        if (categoryForm) {
            categoryForm.reset();
        }

    }


    if (closeCategoryModal) {
        closeCategoryModal.addEventListener("click", closeModal);
    }

    if (cancelCategory) {
        cancelCategory.addEventListener("click", closeModal);
    }


    /* CLOSE WHEN CLICKING OUTSIDE */
    if (categoryModal) {

        categoryModal.addEventListener("click", function (event) {

            if (event.target === categoryModal) {
                closeModal();
            }

        });

    }


    /* ADD CATEGORY */
    if (categoryForm) {

        categoryForm.addEventListener("submit", function (event) {

            event.preventDefault();


            const categoryName =
                newCategory.value.trim();


            if (!categoryName) {

                alert("Please enter a category name.");

                newCategory.focus();

                return;
            }


            /* Temporary front-end category creation.
             
               The category will appear immediately in
               the dropdown.
             
               Later you can connect this to a Django
               AJAX view to permanently save categories */
            const option =
                document.createElement("option");

            option.value = categoryName.toLowerCase()
                .replace(/\s+/g, "-");

            option.textContent = categoryName;

            option.selected = true;

            categorySelect.appendChild(option);


            closeModal();

        });

    }


    /* FORM SUBMISSION */
    const productForm =
        document.getElementById("productForm");

    const submitBtn =
        document.getElementById("submitBtn");


    if (productForm) {

        productForm.addEventListener("submit", function () {

            if (submitBtn) {

                submitBtn.disabled = true;

                submitBtn.innerHTML =
                    "Adding Product...";

            }

        });

    }


    /* ESC KEY CLOSE MODAL */
    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            if (
                categoryModal &&
                categoryModal.classList.contains("show")
            ) {

                closeModal();

            }

        }

    });

});