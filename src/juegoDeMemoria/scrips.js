
// Elementos del DOM
const movimientos = document.getElementById("contador-movimientos");
const tiempoValue = document.getElementById("tiempo");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");
const contenedorJuego = document.querySelector(".contenedor-juego");
const resultados = document.getElementById("resultados");
const controles = document.querySelector(".contenedor-controles");
const contadorParejas = document.getElementById("contador-parejas");
const puntuacionGlobal = document.getElementById("puntuacion-global");
const tableroSizeSelect = document.getElementById("tablero-size");
const registroJugadas = document.getElementById("registroJugadas");
const dificultadIaSelect = document.getElementById("DificultadIA");
const puntuacionIa = document.getElementById("puntuacion-ia");
const contadorAciertosIa = document.getElementById("contador-aciertos-ia");
const playMusicBtn = document.getElementById('play-music');
const backgroundMusic = document.getElementById('background-music');


// Variables del juego
let cartas;
let interval;
let primeraCarta = false;
let segundaCarta = false;
let memoriaIA = {};
let turnoIA = false;
let aciertosIa = 0;
let dificultadIA = 'easy';
let partidasGanadas = localStorage.getItem('partidasGanadas') ? parseInt(localStorage.getItem('partidasGanadas')) : 0;
let partidasGanadasIa = localStorage.getItem('partidasGanadasIa') ? parseInt(localStorage.getItem('partidasGanadasIa')) : 0;


//Actualizar puntuaciones en el DOM
puntuacionGlobal.textContent = `Partidas Ganadas Jugador: ${partidasGanadas}`;
puntuacionIa.textContent = `Partidas Ganadas IA: ${partidasGanadasIa}`;


// Elementos de audio
let winAudio = new Audio('./music/win.wav');
let clickAudio = new Audio('./music/click.wav');
let rightAudio = new Audio('./music/ringtones-zelda-1.mp3');
let wrongAudio = new Audio('./music/wrong.wav');

//Array items
const items = [
    { nombre: "coin", imagen: "/img/1.png" },
    { nombre: "rubi", imagen: "/img/2.png" },
    { nombre: "esmerald", imagen: "/img/3.png" },
    { nombre: "baston", imagen: "/img/4.png" },
    { nombre: "rayo", imagen: "/img/5.png" },
    { nombre: "pocion", imagen: "/img/6.png" },
    { nombre: "fuego", imagen: "/img/7.png" },
    { nombre: "sombrero", imagen: "/img/8.png" },
    { nombre: "sword", imagen: "/img/9.png" },
    { nombre: "shield", imagen: "/img/10.png" },
];

//Tiempo inicial y contadores
let segundos = 0,
    minutos = 0;
let contadorMovimientos = 0,
    contadorVictorias = 0;
let contadorParejasEncontradas = 0;

// temporizador
function timeGenerator() {
    segundos += 1;
    // Logica de minutos
    if (segundos === 60) {
        clearInterval(interval); // Detener el temporizador
        stopGame();
    }
    //Formatear el tiempo antes de mostrarlo
    let segundosValue = segundos < 10 ? `0${segundos}` : segundos;
    tiempoValue.innerHTML = `<span>Time:</span>00:${segundosValue}`;
}


//calcular movimientos
function movesCounter() {
    if (!turnoIA) {
        contadorMovimientos += 1;
        movimientos.innerHTML = `<span>Movimientos: </span>${contadorMovimientos}`;
        turnoIA = true;
        setTimeout(movimientoIA, 1000);
    }
}


// Seleccionar objetos aleatorios del array items
function generateRandom(rows, cols) {
    // Copia temporal del array de cartas
    let arrayTemporal = [...items];

    // Array para almacenar los valores de las cartas
    let cartaValues = [];

    // Tamaño necesario para llenar el tablero con pares de cartas
    const size = rows * cols / 2;

    // Iterar para generar cartas únicas
    for (let i = 0; i < size; i++) {
        // Genera un índice aleatorio dentro del rango del array temporal
        const randomIndex = Math.floor(Math.random() * arrayTemporal.length);
        // Agrega el valor de la carta aleatoria al array de valores
        cartaValues.push(arrayTemporal[randomIndex]);
        // Elimina la carta seleccionada del array temporal para evitar duplicados
        arrayTemporal.splice(randomIndex, 1);
    }

    return cartaValues;
}


