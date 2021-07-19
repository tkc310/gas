const getOAuthURL = () => {
  Logger.log(getService().authorize());
};

const getService = () => {
  return OAuth1.createService('Twitter')
    .setAccessTokenUrl('https://api.twitter.com/oauth/access_token')
    .setRequestTokenUrl('https://api.twitter.com/oauth/request_token')
    .setAuthorizationUrl('https://api.twitter.com/oauth/authorize')
    .setConsumerKey(PropertiesService.getScriptProperties().getProperty(
      TWITTER_API_KEY
    ))
    .setConsumerSecret(PropertiesService.getScriptProperties().getProperty(
      TWITTER_API_SECRET
    ))
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties());
};

const authCallback = (request) => {
  const service = getService();
  const authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('success!!');
  } else {
    return HtmlService.createHtmlOutput('failed');
  }
};

export { getOAuthURL, authCallback };
