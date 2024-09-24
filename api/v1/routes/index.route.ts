import { Express } from "express";

import { taskRoutes } from "./task.route";

import { userRoutes } from "./user.route";

const indexRoutesV1= (app : Express) => {

    const version = "/api/v1" ;

    app.use( version +'/tasks', taskRoutes );

    app.use( version +'/users', userRoutes );


}

export default indexRoutesV1 ;