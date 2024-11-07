// Seleccionar el checkbox y el body
const toggle = document.getElementById("toggleMode");
const body = document.body;

// Escuchar el cambio de estado del checkbox
toggle.addEventListener("change", () => {
  if (toggle.checked) {
    body.classList.add("night-mode");
    body.classList.remove("day-mode");
  } else {
    body.classList.add("day-mode");
    body.classList.remove("night-mode");
  }
});

// Establecer el modo día como el modo inicial
body.classList.add("day-mode");


// Función para alternar la clase 'active' en la barra de navegación
function toggleMenu() {
  document.querySelector('.navbar').classList.toggle('active');
}

// Seleccionar el botón de menú hamburguesa y agregarle el evento de clic
const menuButton = document.querySelector('.menu-hamburguesa'); // Asegúrate de que tenga la clase 'menu-hamburguesa' en el HTML
menuButton.addEventListener('click', toggleMenu);

// Seleccionar todos los enlaces del menú
const navLinks = document.querySelectorAll('.navbar a');

// Agregar evento de clic a cada enlace para cerrar el menú
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.navbar').classList.remove('active');
  });
});