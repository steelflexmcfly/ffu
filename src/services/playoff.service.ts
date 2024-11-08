import { SleeperClient } from "../clients/sleeper.client.js";
import { USER_IDS } from "../config/consts.js";
import { PlayoffData, PlayoffResponse } from "../models/sleeper-api.js";

export class PlayoffService {

    constructor(private sleeper: SleeperClient) { }

    public async getPlayoffsForLeague(leagueId: string) {
        const rosterMap = await this.sleeper.getRosterIdToOwnerIdMap(leagueId);
        const res = await this.getPlayoffBracket(leagueId, rosterMap, USER_IDS);
        const placements = this.determinePlayoffPlacements(res);
        return placements;
    }

    public async getPlayoffBracket(leagueId, rosterIdToOwnerIdMap, userIdMap) {
        try {
            const bracketData: PlayoffData[] = await this.sleeper.getWinnersBracket(leagueId);
            // Replace owner IDs with usernames
            const bracketWithUsernames: PlayoffData[] = bracketData.map((matchup: PlayoffData) => ({
                ...matchup,
                teamOne: matchup.teamOne && (typeof matchup.teamOne === 'object' ? 'Winner' : userIdMap[rosterIdToOwnerIdMap[matchup.teamOne]]),
                teamTwo: matchup.teamTwo && (typeof matchup.teamTwo === 'object' ? 'Loser' : userIdMap[rosterIdToOwnerIdMap[matchup.teamTwo]]),
                winnerId: matchup.winnerId && userIdMap[rosterIdToOwnerIdMap[matchup.winnerId]],
                loserId: matchup.loserId && userIdMap[rosterIdToOwnerIdMap[matchup.loserId]],
            }));
            return bracketWithUsernames;
        } catch (error) {
            console.error('Error fetching playoff bracket data:', error);
            return null;
        }
    }

    public determinePlayoffPlacements(playoffBracket: PlayoffData[]) {
        // Placeholder for playoff placements
        const placements = {};
    
        // Placeholder for winners and losers of each round
        const roundWinners = [[], [], []]; // Three rounds in total
        const roundLosers = [[], [], []]; // Three rounds in total
    
        // Iterate through each round of the playoff bracket data
        playoffBracket.forEach((match: PlayoffData) => {
            console.log(match);
            roundWinners[match.round - 1].push(match.winnerId);
            roundLosers[match.round - 1].push(match.loserId);
            console.log('winners', roundWinners);
            console.log('losers', roundLosers);
        });
    
        // Determine playoff placements based on tracked winners and losers
        // For the first and second rounds, the winners of each matchup move on to the next round,
        // and the losers are tracked for determining 3rd through 6th places.
        // In the final round (round 3), the winners of the championship match determine 1st and 2nd places,
        // and the losers of the semifinal matches determine 3rd through 6th places.
    
        // Determine 1st and 2nd places
        placements[1] = roundWinners[2][0];
        placements[2] = roundLosers[2][0];
    
        // Determine 3rd and 4th places
        placements[3] = roundLosers[1][0];
        placements[4] = roundLosers[1][1];
    
        // Determine 5th and 6th places
        placements[5] = roundLosers[0][0];
        placements[6] = roundLosers[0][1];
    
        // Return the playoff placements
        return placements;
    }

}