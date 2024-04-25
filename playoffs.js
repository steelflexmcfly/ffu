const axios = require('axios');

// Function to fetch roster ID to owner ID map
async function getRosterIdToOwnerIdMap(leagueId) {
    try {
        const response = await axios.get(`https://api.sleeper.app/v1/league/${leagueId}/rosters`);
        const rosters = response.data;
        const rosterIdToOwnerIdMap = {};
        rosters.forEach(roster => {
            rosterIdToOwnerIdMap[roster.roster_id] = roster.owner_id;
        });
        return rosterIdToOwnerIdMap;
    } catch (error) {
        console.error('Error fetching roster data:', error);
        return null;
    }
}

// Function to fetch user data and build mapping between owner IDs and usernames
async function buildOwnerToUsernameMap(rosterIdToOwnerIdMap) {
    try {
        const ownerToUsernameMap = {};
        await Promise.all(Object.values(rosterIdToOwnerIdMap).map(async ownerId => {
            const response = await axios.get(`https://api.sleeper.app/v1/user/${ownerId}`);
            const { display_name } = response.data;
            ownerToUsernameMap[ownerId] = display_name;
        }));
        return ownerToUsernameMap;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

// Function to fetch playoff bracket data
async function getPlayoffBracket(leagueId, rosterIdToOwnerIdMap, ownerToUsernameMap) {
    try {
        const response = await axios.get(`https://api.sleeper.app/v1/league/${leagueId}/winners_bracket`);
        const bracketData = response.data;
        // Replace owner IDs with usernames
        const bracketWithUsernames = bracketData.map(matchup => ({
            ...matchup,
            t1: matchup.t1 && (typeof matchup.t1 === 'object' ? 'Winner' : ownerToUsernameMap[rosterIdToOwnerIdMap[matchup.t1]]),
            t2: matchup.t2 && (typeof matchup.t2 === 'object' ? 'Loser' : ownerToUsernameMap[rosterIdToOwnerIdMap[matchup.t2]]),
            w: matchup.w && ownerToUsernameMap[rosterIdToOwnerIdMap[matchup.w]],
            l: matchup.l && ownerToUsernameMap[rosterIdToOwnerIdMap[matchup.l]],
        }));
        return bracketWithUsernames;
    } catch (error) {
        console.error('Error fetching playoff bracket data:', error);
        return null;
    }
}

function determinePlayoffPlacements(playoffBracket) {
    // Placeholder for playoff placements
    const placements = {};

    // Placeholder for winners and losers of each round
    const roundWinners = [[], [], []]; // Three rounds in total
    const roundLosers = [[], [], []]; // Three rounds in total

    // Iterate through each round of the playoff bracket data
    playoffBracket.forEach(({ r, t1, t2, w, l, winner, loser }) => {
        // Extract relevant information from the matchup
        const matchupData = { t1, t2, w, l, winner, loser };

        // Track winners and losers of each round
        if (typeof w === 'object' && w.w) {
            roundWinners[r - 1].push(winner);
        } else if (w) {
            roundWinners[r - 1].push(w);
        }

        if (typeof l === 'object' && l.l) {
            roundLosers[r - 1].push(loser);
        } else if (l) {
            roundLosers[r - 1].push(l);
        }
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

// Main function
async function main() {
    const leagueId = '989237166217723904'; // Specified league ID
    // Fetch roster ID to owner ID map
    const rosterIdToOwnerIdMap = await getRosterIdToOwnerIdMap(leagueId);
    if (!rosterIdToOwnerIdMap) {
        console.error('Failed to fetch roster data. Exiting.');
        return;
    }
    console.log('Roster ID to owner ID map:', rosterIdToOwnerIdMap);
    // Build mapping between owner IDs and usernames
    const ownerToUsernameMap = await buildOwnerToUsernameMap(rosterIdToOwnerIdMap);
    if (!ownerToUsernameMap) {
        console.error('Failed to build owner to username map. Exiting.');
        return;
    }
    console.log('Owner ID to username map:', ownerToUsernameMap);
    // Fetch playoff bracket data
    const playoffBracket = await getPlayoffBracket(leagueId, rosterIdToOwnerIdMap, ownerToUsernameMap);
    if (!playoffBracket) {
        console.error('Failed to fetch playoff bracket data. Exiting.');
        return;
    }

    // Determine playoff placements
    const placements = determinePlayoffPlacements(playoffBracket, ownerToUsernameMap);
    console.log('Playoff Placements:', placements);
    // console.log('Playoff bracket:', playoffBracket);
}

// Run the main function
main();