function generarCartas(cartaValues, rows, cols) {
    // Limpiar el contenido del contenedor del juego
    contenedorJuego.innerHTML = "";

    // Duplicar y mezclar los valores de las cartas
    cartaValues = [...cartaValues, ...cartaValues];
    cartaValues.sort(() => Math.random() - 0.5);

    const imagenDelantera = './img/parte-delantera.png';

    // Iterar sobre cada posición del tablero
    for (let i = 0; i < rows * cols; i++) {
        contenedorJuego.innerHTML += `
        <div class="contenedor-cartas" data-card-value="${i < cartaValues.length ? cartaValues[i].nombre : ''}">
            <div class="delantero-carta">
            <img src="${imagenDelantera}" class="imagen-delantera"/>
             </div>
            <div class="trasero-carta">
                ${i < cartaValues.length ? `<img src="${cartaValues[i].imagen}" class="imagen"/>` : ''}
            </div>
        </div>`;
    }

    contenedorJuego.style.gridTemplateColumns = `repeat(${cols}, auto)`;
}


function verificarParejas() {
    let cartasVolteadas = 0; // Contador de cartas volteadas durante el turno del jugador
    let primeraCarta, segundaCarta;
    let primeraCartaValue, segundaCartaValue;


    // Obtener todas las cartas del tablero
    cartas = document.querySelectorAll(".contenedor-cartas");
    cartas.forEach((carta) => {
        // Agregar un evento de clic a cada carta
        carta.addEventListener("click", () => {
            if (!carta.classList.contains("Pareja") && cartasVolteadas < 2 && carta !== primeraCarta) {
                carta.classList.add("Girar");
                clickAudio.play();

                if (!primeraCarta) {
                    primeraCarta = carta;
                    primeraCartaValue = carta.getAttribute("data-card-value");
                } else {
                    cartasVolteadas++;
                    movesCounter();
                    segundaCarta = carta;
                    segundaCartaValue = carta.getAttribute("data-card-value");

                    if (primeraCartaValue === segundaCartaValue) {
                        primeraCarta.classList.add("Pareja");
                        segundaCarta.classList.add("Pareja");
                        contadorParejasEncontradas++;
                        contadorParejas.innerText = `Parejas encontradas Jugador: ${contadorParejasEncontradas}`;
                        rightAudio.play();
                        primeraCarta = false;
                        contadorVictorias++;
                        registrarJugada("¡El jugador👤 encontró una pareja🎉!", true);

                          // Reiniciar las variables para permitir al jugador seguir jugando
                          primeraCarta = null;
                          segundaCarta = null;
                          cartasVolteadas = 0;

                    } else {
                        wrongAudio.play();
                        let [tempFirst, tempSecond] = [primeraCarta, segundaCarta];
                        primeraCarta = null;
                        segundaCarta = null;
                        setTimeout(() => {
                            tempFirst.classList.remove("Girar");
                            tempSecond.classList.remove("Girar");
                        }, 800);
                        registrarJugada("El jugador👤 no encontró pareja😭", false);
                        turnoIA = true; // Activa el turno de la IA
                        movesCounter();
                    }

                    // Reiniciar el contador de cartas giradas si ya se han girado dos
                    if (cartasVolteadas === 2) {
                        cartasVolteadas = 0;
                    }
                }
            }
        });
    });
}

function generarCartasYVerificarParejas(cartaValues, rows = 4, cols = 4) {
    generarCartas(cartaValues, rows, cols); // Generar cartas en el tablero
    verificarParejas(); // Verificar si se forman parejas al hacer clic en las cartas
}



// Configurar la dificultad de la IA
dificultadIaSelect.addEventListener('change', () => {
    dificultadIA = dificultadIaSelect.value;
});

