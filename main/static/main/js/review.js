document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* ELEMENTS */
        const drawer =
            document.getElementById(
                "addressDrawer"
            );

        const overlay =
            document.getElementById(
                "addressDrawerOverlay"
            );

        const openButton =
            document.getElementById(
                "openAddressDrawer"
            );

        const closeButton =
            document.getElementById(
                "closeAddressDrawer"
            );

        const form =
            document.getElementById(
                "addressForm"
            );

        const drawerTitle =
            document.getElementById(
                "addressDrawerTitle"
            );


        /* DELIVERY ADDRESS ELEMENTS */
        const deliveryAddressMessage =
            document.getElementById(
                "deliveryAddressMessage"
            );

        const deliveryAddressRadios =
            document.querySelectorAll(
                'input[name="deliveryAddress"]'
            );


        /* SHOW DELIVERY ADDRESS MESSAGE */
        function showDeliveryAddressMessage(message) {

            if (!deliveryAddressMessage) {
                return;
            }


            deliveryAddressMessage.textContent =
                message;


            deliveryAddressMessage.classList.add(
                "show"
            );


            setTimeout(
                function () {

                    deliveryAddressMessage.classList.remove(
                        "show"
                    );

                },
                3000
            );

        }


        /* ADDRESS RADIO SELECTION UI */
        deliveryAddressRadios.forEach(
            function (radio) {

                radio.addEventListener(
                    "change",
                    function () {

                        document
                            .querySelectorAll(
                                ".select-address-card"
                            )
                            .forEach(
                                function (card) {

                                    card.classList.remove(
                                        "selected"
                                    );

                                }
                            );


                        const selectedCard =
                            radio.closest(
                                ".select-address-card"
                            );


                        if (selectedCard) {

                            selectedCard.classList.add(
                                "selected"
                            );

                        }


                        if (deliveryAddressMessage) {

                            deliveryAddressMessage.classList.remove(
                                "show"
                            );

                        }

                    }
                );

            }
        );


        /* AUTOMATICALLY SELECT ONE ADDRESS */
        const allAddressCards =
            document.querySelectorAll(
                ".select-address-card"
            );


        if (allAddressCards.length === 1) {

            const singleCard =
                allAddressCards[0];

            const singleRadio =
                singleCard.querySelector(
                    'input[name="deliveryAddress"]'
                );


            if (singleRadio) {

                singleRadio.checked = true;

                singleCard.classList.add(
                    "selected"
                );

            }

        }


        /* OPEN DRAWER */
        function openDrawer() {

            if (!drawer || !overlay) {
                return;
            }


            drawer.classList.add(
                "active"
            );


            overlay.classList.add(
                "active"
            );


            document.body.style.overflow =
                "hidden";

        }


        /* CLOSE DRAWER */
        function closeDrawer() {

            if (!drawer || !overlay) {
                return;
            }


            drawer.classList.remove(
                "active"
            );


            overlay.classList.remove(
                "active"
            );


            document.body.style.overflow =
                "";

        }


        /* ADD NEW ADDRESS */
        if (openButton) {

            openButton.addEventListener(
                "click",
                function () {

                    resetForm();


                    if (drawerTitle) {

                        drawerTitle.textContent =
                            "Add New Address";

                    }


                    openDrawer();

                }
            );

        }


        /* CLOSE */
        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeDrawer
            );

        }


        if (overlay) {

            overlay.addEventListener(
                "click",
                closeDrawer
            );

        }


        /* ADDRESS TYPE */
        const addressTypeInputs =
            document.querySelectorAll(
                'input[name="addressType"]'
            );

        const receiverFields =
            document.getElementById(
                "receiverFields"
            );


        function updateReceiverFields() {

            const selected =
                document.querySelector(
                    'input[name="addressType"]:checked'
                );


            if (!receiverFields) {
                return;
            }


            if (
                selected &&
                selected.value ===
                    "someone_else"
            ) {

                receiverFields.classList.add(
                    "active"
                );

            } else {

                receiverFields.classList.remove(
                    "active"
                );

            }

        }


        addressTypeInputs.forEach(
            function (input) {

                input.addEventListener(
                    "change",
                    updateReceiverFields
                );

            }
        );


        updateReceiverFields();


        /* SAVE ADDRESS */
        if (form) {

            form.addEventListener(
                "submit",
                async function (event) {

                    event.preventDefault();


                    const selectedType =
                        document.querySelector(
                            'input[name="addressType"]:checked'
                        );


                    const addressData = {

                        address_id:
                            document.getElementById(
                                "addressId"
                            ).value,


                        name:
                            document.getElementById(
                                "addressName"
                            ).value.trim(),


                        mobile:
                            document.getElementById(
                                "addressMobile"
                            ).value.trim(),


                        house:
                            document.getElementById(
                                "addressHouse"
                            ).value.trim(),


                        address:
                            document.getElementById(
                                "addressAddress"
                            ).value.trim(),


                        locality:
                            document.getElementById(
                                "addressLocality"
                            ).value.trim(),


                        pincode:
                            document.getElementById(
                                "addressPincode"
                            ).value.trim(),


                        city:
                            document.getElementById(
                                "addressCity"
                            ).value.trim(),


                        state:
                            document.getElementById(
                                "addressState"
                            ).value.trim(),


                        address_type:
                            selectedType
                                ? selectedType.value
                                : "myself",


                        receiver_name:
                            document.getElementById(
                                "receiverName"
                            ).value.trim(),


                        receiver_number:
                            document.getElementById(
                                "receiverNumber"
                            ).value.trim(),


                        receiver_address:
                            document.getElementById(
                                "receiverAddress"
                            ).value.trim(),


                        message:
                            document.getElementById(
                                "receiverMessage"
                            ).value.trim(),


                        default:
                            document.getElementById(
                                "makeDefault"
                            ).checked

                    };


                    try {

                        const response =
                            await fetch(
                                "/address/save/",
                                {

                                    method:
                                        "POST",

                                    headers: {

                                        "Content-Type":
                                            "application/json",

                                        "X-CSRFToken":
                                            getCookie(
                                                "csrftoken"
                                            )

                                    },

                                    body:
                                        JSON.stringify(
                                            addressData
                                        )

                                }
                            );


                        const data =
                            await response.json();


                        if (data.success) {

                            window.location.reload();

                            return;

                        }


                        showMessage(
                            data.message ||
                            "Unable to save address."
                        );

                    }


                    catch (error) {

                        console.error(
                            "Save address error:",
                            error
                        );


                        showMessage(
                            "Unable to save address."
                        );

                    }

                }
            );

        }


        /* EDIT ADDRESS
           FIXED:
           READ ALL SAVED INFORMATION */
        document.addEventListener(
            "click",
            function (event) {

                const editButton =
                    event.target.closest(
                        ".edit-address-button"
                    );


                if (!editButton) {
                    return;
                }


                event.preventDefault();

                event.stopPropagation();


                const addressId =
                    editButton.getAttribute(
                        "data-address-id"
                    );


                if (!addressId) {
                    return;
                }


                const card =
                    editButton.closest(
                        ".select-address-card"
                    );


                if (!card) {
                    return;
                }


                const address =
                    getAddressFromCard(
                        card
                    );


                if (!address) {
                    return;
                }


                /* Fill every saved field */
                fillForm(
                    address
                );


                if (drawerTitle) {

                    drawerTitle.textContent =
                        "Edit Address";

                }


                openDrawer();

            }
        );


        /* DELETE ADDRESS
           FIXED:
           CUSTOM DELETE / CANCEL CONFIRMATION */
        document.addEventListener(
            "click",
            function (event) {

                const deleteButton =
                    event.target.closest(
                        ".delete-address-button"
                    );


                if (!deleteButton) {
                    return;
                }


                event.preventDefault();

                event.stopPropagation();


                const addressId =
                    deleteButton.getAttribute(
                        "data-address-id"
                    );


                if (!addressId) {
                    return;
                }


                /* CONFIRMATION ELEMENTS */
                const deleteConfirmOverlay =
                    document.getElementById(
                        "deleteConfirmOverlay"
                    );


                const deleteCancelButton =
                    document.getElementById(
                        "deleteCancelButton"
                    );


                const deleteConfirmButton =
                    document.getElementById(
                        "deleteConfirmButton"
                    );


                if (
                    !deleteConfirmOverlay ||
                    !deleteCancelButton ||
                    !deleteConfirmButton
                ) {

                    return;

                }


                /* OPEN CONFIRMATION */
                deleteConfirmOverlay.classList.add(
                    "active"
                );


                document.body.style.overflow =
                    "hidden";


                /* CLOSE CONFIRMATION */
                function closeDeleteConfirmation() {

                    deleteConfirmOverlay.classList.remove(
                        "active"
                    );


                    document.body.style.overflow =
                        "";

                }


                /* CANCEL */
                deleteCancelButton.onclick =
                    function () {

                        closeDeleteConfirmation();

                    };


                /* CLICK OUTSIDE */
                deleteConfirmOverlay.onclick =
                    function (overlayEvent) {

                        if (
                            overlayEvent.target ===
                            deleteConfirmOverlay
                        ) {

                            closeDeleteConfirmation();

                        }

                    };


                /* CONFIRM DELETE */
                deleteConfirmButton.onclick =
                    async function () {

                        deleteConfirmButton.disabled =
                            true;


                        deleteConfirmButton.textContent =
                            "Deleting...";


                        try {

                            const response =
                                await fetch(
                                    "/address/delete/",
                                    {

                                        method:
                                            "POST",

                                        headers: {

                                            "Content-Type":
                                                "application/json",

                                            "X-CSRFToken":
                                                getCookie(
                                                    "csrftoken"
                                                )

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


                            const data =
                                await response.json();


                            /* LOGIN REQUIRED */
                            if (
                                response.status === 401 &&
                                data.login_required
                            ) {

                                window.location.href =
                                    data.login_url ||
                                    "/login/";

                                return;

                            }


                            /* DELETE SUCCESS */
                            if (data.success) {

                                closeDeleteConfirmation();

                                window.location.reload();

                                return;

                            }


                            /* DELETE FAILED */
                            closeDeleteConfirmation();


                            showMessage(
                                data.message ||
                                "Unable to delete address."
                            );

                        }


                        catch (error) {

                            console.error(
                                "Delete address error:",
                                error
                            );


                            closeDeleteConfirmation();


                            showMessage(
                                "Unable to delete address."
                            );

                        }


                        finally {

                            deleteConfirmButton.disabled =
                                false;


                            deleteConfirmButton.textContent =
                                "Delete";

                        }

                    };

            }
        );


        /* GET ADDRESS FROM CARD
           FIXED:
           READ USING getAttribute()
           FOR ALL DATA FIELDS */
        function getAddressFromCard(card) {

            if (!card) {
                return null;
            }


            /*
                Read the exact data-* attributes from
                the saved address card
                This avoids missing values caused by
                dataset name conversion
            */
            function getData(name) {

                const value =
                    card.getAttribute(
                        "data-" + name
                    );

                return value !== null
                    ? value
                    : "";

            }


            return {

                id:
                    getData(
                        "address-id"
                    ),


                name:
                    getData(
                        "name"
                    ),


                mobile:
                    getData(
                        "mobile"
                    ),


                house:
                    getData(
                        "house"
                    ),


                address:
                    getData(
                        "address"
                    ),


                locality:
                    getData(
                        "locality"
                    ),


                pincode:
                    getData(
                        "pincode"
                    ),


                city:
                    getData(
                        "city"
                    ),


                state:
                    getData(
                        "state"
                    ),


                address_type:
                    getData(
                        "address-type"
                    ) || "myself",


                receiver_name:
                    getData(
                        "receiver-name"
                    ),


                receiver_number:
                    getData(
                        "receiver-number"
                    ),


                receiver_address:
                    getData(
                        "receiver-address"
                    ),


                message:
                    getData(
                        "message"
                    ),


                default:
                    getData(
                        "default"
                    ).toLowerCase() === "true"

            };

        }


        /* FORM FILL
           FIXED:
           FILL ALL SAVED INFORMATION */
        function fillForm(address) {

            /* Basic address information */
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


            const addressAddress =
                document.getElementById(
                    "addressAddress"
                );


            if (addressAddress) {

                addressAddress.value =
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


            /* Address type */
            document
                .querySelectorAll(
                    'input[name="addressType"]'
                )
                .forEach(
                    function (input) {

                        input.checked =
                            input.value ===
                            (
                                address.address_type ||
                                "myself"
                            );

                    }
                );


            /* Someone Else information */
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


            const receiverMessage =
                document.getElementById(
                    "receiverMessage"
                );


            if (receiverMessage) {

                receiverMessage.value =
                    address.message || "";

            }


            /* Default address */
            const makeDefault =
                document.getElementById(
                    "makeDefault"
                );


            if (makeDefault) {

                makeDefault.checked =
                    address.default === true;

            }


            /*
                Show/hide receiver fields
                according to saved address type
            */
            updateReceiverFields();

        }


        /* RESET FORM */
        function resetForm() {

            if (!form) {
                return;
            }


            form.reset();


            const addressId =
                document.getElementById(
                    "addressId"
                );


            if (addressId) {

                addressId.value =
                    "";

            }


            const myselfRadio =
                document.querySelector(
                    'input[name="addressType"][value="myself"]'
                );


            if (myselfRadio) {

                myselfRadio.checked =
                    true;

            }


            updateReceiverFields();

        }


        /* MESSAGE */
        function showMessage(message) {

            const element =
                document.getElementById(
                    "addressMessage"
                );


            if (!element) {
                return;
            }


            element.textContent =
                message;


            element.classList.add(
                "show"
            );


            setTimeout(
                function () {

                    element.classList.remove(
                        "show"
                    );

                },
                3000
            );

        }


        /* CSRF */
        function getCookie(name) {

            let cookieValue =
                null;


            if (
                document.cookie &&
                document.cookie !== ""
            ) {

                const cookies =
                    document.cookie.split(";");


                for (
                    let i = 0;
                    i < cookies.length;
                    i++
                ) {

                    const cookie =
                        cookies[i].trim();


                    if (
                        cookie.substring(
                            0,
                            name.length + 1
                        ) ===
                        (
                            name + "="
                        )
                    ) {

                        cookieValue =
                            decodeURIComponent(
                                cookie.substring(
                                    name.length + 1
                                )
                            );


                        break;

                    }

                }

            }


            return cookieValue;

        }


        /* GET DELIVERY ADDRESS ID */
        function getSelectedAddressId() {

            const addressCards =
                document.querySelectorAll(
                    ".select-address-card"
                );


            /* NO ADDRESS */
            if (addressCards.length === 0) {

                return "";

            }


            /* 
                EXACTLY ONE ADDRESS
                AUTOMATICALLY SELECT
            */
            if (addressCards.length === 1) {

                const radio =
                    addressCards[0].querySelector(
                        'input[name="deliveryAddress"]'
                    );


                if (radio) {

                    radio.checked =
                        true;


                    addressCards[0].classList.add(
                        "selected"
                    );


                    return radio.value || "";

                }


                return (
                    addressCards[0].getAttribute(
                        "data-address-id"
                    ) || ""
                );

            }


            /* 
                MULTIPLE ADDRESSES
                USER MUST SELECT
            */
            const selectedRadio =
                document.querySelector(
                    'input[name="deliveryAddress"]:checked'
                );


            if (!selectedRadio) {

                return "";

            }


            return selectedRadio.value || "";

        }


        /* SAVE SELECTED ADDRESS TO SESSION */
        async function saveSelectedAddress(
            addressId
        ) {

            try {

                const response =
                    await fetch(
                        "/address/select/",
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "X-CSRFToken":
                                    getCookie(
                                        "csrftoken"
                                    )

                            },

                            body:
                                JSON.stringify({

                                    address_id:
                                        addressId

                                })

                        }
                    );


                const data =
                    await response.json();


                if (
                    response.status === 401 &&
                    data.login_required
                ) {

                    window.location.href =
                        data.login_url ||
                        "/login/";


                    return false;

                }


                if (!data.success) {

                    showDeliveryAddressMessage(
                        data.message ||
                        "Unable to select delivery address."
                    );


                    return false;

                }


                return true;

            }


            catch (error) {

                console.error(
                    "Select address error:",
                    error
                );


                showDeliveryAddressMessage(
                    "Unable to select delivery address. Please try again."
                );


                return false;

            }

        }


        /* CONTINUE TO PAYMENT */
        const continuePaymentButton =
            document.getElementById(
                "continuePaymentButton"
            );


        if (continuePaymentButton) {

            continuePaymentButton.addEventListener(
                "click",
                async function () {

                    console.log(
                        "Continue to Payment clicked"
                    );


                    /* GET SELECTED ADDRESS */
                    const selectedAddressId =
                        getSelectedAddressId();


                    /* NO ADDRESS SELECTED */
                    if (!selectedAddressId) {

                        const addressCount =
                            document.querySelectorAll(
                                ".select-address-card"
                            ).length;


                        if (addressCount === 0) {

                            showDeliveryAddressMessage(
                                "Please add a delivery address before continuing."
                            );

                        } else {

                            showDeliveryAddressMessage(
                                "Please select a delivery address."
                            );

                        }


                        return;

                    }


                    /* SAVE ADDRESS TO SESSION */
                    continuePaymentButton.disabled =
                        true;


                    const originalText =
                        continuePaymentButton.textContent;


                    continuePaymentButton.textContent =
                        "Please wait...";


                    const saved =
                        await saveSelectedAddress(
                            selectedAddressId
                        );


                    if (!saved) {

                        continuePaymentButton.disabled =
                            false;


                        continuePaymentButton.textContent =
                            originalText;


                        return;

                    }


                    /* CONTINUE TO PAYMENT */
                    const currentUrl =
                        new URL(
                            window.location.href
                        );


                    const source =
                        currentUrl.searchParams.get(
                            "source"
                        ) || "buy_now";


                    window.location.href =
                        `/payment/?source=${encodeURIComponent(source)}`;

                }
            );

        }

    }
);