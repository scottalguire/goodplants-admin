// https://mattstauffer.com/blog/a-little-trick-for-grouping-fields-in-an-html-form/

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

const increment = (el) => {
  const id = el.id || el.htmlFor;
  const findNum = id.match(/\d+/g);
  return id.replace(findNum, parseInt(findNum) + 1);
};
const repeaters = Array.from(document.querySelectorAll(".repeater"));

repeaters.forEach((repeater) => {
  const labels = Array.from(repeater.querySelectorAll("label"));
  const button = document.createElement("button");

  button.textContent = "Add Row";
  button.type = "button";
  button.addEventListener("click", () => {
    const lastGroup = Array.from(repeater.getElementsByClassName("group")).reverse()[0];
    console.log(lastGroup);
    const clonedGroup = lastGroup.cloneNode(true);
    const inputs = Array.from(clonedGroup.querySelectorAll("input"));
    const labels = Array.from(clonedGroup.querySelectorAll("label"));

    inputs.forEach((input) => {
      const incrementedId = increment(input);
      input.id = incrementedId;
      input.name = incrementedId;
    });

    labels.forEach((label) => {
      const incrementedId = increment(label);
      label.htmlFor = incrementedId;
    });

    insertAfter(clonedGroup, lastGroup);
  });
  repeater.appendChild(button);
});
