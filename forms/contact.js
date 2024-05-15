document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
    const loading = form.querySelector(".loading");
    const errorMessage = form.querySelector(".error-message");
    const sentMessage = form.querySelector(".sent-message");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(form); // Get form data

        // Display loading message
        loading.style.display = "block";
        errorMessage.style.display = "none";
        sentMessage.style.display = "none";

        // Convert form data to JSON
        const jsonData = {};
        formData.forEach(function (value, key) {
            jsonData[key] = value;
        });

        // Send form data to the server
        fetch("https://submit-form.com/li0748Gwj", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonData)
        })
            .then(response => {
                // Handle server response
                if (response.ok) {
                    // If the response is successful, display success message
                    sentMessage.style.display = "block";
                    form.reset(); // Reset form fields
                } else {
                    // If there is an error, display error message
                    errorMessage.style.display = "block";
                }
            })
            .catch(error => {
                // If there is a network error, display error message
                errorMessage.style.display = "block";
            })
            .finally(() => {
                // Hide loading message after response
                loading.style.display = "none";
            });
    });
});
