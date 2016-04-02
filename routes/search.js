var express = require('express');
var router = express.Router();
var connector = new require('../db/dbconnector')();
var errorResponse = new require('../utilities/error_response')();
var Utility = new require('../utilities')();
var config = require('../config');

router.route('/search')
	.get(function (request, response) {

        var page = parseInt(request.query.page);
        var elementCount = parseInt(request.query.count);
        var paginationConfig = Utility.getPaginationConfig(request.query);
        var sortConfig = Utility.getSortConfig(request.query);

		var entity = request.query.entity;
		var query = request.query.q;
		delete request.query.q;
		delete request.query.entity;
		var filters = Utility.getFilters(request.query);

		connector.getSearchTerm(function (err, search_items, totalSearchResults) {

			if (err) {
				errorResponse.sendErrorResponse(response, 404, "Not Found", "The requested resource could not be found");
			} else {

				search_items = Utility.getFormattedResponse(search_items);
                if (isNaN(elementCount)) {

                    page=1;
                    elementCount = config.defaultLimit;
                }
                console.log(totalSearchResults);
				if (totalSearchResults > elementCount) {
					search_items.data.pages = [];
					var lastPage = totalSearchResults / elementCount;
					if (page < lastPage) {
						search_items.data.pages.push(Utility.getNextPage(request.url, parseInt(page) + 1, elementCount));
					}
					if (page > 1) {
						search_items.data.pages.push(Utility.getPreviousPage(request.url, parseInt(page) - 1, elementCount));
					}
				}

				search_items.data.collection_size =  totalSearchResults;
				response.status(200).json(search_items);
			}
		}, query, entity, filters, paginationConfig, sortConfig);
		});

module.exports = router;