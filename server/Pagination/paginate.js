module.exports = {
    paginate: (results, pageNumber, noOfRecordsPerPage) => {
        const page = parseInt(pageNumber)
        const limit = parseInt(noOfRecordsPerPage)

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const result = {};

        result.noOfEntries = results.length;

        result.results = results.splice(startIndex, limit)

        if (endIndex < result.noOfEntries) {
            result.next = {
                page: page + 1,
                limit: limit
            }
        }


        if (startIndex > 0) {
            result.previous = {
                page: page - 1,
                limit: limit
            }
        }
        return result;
    }
}