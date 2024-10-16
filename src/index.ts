import * as fs from 'fs';
import { SleeperService } from './services/sleeper.service';
import { LEAGUE_IDS } from './consts';
import { PlayerService } from './services/player.service';

async function main() {
  const sleeper = new SleeperService();
  const players = new PlayerService();
  // const data = await sleeper.getMatchupsByWeek(LEAGUE_IDS.MASTERS[2024], 6);
  const player = players.getPlayerById('');
  fs.writeFileSync('output.json', JSON.stringify(player));
}

main();