import * as functions from 'firebase-functions';
//import * as admin from 'firebase-admin';
import axios from 'axios';

const BASE_URL = 'https://api.sleeper.app/v1';

// Helper function to make API requests
async function makeRequest(endpoint: string) {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw new functions.https.HttpsError('internal', 'An error occurred while fetching data from Sleeper API');
  }
}

// Helper function to check authentication
function assertAuthenticated(context: functions.https.CallableContext) {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }
}

// User endpoints
export const getUser = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context);
  const { username } = data;
  return await makeRequest(`/user/${username}`);
});

export const getUserLeagues = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context);
  const { userId, sport, season } = data;
  return await makeRequest(`/user/${userId}/leagues/${sport}/${season}`);
});

// League endpoints
export const getLeague = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context);
  const { leagueId } = data;
  return await makeRequest(`/league/${leagueId}`);
});

export const getLeagueRosters = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context);
  const { leagueId } = data;
  return await makeRequest(`/league/${leagueId}/rosters`);
});

export const getLeagueUsers = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context);
  const { leagueId } = data;
  return await makeRequest(`/league/${leagueId}/users`);
});

export const getLeagueMatchups = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context);
  const { leagueId, week } = data;
  return await makeRequest(`/league/${leagueId}/matchups/${week}`);
});

export const getLeagueWinnersBracket = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context);
  const { leagueId } = data;
  return await makeRequest(`/league/${leagueId}/winners_bracket`);
});

export const getLeagueLosersBracket = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context);
  const { leagueId } = data;
  return await makeRequest(`/league/${leagueId}/losers_bracket`);
});

export const getLeagueTransactions = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context);
  const { leagueId, round } = data;
  return await makeRequest(`/league/${leagueId}/transactions/${round}`);
});

export const getLeagueTradedPicks = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context);
  const { leagueId } = data;
  return await makeRequest(`/league/${leagueId}/traded_picks`);
});

// Draft endpoints
export const getUserDrafts = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context);
  const { userId, sport, season } = data;
  return await makeRequest(`/user/${userId}/drafts/${sport}/${season}`);
});

export const getLeagueDrafts = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context);
  const { leagueId } = data;
  return await makeRequest(`/league/${leagueId}/drafts`);
});

export const getDraft = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context);
  const { draftId } = data;
  return await makeRequest(`/draft/${draftId}`);
});

export const getDraftPicks = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context);
  const { draftId } = data;
  return await makeRequest(`/draft/${draftId}/picks`);
});

export const getDraftTradedPicks = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context);
  const { draftId } = data;
  return await makeRequest(`/draft/${draftId}/traded_picks`);
});

// NFL State
export const getNflState = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context);
  return await makeRequest('/state/nfl');
});

// Players
export const getAllPlayers = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context);
  return await makeRequest('/players/nfl');
});

export const getTrendingPlayers = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context);
  const { type, lookbackHours = 24, limit = 25 } = data;
  return await makeRequest(`/players/nfl/trending/${type}?lookback_hours=${lookbackHours}&limit=${limit}`);
});
