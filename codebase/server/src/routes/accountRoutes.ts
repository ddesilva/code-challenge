import express from "express";
import {
  getAccountsController,
  processPaymentController,
} from "../controllers/accountController";

const router = express.Router();

router.get("/accounts", getAccountsController);
router.post("/payment", processPaymentController);

export default router;
