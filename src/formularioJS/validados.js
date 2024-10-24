_get("#icono-ojo").addEventListener("click", function () { muestraPassword("#password", "#icono-ojo")});
_get("#btnCambioModo").onclick = cambioModo;

function _get(elemento) {
    return document.querySelector(elemento);
}







const form = document.querySelector('form');


const usuaris = ["daniel.82", "manuel-223", "darknight_1", "mrNum.1234", "user77", "fairyGoth"];

/* Funció que marca els inputs com a vàlids/invàlids*/
function setValidity(element, msgError) {
    element.classList.remove("is-invalid");
    element.classList.remove("is-valid");

    if (msgError.length == 0) {
        element.classList.add("is-valid");
    } else {
        element.classList.add("is-invalid");
    }

    element.setCustomValidity(msgError);
    document.querySelector(`#error-${element.id}`).innerHTML = msgError;


}

form.onsubmit = function (event) {
    form.querySelectorAll("input").forEach(element => {
        element.dispatchEvent(new Event("input"));
    });

    validaCaptcha();

    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        alert("Revisau les errades abans de continuar");
    }

    form.classList.add('was-validated');
};

form.onreset = () => {
    // Limpiar los valores de los inputs
    form.querySelectorAll("input").forEach(input => {
        input.value = "";
    });

    // Limpiar las clases de validación y mensajes de error
    form.querySelectorAll(".is-invalid").forEach(input => {
        input.classList.remove("is-invalid");
    });

    form.querySelectorAll(".is-valid").forEach(input => {
        input.classList.remove("is-valid");
    });

    form.querySelectorAll(".invalid-feedback").forEach(error => {
        error.innerHTML = "";
    });
};


function cambioModo() {
    const body = _get("body");
    const icona = _get("#iconoCambioModo");
    if (body.classList.contains("modoDia")) {
        body.classList.remove("modoDia");
        body.classList.add("modoNoche");
        icona.classList.remove("fa-sun");
        icona.classList.add("fa-moon");
    } else if (body.classList.contains("modoNoche")) {
        body.classList.remove("modoNoche");
        body.classList.add("modoDia");
        icona.classList.remove("fa-moon");
        icona.classList.add("fa-sun");
    }
}

function muestraPassword(){
    var password = _get("#password");
    var iconoOjo = _get("#icono-ojo");
    var valorAtrib = password.getAttribute("type");
    if(valorAtrib == "text") {
        password.setAttribute("type", "password");
        iconoOjo.classList.add("fa-eye-slash");
        iconoOjo.classList.remove("fa-eye");
    } else if (valorAtrib == "password") {
        password.setAttribute("type", "text");
        iconoOjo.classList.add("fa-eye");
        iconoOjo.classList.remove("fa-eye-slash");
    }
}

/* Attach events oninput*/

const nomInput = document.getElementById('nom');
const llin1Input = document.getElementById('llin1');
const llin2Input = document.getElementById('llin2');
const usuariInput = document.getElementById('usuari');
const passwordInput = document.getElementById('password');
const pais = document.getElementById('pais');
const codigoPostal = document.getElementById('codigoPostal');
const dni = document.getElementById('dni');

/* Que los campos obligatorios no esten vacios */
nomInput.onblur = () => {
    validarVacios(nomInput, "El camp nom no pot estar buit");
};
llin1Input.onblur = () => {
    validarVacios(llin1Input, "El primer llinatge no pot estar buit");
};

usuariInput.onblur = () => {
    validarVacios(usuariInput, "El camp usuarname no pot estar buit");
}

passwordInput.onblur = () => {
    validarVacios(passwordInput, "El camp password no pot estar buit");
}



/*-----------------------------------------------------------------*/

nom.oninput = validarNom;
llin1.oninput = validarApellido1;
llin2.oninput = validarApellido2;
usuari.oninput = validarUsername;
password.oninput = validarPassword;
dataNaix.oninput = validarDataNaix;
pais.oninput = inputDisable;
codigoPostal.oninput = validarCodigoPostal;
dni.oninput = validarDni;
generaCaptcha.oninput = validaCaptcha;


