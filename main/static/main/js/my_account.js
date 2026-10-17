document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* ELEMENTS */
        const accountMenuView =
            document.getElementById(
                "accountMenuView"
            );


        const addressView =
            document.getElementById(
                "addressView"
            );


        const myAddressButton =
            document.getElementById(
                "myAddressButton"
            );


        const addressBackButton =
            document.getElementById(
                "addressBackButton"
            );


        const addAddressButton =
            document.getElementById(
                "addAddressButton"
            );


        const emptyAddButton =
            document.getElementById(
                "emptyAddButton"
            );


        const closeAddressModal =
            document.getElementById(
                "closeAddressModal"
            );


        const cancelAddressButton =
            document.getElementById(
                "cancelAddressButton"
            );


        const addressModalOverlay =
            document.getElementById(
                "addressModalOverlay"
            );


        const addressForm =
            document.getElementById(
                "addressForm"
            );


        const addressModalTitle =
            document.getElementById(
                "addressModalTitle"
            );


        const profilePictureButton =
            document.getElementById(
                "editProfileButton"
            );


        const profilePictureInput =
            document.getElementById(
                "profilePictureInput"
            );


        /* ACCOUNT MENU */
        function showAccountMenu() {

            if (accountMenuView) {

                accountMenuView.style.display =
                    "";

                accountMenuView.style.visibility =
                    "visible";

                accountMenuView.style.opacity =
                    "1";

            }


            if (addressView) {

                addressView.classList.remove(
                    "show"
                );

                addressView.style.display =
                    "none";

            }

        }


        /* SHOW MY ADDRESS */
        function showAddressView() {

            if (accountMenuView) {

                accountMenuView.style.display =
                    "none";

            }


            if (addressView) {

                /* IMPORTANT:
                   my_account.css hides .address-section.
                   Therefore the .show class must be added.
                */
                addressView.classList.add(
                    "show"
                );

                addressView.style.display =
                    "block";

                addressView.style.visibility =
                    "visible";

                addressView.style.opacity =
                    "1";

            }

        }


        /* MY ADDRESS BUTTON */
        if (myAddressButton) {

            myAddressButton.addEventListener(
                "click",
                function () {

                    showAddressView();

                }
            );

        }


        /* BACK TO ACCOUNT MENU */
        if (addressBackButton) {

            addressBackButton.addEventListener(
                "click",
                function () {

                    showAccountMenu();

                }
            );

        }


        /* OPEN ADDRESS MODAL */
        function openAddressModal() {

            if (!addressModalOverlay) {

                return;

            }


            /*  The HTML starts the modal with:
                style="display: none;"
                So simply adding "active" is not enough.
            */
            addressModalOverlay.style.display =
                "flex";


            addressModalOverlay.classList.add(
                "active"
            );


            document.body.style.overflow =
                "hidden";

        }


        /* CLOSE ADDRESS MODAL */
        function closeModal() {

            if (!addressModalOverlay) {

                return;

            }


            addressModalOverlay.classList.remove(
                "active"
            );


            addressModalOverlay.style.display =
                "none";


            document.body.style.overflow =
                "";

        }


        /* RESET FORM */
        function resetAddressForm() {

            if (!addressForm) {

                return;

            }


            addressForm.reset();


            const addressId =
                document.getElementById(
                    "addressId"
                );


            if (addressId) {

                addressId.value =
                    "";

            }


            if (addressModalTitle) {

                addressModalTitle.textContent =
                    "Add Address";

            }


            const saveAddressButton =
                document.getElementById(
                    "saveAddressButton"
                );


            if (saveAddressButton) {

                saveAddressButton.textContent =
                    "Save Address";

            }


            /* Default Home */
            const homeRadio =
                document.querySelector(
                    'input[name="address_type"][value="Home"]'
                );


            if (homeRadio) {

                homeRadio.checked =
                    true;

            }

        }


        /* ADD ADDRESS */
        function addAddress() {

            resetAddressForm();

            openAddressModal();

        }


        if (addAddressButton) {

            addAddressButton.addEventListener(
                "click",
                addAddress
            );

        }


        if (emptyAddButton) {

            emptyAddButton.addEventListener(
                "click",
                addAddress
            );

        }


        /* CLOSE BUTTONS */
        if (closeAddressModal) {

            closeAddressModal.addEventListener(
                "click",
                closeModal
            );

        }


        if (cancelAddressButton) {

            cancelAddressButton.addEventListener(
                "click",
                closeModal
            );

        }


        /* CLICK OUTSIDE MODAL */
        if (addressModalOverlay) {

            addressModalOverlay.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        addressModalOverlay
                    ) {

                        closeModal();

                    }

                }
            );

        }


        /* ESCAPE KEY */
        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Escape"
                ) {

                    if (
                        addressModalOverlay &&
                        addressModalOverlay.classList.contains(
                            "active"
                        )
                    ) {

                        closeModal();

                    }

                    else if (
                        addressView &&
                        addressView.classList.contains(
                            "show"
                        )
                    ) {

                        showAccountMenu();

                    }

                }

            }
        );


        /* GET CSRF TOKEN */
        function getCSRFToken() {

            const csrfInput =
                document.querySelector(
                    "#addressForm input[name='csrfmiddlewaretoken']"
                );


            if (csrfInput) {

                return csrfInput.value;

            }


            return "";

        }


        /* EDIT ADDRESS */
        const editButtons =
            document.querySelectorAll(
                ".address-edit-button"
            );


        editButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const addressId =
                            button.dataset.addressId;


                        const card =
                            document.querySelector(
                                `.address-card[data-address-id="${addressId}"]`
                            );


                        if (!card) {

                            return;

                        }


                        /* Django already rendered
                           the address into this card

                           We use the page data attributes
                           below when available
                        */
                        const addressData =
                            window.giftifyAddresses
                            ?.find(
                                address =>
                                    String(
                                        address.id
                                    ) ===
                                    String(
                                        addressId
                                    )
                            );


                        if (!addressData) {

                            alert(
                                "Unable to load this address."
                            );

                            return;

                        }


                        fillAddressForm(
                            addressData
                        );


                        openAddressModal();

                    }
                );

            }
        );


        /* FILL ADDRESS FORM */
        function fillAddressForm(
            address
        ) {

            if (addressModalTitle) {

                addressModalTitle.textContent =
                    "Edit Address";

            }


            const saveAddressButton =
                document.getElementById(
                    "saveAddressButton"
                );


            if (saveAddressButton) {

                saveAddressButton.textContent =
                    "Update Address";

            }


            const addressId =
                document.getElementById(
                    "addressId"
                );


            if (addressId) {

                addressId.value =
                    address.id || "";

            }


            const addressName =
                document.getElementById(
                    "addressName"
                );


            if (addressName) {

                addressName.value =
                    address.name || "";

            }


            const addressMobile =
                document.getElementById(
                    "addressMobile"
                );


            if (addressMobile) {

                addressMobile.value =
                    address.mobile || "";

            }


            const addressHouse =
                document.getElementById(
                    "addressHouse"
                );


            if (addressHouse) {

                addressHouse.value =
                    address.house || "";

            }


            const addressLine =
                document.getElementById(
                    "addressLine"
                );


            if (addressLine) {

                addressLine.value =
                    address.address || "";

            }


            const addressLocality =
                document.getElementById(
                    "addressLocality"
                );


            if (addressLocality) {

                addressLocality.value =
                    address.locality || "";

            }


            const addressPincode =
                document.getElementById(
                    "addressPincode"
                );


            if (addressPincode) {

                addressPincode.value =
                    address.pincode || "";

            }


            const addressCity =
                document.getElementById(
                    "addressCity"
                );


            if (addressCity) {

                addressCity.value =
                    address.city || "";

            }


            const addressState =
                document.getElementById(
                    "addressState"
                );


            if (addressState) {

                addressState.value =
                    address.state || "";

            }


            const receiverName =
                document.getElementById(
                    "receiverName"
                );


            if (receiverName) {

                receiverName.value =
                    address.receiver_name || "";

            }


            const receiverNumber =
                document.getElementById(
                    "receiverNumber"
                );


            if (receiverNumber) {

                receiverNumber.value =
                    address.receiver_number || "";

            }


            const receiverAddress =
                document.getElementById(
                    "receiverAddress"
                );


            if (receiverAddress) {

                receiverAddress.value =
                    address.receiver_address || "";

            }


            const addressMessage =
                document.getElementById(
                    "addressMessage"
                );


            if (addressMessage) {

                addressMessage.value =
                    address.message || "";

            }


            const addressDefault =
                document.getElementById(
                    "addressDefault"
                );


            if (addressDefault) {

                addressDefault.checked =
                    Boolean(
                        address.default
                    );

            }


            const type =
                address.address_type ||
                "Home";


            const typeRadio =
                document.querySelector(
                    `input[name="address_type"][value="${type}"]`
                );


            if (typeRadio) {

                typeRadio.checked =
                    true;

            }

        }


        /* SAVE / UPDATE ADDRESS */
        if (addressForm) {

            addressForm.addEventListener(
                "submit",
                async function (event) {

                    event.preventDefault();


                    const saveButton =
                        document.getElementById(
                            "saveAddressButton"
                        );


                    const formData =
                        new FormData(
                            addressForm
                        );


                    const data = {

                        id:
                            formData.get(
                                "id"
                            ),

                        name:
                            formData.get(
                                "name"
                            ),

                        mobile:
                            formData.get(
                                "mobile"
                            ),

                        house:
                            formData.get(
                                "house"
                            ),

                        address:
                            formData.get(
                                "address"
                            ),

                        locality:
                            formData.get(
                                "locality"
                            ),

                        pincode:
                            formData.get(
                                "pincode"
                            ),

                        city:
                            formData.get(
                                "city"
                            ),

                        state:
                            formData.get(
                                "state"
                            ),

                        address_type:
                            formData.get(
                                "address_type"
                            ),

                        receiver_name:
                            formData.get(
                                "receiver_name"
                            ),

                        receiver_number:
                            formData.get(
                                "receiver_number"
                            ),

                        receiver_address:
                            formData.get(
                                "receiver_address"
                            ),

                        message:
                            formData.get(
                                "message"
                            ),

                        default:
                            document.getElementById(
                                "addressDefault"
                            ).checked

                    };


                    if (saveButton) {

                        saveButton.disabled =
                            true;


                        saveButton.textContent =
                            "Saving...";

                    }


                    try {

                        const response =
                            await fetch(
                                "{% url 'main:save_address' %}",
                                {

                                    method:
                                        "POST",

                                    headers: {

                                        "Content-Type":
                                            "application/json",

                                        "X-CSRFToken":
                                            getCSRFToken()

                                    },

                                    body:
                                        JSON.stringify(
                                            data
                                        )

                                }
                            );


                        const result =
                            await response.json();


                        if (
                            result.success
                        ) {

                            closeModal();

                            window.location.reload();

                        }

                        else {

                            alert(
                                result.message ||
                                "Unable to save address."
                            );

                        }

                    }

                    catch (error) {

                        console.error(
                            "ADDRESS SAVE ERROR:",
                            error
                        );


                        alert(
                            "Something went wrong while saving the address."
                        );

                    }


                    finally {

                        if (saveButton) {

                            saveButton.disabled =
                                false;


                            saveButton.textContent =
                                data.id
                                    ? "Update Address"
                                    : "Save Address";

                        }

                    }

                }
            );

        }


        /* DELETE ADDRESS */
        const deleteButtons =
            document.querySelectorAll(
                ".address-delete-button"
            );


        deleteButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    async function () {

                        const addressId =
                            button.dataset.addressId;


                        const confirmed =
                            confirm(
                                "Are you sure you want to delete this address?"
                            );


                        if (!confirmed) {

                            return;

                        }


                        try {

                            const response =
                                await fetch(
                                    "{% url 'main:delete_address' %}",
                                    {

                                        method:
                                            "POST",

                                        headers: {

                                            "Content-Type":
                                                "application/json",

                                            "X-CSRFToken":
                                                getCSRFToken()

                                        },

                                        body:
                                            JSON.stringify(
                                                {
                                                    address_id:
                                                        addressId
                                                }
                                            )

                                    }
                                );


                            const result =
                                await response.json();


                            if (
                                result.success
                            ) {

                                window.location.reload();

                            }

                            else {

                                alert(
                                    result.message ||
                                    "Unable to delete address."
                                );

                            }

                        }

                        catch (error) {

                            console.error(
                                "ADDRESS DELETE ERROR:",
                                error
                            );


                            alert(
                                "Something went wrong while deleting the address."
                            );

                        }

                    }
                );

            }
        );


        /* PROFILE PICTURE PREVIEW

           Edit Profile button opens the image selector
           Actual Firebase Storage saving will be connected
           separately */
        if (
            profilePictureButton &&
            profilePictureInput
        ) {

            profilePictureButton.addEventListener(
                "click",
                function () {

                    profilePictureInput.click();

                }
            );


            profilePictureInput.addEventListener(
                "change",
                function () {

                    const file =
                        profilePictureInput.files[0];


                    if (!file) {

                        return;

                    }


                    if (
                        !file.type.startsWith(
                            "image/"
                        )
                    ) {

                        alert(
                            "Please select an image file."
                        );


                        profilePictureInput.value =
                            "";

                        return;

                    }


                    const reader =
                        new FileReader();


                    reader.onload =
                        function (event) {

                            let image =
                                document.getElementById(
                                    "profilePicture"
                                );


                            const initials =
                                document.getElementById(
                                    "profileInitials"
                                );


                            if (!image) {

                                image =
                                    document.createElement(
                                        "img"
                                    );


                                image.id =
                                    "profilePicture";


                                image.className =
                                    "profile-picture";


                                if (initials) {

                                    initials.replaceWith(
                                        image
                                    );

                                }

                            }


                            image.src =
                                event.target.result;

                        };


                    reader.readAsDataURL(
                        file
                    );

                }
            );

        }


        /* DEFAULT VIEW */
        showAccountMenu();


    }
);