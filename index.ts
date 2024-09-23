import express , {Express} from 'express';
import dotenv from "dotenv";
import * as database from "./config/database" ;
import indexRoutesV1 from './api/v1/routes/index.route';

dotenv.config();

database.connect();

const app : Express= express();
const port  : number | string = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

indexRoutesV1(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});