function inputDisable() {
    if (pais.value === "ES") {
        // Si el país seleccionado es España, habilitar el campo de código postal y el de DNI
        codigoPostal.disabled = false;
        dni.disabled = false;
    } else {
        // Si el país seleccionado no es España, deshabilitar ambos campos y limpiar sus valores
        codigoPostal.disabled = true;
        dni.disabled = true;
        codigoPostal.value = "";
        dni.value = "";
    }
}



/* funcion evaluar nombre */

function validarNom() {
    let nomValue = nom.value;

    if (validaLargaria(nomValue, 2, 24) === "" && soloLetras(nomValue) === "") {
        setValidity(nom, ""); // Si el nombre cumple con los criterios, no hay error
    } else {
        setValidity(nom, validaLargaria(nomValue, 2, 24) + soloLetras(nomValue));
    }
}


/* evaluar apellido */
function validarApellido1() {
    let apellido1Value = llin1.value;


    if (validaLargaria(apellido1Value, 2, 24) === "" && soloLetras(apellido1Value) === "") {
        setValidity(llin1, "");
    } else {
        setValidity(llin1, validaLargaria(apellido1Value, 2, 24) + soloLetras(apellido1Value));
    }
}

function validarApellido2() {
    let apellido2Value = llin2.value;

    if (apellido2Value === "") {
        setValidity(llin2, ""); // Si el campo está vacío, no se aplica ninguna validación
    } else {
        setValidity(llin2, validaLargaria(apellido2Value, 2, 24) + soloLetras(apellido2Value));
    }
}

function validarUsername() {
    let usernameValue = usuari.value;


    // Verificar longitud entre 4 y 20 caracteres
    if (validaLargaria(usernameValue, 4, 20)) {
        setValidity(usuari, " L'usuari ha de tenir entre 4 i 20 caràcters.");
        return;
    }

    // Verificar que comience con una letra
    if (!/^[a-zA-Z]/.test(usernameValue)) {
        setValidity(usuari, " L'usuari ha de començar amb una lletra.");
        return;
    }

    // Verificar que sea alfanumérico con al menos una letra y opcionalmente números y [-, _, .]
    let error = soloUnSimbolo(usernameValue);
    if (error !== "") {
        setValidity(usuari, error);
        return;
    }

    // Si llegamos aquí, el username es válido
    setValidity(usuari, "");
}

//--------------------------------------------------------------------------------------


/* He creado esta función ya que en el enunciado ponia que puede admitir solamente un simbolo, al poner otro más quiero que salte el error
de que he añadido otro simbolo más y que no haya problema al poner numeros*/

function soloUnSimbolo(texto) {
    let simbolosPermitidos = ["-", "_", "."];
    let simbolosCount = 0;

    for (let char of texto) {
        if (!/[A-Za-z0-9]/.test(char)) {
            if (!simbolosPermitidos.includes(char)) {
                return " L'usuari només pot contenir lletres, números i un símbol dels següents: [-, _, .].";
            } else {
                simbolosCount++;
            }
        }
    }

    if (simbolosCount > 1) {
        return " L'usuari no pot contenir més d'un símbol dels següents: [-, _, .].";
    }

    return "";
}

//-------------------------------------------------------------------------------------------------

function validarPassword() {
    let passwordValue = password.value.trim();

    if (validaLargaria(passwordValue, 8, 16) === "" && soloMayuscula(passwordValue) === ""
    && soloMinuscula(passwordValue) === "" && soloNumero(passwordValue) === "" && soloSimbolo(passwordValue) === "") {
        setValidity(password, ""); // Si el nombre cumple con los criterios, no hay error
    } else {
        setValidity(password, validaLargaria(passwordValue, 8, 16) + soloMayuscula(passwordValue) + soloMinuscula(passwordValue) + soloNumero(passwordValue) + "<br>" + soloSimbolo(passwordValue));
    }
}


