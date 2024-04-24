const axios = require('axios');
const fs = require('fs');
const { JSDOM } = require('jsdom');

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

// Function to generate HTML content with Bootstrap v5 styling for all weeks
function generateHTMLForAllLeagues(matchupsByLeague) {
    const { document } = (new JSDOM()).window;
    const div = document.createElement('div');
    div.innerHTML = `
        <html>
        <head>
            <title>FFU Matchup History</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body {
                    padding: 20px;
                }
                .table-container {
                    width: 75%;
                    margin: auto;
                }
                .winner {
                    color: green;
                    font-weight: bold;
                }
                .loser {
                    color: red;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <h1 class="mb-4">Matchup History</h1>
            <ul class="nav nav-tabs" id="leagueTabs" role="tablist">
                ${matchupsByLeague.map(({ leagueId, seasonYear }, index) => {
                    let leagueName = '';
                    switch (leagueId) {
                        case '989237166217723904':
                            leagueName = 'Premier';
                            break;
                        case '989238596353794048':
                            leagueName = 'Master';
                            break;
                        case '989240797381951488':
                            leagueName = 'National';
                            break;
                        default:
                            leagueName = leagueId;
                    }
                    return `
                        <li class="nav-item" role="presentation">
                            <button class="nav-link ${index === 0 ? 'active' : ''}" id="tab-${leagueId}" data-bs-toggle="tab" data-bs-target="#content-${leagueId}" type="button" role="tab" aria-controls="content-${leagueId}" aria-selected="${index === 0 ? 'true' : 'false'}">${leagueName} - ${seasonYear}</button>
                        </li>
                    `;
                }).join('')}
            </ul>
            <div class="tab-content" id="leagueTabsContent">
                ${matchupsByLeague.map(({ leagueId, seasonYear, matchupsByWeek }, index) => `
                    <div class="tab-pane fade ${index === 0 ? 'show active' : ''}" id="content-${leagueId}" role="tabpanel" aria-labelledby="tab-${leagueId}">
                        ${matchupsByWeek.map(({ week, matchups }) => `
                            <div class="table-container">
                                <h2 class="mb-3">Week ${week}</h2>
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Winner</th>
                                            <th scope="col">Winner Score</th>
                                            <th scope="col">Loser Score</th>
                                            <th scope="col">Loser</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${matchups.map((matchup, index) => `
                                            <tr>
                                                <td class="${matchup.winnerScore > matchup.loserScore ? 'winner' : 'loser'}">${matchup.winner}</td>
                                                <td>${matchup.winnerScore}</td>
                                                <td>${matchup.loserScore}</td>
                                                <td class="${matchup.winnerScore > matchup.loserScore ? 'loser' : 'winner'}">${matchup.loser}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
    `;
    return div.innerHTML;
}



// Function to fetch matchup history for all leagues and generate HTML for each league
async function fetchAndGenerateHTMLForAllLeagues(leagueIds) {
    const matchupsByLeague = [];

    for (const leagueId of leagueIds) {
        const leagueInfoResponse = await axios.get(`https://api.sleeper.app/v1/league/${leagueId}`);
        const seasonYear = leagueInfoResponse.data.season;

        const matchupsByWeek = [];
        for (let week = 1; week <= 17; week++) {
            const matchups = await getMatchupHistory(leagueId, week, {});
            matchupsByWeek.push({ week, matchups });
        }

        matchupsByLeague.push({ leagueId, seasonYear, matchupsByWeek });
    }

    const html = generateHTMLForAllLeagues(matchupsByLeague);
    fs.writeFileSync('index.html', html);
    console.log('HTML file generated successfully.');
}

// Example usage:
const leagueIds = ['989237166217723904', '989238596353794048', '989240797381951488'];
fetchAndGenerateHTMLForAllLeagues(leagueIds);
