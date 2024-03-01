document.addEventListener("DOMContentLoaded", function () {
    SetInitialUIState();

    const sidebarLinks = document.querySelectorAll(".sidebar-link");
    const currentUrl = window.location.href;
    sidebarLinks.forEach((link) => {
        if (link.href === currentUrl) {
            link.classList.add("active");
        }
        link.addEventListener("click", function (event) {
            sidebarLinks.forEach(function (innerLink) {
                innerLink.classList.remove("active");
            });
            return true;
        });
    });

    const checkboxAll = document.getElementById("checkbox-all-search");
    const checkboxes = document.querySelectorAll(".checkbox");

    checkboxAll.addEventListener("change", function () {
        checkboxes.forEach(function (checkbox) {
            checkbox.checked = checkboxAll.checked;
        });
    });

    const completeAllBtn = document.getElementById("markAllCompleteBtn");
    const archiveAllBtn = document.getElementById('markAllArchive');

    archiveAllBtn.addEventListener("click", function () {
        const selectedOrderIds = [];
        checkboxes.forEach(function (checkbox) {
            if (checkbox.checked) {
                selectedOrderIds.push(checkbox.dataset.orderId);
            }
        });

        if (selectedOrderIds.length > 0) {
            markOrdersArchive(selectedOrderIds);
        } else {
            alert("Please select at least one order.");
        }
    });

    // completeAllBtn.addEventListener("click", function () {
    //     const selectedOrderIds = [];
    //     checkboxes.forEach(function (checkbox) {
    //         if (checkbox.checked) {
    //             selectedOrderIds.push(checkbox.dataset.orderId);
    //         }
    //     });

    //     if (selectedOrderIds.length > 0) {
    //         confirmButton.addEventListener("click", function () {
    //             markOrdersAsComplete(selectedOrderIds);

    //         });
       
    //     } else {
    //         alert("Please select at least one order.");
    //     }

    // });

    completeAllBtn.addEventListener("click", function () {
        confirmButton.addEventListener("click", function () {
            const form = document.getElementById(`mark-orders-form`);
            form.submit();
        });
    });

    function markOrdersArchive(orderIds) {
        const status = 1;
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        orderIds.forEach(orderId => {
            console.log(orderId);
            fetch(`/set-archive/${orderId}/${status}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken 
                }
            })
            .then(response => {
                if (response.ok) {
                    console.log(`Order ${orderId} archived successfully`);
                } else {
                    console.error(`Failed to mark order ${orderId} as complete`);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }

    function markOrdersAsComplete(orderIds) {
        const status = 2;
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        orderIds.forEach(orderId => {
            console.log(orderId);
            fetch(`/mark-order/${orderId}/${status}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken 
                }
            })
            .then(response => {
                if (response.ok) {

                    location.reload();

                } else {
                    console.error(`Failed to mark order ${orderId} as complete`);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }

    var mapButtons = document.querySelectorAll("[id^='table-map-']");
    mapButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            var mapReference = this.getAttribute("data-loc");

            var matches = mapReference.match(
                /Lat:\s*([-+]?\d*\.\d+)\s*Lgn:\s*([-+]?\d*\.\d+)/
            );
            var lat = parseFloat(matches[1]);
            var lng = parseFloat(matches[2]);

            var modal = document.getElementById(
                this.getAttribute("data-modal-target")
            );

            var mapIframe = modal.querySelector("iframe#map");

            mapIframe.contentWindow.postMessage(
                { lat, lng, action: "view" },
                "*"
            );

            modal.classList.remove("hidden");
        });
    });

    var button = document.getElementById("table-map");
    if (button) {
        button.addEventListener("click", handleClick);
    }

    const rowRange = document.getElementById("minmax-range");
    const maxRow = document.getElementById("maxrow");

    rowRange.addEventListener("input", function () {
        maxRow.textContent = rowRange.value;
    });

    var searchInput = document.querySelector("#table-search");

    searchInput.addEventListener("input", function (event) {
        var searchTerm = searchInput.value.trim().toLowerCase();
        var rows = document.querySelectorAll("tbody tr");
        rows.forEach(function (row) {
            var textContent = row.textContent.toLowerCase();
            if (textContent.includes(searchTerm)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });
});




function resetmarker(frame) {
    document.getElementById(frame).contentWindow.postMessage(
        {
            action: "resetMarker",
        },
        "*"
    );
}

function SetInitialUIState() {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("delivery[]")) {
        const deliveryValues = urlParams.getAll("delivery[]");
        console.log(deliveryValues);
        deliveryValues.forEach(function (value) {
            const decodedValue = decodeURIComponent(value);
            console.log(`decoded ${decodedValue}`);
            document.getElementById(decodedValue).checked = true;
        });
    }

    if (urlParams.has("status[]")) {
        const statusValues = urlParams.getAll("status[]");
        statusValues.forEach(function (value) {
            const decodedValue = decodeURIComponent(value);
            document.getElementById(decodedValue).checked = true;
        });
    }

    const rowSize = urlParams.get("rowSize");
    if (rowSize) {
        document.getElementById("minmax-range").value = rowSize;
        document.getElementById("maxrow").textContent = rowSize;
    }
}

const orderMarkButtons = document.querySelectorAll(".order-mark-btn");
const confirmButton = document.getElementById("confirm-button");

orderMarkButtons.forEach((button) => {
    button.addEventListener("click", function () {
        const orderId = this.dataset.id; // Get the order ID from data-id attribute
        confirmButton.dataset.id = orderId; // Set the data-id attribute of the confirm button
    });
});

confirmButton.addEventListener("click", function () {
    const orderId = this.dataset.id;
    const form = document.getElementById(`form-complete-${orderId}`);
    form.submit();
});