function validarDataNaix() {
    let dataNaixValue = dataNaix.value;
    let fechaNacimientoUsuario = new Date(dataNaixValue);
    let edad = calcularEdad(fechaNacimientoUsuario);

    if (edad < 18) {
        setValidity(dataNaix, "Debes ser mayor de 18 años para registrarte.");
    } else {
        setValidity(dataNaix, "");
    }
}

function parseFecha(fechaString) {
    let partes = fechaString.split("-");
    return new Date(partes[2], partes[1] - 1, partes[0]); // Ajustar para DD-MM-YYYY
}

function calcularEdad(dataNaix) {
    let hoy = new Date();
    let edad = hoy.getFullYear() - dataNaix.getFullYear();
    let mes = hoy.getMonth() - dataNaix.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < dataNaix.getDate())) {
        edad--;
    }

    return edad;
}

function validarCodigoPostal() {
    let codigoPostalValue = codigoPostal.value;

    if (validaLargaria(codigoPostalValue, 5, 5) === "" && soloNumero(codigoPostalValue) === "") {
        setValidity(codigoPostal, ""); // Si el nombre cumple con los criterios, no hay error
    } else {
        setValidity(codigoPostal, validaLargaria(codigoPostalValue, 5, 5) + soloNumero(codigoPostalValue));
    }

}

function validarDni() {
    let dniValue = dni.value;


    const dniRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;

    if (dniRegex.test(dniValue)) {
        setValidity(dni, ""); // DNI válido, no hay error
    } else {
        setValidity(dni, "El format del DNI no és vàlid.");
    }


}

/* Validar parametros */

function validarVacios(element, mensaje) {
    if (element.value.trim().length === 0) {
        setValidity(element, mensaje); // Cambia la clase del input y muestra el mensaje debajo
    } else {
        setValidity(element, ""); // Si el campo no está vacío, elimina la clase y el mensaje de error
    }
}


function validaLargaria(texto, min, max) {
    let msgError = "";

    if (texto.length > max) {
        msgError = `No pot superar els ${max} carácteres.`;
    } else if (texto.length < min) {
        msgError = `Ha de tenir com a mínim ${min} caràcteres.`;
    }

    return msgError;

}

function soloLetras(texto) {
    var valida = /^[A-Za-z-ñ\s]+$/.test(texto);

    if (valida) {
        return "";
    }
    return " Només es permeten lletres";
}

function soloMayuscula(texto) {
    var valida = /[A-Z]/.test(texto);

    if (valida) {
        return "";
    }
    return " Ha de contenir com a mínim una lletra majúscula.";
}

function soloMinuscula(texto) {
    var valida = /[a-z]/.test(texto);

    if (valida) {
        return "";
    }
    return " Ha de contenir com a mínim una lletra minúscula.";
}

function soloNumero(texto) {
    var valida = /\d/.test(texto);

    if (valida) {
        return "";
    }
    return " Ha de contenir almenys un número.";
}

function soloSimbolo(texto) {
    var simbolosPermitidos = /[-_.#$]/;
    var simbolosEncontrados = texto.match(simbolosPermitidos);

    if (simbolosEncontrados === null || simbolosEncontrados.length !== 1) {
        return "  Ha de contenir exactament un símbol dels següents: [-, _, ., $, #].";
    }
    return "";
}








/* CAPTCHA */

// Obtener el botón Regenera
const regeneraButton = document.getElementById('regenera');

// Agregar evento de clic al botón Regenera
regeneraButton.addEventListener('click', function() {
    // Regenerar otro captcha
    generaCaptcha();
});




function generaCaptcha() {
    // Generar dos números aleatorios entre 1 y 10
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    // Generar un operador aleatorio (+, - o *)
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    // Calcular el resultado del captcha
    let result;
    switch (operator) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '*':
            result = num1 * num2;
            break;
    }
    // Construir el captcha como una cadena legible
    const captchaString = `${num1} ${operator} ${num2}`;
    // Almacenar los datos del captcha en un atributo del formulario
    form.setAttribute('data-captcha-result', result);
    // Mostrar el captcha en el campo de entrada
    document.getElementById('label-captcha').textContent = captchaString;
}

