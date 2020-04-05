module.exports = data => {
  let output = "<ul>";
  for (let prop in data) {
    if (typeof data[prop] === "object") {
      output += `<h3 class="title-tertiary">${prop.toUpperCase()}</h3>`;
      for (let inner in data[prop]) {
        output += `<li>${inner}: ${data[prop][inner]}</li>`;
      }
    } else {
      output += `<li>${prop}: ${data[prop]}</li>`;
    }
  }
  return output;
};
