var mongoose = require('mongoose');

var searchLogSchema = mongoose.Schema({

	email: {
		type: String
	},
	search: [{
		keyword: String,
		timestamp: Number
	}]
});

searchLogSchema.index({
		email: 1
	},
	{
		unique: true
	});

module.exports = mongoose.model('SearchLog', searchLogSchema);
