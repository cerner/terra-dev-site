const findCss = (content) => {
  /**
  * The regex picks out lines that don't contain // but do contain some form of quotation (' or "),
  * and an explicit .css or .scss declaration
  */
  const regex = /^(?!\/\/|\/).*["'](.*\.css|.*\.scss)["']/m;
  const processedContent = regex.exec(content);
  let fileName;

  if (processedContent) {
    processedContent.forEach((match, groupIndex) => {
      if (groupIndex === 1) {
        fileName = match;
      }
    });
  }
  return fileName;
};

module.exports = findCss;
