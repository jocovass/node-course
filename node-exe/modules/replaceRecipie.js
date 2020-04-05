module.exports = (data, temp, ingHtml) => {
  let output = temp.replace(/{%NAME%}/g, data.name);
  output = output.replace(/{%IMAGE%}/g, data.image);
  output = output.replace(/{%PERSON%}/g, data.person);
  output = output.replace(/{%INGREDIENTS%}/g, ingHtml);
  output = output.replace(/{%PREPARATION%}/g, data.preparation);

  return output;
};
