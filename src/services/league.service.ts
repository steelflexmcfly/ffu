import { SleeperService } from "./sleeper.service";

export class LeagueService {

    constructor(private sleeper: SleeperService) {}

    public async describeMatchupsForWeek(leagueId: string, week: number) {
        const league = await this.sleeper.getRosters(leagueId);
        const matchups = await this.sleeper.getMatchupsByWeek(leagueId, week);
        const groupedMatchups = {};
        matchups.forEach((matchup: { matchup_id: any; }) => {
            const matchupId = matchup.matchup_id;
            if (!groupedMatchups[matchupId as keyof Object]) {
                groupedMatchups[matchupId] = [];
            }
            groupedMatchups[matchupId].push(matchup);
        });
        // const matchupDetails = Object.values(groupedMatchups).forEach(matchup => {
        console.log(groupedMatchups);
        return matchups;
    }

}