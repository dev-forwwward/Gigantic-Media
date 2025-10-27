document.addEventListener("DOMContentLoaded", () => {
    // Set dynamic date in Footer Components
    let spanInstances = document.querySelectorAll(".current-year");

    if(spanInstances) {
        spanInstances.forEach((span) => {
            span.innerHTML = new Date().getFullYear();
        });
    }
});