// Función para obtener la probabilidad de acierto según la dificultad
function probabilidadAcierto() {
    if (dificultadIA === 'easy') return 0.3;
    if (dificultadIA === 'normal') return 0.6;
    if (dificultadIA === 'hard') return 0.9;
}



/**
 * Función que simula el movimiento de la IA.
 * La IA selecciona dos cartas no emparejadas al azar, las voltea y verifica si forman una pareja.
 * Si las cartas forman una pareja, las marca como emparejadas.
 * Si no forman una pareja, las cartas se vuelven a voltear.
 */
function movimientoIA() {
    // Filtra las cartas que aún no están emparejadas ni volteadas
    let cartasNoEmparejadas = [...cartas].filter(carta => !carta.classList.contains("Pareja") && !carta.classList.contains("Girar"));

    if (cartasNoEmparejadas.length < 2) {
        // No hay suficientes cartas no emparejadas para que la IA haga un movimiento
        turnoIA = false;
        return;
    }

    // Selecciona dos cartas al azar de las cartas no emparejadas
    let primeraCarta = cartasNoEmparejadas[Math.floor(Math.random() * cartasNoEmparejadas.length)];
    let segundaCarta = cartasNoEmparejadas.filter(carta => carta !== primeraCarta)[Math.floor(Math.random() * (cartasNoEmparejadas.length - 1))];

    // Comprueba si primeraCarta y segundaCarta son válidas
    if (!primeraCarta || !segundaCarta) {
        console.error("No se encontraron suficientes cartas no emparejadas.");
        turnoIA = false;
        return;
    }

    // Almacena las cartas en la memoria de la IA
    memoriaIA[primeraCarta.getAttribute("data-card-value")] = primeraCarta;
    memoriaIA[segundaCarta.getAttribute("data-card-value")] = segundaCarta;

    // Gira las cartas seleccionadas
    primeraCarta.classList.add("Girar");
    segundaCarta.classList.add("Girar");

    // Llama a la función para verificar si las cartas forman una pareja después de un segundo
    setTimeout(() => {
        verificarMovimientoIa(primeraCarta, segundaCarta);
    }, 1000);
}


// Función para verificar el movimiento de la IA
function verificarMovimientoIa(primeraCarta, segundaCarta) {
    let valorPrimeraCarta = primeraCarta.getAttribute("data-card-value");
    let valorSegundaCarta = segundaCarta.getAttribute("data-card-value");

    if (valorPrimeraCarta === valorSegundaCarta) {
        // Las cartas forman una pareja
        primeraCarta.classList.add("Pareja");
        segundaCarta.classList.add("Pareja");
        contadorParejasEncontradas++;
        memoriaIA[valorPrimeraCarta].emparejada = true;
        memoriaIA[valorSegundaCarta].emparejada = true;

        aciertosIa++;
        contadorAciertosIa.innerText = `Parejas encontradas IA: ${aciertosIa}`;

        registrarJugada(`La IA🤖 encontró una pareja🎉!`, true);
        rightAudio.play();

        // Si la IA encuentra una pareja, juega de nuevo
        setTimeout(movimientoIA, 1000);
    } else {
        // Las cartas no forman una pareja, se vuelven a tapar
        let delay = setTimeout(() => {
            primeraCarta.classList.remove("Girar");
            segundaCarta.classList.remove("Girar");
        }, 800);
        registrarJugada(`La IA🤖 no encontró pareja😭`, false);
        wrongAudio.play();
    }

    turnoIA = false;

    // Si se han encontrado todas las parejas, termina el juego y muestra el ganador
    if (contadorParejasEncontradas == Math.floor(cartas.length / 2)) {
        let ganador = "";
        let mensajeGanador = "";

        if (aciertosIa > contadorVictorias) {
            ganador = "IA";
            mensajeGanador = `La IA🤖 gana con ${aciertosIa} aciertos`;
        } else if (aciertosIa < contadorVictorias) {
            ganador = "Jugador";
            mensajeGanador = `El Jugador👤 gana con ${contadorVictorias} aciertos`;
        } else {
            ganador = "Empate";
            mensajeGanador = `¡Es un empate con ${contadorVictorias} aciertos para cada jugador!`;
        }

        if (ganador !== "Empate") {
            partidasGanadas += ganador === "IA" ? 0 : 1;
            partidasGanadasIa += ganador === "IA" ? 1 : 0;
            localStorage.setItem('partidasGanadas', partidasGanadas);
            localStorage.setItem('partidasGanadasIa', partidasGanadasIa);
            puntuacionGlobal.textContent = `Partidas Ganadas por el Jugador👨🏻: ${partidasGanadas}`;
            puntuacionIa.textContent = `Partidas Ganadas por la IA🤖: ${partidasGanadasIa}`;
        }

        resultados.innerHTML = `<h2>${mensajeGanador}</h2>`;
        stopGame();
    }
};




