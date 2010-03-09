function FilterManager() {
	this.filtersCache = {};
}

FilterManager.prototype.loadFilters = function() {
	try {
		if(localStorage['filters']){
			return JSON.parse(localStorage['filters']);		
		}else{
			filters = new Object();
			localStorage['filters'] = JSON.stringify(filters);
		}
	} catch (e) {
		// TODO: handle exception
	}
};

FilterManager.prototype.setFilter = function(filter) {
	try {
		console.log('Set Filter:[' + filter.serviceId + '_' + filter.query
				+ ']');

		var filters = JSON.parse(localStorage['filters']);

		/*
		 * added filters if not exist
		 */
		if (!filters) {
			filters = new Object();
			window.localStorage.setItem('filters', filters);
			console.log('No filters found add create new filters array');
		}

		filters[filter.serviceId + '_' + filter.query] = filter;

		localStorage['filters'] = JSON.stringify(filters);

		// window.localStorage.setItem('filters', filters);
	} catch (e) {
		console.log("Error writing filter to localstorage");
		console.log(e);
	}
}

FilterManager.prototype.getFilter = function(key) {
	console.log('Get Filter:' + key);
	try {

		var filters = JSON.parse(localStorage['filters']);

		/*
		 * added filters if not exist
		 */
		if (!filters) {
			console.log('No filter found[' + key + ']:');
			return null;
		}

		var filter = filters[escape(key)];

		return filter;

	} catch (e) {
		console.log("Error getting item to localstorage for key:" + key);
		console.log(e);
		return null;
	}

}

FilterManager.prototype.removeFilterByKey = function(key) {
	console.log('remove Filter:' + key);
	try {

		var filters = JSON.parse(localStorage['filters']);

		/*
		 * added filters if not exist
		 */
		if (!filters) {
			console.log('No filter found[' + key + ']:');
			return null;
		}

		var filter = filters[escape(key)];

		if (filter) {
			delete filters[escape(key)];
			localStorage['filters'] = JSON.stringify(filters);
			return true;
		}

	} catch (e) {
		console.log("Error getting item to localstorage for key:" + key);
		console.log(e);
		return null;
	}

}