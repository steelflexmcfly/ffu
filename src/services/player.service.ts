import players from '../player-data.json';

export class PlayerService {
    
    public getPlayerById(term: string) {
        return players['1' as keyof Object];
    }

}