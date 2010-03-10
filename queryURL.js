function QueryURL(baseURL, probeTag) {
	this._baseURL = baseURL;
	this._query = probeTag.query;
	this.timeIntervalInMS = undefined;
	this._latitude = probeTag.latitude;
	this._longtitude = probeTag.longtitude;
	this._radius = probeTag.radius;
}

QueryURL.prototype.getURL = function getURL() {
	if(period !== undefined)
		since =  'since='+ this.getSinceDate();
	
	if(this._latitude !== undefined && this._longtitude !== undefined && this._radius !== undefined)
		geoLoc = 'geocode=' + this._latitude + ',' + this._longtitude + ',' + this._radius + 'km';

	var queryURL = this._baseURL + escape(this._query !== undefined ? + this._query : throw "Error: query must be defined!"; 
									since !== undefined ? '&' + since : '' + 
									geoLoc !== undefined ? '&' + geoLoc : '');

	console.log('XHRQueryURL:' + queryURL);
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