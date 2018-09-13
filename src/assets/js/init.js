const defaultDomain = 'gps.dtmobi.com';

const domainMap = {
  [defaultDomain]: {
    // ECMA2015 Computed property names
    name: 'gps',
    title: '车保姆',
    icon: '/static/images/logo.ico',
    logoImg: '/static/website-setting/gps/logo.jpg',
    appDownloadImg: '/static/app_download.png',
  },
  'dcszx.dtmobi.com': {
    name: 'dcszx',
    title: '大城市在线',
    icon: '/static/images/dcszx_logo.ico',
    logoImg: '/static/website-setting/dcszx/logo.png',
    appDownloadImg: '/static/app_download.png',
  },
  'huaxin.dtmobi.com': {
    name: 'huaxin',
    title: '华新融资租赁',
    icon: '/static/website-setting/huaxin/logo.ico',
    logoImg: '/static/website-setting/huaxin/logo.png',
    appDownloadImg: '/static/app_download.png',
  },
  'magicyo.dtmobi.com': {
    name: 'magicyo',
    title: 'Magicyo',
    icon: '/static/website-setting/magicyo/logo.ico',
    logoImg: '/static/website-setting/magicyo/logo.png',
    miniLogoImg: '/static/website-setting/magicyo/mini-logo.png',
    miniLogoWidth: 35,
    appDownloadImg: '/static/app_download.png',
  },
  'ht-telecom.dtmobi.com': {
    name: 'htdx',
    title: 'HtTelecom',
    icon: '/static/website-setting/htdx/logo.ico',
    logoImg: '/static/website-setting/htdx/logo.png',
    miniLogoImg: '/static/website-setting/htdx/mini-logo.png',
    miniLogoWidth: 35,
    appDownloadImg: '/static/app_download.png',
  },
};

const domain = Object.keys(domainMap).indexOf(document.domain) === -1
                ? defaultDomain : document.domain;

export const configuration = domainMap[domain];

export function init() {
  const link = document.createElement('link');
  link.rel = 'shortcut icon';
  link.href = configuration.icon;
  document.title = configuration.title;
  document.head.appendChild(link);
}