// Función para registrar jugadas
function registrarJugada(mensaje, esAcierto) {
    const nuevoMensaje = document.createElement('div');
    nuevoMensaje.textContent = mensaje;
    nuevoMensaje.classList.add('mensaje-jugada');
    if (esAcierto) {
        nuevoMensaje.classList.add('mensaje-acierto'); // Añadir clase de acierto si es un acierto
    } else {
        nuevoMensaje.classList.add('mensaje-error'); // Añadir clase de error si no es un acierto
    }
    registroJugadas.appendChild(nuevoMensaje);
    registroJugadas.scrollTop = registroJugadas.scrollHeight;
}



// Empieza el juego
startButton.addEventListener("click", () => {
    contadorMovimientos = 0;
    segundos = 0;
    minutos = 0;
    contadorParejasEncontradas = 0; // Reinicia el contador de parejas encontradas
    contadorParejas.innerText = `Parejas encontradas Jugador: ${contadorParejasEncontradas}`; // Actualiza el contador de parejas
    contadorAciertosIa.innerText = `Parejas encontradas IA: ${aciertosIa}`;

    //controla la visibilidad de los botones
    controles.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    // Se activa el tiempo
    interval = setInterval(timeGenerator, 1000);
    // Se activan el contador de movimientos
    movimientos.innerHTML = `<span>Movimientos: </span> ${contadorMovimientos}`;
    initializer();
});

//Stop game
stopButton.addEventListener("click", stopGame);

function stopGame() {
    controles.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
}

// Reset game
resetButton.addEventListener("click", () => {
    resetGame();
});

function resetGame() {
    stopGame();  // Detiene el juego
    contadorMovimientos = 0;
    segundos = 0;
    minutos = 0;
    contadorVictorias = 0;
    contadorParejasEncontradas = 0;
    aciertosIa = 0;
    contadorParejas.innerText = `Parejas encontradas Jugador: ${contadorParejasEncontradas}`;
    contadorAciertosIa.innerText = `Parejas encontradas IA: ${aciertosIa}`;

    movimientos.innerHTML = `<span>Movimientos:</span> 0`;
    tiempoValue.innerHTML = `<span>Time:</span>00:00`;
    resultados.innerText = "";
    contenedorJuego.innerHTML = ""; // Limpia el tablero
    registroJugadas.innerHTML = "";
}


//Inicializa valores y llamadas a funciones
function initializer() {
    resultados.innerText = "";
    contadorVictorias = 0;
    const nuevoTamano = tableroSizeSelect.value.split("x");
    const rows = parseInt(nuevoTamano[0]);
    const cols = parseInt(nuevoTamano[1]);
    generarCartasYVerificarParejas(generateRandom(rows, cols), rows, cols);
    registroJugadas.innerHTML = "";
}


playMusicBtn.addEventListener('click', () => {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        playMusicBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    } else {
        backgroundMusic.pause();
        playMusicBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    }
});

// Manejadores de eventos

// Escuchar cambios en el tamaño del tablero seleccionado
tableroSizeSelect.addEventListener('change', () => {
    const nuevoTamano = tableroSizeSelect.value.split("x"); // Obtener el nuevo tamaño seleccionado
    resetGame(nuevoTamano[0], nuevoTamano[1]); // Reiniciar el juego con el nuevo tamaño del tablero
});
