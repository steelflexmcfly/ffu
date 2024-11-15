import { LEAGUE_IDS, USER_IDS_INFO_MAP } from "../config/consts.js";
export default class Controller {
    league;
    constructor(league) {
        this.league = league;
    }
    async getMatchupsForWeek(req, res) {
        try {
            const league = req.params.league.toUpperCase();
            const year = req.params.year;
            const week = +req.params.week;
            console.log(league, year, week);
            const data = await this.league.getMatchupsForWeek(LEAGUE_IDS[league][year], week);
            const mappedData = data.map(matchup => {
                return {
                    ...matchup,
                    winner: USER_IDS_INFO_MAP[matchup.winner].teamName,
                    loser: USER_IDS_INFO_MAP[matchup.loser].teamName
                };
            });
            res.status(200).json(mappedData);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Internal Server Error!"
            });
        }
    }
    async getTest(req, res) {
        try {
            res.status(200).json({
                message: "getTest works"
            });
        }
        catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            });
        }
    }
    async getTestById(req, res) {
        try {
            res.status(200).json({
                message: `getTestById works - ${req.params.id}`
            });
        }
        catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            });
        }
    }
}
