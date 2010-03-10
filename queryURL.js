function QueryURL(baseURL, probeTag) {
	this._baseURL = baseURL;
	this._probe = probeTag;
	this._query = probeTag.query;
	this.timeIntervalInMS = undefined;
	this._latitude = probeTag.latitude;
	this._longtitude = probeTag.longtitude;
	this._radius = probeTag.radius;
}

QueryURL.prototype.getURL = function getURL() {
	var since = '';
	if(this.timeIntervalInMS !== undefined)
		since =  'since='+ escape(this.getSinceDate());
	
	var geoLoc = '';
	if(this._latitude !== undefined && this._longtitude !== undefined && this._radius !== undefined)
		geoLoc = 'geocode=' + escape(this._latitude + ',' + this._longtitude + ',' + this._radius + 'km');
	
	console.log('baseURL:' + this._baseURL);
	console.log('query:' + this._query !== undefined ? this._query : '');
	console.log('since:' + since !== '' ? '&' + since : since);
	console.log('geoLoc:' + geoLoc !== '' ? '&' + geoLoc : geoLoc);
	
	var urlQuery = this._query !== undefined ? 'q=' + this._query : '';
	var urlSince = since !== '' ? '&' + since : since;
	var urlGeoLoc = geoLoc !== '' ? '&' + geoLoc : geoLoc;
	
	queryURL = this._baseURL + urlQuery + urlSince + urlGeoLoc;
	console.log('XHRQueryURL:' + queryURL);
	return queryURL;
};

QueryURL.prototype.getSinceDate = function _getSinceDate() {
	var currentTime = new Date();
	console.log('currentTS: '+ currentTime.getTime() + ', Interval length: ' + this.timeIntervalInMS);
	var sinceDate = new Date(currentTime.getTime() - this.timeIntervalInMS);
	console.log('sinceTS: ' + sinceDate.getTime());
	var sinceYear = sinceDate.getFullYear();
	var sinceMonth = sinceDate.getMonth() >= 10 ? sinceDate.getMonth() : '0' + sinceDate.getMonth();
	var sinceDay = sinceDate.getDay() >= 10 ? sinceDate.getDay() : '0' + sinceDate.getDay();
	console.log('Since: ' + sinceYear + '-' + sinceMonth + '-' + sinceDay);
	return sinceYear + '-' + sinceMonth + '-' + sinceDay;
};