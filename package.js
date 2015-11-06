Package.describe({
  name: 'vijayanant:meteor-yahoo-oauth',
  summary: "Yahoo OAuth flow",
  version: "1.0.0",
  git: 'https://github.com/vijayanant/meteor-yahoo-oauth'
});

Package.onUse(function(api) {
  api.versionsFrom("1.0.1");
  api.use('oauth2@1.1.3', ['client', 'server']);
  api.use('oauth@1.1.4', ['client', 'server']);
  api.use('http@1.1.0', ['server']);
  api.use(['underscore', 'service-configuration'], ['client', 'server']);
  api.use(['random', 'templating'], 'client');

  api.export('Yahoo');

  api.addFiles(
    ['yahoo_configure.html', 'yahoo_configure.js'],
    'client');

  api.addFiles('yahoo_server.js', 'server');
  api.addFiles('yahoo_client.js', 'client');
});
