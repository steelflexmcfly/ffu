import { LEAGUE_IDS, USER_IDS, USER_IDS_INFO_MAP } from "../config/consts";
import { WeekMatchup } from "../models/matchups";
import { SleeperClient } from "../clients/sleeper.client";

export class LeagueService {

    constructor(private sleeper: SleeperClient) { }

    public async getMatchupsForAllLeagues() {
        const premierLeagueYears = Object.entries(LEAGUE_IDS['PREMIER']);
        const mastersLeagueYears = Object.entries(LEAGUE_IDS['MASTERS']);
        const nationalLeagueYears = Object.entries(LEAGUE_IDS['NATIONAL']);
        const premierMatchups = await this.getMatchupsForAllYearsOfLeague(premierLeagueYears);
        const mastersMatchups = await this.getMatchupsForAllYearsOfLeague(mastersLeagueYears);
        const nationalMatchups = await this.getMatchupsForAllYearsOfLeague(nationalLeagueYears);
        return {
            premier: premierMatchups,
            masters: mastersMatchups,
            national: nationalMatchups
        }
    }

    public async getMatchupsForAllYearsOfLeague(leagueYears: [string, string][]) {
        return Promise.all(
            leagueYears.map(
                async leagueYear => {
                    const year = leagueYear[0];
                    const leagueId = leagueYear[1];
                    const matchups = await this.getAllMatchupsForLeague(leagueId);
                    return {
                        year,
                        matchupsByWeek: matchups
                    }
                }
            )
        );
    }

    public async getAllMatchupsForLeague(leagueId: string) {
        const matchupsByWeek = [];
        for (let week = 1; week <= 17; week++) {
            const matchups = await this.getMatchupsForWeek(leagueId, week);
            matchupsByWeek.push({ week, matchups });
        }
        return matchupsByWeek;
    }

    public async getMatchupsForWeek(leagueId: string, week: number): Promise<WeekMatchup[]> {
        const rosters = await this.sleeper.getRosters(leagueId);
        const matchups = await this.sleeper.getMatchupsByWeek(leagueId, week);

        const rosterUserMap = {};
        rosters.forEach((roster: { roster_id: string | number; owner_id: any; }) => {
            rosterUserMap[roster.roster_id] = roster.owner_id;
        });

        const groupedMatchups = {};
        matchups.forEach((matchup: { matchup_id: any; }) => {
            const matchupId = matchup.matchup_id;
            if (!groupedMatchups[matchupId]) {
                groupedMatchups[matchupId] = [];
            }
            groupedMatchups[matchupId].push(matchup);
        });

        // Create pairs of matchups
        const condensedMatchups = [];
        for (const matchupId in groupedMatchups) {
            if (groupedMatchups.hasOwnProperty(matchupId)) {
                const matchups = groupedMatchups[matchupId];
                if (matchups.length === 2) {
                    const user1 = USER_IDS_INFO_MAP[rosterUserMap[matchups[0].roster_id]].teamName || 'Unknown User';
                    const user2 = USER_IDS_INFO_MAP[rosterUserMap[matchups[1].roster_id]].teamName || 'Unknown User';
                    const score1 = matchups[0].points;
                    const score2 = matchups[1].points;
                    const winner = score1 > score2 ? user1 : user2;
                    const loser = score1 > score2 ? user2 : user1;
                    const winnerScore = Math.max(score1, score2);
                    const loserScore = Math.min(score1, score2);
                    condensedMatchups.push({ winner, loser, winnerScore, loserScore });
                }
            }
        }

        return condensedMatchups;
    }

}