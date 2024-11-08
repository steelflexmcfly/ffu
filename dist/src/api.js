import { Router } from 'express';
const router = Router();
const test = ['1', '2', '3'];
router.get('/', (req, res) => {
    res.json(test);
});
export default router;
