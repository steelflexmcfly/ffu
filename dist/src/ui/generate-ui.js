import leagueData from '../../output/all-matchups.json' with { type: "json" };
;
import * as fs from 'fs';
import { USER_IDS_INFO_MAP } from '../config/consts.js';
function buildYearlyMatchupTables(league, leagueName) {
    return league.map(season => buildSingleYearMatchups(season, leagueName)).join('');
}
function buildSingleYearMatchups(season, leagueName) {
    return `<h2>${leagueName} - ${season.year}</h2>${season.matchupsByWeek.map(week => buildWeekMatchips(week)).join('')}`;
}
function buildWeekMatchips(week) {
    return `
        <h3>Week ${week.week}</h3>
        <table>
            <tr>
                <th>Winner</th>
                <th>Winner Score</th>
                <th>Loser Score</th>
                <th>Loser</th>
            </tr>
            ${week.matchups.map(matchup => buildMatchup(matchup)).join('')}
        </table>
    `;
}
function buildMatchup(matchup) {
    return `
        <tr>
            <td>${USER_IDS_INFO_MAP[matchup.winner].teamName}</td>
            <td>${matchup.winnerScore}</td>
            <td>${matchup.loserScore}</td>
            <td>${USER_IDS_INFO_MAP[matchup.loser].teamName}</td>
        </tr>
    `;
}
async function main() {
    const allLeagueData = leagueData;
    const premier = allLeagueData.premier;
    const masters = allLeagueData.masters;
    const national = allLeagueData.national;
    const premierTable = buildYearlyMatchupTables(premier, "Premier League");
    const mastersTable = buildYearlyMatchupTables(masters, "Masters League");
    const nationalTable = buildYearlyMatchupTables(national, "National League");
    const html = `<html>${premierTable}${mastersTable}${nationalTable}</html>`;
    fs.writeFileSync('./index.html', html);
}
main();
