import * as fs from 'fs';
import { SleeperClient } from './clients/sleeper.client';
import { PlayerService } from './services/player.service';
import { LeagueService } from './services/league.service';
import { LEAGUE_IDS } from './config/consts';

async function main() {
  const sleeper = new SleeperClient();
  const league = new LeagueService(sleeper);
  const playoffs = new PlayerService();
  // const data = await league.getMatchupsForAllLeagues();
  // const data = await sleeper.getWinnersBracket(LEAGUE_IDS["PREMIER"][2023]);
  const data = await sleeper.getLosersBracket(LEAGUE_IDS["PREMIER"][2023]);
  fs.writeFileSync('output.json', JSON.stringify(data));     
}

main();