const pickers = document.querySelectorAll("[data-tag-picker]");
Array.from(pickers).forEach((p) => new TP(p));

const formElem = document.getElementById("create");
const submitStatus = formElem.querySelector(".submit-status");

const handleSubmit = (e) => {
  e.preventDefault();

  const form = e.currentTarget;
  const url = form.action;
  const data = new FormData(form);
  // https://simonplend.com/how-to-use-fetch-to-post-form-data-as-json-to-your-api/
  // const plainFormData = Object.fromEntries(data.entries());
  let plainFormData = {};
  for (const [key, value] of data.entries()) {
    _.set(plainFormData, key, value);
  }

  const formDataJsonString = JSON.stringify(plainFormData);
  submitStatus.classList.add("sending");
  submitStatus.textContent = "Sending...";

  fetch(url, {
    method: "PATCH",
    body: formDataJsonString,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((json) => {
      console.log("res:", json);
      submitStatus.classList.add("success");
      submitStatus.textContent = "Success!";
    })
    .catch((err) => {
      console.log(err);
      submitStatus.textContent = "Error: " + err;
      submitStatus.classList.add("error");
    })
    .finally(() => {
      submitStatus.classList.remove("sending");

      submitStatus.addEventListener("animationend", () => {
        submitStatus.classList.remove("animate__animated", "animate__fadeOut", "success");
        submitStatus.textContent = "";
      });

      submitStatus.classList.add("animate__animated", "animate__fadeOut");
    });
};

formElem.addEventListener("submit", handleSubmit);
