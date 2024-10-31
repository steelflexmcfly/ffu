export interface WeekMatchup {
    winner: string;
    loser: string;
    winnerScore: number;
    loserScore: number;
}

export type CrossLeagueData = {
    [key in "premier" | "masters" | "national"]: LeagueYear[];
};

export type LeagueYear = {
    year: string;
    leagueId: string;
    matchupsByWeek: LeagueWeek[];
};

export type LeagueWeek = {
    week: number;
    matchups: LeagueMatchup[];
}

export type LeagueMatchup = {
    winner: string;
    loser: string;
    winnerScore: number;
    loserScore: number;
}