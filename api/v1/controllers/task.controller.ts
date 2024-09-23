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
export const  changeStatus = async (req : Request ,res : Response) => {
    try {
        const id: string = req.params.id;
        const status: string = req.body.status;

        await Task.updateOne({
            _id: id
        }, {
            status: status,
        })
        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "không tồn tại!"
        })
    }

};

// [PATCH] /tasks/change-multi
export const changeMulti = async (req : Request ,res : Response) => {
    try {
        const ids: string[] = req.body.ids;
        const key: string = req.body.key;     
        const value: string = req.body.value;

        switch (key) {
            case "status":
                await Task.updateMany({
                    _id: {
                        $in: ids
                    },
                }, {
                    status: value
                })
                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công"
                })
                break;
            case "delete":
                await Task.updateMany({
                    _id: {
                        $in: ids
                    },
                }, {
                    deleted: true,
                    deletedAt: new Date(),
                })
                res.json({
                    code: 200,
                    message: "Xóa  thành công"
                })
                break;

            default:
                res.json({
                    code: 400,
                    message: "không tồn tại!"
                })
                break;
        }

    } catch (error) {
        res.json({
            code: 400,
            message: "không tồn tại!"
        })
    }

};

// [POST] /tasks/create
export const create = async  (req : Request ,res : Response) => {
    try {
        // req.body.createdBy = req.user.id ;
        
        const task = new Task(req.body);
        const data = await task.save();


        res.json({
            code: 200,
            message: "Tạo thành công",
            data: data,
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "không tồn tại!"
        })
    }
};

// [PATCH] /tasks/edit/:id
export const edit = async (req : Request ,res : Response) => {
    try {
        const id : string = req.params.id;

        await Task.updateOne({
            _id: id
        }, req.body)
        res.json({
            code: 200,
            message: "Cập nhật  thành công"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "không tồn tại!"
        })
    }

};

// [DELETE] /tasks/delete/:id
export const deleteTask = async (req : Request ,res : Response) => {
    try {
        const id : string = req.params.id;

        await Task.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedAt: new Date(),
        })
        res.json({
            code: 200,
            message: "Xóa  thành công"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "không tồn tại!"
        })
    }

};
