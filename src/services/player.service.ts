import players from '../config/player-data.json' with { type: "json" };;

export class PlayerService {
    
    public getPlayerById(term: string) {
        return players['1' as keyof Object];
    }

}