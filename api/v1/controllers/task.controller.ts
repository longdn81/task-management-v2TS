import paginationHelper from "../helpers/pagination";
import searchHelper from "../helpers/search";
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

    // Sort
    const sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toLocaleString();
        sort[sortKey] = req.query.sortValue;
    }
    // End Sort

    // pagination
    const countTasks = await Task.countDocuments(find);

    let objectPagination = paginationHelper({
            limitItem: 2,
            currentPage: 1
        },
        req.query,
        countTasks
    );

    // end pagination

    // search
    let objectSearch = searchHelper(req.query);

    if (objectSearch.regex) {
        find[`title`] = objectSearch.regex;
    }

    // End search

    const tasks = await Task.find(find)
        .sort(sort)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);
    

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

