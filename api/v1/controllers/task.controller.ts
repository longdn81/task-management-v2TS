import Task from "../models/task.model";

import {Request , Response} from "express";


// [GET] /tasks
export const index =  async (req : Request ,res : Response) => {
    const find = {
        deleted: false,
    };
    if (req.query.status) {
        find[`status`] = req.query.status;
    }
    const tasks = await Task.find(find)
    

    res.json(tasks);
};
// [GET] /tasks/detail/:id
export const detail = async (req : Request ,res : Response) => {
    const id : string  = req.params.id ;

    const task = await Task.find({
        deleted : false ,
        _id : id ,
    })
    

    res.json(task);
}

// [PATCH] /tasks/change-status/:id


// [PATCH] /tasks/change-multi


// [POST] /tasks/create


// [PATCH] /tasks/edit/:id


// [DELETE] /tasks/delete/:id

