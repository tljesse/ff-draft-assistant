const config = require("./app/config");
config; // Keep this config stuff here

// Import all Sleeper API functions
import {
  getUser,
  getUserLeagues,
  getLeague,
  getLeagueRosters,
  getLeagueUsers,
  getLeagueMatchups,
  getLeagueWinnersBracket,
  getLeagueLosersBracket,
  getLeagueTransactions,
  getLeagueTradedPicks,
  getUserDrafts,
  getLeagueDrafts,
  getDraft,
  getDraftPicks,
  getDraftTradedPicks,
  getNflState,
  getAllPlayers,
  getTrendingPlayers,
} from './app/sleeper/sleeper';

import { createAccountDocument } from "./app/accounts/create-account";

export const createAccountDoc = createAccountDocument;


// Export all Sleeper API functions
export {
  getUser,
  getUserLeagues,
  getLeague,
  getLeagueRosters,
  getLeagueUsers,
  getLeagueMatchups,
  getLeagueWinnersBracket,
  getLeagueLosersBracket,
  getLeagueTransactions,
  getLeagueTradedPicks,
  getUserDrafts,
  getLeagueDrafts,
  getDraft,
  getDraftPicks,
  getDraftTradedPicks,
  getNflState,
  getAllPlayers,
  getTrendingPlayers,
};
