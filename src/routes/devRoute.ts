import { Router } from "express";
import * as controller from '../controllers/devController'


const router = Router();
router.get('/reset-rate-limit', controller.resetRateLimit);

export default router;
