// script.js
function toggleMenu() {
    const navbar = document.querySelector(".navbar");
    navbar.classList.toggle("active");
}

// Cerrar el menú cuando se hace clic en un enlace
document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        const navbar = document.querySelector(".navbar");
        navbar.classList.remove("active");
    });
});