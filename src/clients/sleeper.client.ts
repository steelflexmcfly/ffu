import { LEAGUE_IDS } from "../config/consts";
import { PlayoffData, PlayoffResponse } from "../models/sleeper-api";

export class SleeperClient {

    // ** Call sparingly, over 5MB returned **
    public async getPlayerData(): Promise<any> {
        const response = await fetch(`https://api.sleeper.app/v1/players/nfl`);
        return response.json();
    }

    public async getLeagueInfo(leagueId: string): Promise<any> {
        const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}`);
        return response.json();
    }

    public async getUserInfo(username: string): Promise<any> {
        const response = await fetch(`https://api.sleeper.app/v1/user/${username}`);
        return response.json();
    }

    public async getUsers(leagueId: string): Promise<any> {
        const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`);
        return response.json();
    }

    public async getRosters(leagueId: string): Promise<any> {
        const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`);
        return response.json();
    }

    public async getMatchupsByWeek(leagueId: string, week: number): Promise<any> {
        const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`);
        return response.json();
    }

    public async getWinnersBracket(leagueId: string): Promise<PlayoffData[]> {
        const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/winners_bracket`);
        const body: PlayoffResponse[] = await response.json();
        const playoffData: PlayoffData[] = body.map(b => {
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
            }
        });
        return playoffData;
    }

    public async getLosersBracket(leagueId: string): Promise<PlayoffData[]> {
        const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/losers_bracket`);
        const body: PlayoffResponse[] = await response.json();
        const playoffData: PlayoffData[] = body.map(b => {
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
            }
        });
        return playoffData;
    }

    // Helper function used to get list of all current and past league IDs for a given league
    public async getLeagueIdHistory(leagueId: string): Promise<string[]> {
        let pastLeagueIds: string[] = [];
        const currentLeague = await this.getLeagueInfo(leagueId);
        if (currentLeague.previous_league_id) {
            const nextLeagueId = (await this.getLeagueIdHistory(currentLeague.previous_league_id));
            pastLeagueIds.push(leagueId, ...nextLeagueId);
        } else {
            return [leagueId];
        }
        return pastLeagueIds;
    }

    public async getRosterIdToOwnerIdMap(leagueId: string): Promise<any> {
        try {
            const rosters = await this.getRosters(leagueId);
            const rosterIdToOwnerIdMap = {};
            rosters.forEach(roster => {
                rosterIdToOwnerIdMap[roster.roster_id] = roster.owner_id;
            });
            return rosterIdToOwnerIdMap;
        } catch (error) {
            console.error('Error fetching roster data:', error);
            return null;
        }
    }

    // Helper to get all username - userId mappings
    public async getAllUserIds(): Promise<any> {
        const usernameIdMap = new Map<string, string>();
        const leagueIds: string[] = [
            ...Object.values(LEAGUE_IDS.PREMIER),
            ...Object.values(LEAGUE_IDS.MASTERS),
            ...Object.values(LEAGUE_IDS.NATIONAL)
        ];
        await Promise.all(leagueIds.map(async id => {
            const rosters = await this.getUsers(id);
            rosters.forEach((roster: { display_name: string; user_id: string; }) => {
                if (!usernameIdMap.get(roster.display_name)) {
                    usernameIdMap.set(roster.display_name, roster.user_id)
                }
            })
        }));
    }
}