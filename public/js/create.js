const pickers = document.querySelectorAll("[data-tag-picker]");
Array.from(pickers).forEach((p) => new TP(p));

const formElem = document.getElementById("create");

const handleSubmit = (e) => {
  e.preventDefault();

  const form = e.currentTarget;
  const url = form.action;
  const data = new FormData(form);
  // https://simonplend.com/how-to-use-fetch-to-post-form-data-as-json-to-your-api/
  //const plainFormData = Object.fromEntries(data.entries());

  let plainFormData = {};
  for (const [key, value] of data.entries()) {
    _.set(plainFormData, key, value);
  }

  if (plainFormData.description) {
    // FormData reencodes newline chars ("\n") in textareas as ("\r\n").
    // We reverse this to allow the server markdown parser to properly handle new lines.
    plainFormData.description = plainFormData.description.replace(/(\r\n)/g, "\n");
  }

  const formDataJsonString = JSON.stringify(plainFormData);

  fetch(url, {
    method: "POST",
    body: formDataJsonString,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((json) => {
      console.log("res:", json);
      window.location.href = "/";
    })
    .catch((err) => console.log("Error:", err));
};

formElem.addEventListener("submit", handleSubmit);
