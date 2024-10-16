import { LeagueInfoResponse, LeagueRostersResponse } from "../models/models";

export class SleeperService {

    // ** Call sparingly, over 5MB returned **
    public async getPlayerData(): Promise<any> {
        const response = await fetch(`https://api.sleeper.app/v1/players/nfl`);
        return response.json();
    }

    public async getLeagueInfo(leagueId: string): Promise<LeagueInfoResponse> {
        const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}`);
        return response.json();
    }

    public async getUserInfo(username: string): Promise<any> {
        const response = await fetch(`https://api.sleeper.app/v1/user/${username}`);
        return response.json();
    }

    public async getRosters(leagueId: string): Promise<LeagueRostersResponse> {
        const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`);
        return response.json();
    }

    public async getMatchupsByWeek(leagueId: string, week: number): Promise<LeagueRostersResponse> {
        const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`);
        return response.json();
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
}