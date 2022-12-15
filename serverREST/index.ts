import express, { Express} from 'express';
import {router} from "./routes/user.routes";

const app: Express = express();
const port: number = 5000;
app.use(express.json());

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

app.use('/api',router);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});