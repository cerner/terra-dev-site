const findCss = (x) => {
  let fileName;
  const regex = /^.*["'](.*\.css|.*\.scss)["']/m;
  const m = regex.exec(x);

  if (m !== null) {
    m.forEach((match, groupIndex) => {
      if (groupIndex === 1) {
        fileName = match;
      }
    });
  }
  return fileName;
};

module.exports = findCss;
