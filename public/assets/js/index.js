// Contact-form

//Para mostrar el mensaje en el modal
function formResponse(head, body, loader) {
  const messageHead = document.querySelector("#form-response h6");
  const messageBody = document.querySelector("#form-response p");
  const resMessage = document.getElementById("form-response");
  loader.classList.add("d-none");
  resMessage.classList.remove("d-none");
  messageHead.innerHTML = head;
  messageBody.innerHTML = body;
}
//salir del modal
const resButton = document.querySelector("#form-response button");
resButton.addEventListener("click", () => {
  const resView = document.getElementById("form-loader");
  resView.classList.add("d-none");
});

//Enviar el mensaje
const contactForm = document.getElementById("contact-form");
contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const resView = document.getElementById("form-loader");
  const loader = document.getElementById("img-form-loader");
  resView.classList.remove("d-none");
  loader.classList.remove("d-none");

  const formData = new FormData(contactForm);
  //cambiar ruta para deploy
  fetch("http://localhost/PruebaPHPmailer/send_mail.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        formResponse("Hubo un error", "Por favor inténtelo más tarde", loader);
        console.log("ma");
        console.log(response);
        // alert("Hubo un error!");
      } else {
        return response.json();
      }
    })
    .then((data) => {
      if (data.message) {
        formResponse(
          data.message,
          "Nos contactaremos contigo lo antes posible.",
          loader
        );

        // alert(data.message);
      }
    })
    .catch((error) => {
      formResponse("Hubo un error", "Por favor inténtelo más tarde", loader);
      console.error("Error:", error);
    });
});
// Contact-form end

// Back top
const biography = document.getElementById("biografia");
const arrow = document.getElementById("back-top");
window.addEventListener("scroll", function () {
  if (biography.offsetTop <= this.scrollY) {
    arrow.classList.remove("fade");
    arrow.classList.add("show");
  } else {
    arrow.classList.remove("show");
    arrow.classList.add("fade");
  }
});

arrow.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

//ModalDev
const btnDev = document.getElementById("btn-dev");
const modalDev = document.getElementById("modal-gatitos");
const btnClose = document.getElementById("closeM");
btnDev.addEventListener("click", function () {
  // modalDev.classList.remove("d-none");

  // modalDev.classList.remove("fade");
  modalDev.style.zIndex = "100";
  modalDev.classList.add("show");
});
btnClose.addEventListener("click", function () {
  // modalDev.classList.remove("d-none");

  // modalDev.classList.remove("fade");
  modalDev.classList.remove("show");
  modalDev.style.zIndex = "-1";
});
