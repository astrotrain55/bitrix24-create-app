export default {
  scope: ['crm', 'user', 'placement'],
  placement: ['CRM_DEAL_DETAIL_TAB', 'CRM_ANALYTICS_MENU', 'REST_APP_URI'],
  testDomains: [],
  scripts: [],
  global: {
    appName: window.appName,
    appNameEng: window.appNameEng,
    appCodeName: window.appCodeName,
    appDirName: window.DIRNAME_APP,
    archiveName: [window.ARCHIVE_NAME, Math.random()].join('?'),
    mode: window.MODE,
  },
  path: `${window.location.origin}/dev/${window.DIRNAME_APP}/`,
  ajaxUrl: `/dev/${window.DIRNAME_APP}/ajax/`,
  handler: [window.location.origin, window.location.pathname].join(''),
};