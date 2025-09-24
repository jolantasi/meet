'use strict';


const { google } = require("googleapis");
const calendar = google.calendar("v3");
const SCOPES = ["https://www.googleapis.com/auth/calendar.events.public.readonly"];
const { CLIENT_SECRET, CLIENT_ID, CALENDAR_ID } = process.env;
const redirect_uris = [
 "https://meet-zeta-rust.vercel.app"
];


const oAuth2Client = new google.auth.OAuth2(
 CLIENT_ID,
 CLIENT_SECRET,
 redirect_uris[0]
);


module.exports.getAuthURL = async () => {
 const authUrl = oAuth2Client.generateAuthUrl({
   access_type: "offline",
   scope: SCOPES,
 });


 return {
   statusCode: 200,
   headers: {
     'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Credentials': true,
   },
   body: JSON.stringify({
     authUrl,
   }),
 };
};

module.exports.getAccessToken = async (event) => {
 // Decode authorization code extracted from the URL query
 const code = decodeURIComponent(`${event.pathParameters.code}`);

 return new Promise((resolve, reject) => {
   oAuth2Client.getToken(code, (error, token) => {
     if (error) {
       return reject(error);
     }

     // Set the token as credentials for the oAuth2 client
  oAuth2Client.setCredentials(token);
  return resolve(token);
   });
 })
   .then((token) => {
     // Respond with OAuth token
     return {
       statusCode: 200,
       headers: {
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Credentials': true,
       },
       body: JSON.stringify(token),
     };
   }).catch((error) => {
     return {
       statusCode: 500,
       headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
       body: JSON.stringify({ error: error.message || 'Unable to get access token' }),
      };
    });
};

module.exports.getCalendarEvents = async (event) => {
  // Get the access token from the URL path parameters
  const access_token = decodeURIComponent(`${event.pathParameters.access_token}`);

  // Set the access token as credentials
  oAuth2Client.setCredentials({ access_token });

  // Create the calendar instance
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

  // Return a new Promise for the Calendar API call
  return new Promise((resolve, reject) => {
    calendar.events.list(
      {
        calendarId: CALENDAR_ID,
        timeMin: new Date().toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      },
      (error, response) => {
        if (error) {
          return reject(error);
        }
        //Resolve with the full response so we can access response.data.items
        return resolve(response);
      }
    );
  })
    .then((results) => {
      // Successful response
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ events: results.data.items }),
      };
    })
    .catch((error) => {
      // Error handling logic
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          error: error.message || 'Unable to fetch calendar events',
        }),
      };
    });
};