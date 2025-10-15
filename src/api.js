import mockData from './mock-data';

/**
 * Check if access token is valid
 */
const checkToken = async (accessToken) => {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
  );
  const result = await response.json();
  return result;
};

/**
 * Exchange code for access token
 */
const getToken = async (code) => {
  const encodedCode = encodeURIComponent(code);
  const response = await fetch(
    `https://pktxx7enyhroozlsiu2c4s7yfu0ljlpi.lambda-url.eu-central-1.on.aws/accessToken/${encodedCode}`,
    { method: 'GET', mode: 'cors' }
  );
  const { access_token } = await response.json();

  if (access_token) {
    localStorage.setItem("access_token", access_token);
  }

  return access_token;
};

/**
 * Get access token from localStorage or via Lambda
 */
export const getAccessToken = async () => {
  const accessToken = localStorage.getItem("access_token");
  const tokenCheck = accessToken && (await checkToken(accessToken));

  if (!accessToken || tokenCheck?.error) {
    localStorage.removeItem("access_token");
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");

    if (!code) {
      // Fetch the Google Auth URL from Lambda
      const response = await fetch(
        "https://cipidgpp3q5nxor5xtmn6fkubi0nnilh.lambda-url.eu-central-1.on.aws/getAuthURL",
        { method: 'GET', mode: 'cors' }
      );
      const result = await response.json();
      const { authUrl } = result;

      // Redirect user to Google Auth
      window.location.href = authUrl;
      return null;
    }

    // Exchange authorization code for access token
    return code && getToken(code);
  }

  return accessToken;
};

/**
 * Extract unique locations from events
 */
export const extractLocations = (events) => {
  const extractedLocations = events.map((event) => event.location);
  return [...new Set(extractedLocations)];
};

/**
 * Remove query parameters from URL
 */
export const removeQuery = () => {
  let newUrl;
  if (window.history.pushState && window.location.pathname) {
    newUrl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname;
    window.history.pushState("", "", newUrl);
  } else {
    newUrl = window.location.protocol + "//" + window.location.host;
    window.history.pushState("", "", newUrl);
  }
};

/**
 * Get calendar events from Lambda or mock data
 */
export const getEvents = async () => {
  // For local testing, return mock data
  if (window.location.href.startsWith("http://localhost")) {
    return mockData;
  }

  // Fetch events from Lambda in production
  const token = await getAccessToken();

  if (token) {
    removeQuery();
    const url = `https://hsk7rllx6us5larpn4yvsaeez40wnenj.lambda-url.eu-central-1.on.aws/${token}`;
    const response = await fetch(url, { method: 'GET', mode: 'cors' });
    const result = await response.json();

    if (result && result.events) {
      return result.events;
    }
  }

  return [];
};
