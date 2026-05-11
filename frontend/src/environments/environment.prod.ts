import packageInfo from '../../package.json';

// Tự động lấy base href từ file index.html để ghép vào API URL
const getBaseHref = () => {
  const base = document.getElementsByTagName('base')[0];
  const href = base ? base.getAttribute('href') : '/';
  // Loại bỏ dấu gạch chéo cuối nếu có để ghép cho đẹp
  return href && href.endsWith('/') ? href.substring(0, href.length - 1) : href;
};

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl: (getBaseHref() || '') + '/api'
};
