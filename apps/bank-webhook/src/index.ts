import express from "express";
import db from "@repo/db/client";

const app = express();

app.post("/hdfcWebhook", async (req, res) => {
    console.log("HDFC Webhook called");

    try {

        const paymentInfo = {
            token: req.body.token,
            userId: req.body.userId,
            amount: req.body.amount,
        }

        await db.$transaction([

            db.balance.update({
                where: {
                    userId: paymentInfo.userId
                },
                data: {
                    amount: {
                        increment: paymentInfo.amount
                    }
                }
            }),

            db.onRampTransaction.update({
                where: {
                    token: paymentInfo.token
                },
                data: {
                    status: "Success"
                }
            })
        ])

        res.json({ message: "Payment successful" });
        
    } catch (error) {
        res.json({ message: "Payment failed" });
    }

});