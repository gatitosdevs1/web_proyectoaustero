// Contact-form
// alert("desde js");
const contactForm = document.getElementById("contact-form");
contactForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(contactForm);
  //cambiar ruta para deploy
  fetch("http://localhost/PruebaPHPmailer/send_mail.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        alert("Hubo un error!");
      } else {
        return response.json();
      }
    })
    .then((data) => {
      if (data.message) {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
// Contact-form end
