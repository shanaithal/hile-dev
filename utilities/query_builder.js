var config = require('../config');

var QueryBuilder = function () {

	return Object.create(QueryBuilder.prototype);
};

QueryBuilder.prototype.build = function (query_object, search_terms, required_fields, sortConfig, pagination_config) {

	var query = query_object.find(search_terms).select(required_fields);

	for (var key in sortConfig) {

		var sortObj = {};
		sortObj[key] = sortConfig[key];
		query.sort(sortObj);
	}

	//By default apply new first sort
	query.sort({createdAt: -1});
	if (pagination_config !== undefined && pagination_config !== null) {

		if (pagination_config.limit > config.maxCount) {
			pagination_config.skip = config.defaultSkip;
			pagination_config.limit = config.defaultLimit;
		}
		if (pagination_config.limit === undefined && pagination_config.skip === undefined) {
			pagination_config.skip = config.defaultSkip;
			pagination_config.limit = config.defaultLimit;
		}
		if (pagination_config.skip < 1) {
			pagination_config.skip = config.defaultSkip;
			pagination_config.limit = config.defaultLimit;
		}
		if (pagination_config.skip > 0) {
			pagination_config.skip = (pagination_config.skip - 1) * pagination_config.limit;
		}

		query.skip(pagination_config.skip).limit(pagination_config.limit);
	} else {

		query.skip(config.defaultSkip).limit(config.defaultLimit);
	}

	return query.lean();
};

module.exports = QueryBuilder;