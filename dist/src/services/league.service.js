import { LEAGUE_IDS } from "../config/consts.js";
export class LeagueService {
    sleeper;
    constructor(sleeper) {
        this.sleeper = sleeper;
    }
    async getMatchupsForAllLeagues() {
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
        };
    }
    async getMatchupsForAllYearsOfLeague(leagueYears) {
        return Promise.all(leagueYears.map(async (leagueYear) => {
            const year = leagueYear[0];
            const leagueId = leagueYear[1];
            const matchups = await this.getAllMatchupsForLeague(leagueId);
            return {
                year,
                leagueId,
                matchupsByWeek: matchups
            };
        }));
    }
    async getAllMatchupsForLeague(leagueId) {
        const matchupsByWeek = [];
        for (let week = 1; week <= 17; week++) {
            const matchups = await this.getMatchupsForWeek(leagueId, week);
            matchupsByWeek.push({ week, matchups });
        }
        return matchupsByWeek;
    }
    async getMatchupsForWeek(leagueId, week) {
        const rosters = await this.sleeper.getRosters(leagueId);
        const matchups = await this.sleeper.getMatchupsByWeek(leagueId, week);
        const rosterUserMap = {};
        rosters.forEach((roster) => {
            rosterUserMap[roster.roster_id] = roster.owner_id;
        });
        const groupedMatchups = {};
        matchups.forEach((matchup) => {
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
                    const user1 = rosterUserMap[matchups[0].roster_id] || 'Unknown User';
                    const user2 = rosterUserMap[matchups[1].roster_id] || 'Unknown User';
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
