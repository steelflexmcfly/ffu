import { USER_IDS_INFO_MAP } from "../config/consts.js";
import leagueData from '../../output/all-matchups.json' with { type: "json" };
;
export class StatisticsService {
    memberStatMap = new Map();
    buildRegularSeasonAllTimeStats() {
        leagueData.premier.forEach((leagueYear) => {
            this.processSeason(leagueYear);
        });
        let memberStatArray = [];
        this.memberStatMap.forEach((v, k) => {
            memberStatArray.push({
                userId: k,
                userName: USER_IDS_INFO_MAP[k].teamName,
                ...v,
                averageScore: v.pointsFor / (v.wins + v.losses)
            });
        });
        console.log(memberStatArray.sort((a, b) => b.averageScore - a.averageScore));
        return JSON.stringify(memberStatArray);
    }
    processSeason(leagueYear) {
        leagueYear.matchupsByWeek.forEach((week) => {
            if (week.week <= 14) {
                week.matchups.forEach((matchup) => {
                    this.processMatchup(matchup);
                });
            }
        });
    }
    processMatchup(matchup) {
        if (!this.memberStatMap.get(matchup.winner)) {
            this.initMemberStatMapObject(matchup.winner);
        }
        if (!this.memberStatMap.get(matchup.loser)) {
            this.initMemberStatMapObject(matchup.loser);
        }
        if (matchup.winnerScore == 0 && matchup.loserScore == 0) {
            return;
        }
        const winnerStats = this.memberStatMap.get(matchup.winner);
        const loserStats = this.memberStatMap.get(matchup.loser);
        const newWinnerStats = {
            ...winnerStats,
            wins: winnerStats.wins + 1,
            pointsFor: winnerStats.pointsFor + matchup.winnerScore,
            pointsAgainst: winnerStats.pointsAgainst + matchup.loserScore
        };
        const newLoserStats = {
            ...loserStats,
            losses: loserStats.losses + 1,
            pointsFor: loserStats.pointsFor + matchup.loserScore,
            pointsAgainst: loserStats.pointsAgainst + matchup.winnerScore
        };
        this.memberStatMap.set(matchup.winner, newWinnerStats);
        this.memberStatMap.set(matchup.loser, newLoserStats);
        console.log(this.memberStatMap);
    }
    initMemberStatMapObject(userId) {
        this.memberStatMap.set(userId, {
            wins: 0,
            losses: 0,
            pointsFor: 0,
            pointsAgainst: 0,
        });
    }
}
