import * as fs from 'fs';
import { SleeperService } from './services/sleeper.service';
import { LEAGUE_IDS } from './config/consts';
import { PlayerService } from './services/player.service';
import { LeagueService } from './services/league.service';

async function main() {
  const sleeper = new SleeperService();
  const players = new PlayerService();
  const league = new LeagueService(sleeper);
  // const data = await sleeper.getAllUserIds();
  // const player = players.getPlayerById('');
  const data = await league.describeMatchupsForWeek(LEAGUE_IDS.PREMIER[2024], 6);
  fs.writeFileSync('output.json', JSON.stringify(data));
}

main();