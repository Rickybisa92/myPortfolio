const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const port = 3000;  // El puerto en el que el servidor escuchará

// Habilita CORS para que el frontend pueda hacer peticiones desde otro origen
app.use(cors());

// Middleware para parsear el cuerpo en formato JSON
app.use(express.json());

// Inicializa Resend con tu clave de API
const resend = new Resend('re_6ZS3V3Ga_9CnA5JpueZVNVMDWLiogTrZr');  // Reemplaza con tu clave de API real

// Endpoint para manejar el envío del formulario
app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',  // Dirección verificada en Resend
      to: ['ricardobji92@gmail.com'],  // Tu correo donde quieres recibir los mensajes
      subject: `Nuevo mensaje de ${name}`,  // Asunto con el nombre del remitente
      html: `<p>Nombre: ${name}</p><p>Email: ${email}</p><p>Mensaje: ${message}</p>`,  // El contenido del mensaje
    });

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Inicia el servidor en el puerto especificado
app.listen(port, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${port}`);
  });
