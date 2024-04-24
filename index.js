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

function calculateRegularSeasonSummary(matchupsByWeek) {
    const userSummary = {};
    const matchups = matchupsByWeek.filter(matchupSet => +matchupSet.week <= 14).map(matchupSet => matchupSet.matchups);
    matchups.forEach(matchup => {
        matchup.forEach(({ winner, loser, winnerScore, loserScore }) => {
            // Increment wins and losses for winner and loser
            userSummary[winner] = userSummary[winner] || { wins: 0, losses: 0, pointsFor: 0, pointsAgainst: 0 };
            userSummary[loser] = userSummary[loser] || { wins: 0, losses: 0, pointsFor: 0, pointsAgainst: 0 };
            userSummary[winner].wins++;
            userSummary[loser].losses++;
    
            // Add points for and against for winner and loser
            userSummary[winner].pointsFor += winnerScore;
            userSummary[winner].pointsAgainst += loserScore;
            userSummary[loser].pointsFor += loserScore;
            userSummary[loser].pointsAgainst += winnerScore;
        });
    });

    // Calculate average points for each user
    Object.values(userSummary).forEach(summary => {
        summary.averagePoints = summary.pointsFor / (summary.wins + summary.losses);
    });

    // Convert userSummary object to an array of user summaries
    const userSummaries = Object.entries(userSummary).map(([user, summary]) => ({ user, ...summary }));
    return userSummaries;
}


// Function to generate HTML content with Bootstrap v5 styling for all leagues and years
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
            <h1 class="mb-4">FFU Matchup History</h1>
            <ul class="nav nav-tabs" id="leagueTabs" role="tablist">
                ${matchupsByLeague.map(({ name, leagueYears }, index) => `
                    <li class="nav-item" role="presentation">
                        <button class="nav-link ${index === 0 ? 'active' : ''}" id="tab-${index}" data-bs-toggle="tab" data-bs-target="#content-${index}" type="button" role="tab" aria-controls="content-${index}" aria-selected="${index === 0 ? 'true' : 'false'}">${name}</button>
                    </li>
                `).join('')}
            </ul>
            <div class="tab-content" id="leagueTabsContent">
                ${matchupsByLeague.map(({ leagueYears }, index) => `
                    <div class="tab-pane fade ${index === 0 ? 'show active' : ''}" id="content-${index}" role="tabpanel" aria-labelledby="tab-${index}">
                        <ul class="nav nav-tabs" id="yearTabs-${index}" role="tablist">
                            ${leagueYears.map(({ year }, subIndex) => `
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link ${subIndex === 0 ? 'active' : ''}" id="subtab-${index}-${subIndex}" data-bs-toggle="tab" data-bs-target="#subcontent-${index}-${subIndex}" type="button" role="tab" aria-controls="subcontent-${index}-${subIndex}" aria-selected="${subIndex === 0 ? 'true' : 'false'}">${year}</button>
                                </li>
                            `).join('')}
                        </ul>
                        <div class="tab-content" id="yearTabsContent-${index}">
                            ${leagueYears.map(({ year, matchupsByWeek }, subIndex) => `
                                <div class="tab-pane fade ${subIndex === 0 ? 'show active' : ''}" id="subcontent-${index}-${subIndex}" role="tabpanel" aria-labelledby="subtab-${index}-${subIndex}">
                                    <div class="table-container">
                                        <h2 class="mb-3">Regular Season Summary</h2>
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">User</th>
                                                    <th scope="col">Win</th>
                                                    <th scope="col">Loss</th>
                                                    <th scope="col">Points For</th>
                                                    <th scope="col">Points Against</th>
                                                    <th scope="col">Average Points</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${calculateRegularSeasonSummary(matchupsByWeek.flat())
                                                    .sort((a, b) => b.averagePoints - a.averagePoints)
                                                    .map(({ user, wins, losses, pointsFor, pointsAgainst, averagePoints }) => `
                                                    <tr>
                                                        <td>${user}</td>
                                                        <td>${wins}</td>
                                                        <td>${losses}</td>
                                                        <td>${pointsFor.toFixed(2)}</td>
                                                        <td>${pointsAgainst.toFixed(2)}</td>
                                                        <td>${averagePoints.toFixed(2)}</td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
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
                    </div>
                `).join('')}
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
    `;
    return div.innerHTML;
}

async function fetchAndGenerateHTMLForAllLeagues(leagueIds) {
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

    const html = generateHTMLForAllLeagues(matchupsByLeague);
    fs.writeFileSync('index.html', html);
    console.log('HTML file generated successfully.');
}

// Example usage:
const leagueIds = ['989237166217723904', '989238596353794048', '989240797381951488'];
fetchAndGenerateHTMLForAllLeagues(leagueIds);
