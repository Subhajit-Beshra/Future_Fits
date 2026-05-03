const elements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }else{
      entry.target.classList.remove('show');
    }
  });
}, {});

elements.forEach(el => observer.observe(el));
/*main logic for the contact page, this is where the form will be handled and the email will be sent to the server*/
const form = document.getElementById('contactForm');
const sendBtn = document.getElementById('sendBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  sendBtn.innerText = 'Sending...';
  sendBtn.disabled = true;
  const formData = new FormData(form);

  try{
    const response = await fetch('https://formspree.io/f/mzdodqrd', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })

    if(response.ok){
      sendBtn.innerText = 'Message Sent!';
      form.reset();
      setTimeout(() => {
        sendBtn.innerText = 'Send Message';
        sendBtn.disabled = false;
      }, 3000);
    }
    else{
      sendBtn.innerText = 'Failed to Send';
      setTimeout(() => {
        sendBtn.innerText = 'Send Message';
        sendBtn.disabled = false;
      }, 3000);
    }
  }catch(error){
    console.error('Error sending message:', error);
    sendBtn.innerText = 'Error Sending';
    sendBtn.disabled = false;
  }

})