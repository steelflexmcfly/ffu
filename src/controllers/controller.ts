import { Request, Response } from "express";
import { SleeperClient } from "../clients/sleeper.client.js"
import { LeagueService } from "../services/league.service.js";
import { PlayoffService } from "../services/playoff.service.js";
import { StatisticsService } from "../services/statistics.service.js";
import { LEAGUE_IDS, USER_IDS_INFO_MAP } from "../config/consts.js";
import { WeekMatchup } from "../models/matchups.js";

export default class Controller {
    league: LeagueService;

    constructor(league: LeagueService) {
        this.league = league;
    }

    async getMatchupsForWeek(req: Request, res: Response) {
        try {
            const league = req.params.league.toUpperCase();
            const year = req.params.year;
            const week = +req.params.week;
            console.log(league, year, week);
            const data: WeekMatchup[] = await this.league.getMatchupsForWeek(LEAGUE_IDS[league][year], week);
            const mappedData = data.map(matchup => {
                return {
                    ...matchup,
                    winner: USER_IDS_INFO_MAP[matchup.winner].teamName,
                    loser: USER_IDS_INFO_MAP[matchup.loser].teamName
                }
            })
            res.status(200).json(mappedData);
        }catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Internal Server Error!"
            });
        }
    }

    async getTest(req: Request, res: Response) {
        try {
            res.status(200).json({
                message: "getTest works"
            });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            });
        }
    }

    async getTestById(req: Request, res: Response) {
        try {
            res.status(200).json({
                message: `getTestById works - ${req.params.id}`
            });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            });
        }
    }

}