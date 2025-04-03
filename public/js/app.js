document.addEventListener('DOMContentLoaded', () => {
    const questionForm = document.getElementById('questionForm');
    const pytanieInput = document.getElementById('pytanie');
    const formFeedback = document.getElementById('formFeedback');
    const formError = document.getElementById('formError');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      
  
    questionForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      formFeedback.textContent = '';
      formError.textContent = '';
  
      const questionText = pytanieInput.value.trim();
      if (questionText.length < 3) {
        formError.textContent = 'Pytanie musi mieć co najmniej 3 znaki.';
        return;
      }
  
      try {
        // Wywołujemy nasz endpoint
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: questionText })
        });
  
        if (!response.ok) {
          throw new Error('Błąd wysyłania na serwer.');
        }
        const data = await response.json();
        formFeedback.textContent = data.message || 'Wysłano pytanie!';
        pytanieInput.value = '';
  
      } catch (err) {
        formError.textContent = 'Wystąpił problem z wysyłaniem pytania. Spróbuj ponownie.';
        console.error(err);
      }
    });
  });
  