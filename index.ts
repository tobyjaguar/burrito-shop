import 'dotenv/config'; // Load environment variables from .env file
import app from './app.js';
import { connect } from './config/db.js';

import { getNetwork } from './blockchain/sendPayment.js';

const port = process.env.NODE_LOCAL_PORT || 3000;

(async () => {
    try {
        await connect();
        await getNetwork();

        app.listen(port, () => {
            console.log(`[server]: Server is running at http://localhost:${port}`);
        });
    }
    catch (error) {
        console.log('Error connecting to the database: ', error);
    }
})();

