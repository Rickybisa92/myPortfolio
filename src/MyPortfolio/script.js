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
