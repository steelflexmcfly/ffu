import leagueData from '../../output/all-matchups.json';
import * as fs from 'fs';

type CrossLeagueData = {
    [key in "premier" | "masters" | "national"]: LeagueYear[];
};

type LeagueYear = {
    year: string;
    matchupsByWeek: LeagueWeek[];
};

type LeagueWeek = {
    week: number;
    matchups: LeagueMatchup[];
}

type LeagueMatchup = {
    winner: string;
    loser: string;
    winnerScore: number;
    loserScore: number;
}

function buildYearlyMatchupTables(league: LeagueYear[], leagueName: string) {
    return league.map(season => buildSingleYearMatchups(season, leagueName)).join('');
}

function buildSingleYearMatchups(season: LeagueYear, leagueName: string) {
    return `<h2>${leagueName} - ${season.year}</h2>${season.matchupsByWeek.map(week => buildWeekMatchips(week)).join('')}`;
}

function buildWeekMatchips(week: LeagueWeek) {
    return `
        <h3>${week.week}</h3>
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

function buildMatchup(matchup: LeagueMatchup) {
    return `
        <tr>
            <td>${matchup.winner}</td>
            <td>${matchup.winnerScore}</td>
            <td>${matchup.loserScore}</td>
            <td>${matchup.loser}</td>
        </tr>
    `;
}

async function main() {
    const allLeagueData: CrossLeagueData = leagueData;
    const premier = allLeagueData.premier as LeagueYear[];
    const masters = allLeagueData.masters as LeagueYear[];
    const national = allLeagueData.national as LeagueYear[];

    const premierTable = buildYearlyMatchupTables(premier, "Premier League");
    const mastersTable = buildYearlyMatchupTables(masters, "Masters League");
    const nationalTable = buildYearlyMatchupTables(national, "National League");
    const html = `<html>${premierTable}${mastersTable}${nationalTable}</html>`
    fs.writeFileSync('./index.html', html);
}

main();