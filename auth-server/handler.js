'use strict';

const { google } = require('googleapis');
const calendar = google.calendar('v3');
const SCOPES = ['https://www.googleapis.com/auth/calendar.events.public.readonly'];
const { CLIENT_SECRET, CLIENT_ID, CALENDAR_ID } = process.env;
const redirect_uris = ['https://meet-zeta-rust.vercel.app'];

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  redirect_uris[0]
);

// ✅ Define CORS headers once at the top
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // or restrict to your domain
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '3600',
};

// ✅ Handle preflight OPTIONS requests
const handleOptions = (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: null,
    };
  }
  return null;
};

// ✅ AUTH URL FUNCTION
module.exports.getAuthURL = async (event) => {
  const optionsResponse = handleOptions(event);
  if (optionsResponse) return optionsResponse;

  try {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ authUrl }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message || 'Unable to generate auth URL' }),
    };
  }
};

// ✅ ACCESS TOKEN FUNCTION
module.exports.getAccessToken = async (event) => {
  const optionsResponse = handleOptions(event);
  if (optionsResponse) return optionsResponse;

  const code = decodeURIComponent(`${event.pathParameters.code}`);

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(tokens),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message || 'Unable to get access token' }),
    };
  }
};

// ✅ GET CALENDAR EVENTS FUNCTION
module.exports.getCalendarEvents = async (event) => {
  const optionsResponse = handleOptions(event);
  if (optionsResponse) return optionsResponse;

  const access_token = decodeURIComponent(`${event.pathParameters.access_token}`);
  oAuth2Client.setCredentials({ access_token });

  try {
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ events: response.data.items }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message || 'Unable to fetch calendar events' }),
    };
  }
};
