function QueryURL(baseURL, probeTag) {
	this.baseURL = baseURL;
	this.query = probeTag.query;
	this.period = undefined;
	this.latitude = probeTag.latitude;
	this.longtitude = probeTag.longtitude;
	this.radius = probeTag.radius;
}

QueryURL.prototype.getURL = function getURL() {
	if(period !== undefined)
		since =  'since='+ this.getSinceDate();
	
	if(this.latitude !== undefined && this.longtitude !== undefined && radius !== undefined)
		geoLoc = 'geocode=' + latitude + ',' + longtitude + ',' + radius + 'km';

	var queryURL = baseURL + escape(this.query !== undefined ? + this.query : throw "Error: query must be defined!"; 
									this.since !== undefined ? '&' + this.since : '' + 
									geoLoc !== undefined ? '&' + geoLoc : '');

	console.log('XHRQueryURL:' + queryURL);
};

QueryURL.prototype.getSinceDate = function _getSinceDate() {
	var currentTime = new Date();
	var timeIntervalInMS = period * 60 * 60 *1000;
	console.log('currentTS: '+ currentTime.getTime() + ', Interval length: ' + timeIntervalInMS);
	var sinceDate = new Date(currentTime.getTime() - timeIntervalInMS);
	console.log('sinceTS: ' + sinceDate.getTime());
	var sinceYear = sinceDate.getFullYear();
	var sinceMonth = sinceDate.getMonth() >= 10 ? sinceDate.getMonth() : '0' + sinceDate.getMonth();
	var sinceDay = sinceDate.getDay() >= 10 ? sinceDate.getDay() : '0' + sinceDate.getDay();
	console.log('Since: ' + sinceYear + '-' + sinceMonth + '-' + sinceDay);
	return sinceYear + '-' + sinceMonth + '-' + sinceDay;
};