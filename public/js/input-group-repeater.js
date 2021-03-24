// https://mattstauffer.com/blog/a-little-trick-for-grouping-fields-in-an-html-form/

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

const getIndex = (id) => (findNum = id.match(/\d+/g));

const increment = (el) => {
  const id = el.id || el.htmlFor;
  const index = getIndex(id);
  return id.replace(index, parseInt(index) + 1);
};

let timer;
/**
 * Waits 1 second for typing to stop before set image src
 * @param {*} e
 */
const onKeyUp = (e) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    const possibleGroup = e.target.parentElement.parentElement.parentElement;

    if (possibleGroup.classList.contains("group")) {
      const img = possibleGroup.querySelector("img");

      const req = new XMLHttpRequest();
      const reqListener = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
          console.log(this.status);
          if (this.status === 0 || (this.status >= 200 && this.status < 400)) {
            img.src = e.target.value;
          }
        }
      };
      req.open("GET", e.target.value);
      req.addEventListener("readystatechange", reqListener);
      req.send(null);
    }
  }, 1000);
};

const reIndexGroups = (repeater) => {
  const groups = Array.from(repeater.querySelectorAll(".group"));
  const repeaterType = repeater.dataset.repeater;

  groups.forEach((group, groupIndex) => {
    const inputs = Array.from(group.querySelectorAll("input"));
    const labels = Array.from(group.querySelectorAll("label"));

    inputs.forEach((input) => {
      const id = input.id || input.htmlFor;
      const index = getIndex(id);
      const reindexedId = id.replace(index, groupIndex);

      input.id = reindexedId;
      input.name = reindexedId;

      if (repeaterType === "image") {
        if (input.id.indexOf("src") > -1) {
          input.removeEventListener("keyup", onKeyUp);
          input.addEventListener("keyup", onKeyUp);
        }
      }
    });

    labels.forEach((label) => {
      const id = label.id || label.htmlFor;
      const index = getIndex(id);
      const reindexedId = id.replace(index, groupIndex);

      label.htmlFor = reindexedId;
    });
  });
};

const repeaters = Array.from(document.querySelectorAll("[data-repeater]"));

repeaters.forEach((repeater) => {
  let cachedGroupHtml;
  const groups = Array.from(repeater.querySelectorAll(".group"));

  // Store the first group on load in memory, in case the user deletes all rows and we need a prototype to clone from
  if (groups.length) cachedGroupHtml = groups[0];

  const initDeleteBtns = () => {
    groups.forEach((group) => {
      // on load add dynamic delete buttons
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Remove Row";
      deleteButton.type = "button";

      deleteButton.addEventListener("click", () => {
        const groups = Array.from(repeater.querySelectorAll(".group"));
        // if (groups.length > 1) {
        group.remove();
        // Reindex after delete
        reIndexGroups(repeater);
        // }
      });

      group.appendChild(deleteButton);
    });
  };

  initDeleteBtns();

  // The add button allows for cloning the last group with incremented id/name attributes
  const addButton = document.createElement("button");
  addButton.textContent = "Add Row";
  addButton.type = "button";
  addButton.addEventListener("click", () => {
    const lastGroup = Array.from(repeater.getElementsByClassName("group")).reverse()[0];
    const clonedGroup = lastGroup ? lastGroup.cloneNode(true) : cachedGroupHtml.cloneNode(true);
    const inputs = Array.from(clonedGroup.querySelectorAll("input"));
    const labels = Array.from(clonedGroup.querySelectorAll("label"));
    const existingDeleteButton = clonedGroup.querySelector("button");

    if (existingDeleteButton) existingDeleteButton.remove();

    inputs.forEach((input) => {
      const incrementedId = increment(input);
      input.id = incrementedId;
      input.name = incrementedId;
    });

    labels.forEach((label) => {
      const incrementedId = increment(label);
      label.htmlFor = incrementedId;
    });

    // Replace delete button since node.cloneNode doesn't copy event handlers of exisitng delete button since they were created with addEventListener
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Remove Row";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", () => {
      const groups = Array.from(repeater.querySelectorAll(".group"));
      clonedGroup.remove();
      // Reindex after delete
      reIndexGroups(repeater);
    });
    clonedGroup.appendChild(deleteButton);

    lastGroup
      ? insertAfter(clonedGroup, lastGroup)
      : repeater.insertBefore(clonedGroup, repeater.querySelector("button"));
    // Reindex after add
    reIndexGroups(repeater);
  });

  repeater.appendChild(addButton);

  // Reindex on init
  reIndexGroups(repeater);
});
