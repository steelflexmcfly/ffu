const fs = require('fs');
const { JSDOM } = require('jsdom');
const leagueData = require('./league_data.json');

// Function to calculate regular season summary
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

// Function to calculate the Top 10 highest single game scores
function calculateTop10HighestSingleGameScores(matchupsByLeague) {
    const topScores = [];
    matchupsByLeague.forEach(({ leagueYears }) => {
        leagueYears.forEach(({ year, matchupsByWeek }) => {
            matchupsByWeek.forEach(({ week, matchups }) => {
                matchups.forEach(({ winner, winnerScore }) => {
                    const existing = topScores.find(score => score.user === winner);
                    if (!existing) {
                        topScores.push({ user: winner, score: winnerScore, year, week });
                    } else if (winnerScore > existing.score) {
                        existing.score = winnerScore;
                        existing.year = year;
                        existing.week = week;
                    }
                });
            });
        });
    });
    return topScores.sort((a, b) => b.score - a.score).slice(0, 10);
}

// Function to calculate the Top 10 lowest single game scores
function calculateTop10LowestSingleGameScores(matchupsByLeague) {
    const lowestScores = [];
    matchupsByLeague.forEach(({ leagueYears }) => {
        leagueYears.forEach(({ year, matchupsByWeek }) => {
            matchupsByWeek.forEach(({ week, matchups }) => {
                matchups.forEach(({ loser, loserScore }) => {
                    const existing = lowestScores.find(score => score.user === loser);
                    if (!existing) {
                        lowestScores.push({ user: loser, score: loserScore, year, week });
                    } else if (loserScore < existing.score) {
                        existing.score = loserScore;
                        existing.year = year;
                        existing.week = week;
                    }
                });
            });
        });
    });
    return lowestScores.sort((a, b) => a.score - b.score).slice(0, 10);
}

// Function to calculate the Top 10 closest matchups
function calculateTop10ClosestMatchups(matchupsByLeague) {
    const closestMatchups = [];
    matchupsByLeague.forEach(({ leagueYears }) => {
        leagueYears.forEach(({ year, matchupsByWeek }) => {
            matchupsByWeek.forEach(({ week, matchups }) => {
                matchups.forEach(({ winner, loser, winnerScore, loserScore }) => {
                    const difference = Math.abs(winnerScore - loserScore);
                    closestMatchups.push({ winner, loser, difference: difference.toFixed(2), year, week });
                });
            });
        });
    });
    return closestMatchups.sort((a, b) => a.difference - b.difference).slice(0, 10);
}

