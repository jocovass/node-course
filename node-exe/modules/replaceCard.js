module.exports = (data, temp) => {
  let output = temp.replace(/{%NAME%}/g, data.name);
  const url = data.image;
  output = output.replace(/{%IMAGE%}/g, url);
  output = output.replace(/{%ID%}/g, data.id);

  return output;
};
