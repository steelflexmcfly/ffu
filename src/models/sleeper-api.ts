export interface Player {
    hashtag: string;
    depth_chart_position: number;
    status: string;
    sport: string;
    fantasy_positions: string[];
    number: number;
    search_last_name: string;
    injury_start_date: unknown;
    weight: string;
    position: string;
    practice_participation: unknown;
    sportradar_id: string;
    team: string;
    last_name: string;
    college: string;
    fantasy_data_id: number;
    injury_status: unknown;
    player_id: string;
    height: string;
    search_full_name: string;
    age: number;
    stats_id: string;
    birth_country: string;
    espn_id: string;
    search_rank: number;
    first_name: string;
    depth_chart_order: number;
    years_exp: number;
    rotowire_id: unknown;
    rotoworld_id: number;
    search_first_name: string;
    yahoo_id: unknown;
};

export interface LeagueInfoResponse {
    name: string;
    status: string;
    settings: Object;
    season: string;
    season_type: string;
    league_id: string;
    previous_league_id: string;
    bracket_id: string;
    loser_bracket_id: string;
};

export interface UserLeaguesInfoResponse {
    leagues: LeagueInfoResponse[];
}

export interface LeagueRostersResponse {
    display_name: string;
    league_id: string;
    user_id: string;
};

export interface LeagueWeekMatchupResponse {
    matchup_id: number;
    roster_id: number;
    points: number;
    custom_points: unknown;
    starters: number[];
    starters_points: number[];
    players: number[];
    players_points: number[];
}

export interface PlayoffResponse {
    r: number;
    m: number;
    t1: number;
    t2: number;
    w: number;
    l: number;
    t1_from: {
        w?: number;
        l?: number;
    },
    t2_from: {
        w?: number;
        l?: number;
    }
}
export interface PlayoffData {
    round: number;
    matchId: number;
    teamOne: number;
    teamTwo: number;
    winnerId: number;
    loserId: number;
    teamOneFrom: {
        winFromId: number;
        loseFromId: number;
    },
    teamTwoFrom: {
        winFromId: number;
        loseFromId: number;
    }
}
