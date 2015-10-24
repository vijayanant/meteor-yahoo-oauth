Yahoo = {};

// Request Yahoo credentials for the user
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
Yahoo.requestCredential = function (options, credentialRequestCompleteCallback) {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  } else if (!options) {
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'yahoo'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError());
    return;
  }

  var credentialToken = Random.secret();

  // always need this to get user id from yahoo.
  var requiredScope = ['profile'];
  var scope = ['email'];
  if (options.requestPermissions)
    scope = options.requestPermissions;
  scope = _.union(scope, requiredScope);

  var loginUrlParameters = {};
  if (config.loginUrlParameters){
    _.extend(loginUrlParameters, config.loginUrlParameters)
  }
  if (options.loginUrlParameters){
    _.extend(loginUrlParameters, options.loginUrlParameters)
  }
  var ILLEGAL_PARAMETERS = ['response_type', 'client_id', 'scope', 'redirect_uri', 'state'];
    // validate options keys
  _.each(_.keys(loginUrlParameters), function (key) {
    if (_.contains(ILLEGAL_PARAMETERS, key))
      throw new Error("Yahoo.requestCredential: Invalid loginUrlParameter: " + key);
  });

  // backwards compatible options
  if (options.requestOfflineToken != null){
    loginUrlParameters.access_type = options.requestOfflineToken ? 'offline' : 'online'
  }
  if (options.prompt != null) {
    loginUrlParameters.prompt = options.prompt;
  } else if (options.forceApprovalPrompt) {
    loginUrlParameters.prompt = 'consent'
  }

  if (options.loginHint) {
    loginUrlParameters.login_hint = options.loginHint;
  }

  var loginStyle = OAuth._loginStyle('yahoo', config, options);
  _.extend(loginUrlParameters, {
    "response_type": "code",
    "client_id":  config.clientId,
    // "scope": scope.join(' '), // space delimited
    // "redirect_uri": OAuth._redirectUri('yahoo', config),
    redirect_uri: 'http://myapp.com:3000/_oauth/yahoo/close',
    "state": OAuth._stateParam(loginStyle, credentialToken, options.redirectUrl)
  });
  var loginUrl = 'https://api.login.yahoo.com/oauth2/request_auth?' +
    _.map(loginUrlParameters, function(value, param){
      return encodeURIComponent(param) + '=' + encodeURIComponent(value);
    }).join("&");

  OAuth.launchLogin({
    loginService: "yahoo",
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken,
    popupOptions: { height: 600 }
  });
};
