Package.describe({
  summary: "Yahoo OAuth flow",
  version: "1.0.0"
});

Package.onUse(function(api) {
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use(['underscore', 'service-configuration'], ['client', 'server']);
  api.use(['random', 'templating'], 'client');

  api.export('Yahoo');

  api.addFiles(
    ['yahoo_configure.html', 'yahoo_configure.js'],
    'client');

  api.addFiles('yahoo_server.js', 'server');
  api.addFiles('yahoo_client.js', 'client');
});
