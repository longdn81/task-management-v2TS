interface ObjectPagination  {
    limitItem: number,
    currentPage: number,
    skip? : number,
    totalPages? : number
}

const paginationHelper = (objectPagination : ObjectPagination ,query : Record<string ,any> ,countRecords: number):
ObjectPagination => {
    if(query.page) {
        objectPagination.currentPage = parseInt(query.page) ;
    }
    if(query.limit) {
        objectPagination.limitItem = parseInt(query.limit) ;
    }

    objectPagination.skip = (objectPagination.currentPage-1) * objectPagination.limitItem ;
    
    const totalPages = Math.ceil(countRecords/objectPagination.limitItem) ;
    
    objectPagination.totalPages = totalPages ;
    
    return objectPagination ;
}

export default paginationHelper ;