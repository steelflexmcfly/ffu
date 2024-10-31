import { LEAGUE_IDS, USER_IDS_INFO_MAP } from "../config/consts";
import leagueData from '../../output/all-matchups.json';
import { LeagueWeek, LeagueYear, WeekMatchup } from "../models/matchups";

interface MemberStatMapObject {
    wins: number;
    losses: number;
    pointsFor: number;
    pointsAgainst: number;
}

interface MemberStats extends MemberStatMapObject {
    userId: string;
    userName: string;
    averageScore: number;
}

export class StatisticsService {

    memberStatMap: Map<string, MemberStatMapObject> = new Map();

    buildRegularSeasonAllTimeStats() {
        leagueData.premier.forEach((leagueYear: LeagueYear) => {
            this.processSeason(leagueYear);
        });
        let memberStatArray: MemberStats[] = [];
        this.memberStatMap.forEach((v, k) => {
            memberStatArray.push({
                userId: k,
                userName: USER_IDS_INFO_MAP[k].teamName,
                ...v,
                averageScore: v.pointsFor / (v.wins + v.losses)
            })
        })
        console.log(memberStatArray.sort((a,b) => b.averageScore - a.averageScore))
        return JSON.stringify(memberStatArray);
    }

    processSeason(leagueYear: LeagueYear) {
        leagueYear.matchupsByWeek.forEach((week: LeagueWeek) => {
            if (week.week <= 14) {
                week.matchups.forEach((matchup: WeekMatchup) => {
                    this.processMatchup(matchup);
                })
            }
        })
    }

    processMatchup(matchup: WeekMatchup) {
        if (!this.memberStatMap.get(matchup.winner)) {
            this.initMemberStatMapObject(matchup.winner)
        }

        if (!this.memberStatMap.get(matchup.loser)) {
            this.initMemberStatMapObject(matchup.loser)
        }

        if (matchup.winnerScore == 0 && matchup.loserScore == 0) {
            return;
        }

        const winnerStats = this.memberStatMap.get(matchup.winner);
        const loserStats = this.memberStatMap.get(matchup.loser);

        const newWinnerStats: MemberStatMapObject = {
            ...winnerStats,
            wins: winnerStats.wins + 1,
            pointsFor: winnerStats.pointsFor + matchup.winnerScore,
            pointsAgainst: winnerStats.pointsAgainst + matchup.loserScore
        }

        const newLoserStats: MemberStatMapObject = {
            ...loserStats,
            losses: loserStats.losses + 1,
            pointsFor: loserStats.pointsFor + matchup.loserScore,
            pointsAgainst: loserStats.pointsAgainst + matchup.winnerScore
        }

        this.memberStatMap.set(matchup.winner, newWinnerStats);
        this.memberStatMap.set(matchup.loser, newLoserStats);
        console.log(this.memberStatMap);
    }

    initMemberStatMapObject(userId: string) {
        this.memberStatMap.set(userId, {
            wins: 0,
            losses: 0,
            pointsFor: 0,
            pointsAgainst: 0,
        });
    }

}