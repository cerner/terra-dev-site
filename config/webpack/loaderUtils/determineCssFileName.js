const findCss = (content) => {
  /**
  * The regex picks out lines that don't contain // but do contain some form of quotation (' or "),
  * and an explicit .css or .scss declaration
  */
  const regex = /^(?!\/\/|\/).*["'](.*\.css|.*\.scss)["']/m;
  const processedContent = regex.exec(content);
  const matchIndex = 1;
  let fileName;

  if (processedContent && processedContent.length > 0) {
    fileName = processedContent[matchIndex];
  }
  return fileName;
};

module.exports = findCss;
