import * as fs from 'fs';
import { SleeperClient } from './clients/sleeper.client.js';
import { LeagueService } from './services/league.service.js';
import { PlayoffService } from './services/playoff.service.js';
import { StatisticsService } from './services/statistics.service.js';
async function main() {
    const sleeper = new SleeperClient();
    const league = new LeagueService(sleeper);
    const playoffs = new PlayoffService(sleeper);
    const stats = new StatisticsService();
    const allMatchups = await league.getMatchupsForAllLeagues();
    // const data = stats.buildRegularSeasonAllTimeStats();
    // const data = await sleeper.getWinnersBracket(LEAGUE_IDS["PREMIER"][2023]);
    // const data = await sleeper.getLosersBracket(LEAGUE_IDS["PREMIER"][2023]);
    // const data = await playoffs.getPlayoffsForLeague(LEAGUE_IDS["PREMIER"][2023]);
    // const data = await league.getMatchupsForWeek(LEAGUE_IDS.NATIONAL[2024], 7);
    // const user = await sleeper.getRosters(LEAGUE_IDS.NATIONAL[2024]);
    fs.writeFileSync('./output/all-matchups.json', JSON.stringify(allMatchups));
    // fs.writeFileSync('./output/stats.json', data);     
}
main();
