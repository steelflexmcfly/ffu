import players from '../config/player-data.json' with { type: "json" };
;
export class PlayerService {
    getPlayerById(term) {
        return players['1'];
    }
}
