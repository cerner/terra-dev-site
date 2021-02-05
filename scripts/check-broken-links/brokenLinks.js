/* eslint-disable import/no-extraneous-dependencies, no-console, no-param-reassign */
const fs = require('fs');
const path = require('path');
const { XMLHttpRequest } = require('xmlhttprequest');

class BrokenLinks {
  static getAllMDXFilesPath(dirPath, arrayOfMDXFilesPath) {
    const files = fs.readdirSync(dirPath);
    files.forEach((file) => {
      if (file !== 'node_modules' && file !== 'lib') {
        if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
          arrayOfMDXFilesPath = this.getAllMDXFilesPath(`${dirPath}/${file}`, arrayOfMDXFilesPath);
        } else
        if (file.endsWith('.mdx')) {
          arrayOfMDXFilesPath.push(path.join(dirPath, '/', file));
        }
      }
    });

    return arrayOfMDXFilesPath;
  }

  static getMenuItemLinks() {
    const menuItemsPath = path.resolve(`${process.cwd()}/dev-site-config/build/menuItems.js`);
    if (fs.existsSync(menuItemsPath)) {
      const menuItemLinks = fs.readFileSync(menuItemsPath, { encoding: 'utf8', flag: 'r' });
      return menuItemLinks.match(/(?<=path': ')(.*?)(?=')/g);
    }
    return null;
  }

  static getSearchItemLinks() {
    const searchItemsPath = path.resolve(`${process.cwd()}/dev-site-config/build/searchItems.js`);
    if (fs.existsSync(searchItemsPath)) {
      const searchItemLinks = fs.readFileSync(searchItemsPath, { encoding: 'utf8', flag: 'r' });
      return searchItemLinks.match(/(?<=path': ')(.*?)(?=')/g);
    }
    return null;
  }

  static getFileLinks() {
    const fileLinks = {};
    const arrayOfMDXFilesPath = fs.existsSync(`${process.cwd()}/packages`) ? this.getAllMDXFilesPath(`${process.cwd()}/packages`, []) : this.getAllMDXFilesPath(`${process.cwd()}/src`, []);
    arrayOfMDXFilesPath.forEach(filePath => {
      const tempLinks = [];
      const fileContent = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
      tempLinks.push(fileContent.match(/((?<=\]\()((?!#|\.).*?)|https:\/\/(.*?)|http:\/\/(.*?))(?=(\s|\n|>|"|'|\)))/g));
      tempLinks.forEach(tempLink => {
        if (tempLink !== null) {
          fileLinks[filePath] = tempLink;

          tempLink.forEach(link => {
            const index = fileContent.indexOf(link);
            const tempString = fileContent.substring(0, index);
            const lineNumber = tempString.split('\n').length;

            fileLinks[filePath][link] = lineNumber;
          });
        }
      });
    });
    return fileLinks;
  }

  static checkLinks() {
    const fileLinks = this.getFileLinks();
    const menuItemLinks = this.getMenuItemLinks();
    const searchItemLinks = this.getSearchItemLinks();
    Object.entries(fileLinks).forEach(fileLink => {
      const [file, links] = fileLink;
      links.forEach(link => {
        if (link.includes('https') || link.includes('http')) {
          const xmlHttp = new XMLHttpRequest();
          xmlHttp.open('GET', link);
          xmlHttp.onloadend = () => {
            if (xmlHttp.status === 404 && xmlHttp.responseText.includes('Not Found')) {
              console.warn('Warning! Broken Link', link, 'in', file, 'at line:', fileLinks[file][link]);
            }
          };
          xmlHttp.send(null);
          setTimeout(() => xmlHttp.abort(), 10);
        } else
        if (menuItemLinks && searchItemLinks && !(menuItemLinks.includes(link) || searchItemLinks.includes(link))) {
          console.warn('Warning! Broken Link', link, 'in', file, 'at line:', fileLinks[file][link]);
        }
      });
    });
  }
}

module.exports = BrokenLinks;
