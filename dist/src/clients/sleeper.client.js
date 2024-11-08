import { LEAGUE_IDS } from "../config/consts.js";
export class SleeperClient {
    // ** Call sparingly, over 5MB returned **
    async getPlayerData() {
        const response = await fetch(`https://api.sleeper.app/v1/players/nfl`);
        return response.json();
    }
    async getLeagueInfo(leagueId) {
        const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}`);
        return response.json();
    }
    async getUserInfo(username) {
        const response = await fetch(`https://api.sleeper.app/v1/user/${username}`);
        return response.json();
    }
    async getUsers(leagueId) {
        const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`);
        return response.json();
    }
    async getRosters(leagueId) {
        const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`);
        return response.json();
    }
    async getMatchupsByWeek(leagueId, week) {
        const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`);
        return response.json();
    }
    async getWinnersBracket(leagueId) {
        const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/winners_bracket`);
        const body = await response.json();
        const playoffData = body.map(b => {
            return {
                round: b.r,
                matchId: b.m,
                teamOne: b.t1,
                teamTwo: b.t2,
                winnerId: b.w,
                loserId: b.l,
                teamOneFrom: {
                    winFromId: b.t1_from?.w,
                    loseFromId: b.t1_from?.l
                },
                teamTwoFrom: {
                    winFromId: b.t2_from?.w,
                    loseFromId: b.t2_from?.l
                }
            };
        });
        return playoffData;
    }
    async getLosersBracket(leagueId) {
        const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/losers_bracket`);
        const body = await response.json();
        const playoffData = body.map(b => {
            return {
                round: b.r,
                matchId: b.m,
                teamOne: b.t1,
                teamTwo: b.t2,
                winnerId: b.w,
                loserId: b.l,
                teamOneFrom: {
                    winFromId: b.t1_from?.w,
                    loseFromId: b.t1_from?.l
                },
                teamTwoFrom: {
                    winFromId: b.t2_from?.w,
                    loseFromId: b.t2_from?.l
                }
            };
        });
        return playoffData;
    }
    // Helper function used to get list of all current and past league IDs for a given league
    async getLeagueIdHistory(leagueId) {
        let pastLeagueIds = [];
        const currentLeague = await this.getLeagueInfo(leagueId);
        if (currentLeague.previous_league_id) {
            const nextLeagueId = (await this.getLeagueIdHistory(currentLeague.previous_league_id));
            pastLeagueIds.push(leagueId, ...nextLeagueId);
        }
        else {
            return [leagueId];
        }
        return pastLeagueIds;
    }
    async getRosterIdToOwnerIdMap(leagueId) {
        try {
            const rosters = await this.getRosters(leagueId);
            const rosterIdToOwnerIdMap = {};
            rosters.forEach(roster => {
                rosterIdToOwnerIdMap[roster.roster_id] = roster.owner_id;
            });
            return rosterIdToOwnerIdMap;
        }
        catch (error) {
            console.error('Error fetching roster data:', error);
            return null;
        }
    }
    // Helper to get all username - userId mappings
    async getAllUserIds() {
        const usernameIdMap = new Map();
        const leagueIds = [
            ...Object.values(LEAGUE_IDS.PREMIER),
            ...Object.values(LEAGUE_IDS.MASTERS),
            ...Object.values(LEAGUE_IDS.NATIONAL)
        ];
        await Promise.all(leagueIds.map(async (id) => {
            const rosters = await this.getUsers(id);
            rosters.forEach((roster) => {
                if (!usernameIdMap.get(roster.display_name)) {
                    usernameIdMap.set(roster.display_name, roster.user_id);
                }
            });
        }));
    }
}
