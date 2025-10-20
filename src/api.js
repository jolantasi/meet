import NProgress from 'nprogress'; // make sure you have this at the top if not already imported
import 'nprogress/nprogress.css';
import mockData from './mock-data';

NProgress.configure({
  showSpinner: false,  // hides the spinning circle
  speed: 400,          // animation speed
  minimum: 0.2         // how early the bar appears
});

const API_BASE_URL = 'https://dk0a4cdnll.execute-api.eu-central-1.amazonaws.com/dev';

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
  try {
    const encodedCode = encodeURIComponent(code);
    const response = await fetch(`https://dk0a4cdnll.execute-api.eu-central-1.amazonaws.com/dev/api/token/${encodedCode}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { access_token } = await response.json();

    if (access_token) {
      localStorage.setItem('access_token', access_token);
    }

    return access_token;

  } catch (error) {
    console.error('Error fetching access token:', error);
    return null; // Return null if fetching token failed
  }
};

/**
 * Get access token from localStorage or via Lambda
 */
export const getAccessToken = async () => {
  const accessToken = localStorage.getItem('access_token');
  const tokenCheck = accessToken && (await checkToken(accessToken));

  if (!accessToken || tokenCheck?.error) {
    localStorage.removeItem('access_token');

    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');

    if (!code) {
      const response = await fetch(`${API_BASE_URL}/api/get-auth-url`);
      const result = await response.json();
      window.location.href = result.authUrl;
      return null;
    }

    return getToken(code);
  }

  return accessToken;
};

/**
 * Extract unique locations from events
 */
export const extractLocations = (events) => {
  const locations = events.map((event) => event.location);
  return [...new Set(locations)];
};

/**
 * Remove query parameters from URL
 */
export const removeQuery = () => {
  const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
  window.history.pushState('', '', newUrl);
};

/**
 * Get calendar events from Lambda or mock data
 */
export const getEvents = async () => {
  // Local testing
  if (window.location.href.startsWith('http://localhost')) {
    return mockData;
  }

  // Offline check
  if (!navigator.onLine) {
    const events = localStorage.getItem('lastEvents');
    NProgress.done();
    return events ? JSON.parse(events) : [];
  }

  // Production
  const token = await getAccessToken();
  if (!token) return [];

  removeQuery();

  const url = `${API_BASE_URL}/api/get-events/${token}`;
NProgress.start();

try {
  const response = await fetch(url);
  const result = await response.json();

  if (result?.events) {
    localStorage.setItem('lastEvents', JSON.stringify(result.events));
    return result.events;
  } else {
    // No events returned, fallback to empty array
    return [];
  }

} catch (error) {
  console.error('Error fetching events:', error);

  // Offline fallback: return saved events if available
  const savedEvents = localStorage.getItem('lastEvents');
  return savedEvents ? JSON.parse(savedEvents) : [];
} finally {
  NProgress.done();
}

};
