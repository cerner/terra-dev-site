const findCss = (x) => {
  /**
  * The regex picks out lines that don't contain // but do contain some form of quotation (' or "),
  * and an explicit .css or .scss deceleration
  */
  const regex = /^(?!\/\/|\/).*["'](.*\.css|.*\.scss)["']/m;
  const m = regex.exec(x);
  let fileName;

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
