import { google } from 'googleapis';

export const setupGoogleAuth = () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.REACT_APP_GOOGLE_CLIENT_EMAIL,
      private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file',
    ],
  });

  // Force disable http2
  const sheets = google.sheets({ 
    version: 'v4', 
    auth,
    timeout: 1000 * 60 * 5,
    http2: false
  });

  const drive = google.drive({ 
    version: 'v3', 
    auth,
    timeout: 1000 * 60 * 5,
    http2: false
  });

  return { sheets, drive };
};