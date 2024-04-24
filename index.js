const fs = require('fs');
const { JSDOM } = require('jsdom');
const leagueData = require('./league_data.json');

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

function calculateAllTimeRegularSeasonSummary(matchupsByLeague) {
    const userSummary = {};

    matchupsByLeague.forEach(({ leagueYears }) => {
        leagueYears.forEach(({ matchupsByWeek }) => {
            const regularSeasonMatchups = matchupsByWeek.filter(({ week }) => week <= 14).flatMap(({ matchups }) => matchups);

            regularSeasonMatchups.forEach(({ winner, loser, winnerScore, loserScore }) => {
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
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="tab-all-time" data-bs-toggle="tab" data-bs-target="#content-all-time" type="button" role="tab" aria-controls="content-all-time" aria-selected="false">All Time</button>
                </li>
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
                <div class="tab-pane fade" id="content-all-time" role="tabpanel" aria-labelledby="tab-all-time">
                    <div class="table-container">
                        <h2 class="mb-3">All Time Regular Season Summary</h2>
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
                                ${calculateAllTimeRegularSeasonSummary(matchupsByLeague)
                                    .sort((a, b) => b.wins - a.wins)
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
                </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
    `;
    return div.innerHTML;
}

function fetchAndGenerateHTMLForAllLeagues(matchupsByLeague) {
    const html = generateHTMLForAllLeagues(matchupsByLeague);
    fs.writeFileSync('index.html', html);
    console.log('HTML file generated successfully.');
}

// Example usage:
fetchAndGenerateHTMLForAllLeagues(leagueData);