// Llamar a la función para generar el captcha al cargar la página
generaCaptcha();

function validaCaptcha() {
    // Obtener la respuesta ingresada por el usuario
    const userInput = document.getElementById('userCaptcha').value;
    // Obtener el resultado correcto del captcha del atributo del formulario
    const correctResult = parseInt(form.getAttribute('data-captcha-result'));
    // Convertir la respuesta del usuario a un número entero
    const userResult = parseInt(userInput);
    // Verificar si la respuesta del usuario es igual al resultado correcto del captcha
    if (userResult === correctResult) {
        // Captcha válido, continuar con el envío del formulario
        return true;
    } else {
        // Captcha inválido, detener el envío del formulario
        alert("Captcha inválido. Por favor, inténtalo de nuevo.");
        return false;
    }
}


// Función para guardar el formulario en el localStorage
function guardarFormulario() {

    // Verificar si el formulario es válido
    if (form.checkValidity()) {
        
        // Crear un objeto con los datos del formulario
        const formData = {
            nom: nom.value,
            llin1: llin1.value,
            llin2: llin2.value,
            usuari: usuari.value,
            password: password.value,
            dataNaix: dataNaix.value,
            pais: pais.value,
            codigoPostal: codigoPostal.value,
            dni: dni.value,
            captcha: document.getElementById('label-captcha').textContent.trim()
        };

        // Obtener los datos almacenados en el localStorage o inicializar un array vacío
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        // Verificar si el usuario ya está almacenado en el localStorage
        const usuarioExistente = usuarios.find(user => user.usuari === formData.usuari);
        if (usuarioExistente) {
            alert('El usuario ya está registrado.');
            return;
        }

        // Agregar el nuevo usuario al array
        usuarios.push(formData);

        // Guardar el array actualizado en el localStorage
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        // Actualizar el desplegable
        actualizarDesplegable();
    } else {
        alert('Por favor, complete el formulario correctamente.');
    }
}

// Función para actualizar el desplegable con los usuarios almacenados en localStorage
function actualizarDesplegable() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const select = document.getElementById('usuarios-select');

    // Limpiar las opciones existentes
    select.innerHTML = '';

    // Crear opciones para cada usuario almacenado
    usuarios.forEach((user, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${user.usuari} - ${user.dataNaix}`;
        select.appendChild(option);
    });
}

// Función para cargar los datos de un usuario seleccionado en el formulario
function cargarUsuario() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const selectedIndex = document.getElementById('usuarios-select').value;
    const selectedUser = usuarios[selectedIndex];

    // Llenar el formulario con los datos del usuario seleccionado
    nom.value = selectedUser.nom;
    llin1.value = selectedUser.llin1;
    llin2.value = selectedUser.llin2;
    usuari.value = selectedUser.usuari;
    password.value = selectedUser.password;
    dataNaix.value = selectedUser.dataNaix;
    pais.value = selectedUser.pais;
    codigoPostal.value = selectedUser.codigoPostal;
    dni.value = selectedUser.dni;
    document.getElementById('label-captcha').textContent = selectedUser.captcha;
}

// Función para limpiar el localStorage y el desplegable
function limpiarLocalStorage() {
    localStorage.removeItem('usuarios');
    actualizarDesplegable();
}

// Agregar eventos a los elementos del formulario y botones
form.onsubmit = function (event) {
    event.preventDefault(); // Evitar que el formulario se envíe automáticamente
    guardarFormulario();
};

document.getElementById('cargar-usuario-btn').onclick = function () {
    cargarUsuario();
};

document.getElementById('limpiar-localstorage-btn').onclick = function () {
    limpiarLocalStorage();
};

// Cargar usuarios existentes al cargar la página
window.onload = function () {
    actualizarDesplegable();
};