// Function to generate the table for Top 10 highest single game scores
function generateTop10HighestSingleGameScoresTable(top3HighestScores) {
    return `
        <div class="table-container">
            <h2 class="mb-3">Top 10 Highest Single Game Scores</h2>
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">User</th>
                            <th scope="col">Score</th>
                            <th scope="col">Year</th>
                            <th scope="col">Week</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${top3HighestScores.map(({ user, score, year, week }) => `
                            <tr>
                                <td>${user}</td>
                                <td>${score}</td>
                                <td>${year}</td>
                                <td>${week}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Function to generate the table for Top 10 lowest single game scores
function generateTop10LowestSingleGameScoresTable(top3LowestScores) {
    return `
        <div class="table-container">
            <h2 class="mb-3">Top 10 Lowest Single Game Scores</h2>
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">User</th>
                            <th scope="col">Score</th>
                            <th scope="col">Year</th>
                            <th scope="col">Week</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${top3LowestScores.map(({ user, score, year, week }) => `
                            <tr>
                                <td>${user}</td>
                                <td>${score}</td>
                                <td>${year}</td>
                                <td>${week}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Function to generate the table for Top 10 closest matchups
function generateTop10ClosestMatchupsTable(top3ClosestMatchups) {
    return `
        <div class="table-container">
            <h2 class="mb-3">Top 10 Closest Matchups</h2>
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Winner</th>
                            <th scope="col">Loser</th>
                            <th scope="col">Difference</th>
                            <th scope="col">Year</th>
                            <th scope="col">Week</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${top3ClosestMatchups.map(({ winner, loser, difference, year, week }) => `
                            <tr>
                                <td>${winner}</td>
                                <td>${loser}</td>
                                <td>${difference}</td>
                                <td>${year}</td>
                                <td>${week}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}
// Function to calculate all-time regular season summary
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

// Function to generate the header section of HTML
function generateHeader() {
    return `
        <head>
            <title>FFU Matchup History</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
            <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.css">
            <style>
                body {
                    padding: 20px;
                    background-color: #f8f9fa;
                    color: #333;
                    font-size: 16px;
                }
                .container {
                    max-width: 1200px;
                    margin: auto;
                }
                .table-container {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .nav-tabs {
                    border: none;
                    border-radius: 10px;
                    margin-bottom: 20px;
                    overflow-x: auto;
                    display: flex;
                    flex-wrap: nowrap;
                }
                .nav-tabs .nav-link {
                    color: #333;
                    border: none;
                    background-color: transparent;
                    padding: 10px 15px;
                    margin-right: 5px;
                    border-radius: 10px;
                    transition: background-color 0.3s;
                }
                .nav-tabs .nav-link.active {
                    background-color: #dc3545;
                    color: #fff;
                    border: none;
                }
                .nav-tabs .nav-link:not(.active):hover {
                    background-color: #eee;
                    color: #333;
                }
                .tab-content {
                    padding: 10px;
                }
                .table {
                    background-color: #fff;
                    font-size: 14px;
                }
                .winner {
                    color: #218838;
                    font-weight: normal;
                }
                .loser {
                    color: #c82333;
                    font-weight: normal;
                }
                h1, h2, h3, h4, h5, h6 {
                    color: #dc3545;
                    margin-bottom: 15px;
                    text-align: center;
                }
                th {
                    font-weight: bold;
                    color: #000;
                }
                .nav-link.active {
                    background-color: #dc3545;
                    color: #fff;
                    border-color: #dc3545;
                }
                .nav-link {
                    background-color: #fff;
                    color: #dc3545;
                    border-color: #aaa;
                }
                .nav-link:hover {
                    background-color: #eee;
                    color: #333;
                }
                thead th {
                    color: #000;
                }
            </style>
        </head>
    `;
}

// Function to generate tabs for each league
function generateLeagueTabs(matchupsByLeague) {
    return `
        <ul class="nav nav-tabs" id="leagueTabs" role="tablist">
            ${matchupsByLeague.map(({ name }, index) => `
                <li class="nav-item" role="presentation">
                    <button class="nav-link ${index === 0 ? 'active' : ''}" id="tab-${index}" data-bs-toggle="tab" data-bs-target="#content-${index}" type="button" role="tab" aria-controls="content-${index}" aria-selected="${index === 0 ? 'true' : 'false'}">${name}</button>
                </li>
            `).join('')}
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="tab-all-time" data-bs-toggle="tab" data-bs-target="#content-all-time" type="button" role="tab" aria-controls="content-all-time" aria-selected="false">All Time</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="tab-records" data-bs-toggle="tab" data-bs-target="#content-records" type="button" role="tab" aria-controls="content-records" aria-selected="false">Records</button>
            </li>
        </ul>
    `;
}

// Function to generate tabs for each year within a league
function generateYearTabs(leagueYears, leagueIndex) {
    return `
        <ul class="nav nav-tabs" id="yearTabs-${leagueIndex}" role="tablist">
            ${leagueYears.map(({ year }, subIndex) => `
                <li class="nav-item" role="presentation">
                    <button class="nav-link ${subIndex === 0 ? 'active' : ''}" id="subtab-${leagueIndex}-${subIndex}" data-bs-toggle="tab" data-bs-target="#subcontent-${leagueIndex}-${subIndex}" type="button" role="tab" aria-controls="subcontent-${leagueIndex}-${subIndex}" aria-selected="${subIndex === 0 ? 'true' : 'false'}">${year}</button>
                </li>
            `).join('')}
        </ul>
    `;
}

// Function to generate tables for playoff finishes
function generatePlayoffFinishesTable(playoffInfo, year) {
    return `
        <div class="table-container">
            <h2 class="mb-3">Playoff Finishes</h2>
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Place</th>
                            <th scope="col">User</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(playoffInfo)
                            .map(([place, user]) => `
                                <tr class="${place === '1st' ? 'gold' : place === '2nd' ? 'silver' : place === '3rd' ? 'bronze' : ''}">
                                    <td>${place}</td>
                                    <td>${user}</td>
                                </tr>
                            `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Function to generate tables for regular season summary
function generateRegularSeasonSummaryTable(matchupsByWeek, year) {
    return `
        <div class="table-container">
            <h2 class="mb-3">Regular Season Summary</h2>
            <div class="table-responsive">
                <table class="table sortable-table">
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
                        ${calculateRegularSeasonSummary(matchupsByWeek)
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
        </div>
    `;
}

// Function to generate tables for weekly matchup summaries
function generateWeeklyMatchupTables(matchupsByWeek) {
    return matchupsByWeek.map(({ week, matchups }) => `
        <div class="table-container">
            <h2 class="mb-3">Week ${week}</h2>
            <div class="table-responsive">
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
        </div>
    `).join('');
}

// Function to generate the table for all-time regular season summary
function generateAllTimeRegularSeasonSummaryTable(matchupsByLeague) {
    return `
        <div class="table-container">
            <h2 class="mb-3">All Time Regular Season Summary</h2>
            <div class="table-responsive">
                <table class="table sortable-table">
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
    `;
}

// Function to generate the HTML for records tab
function generateRecordsTable(matchupsByLeague) {
    const top3HighestScores = calculateTop10HighestSingleGameScores(matchupsByLeague);
    const top3LowestScores = calculateTop10LowestSingleGameScores(matchupsByLeague);
    const top3ClosestMatchups = calculateTop10ClosestMatchups(matchupsByLeague);

    const top3HighestScoresTable = generateTop10HighestSingleGameScoresTable(top3HighestScores);
    const top3LowestScoresTable = generateTop10LowestSingleGameScoresTable(top3LowestScores);
    const top3ClosestMatchupsTable = generateTop10ClosestMatchupsTable(top3ClosestMatchups);

    return `
        <div class="container">
            ${top3HighestScoresTable}
            ${top3LowestScoresTable}
            ${top3ClosestMatchupsTable}
        </div>
    `;
}

// Function to generate the footer section of HTML
function generateFooter() {
    return `
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
        <script type="text/javascript" src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
        <script type="text/javascript" src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.js"></script>
        <script>
            $(document).ready(function() {
                $('.sortable-table').DataTable({
                    "lengthChange": false,
                    "searching": false,
                    "paging": false
                });
            });
        </script>
    `;
}

// Function to generate HTML for all leagues
function generateHTMLForAllLeagues(matchupsByLeague) {
    const { document } = (new JSDOM()).window;
    const div = document.createElement('div');

    div.innerHTML = `
        <html>
            ${generateHeader()}
            <body>
                <div class="container">
                    <h1 class="mb-4">FFU League History</h1>
                    ${generateLeagueTabs(matchupsByLeague)}
                    <div class="tab-content" id="leagueTabsContent">
                        ${matchupsByLeague.map(({ leagueYears }, index) => `
                            <div class="tab-pane fade ${index === 0 ? 'show active' : ''}" id="content-${index}" role="tabpanel" aria-labelledby="tab-${index}">
                                ${generateYearTabs(leagueYears, index)}
                                <div class="tab-content" id="yearTabsContent-${index}">
                                    ${leagueYears.map(({ year, matchupsByWeek, playoffInfo }, subIndex) => `
                                        <div class="tab-pane fade ${subIndex === 0 ? 'show active' : ''}" id="subcontent-${index}-${subIndex}" role="tabpanel" aria-labelledby="subtab-${index}-${subIndex}">
                                            ${generatePlayoffFinishesTable(playoffInfo, year)}
                                            ${generateRegularSeasonSummaryTable(matchupsByWeek.flat(), year)}
                                            ${generateWeeklyMatchupTables(matchupsByWeek)}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                        <div class="tab-pane fade" id="content-all-time" role="tabpanel" aria-labelledby="tab-all-time">
                            ${generateAllTimeRegularSeasonSummaryTable(matchupsByLeague)}
                        </div>
                        <div class="tab-pane fade" id="content-records" role="tabpanel" aria-labelledby="tab-records">
                            ${generateRecordsTable(matchupsByLeague)}
                        </div>
                    </div>
                </div>
                ${generateFooter()}
            </body>
        </html>
    `;

    return div.innerHTML;
}

// Function to fetch and generate HTML for all leagues
function fetchAndGenerateHTMLForAllLeagues(matchupsByLeague) {
    const html = generateHTMLForAllLeagues(matchupsByLeague);
    fs.writeFileSync('index.html', html);
    console.log('HTML file generated successfully.');
}

// Example usage:
fetchAndGenerateHTMLForAllLeagues(leagueData);
