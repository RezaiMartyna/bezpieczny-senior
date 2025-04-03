require('dotenv').config(); // jeśli używasz pliku .env do przechowywania haseł

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

// Ustawienie nagłówków bezpieczeństwa
app.use(helmet());
// Zezwalamy na żądania z dowolnego źródła (lub skonfiguruj wedle potrzeb)
app.use(cors());
// Odczyt danych JSON z body
app.use(bodyParser.json());
// Udostępniamy pliki statyczne (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// KONFIGURACJA NODMAILERA (Gmail lub inny SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'twoj.gmail@gmail.com',
    pass: process.env.EMAIL_PASS || 'twoje-haslo-aplikacji'
  }
});

/**
 * Endpoint POST: /api/send-email
 * Odbiera JSON: { question: "..."} i wysyła maila do docelowej skrzynki
 */
app.post('/api/send-email', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question || question.trim().length < 3) {
      return res.status(400).json({ error: 'Pytanie jest za krótkie.' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER || 'twoj.gmail@gmail.com',
      to: 'rezai.martyna@gmail.com',  // docelowy adres e-mail
      subject: 'Nowe pytanie z aplikacji "Bezpieczny Senior"',
      text: `Otrzymano nowe pytanie:\n\n${question}\n\n(Wiadomość wysłana automatycznie z formularza)`,
    };

    // Wysyłamy maila
    await transporter.sendMail(mailOptions);

    // Zwracamy potwierdzenie
    res.json({ message: 'Pytanie zostało wysłane na maila.' });
  } catch (err) {
    console.error('Błąd wysyłania e-maila:', err);
    res.status(500).json({ error: 'Wystąpił błąd podczas wysyłania maila.' });
  }
});

// Uruchamiamy serwer na porcie 3000 (lub innym)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serwer wystartował na porcie ${PORT}.`);
});
