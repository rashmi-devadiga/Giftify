document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* ELEMENTS */
        const statusForm =
            document.getElementById(
                "statusForm"
            );


        const statusSelect =
            document.getElementById(
                "statusSelect"
            );


        const statusModal =
            document.getElementById(
                "statusModal"
            );


        const newStatusText =
            document.getElementById(
                "newStatusText"
            );


        const modalClose =
            document.getElementById(
                "modalClose"
            );


        const cancelStatus =
            document.getElementById(
                "cancelStatus"
            );


        const confirmStatus =
            document.getElementById(
                "confirmStatus"
            );


        /* OPEN MODAL */
        statusForm.addEventListener(
            "submit",
            function (event) {

                /* Stop the form from submitting immediately */
                event.preventDefault();


                const selectedStatus =
                    statusSelect.value;


                newStatusText.textContent =
                    selectedStatus;


                statusModal.classList.add(
                    "show"
                );

            }
        );


        /* CLOSE MODAL */
        function closeModal() {

            statusModal.classList.remove(
                "show"
            );

        }


        modalClose.addEventListener(
            "click",
            closeModal
        );


        cancelStatus.addEventListener(
            "click",
            closeModal
        );


        /* CLICK OUTSIDE MODAL */
        const modalOverlay =
            document.querySelector(
                ".status-modal-overlay"
            );


        modalOverlay.addEventListener(
            "click",
            closeModal
        );


        /* CONFIRM STATUS */
        confirmStatus.addEventListener(
            "click",
            function () {

                /* Now actually submit the form */
                statusForm.submit();

            }
        );


        /* ESC KEY */
        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape"
                ) {

                    closeModal();

                }

            }
        );

    }
);