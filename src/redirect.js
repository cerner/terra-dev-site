import basePath from './basePath';

window.sessionStorage.redirect = window.location.href;

window.location.pathname = basePath();
