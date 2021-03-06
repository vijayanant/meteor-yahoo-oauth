Yahoo = {};

// https://developers.yahoo.com/accounts/docs/OAuth2Login#userinfocall
Yahoo.whitelistedFields = ['id', 'email', 'verified_email', 'name', 'given_name',
                   'family_name', 'picture', 'locale', 'timezone', 'gender'];


OAuth.registerService('yahoo', 2, null, function(query) {

  var response = getTokens(query);
  //Yahoo doesn't have a seperate 'revoke access' API. Limiting the validity of the token here 
  var expiresAt = (+new Date) + (1 * parseInt(response.expiresIn, 10));
  var accessToken = response.accessToken;
  var idToken = response.idToken;
  var scopes = getScopes(accessToken);
  var identity = getIdentity(accessToken);

  var serviceData = {
    accessToken: accessToken,
    idToken: idToken,
    expiresAt: expiresAt,
    scope: scopes
  };

  var fields = _.pick(identity, Yahoo.whitelistedFields);
  _.extend(serviceData, fields);

  // only set the token in serviceData if it's there. this ensures
  // that we don't lose old ones (since we only get this on the first
  // log in attempt)
  if (response.refreshToken)
    serviceData.refreshToken = response.refreshToken;

  return {
    serviceData: serviceData,
    options: {profile: {name: identity.name}}
  };
});

// returns an object containing:
// - accessToken
// - expiresIn: lifetime of token in seconds
// - refreshToken, if this is the first authorization request
var getTokens = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'yahoo'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var response;
  try {
    response = HTTP.post(
      "https://api.login.yahoo.com/oauth2/get_token", {params: {
        code: query.code,
        client_id: config.clientId,
        client_secret: OAuth.openSecret(config.secret),
        redirect_uri: OAuth._redirectUri('yahoo', config),
        grant_type: 'authorization_code'
      }});
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Yahoo. " + err.message),
                   {response: err.response});
  }

  if (response.data.error) { // if the http response was a json object with an error attribute
    throw new Error("Failed to complete OAuth handshake with Yahoo. " + response.data.error);
  } else {
    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
      idToken: response.data.id_token,
      guid: response.data.xoauth_yahoo_guid,
    };
  }
};

var getIdentity = function (accessToken) {
    return {}
  // try {
  //   return HTTP.get(
  //     "https://www.googleapis.com/oauth2/v1/userinfo",
  //     {params: {access_token: accessToken}}).data;
  // } catch (err) {
  //   throw _.extend(new Error("Failed to fetch identity from Google. " + err.message),
  //                  {response: err.response});
  // }

};

var getScopes = function (accessToken) {
    // which is the YAhoo API for vthis?
    return {};
  //   try {
  //   return HTTP.get(
  //     "https://www.googleapis.com/oauth2/v1/tokeninfo",
  //     {params: {access_token: accessToken}}).data.scope.split(' ');
  // } catch (err) {
  //   throw _.extend(new Error("Failed to fetch tokeninfo from Google. " + err.message),
  //                  {response: err.response});
  // }
};

Yahoo.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
