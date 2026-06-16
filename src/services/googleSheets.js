import { SignJWT, importPKCS8 } from 'jose';

const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;
const SERVICE_ACCOUNT_EMAIL = import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = import.meta.env.VITE_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

const TOKEN_URI = 'https://oauth2.googleapis.com/token';

let cachedAccessToken = null;
let tokenExpiry = null;

async function getAccessToken() {
  if (cachedAccessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedAccessToken;
  }
  if (!PRIVATE_KEY || !SERVICE_ACCOUNT_EMAIL) {
    throw new Error('Google Sheets API credentials are not set in the environment.');
  }
  const privateKeyObj = await importPKCS8(PRIVATE_KEY, 'RS256');
  const jwt = await new SignJWT({
    iss: SERVICE_ACCOUNT_EMAIL,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: TOKEN_URI,
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000)
  })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .sign(privateKeyObj);

  const response = await fetch(TOKEN_URI, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || 'Failed to obtain access token');
  cachedAccessToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000 - 60000;
  return cachedAccessToken;
}

export const authenticateUser = async (leader, buddy) => {
  const token = await getAccessToken();
  const range = 'Users!A:B';
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('Failed to fetch Users sheet. Please ensure the "Users" tab exists.');
  const data = await res.json();
  const rows = data.values || [];
  const user = rows.find(row => row[0] === leader && row[1] === buddy);
  return !!user;
};

export const checkUserSheetExists = async (leader) => {
  const token = await getAccessToken();
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('Failed to fetch spreadsheet metadata');
  const data = await res.json();
  const sheets = data.sheets || [];
  return sheets.some(sheet => sheet.properties.title === leader);
};

const STATIC_HEADERS = ['Form', 'Persona', 'Agreement', 'Concept', 'Risk1', 'Risk2', 'Risk1_Sol1', 'Risk1_Sol2', 'Risk2_Sol1', 'Risk2_Sol2', 'GlobalNote'];
const SESSION_HEADERS = ['Session Number', 'Topic (หัวข้อ)', 'Objective (จุดประสงค์)', 'Activity (กิจกรรม)', 'Homework (การบ้าน)', 'Note (หมายเหตุ)'];

export const createUserSheet = async (leader, numSessions) => {
  const token = await getAccessToken();
  
  const addSheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`;
  const addSheetRes = await fetch(addSheetUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests: [{ addSheet: { properties: { title: leader } } }] })
  });

  if (!addSheetRes.ok) {
    const err = await addSheetRes.json();
    throw new Error(err.error?.message || 'Failed to create sheet');
  }

  const rows = [
    STATIC_HEADERS,
    Array(STATIC_HEADERS.length).fill(''),
    SESSION_HEADERS
  ];

  for (let i = 1; i <= numSessions; i++) {
    rows.push([i.toString(), '', '', '', '', '']);
  }

  const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${leader}!A1:K${numSessions + 3}?valueInputOption=USER_ENTERED`;
  const updateRes = await fetch(updateUrl, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: rows })
  });

  if (!updateRes.ok) throw new Error('Failed to populate sheet rows');
  return true;
};

export const fetchCanvasData = async (leader) => {
  const token = await getAccessToken();
  
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${leader}!A:K`; 
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('Failed to fetch canvas data');
  
  const data = await res.json();
  const rows = data.values || [];

  const staticRow = rows[1] || [];
  const staticData = {
    form: staticRow[0] || '',
    persona: staticRow[1] || '',
    agreement: staticRow[2] || '',
    concept: staticRow[3] || '',
    risk1: staticRow[4] || '',
    risk2: staticRow[5] || '',
    risk1_sol1: staticRow[6] || '',
    risk1_sol2: staticRow[7] || '',
    risk2_sol1: staticRow[8] || '',
    risk2_sol2: staticRow[9] || '',
    globalNote: staticRow[10] || '',
  };

  const sessions = [];
  for (let i = 3; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue; 
    sessions.push({
      rowIndex: i + 1, 
      sessionNumber: row[0] || '',
      topic: row[1] || '',
      objective: row[2] || '',
      activity: row[3] || '',
      homework: row[4] || '',
      note: row[5] || ''
    });
  }

  return { staticData, sessions };
};

export const updateStaticDataRow = async (leader, staticData) => {
  const token = await getAccessToken();
  const range = `${leader}!A2:K2`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?valueInputOption=USER_ENTERED`;

  const values = [[
    staticData.form || '',
    staticData.persona || '',
    staticData.agreement || '',
    staticData.concept || '',
    staticData.risk1 || '',
    staticData.risk2 || '',
    staticData.risk1_sol1 || '',
    staticData.risk1_sol2 || '',
    staticData.risk2_sol1 || '',
    staticData.risk2_sol2 || '',
    staticData.globalNote || ''
  ]];

  const res = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values })
  });

  if (!res.ok) throw new Error('Failed to update static data');
  return true;
};

export const updateSessionRow = async (leader, rowIndex, data) => {
  const token = await getAccessToken();
  const range = `${leader}!A${rowIndex}:F${rowIndex}`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?valueInputOption=USER_ENTERED`;

  const values = [[
    data.sessionNumber,
    data.topic,
    data.objective,
    data.activity,
    data.homework,
    data.note
  ]];

  const res = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values })
  });

  if (!res.ok) throw new Error('Failed to update session');
  return true;
};

export const appendSessionRow = async (leader, sessionNumber) => {
  const token = await getAccessToken();
  const range = `${leader}!A:F`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED`;

  const values = [[
    sessionNumber.toString(),
    '', '', '', '', ''
  ]];

  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values })
  });

  if (!res.ok) throw new Error('Failed to append session');
  return true;
};

export const reduceLastSessionRow = async (leader) => {
  const token = await getAccessToken();
  
  const getSheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`;
  const sheetRes = await fetch(getSheetUrl, { headers: { Authorization: `Bearer ${token}` } });
  if (!sheetRes.ok) throw new Error('Failed to get spreadsheet metadata');
  
  const sheetData = await sheetRes.json();
  const sheet = sheetData.sheets.find(s => s.properties.title === leader);
  if (!sheet) throw new Error('Sheet not found');
  
  const sheetId = sheet.properties.sheetId;
  const canvasData = await fetchCanvasData(leader);
  const sessions = canvasData.sessions;
  if (sessions.length === 0) return; 
  
  const rowToDelete = sessions[sessions.length - 1].rowIndex - 1; 

  const batchUpdateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`;
  const updateRes = await fetch(batchUpdateUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requests: [{
        deleteDimension: {
          range: {
            sheetId: sheetId,
            dimension: 'ROWS',
            startIndex: rowToDelete,
            endIndex: rowToDelete + 1 
          }
        }
      }]
    })
  });

  if (!updateRes.ok) throw new Error('Failed to delete row');
  return true;
};
