/**
 * Let require.js know where our libraries live
 */
require.config({
  paths: {
    // Common libraries
    'jquery':     'libs/jquery/jquery-1.7.1.min',
    'underscore': 'libs/underscore/underscore-1.2.4.min',
    'backbone':   'libs/backbone/backbone-0.5.3.min',
    'piewpiew':   'libs/piewpiew/piewpiew-core-0.0.1.min', 
    'piewpiew-backbone':   'libs/piewpiew/piewpiew-backbone',

    // Require JS plugins
    'text':       'libs/requirejs/text',
    'order':      'libs/requirejs/order',
    'i18n':       'libs/requirejs/i18n',
    'domReady':   'libs/requirejs/domReady'
  }
});

/**
 * Load the main application module and kick things off
 */
require(['apps/portfolio/App'], function(PortfolioApp) {
  PortfolioApp.getInstance('PortfolioApp', {
    el: document.body,
    baseUrl: 'portfolio'
  }).startup();
});