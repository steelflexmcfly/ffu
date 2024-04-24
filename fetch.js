const axios = require('axios');
const fs = require('fs');

// Function to fetch user details for unique user IDs
async function fetchUserDetails(userId) {
    try {
        const userResponse = await axios.get(`https://api.sleeper.app/v1/user/${userId}`);
        return userResponse.data.display_name || 'Unknown User';
    } catch (error) {
        console.error('Error fetching user details for user ID', userId, ':', error.response ? error.response.data : error.message);
        return 'Unknown User';
    }
}

// Function to fetch matchup history for a specific week
async function getMatchupHistory(leagueId, week, usersCache) {
    try {
        // Fetch roster data
        const rostersResponse = await axios.get(`https://api.sleeper.app/v1/league/${leagueId}/rosters`);
        const rosters = rostersResponse.data;

        // Map roster IDs to user IDs
        const rosterUserMap = {};
        rosters.forEach(roster => {
            rosterUserMap[roster.roster_id] = roster.owner_id;
        });

        // Fetch user details for unique user IDs if not in cache
        const missingUserIds = Object.values(rosterUserMap).filter(userId => !usersCache[userId]);
        await Promise.all(missingUserIds.map(async userId => {
            usersCache[userId] = await fetchUserDetails(userId);
        }));

        // Fetch matchup history
        const matchupsResponse = await axios.get(`https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`);
        const matchups = matchupsResponse.data;

        // Group matchups by matchup_id
        const groupedMatchups = {};
        matchups.forEach(matchup => {
            const matchupId = matchup.matchup_id;
            if (!groupedMatchups[matchupId]) {
                groupedMatchups[matchupId] = [];
            }
            groupedMatchups[matchupId].push(matchup);
        });

        // Create pairs of matchups
        const pairsOfMatchups = [];
        for (const matchupId in groupedMatchups) {
            if (groupedMatchups.hasOwnProperty(matchupId)) {
                const matchups = groupedMatchups[matchupId];
                if (matchups.length === 2) {
                    const user1 = usersCache[rosterUserMap[matchups[0].roster_id]] || 'Unknown User';
                    const user2 = usersCache[rosterUserMap[matchups[1].roster_id]] || 'Unknown User';
                    const score1 = matchups[0].points;
                    const score2 = matchups[1].points;
                    const winner = score1 > score2 ? user1 : user2;
                    const loser = score1 > score2 ? user2 : user1;
                    const winnerScore = Math.max(score1, score2);
                    const loserScore = Math.min(score1, score2);
                    pairsOfMatchups.push({ winner, loser, winnerScore, loserScore });
                }
            }
        }

        return pairsOfMatchups;
    } catch (error) {
        console.error('Error fetching matchup history:', error.response ? error.response.data : error.message);
        return null;
    }
}

async function fetchDataForAllLeagues(leagueIds) {
    const matchupsByLeague = [];

    async function fetchMatchupHistory(leagueId, depth) {
        const leagueInfoResponse = await axios.get(`https://api.sleeper.app/v1/league/${leagueId}`);
        const { name } = leagueInfoResponse.data;
    
        const leagueYears = [];
        let currentLeagueId = leagueId;
        while (currentLeagueId) {
            const seasonResponse = await axios.get(`https://api.sleeper.app/v1/league/${currentLeagueId}`);
            const { season } = seasonResponse.data;
            const year = parseInt(season);
            const matchupsByWeek = [];
            for (let week = 1; week <= 17; week++) {
                const matchups = await getMatchupHistory(currentLeagueId, week, {});
                matchupsByWeek.push({ week, matchups });
            }
            leagueYears.push({ year, matchupsByWeek });
            currentLeagueId = seasonResponse.data.previous_league_id;
        }
    
        matchupsByLeague.push({ name, leagueYears, depth });
    
    }
    
    for (let i = 0; i < leagueIds.length; i++) {
        await fetchMatchupHistory(leagueIds[i], 0);
    }

    // Writing matchupsByLeague to JSON file
    fs.writeFileSync('league_data.json', JSON.stringify(matchupsByLeague));
    console.log('League data JSON file generated successfully.');
}

// Example usage:
const leagueIds = ['989237166217723904', '989238596353794048', '989240797381951488'];
fetchDataForAllLeagues(leagueIds);