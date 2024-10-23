const btnBuscador = document.getElementById("btnBuscador");
const btnRandom = document.getElementById("btnRandom");
const gallery = document.getElementById("gallery");
const orientacion = document.getElementById("orientacion");
const cantidad = document.getElementById("cantidad");
const color = document.getElementById( "color" );
const pagina = document.getElementById('pagina');

btnBuscador.onclick = buscarImagen;
btnRandom.onclick = randomImagen;

const miClave = "wh9rWGsBYml9DkMZ9Dvk5zNVbgz9sqYRZVKtN3abNqA";

function buscarImagen() {
    const query = document.getElementById("search").value;
    const colorValue = color.value; // Obtén el valor del campo de color
    const orientacionValue = orientacion.value;

    // Construye la URL de la API sin el parámetro de color inicialmente
    let apiUrl = `https://api.unsplash.com/search/photos?query=${query}&per_page=${cantidad.value}&client_id=${miClave}`;

    // Agrega el parámetro de color solo si se proporciona un valor
    if (colorValue) {
        apiUrl += `&color=${colorValue}`;
    }

    // Agrega el parámetro de orientación solo si se proporciona un valor
    if (orientacionValue) {
        apiUrl += `&orientation=${orientacionValue}`;
    }

    fetch(apiUrl)
        .then(response => {
            const rateLimitRemaining = response.headers.get("X-Ratelimit-Remaining");
            document.getElementById("peticiones-restantes").textContent = `Peticiones restantes: ${rateLimitRemaining}`;

            if (response.ok) {
                return response.json();
            } 
            throw new Error(`Error ${response.status}: ${getErrorMessage(response.status)}`);
        })
        .then(data => {
            console.log(data)
            displayImages(data.results);
        })
        .catch(err => {
            console.error(err);
            alert("Se ha producido un error al buscar imágenes. Por favor, inténtalo de nuevo más tarde.")
        });
}

function getErrorMessage(status) {
    switch (status) {
        case 400:
            return "Solicitud incorrecta: La solicitud no fue aceptable, a menudo debido a la falta de un parámetro requerido";
        case 401:
            return "No autorizado: Token de acceso inválido";
        case 403:
            return "Prohibido: Permisos faltantes para realizar la solicitud";
        case 404:
            return "No encontrado: El recurso solicitado no existe";
        case 500:
        case 503:
            return "Error interno del servidor: Algo salió mal en nuestro servidor";
        default:
            return "Error desconocido";
    }
}


function randomImagen() {
    const cantidad = document.getElementById("cantidad").value;
    fetch(`https://api.unsplash.com/photos/random?orientation=${orientacion.value}&client_id=${miClave}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Se ha producido un error al obtener una imagen aleatoria");
        })
        .then(data => {
            console.log(data);
            displayImages([data]);
        })
        .catch(err => {
            console.error(err);
        });
}

function displayImages(images) {
    let galleryHTML = "";
    images.forEach((image, index) => {
        if (index % 3 === 0) {
            galleryHTML += '<div class="row justify-content-center">';
        }
        galleryHTML += `
        <div class="col-md-4 gallery-item">
        <a href="${image.urls.full}" target="_blank">
            <img src="${image.urls.regular}" alt="${image.alt_description}" class="gallery-image">
        </a>
        <div class="image-metadata">
        <div class="image-details">
                    <p>User<i class="fa-solid fa-user"></i> : ${image.user.username}</p>
                    <p>Likes<i class="fa-brands fa-gratipay"></i> : ${image.likes}</p>
                    <p>Resolution<i class="fa-solid fa-display"></i> : ${image.width}x${image.height}</p>
                    <p>Creation Date<i class="fa-solid fa-calendar-days"></i> : ${formatDate(image.created_at)}</p>
                    </div>
                </div>
            </div>
    `;
        if ((index + 1) % 3 === 0 || (index + 1) === images.length) {
            galleryHTML += '</div>';
        }
    });
    gallery.innerHTML = galleryHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

