import { TWITTER_API_URL } from './constants';

const { TWITTER_API_KEY, TWITTER_API_SECRET } = process.env;

const getService = () => {
  // @ts-ignore
  return OAuth1.createService('Twitter')
    .setAccessTokenUrl('https://api.twitter.com/oauth/access_token')
    .setRequestTokenUrl('https://api.twitter.com/oauth/request_token')
    .setAuthorizationUrl('https://api.twitter.com/oauth/authenticate')
    .setConsumerKey(TWITTER_API_KEY)
    .setConsumerSecret(TWITTER_API_SECRET)
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties());
};

// twitter api oauth認証URL取得
const getOAuthURL = () => {
  Logger.log(getService().authorize());
};

// twitter api oauth認証のコールバック
const authCallback = (request) => {
  const service = getService();
  const authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('success auth');
  } else {
    return HtmlService.createHtmlOutput('failed auth');
  }
};

const tweet = (message) => {
  const service = getService();

  if (service.hasAccess()) {
    const response = service.fetch(TWITTER_API_URL, {
      method: 'POST',
      payload: { status: message },
    });

    return response.getContentText();
  } else {
    return service.getLastError();
  }
};

export { getOAuthURL, authCallback };
export default tweet;
