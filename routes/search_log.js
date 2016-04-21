var express = require('express');
var router = express.Router();
var connector = new require('../db/dbconnector')();
var errorResponse = new require('../utilities/error_response')();
var Utility = new require('../utilities')();

router.route('/search_log')
	.get(function (request, response) {

		// get all the existing search logs
		connector.getSearchLog(function (responseObj) {

			if (responseObj.code == 500) {
				errorResponse.sendErrorResponse(response, responseObj.code, responseObj.message, responseObj.description);
			} else {

				search_logs = Utility.getFormattedResponse(responseObj.message);
				response.status(200).json(search_logs);
			}
		});
	})
	.post(function (request, response) {

		if (request.body.keyword) {
			var searchObj = {
				email: request.body.email || null,
				keyword: request.body.keyword
			}

			// create a new search log

			connector.addSearchLog(function (responseObj) {

				if (responseObj.code == 500) {
					errorResponse.sendErrorResponse(response, responseObj.code, responseObj.message, responseObj.description);
				} else {
					response.status(responseObj.code).json(responseObj);
				}
			}, searchObj);
		} else {
			errorResponse.sendErrorResponse(response, 400, "Bad Request", "No keyword provided");
		}

	});

module.exports = router;
