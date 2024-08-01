import express, { Express, Router } from "express";
import 'dotenv/config';
import app from './app.js';
import { connect } from './config/db.js';

import { seed } from './startup/seed-db.js';
import { getNetwork } from './blockchain/sendPayment.js';

const port = process.env.NODE_LOCAL_PORT || 3000;

(async () => {
    try {
        await connect();
        await getNetwork();
        // Uncomment if you want to seed the database on startup
        console.log('seeding database');
        await seed();

        app.listen(port, () => {
            console.log(`[server]: Server is running at http://localhost:${port}`);
        });
    }
    catch (error) {
        console.log('Error connecting to the database: ', error);
    }
})();

