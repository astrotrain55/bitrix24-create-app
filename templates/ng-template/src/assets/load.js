['log', 'info', 'warn', 'error'].forEach((method) => {
  window.console[method] = window.console[method].bind(
    window.console,
    '%cBxApp',
    'background-color: #ffffff;color: #000000;',
  );
});
