var express = require('express');
var router = express.Router();
var connector = new require('../db/dbconnector')();
var errorResponse = new require('../utilities/error_response')();
var Utility = new require('../utilities')();

router.route('/search')
	.get(function (request, response) {

		var pageNumber = queryObject.page;
		var elementCount = queryObject.count;
		var paginationConfig = Utility.getPaginationConfig(request.query);
		var sortConfig = Utility.getSortConfig(request.query);

		var entity = request.query.entity;
		var query = request.query.q;
		delete request.query.q;
		delete request.query.entity;
		var filters = Utility.getFilters(queryObject);

		connector.getSearchTerm(function (err, search_items, totalSearchResults) {

			if (err) {
				errorResponse.sendErrorResponse(response, 404, "Not Found", "The requested resource could not be found");
			} else {

				search_items = Utility.getFormattedResponse(search_items);
				if (totalSearchResults > elementCount) {
					search_items.data.pages = [];
					var lastPage = totalSearchResults / elementCount;
					if (pageNumber < lastPage) {
						search_items.data.pages.push(Utility.getNextPage(request.url, parseInt(pageNumber) + 1, elementCount));
					}
					if (pageNumber > 1) {
						search_items.data.pages.push(Utility.getPreviousPage(request.url, parseInt(pageNumber) - 1, elementCount));
					}
				}

				search_items.data.collection_size =  totalSearchResults;
				response.status(200).json(search_items);
			}
		}, query, entity, filters, paginationConfig, sortConfig);
		});

module.exports = router;