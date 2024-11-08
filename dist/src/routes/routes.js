import { Router } from 'express';
import Controller from '../controllers/controller.js';
import { SleeperClient } from '../clients/sleeper.client.js';
import { LeagueService } from '../services/league.service.js';
class Routes {
    router = Router();
    sleeper = new SleeperClient();
    league = new LeagueService(this.sleeper);
    controller = new Controller(this.league);
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/', this.controller.getTest);
        this.router.get('/:league/:year/:week', this.controller.getMatchupsForWeek.bind(this.controller));
    }
}
export default new Routes().router;
