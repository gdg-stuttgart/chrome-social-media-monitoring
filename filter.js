function Filter() {
	this.query = "";
	this.threshold = 0;
	this.shortTermTweetsPerHour = 0;
	this.longTermTweetsPerHour = 0;
	this.serviceId = 'twitter';
	this.geo = null;
}

Filter.prototype.setQuery = function(query){
	this.query = query;
}

Filter.prototype.getQuery = function(){
	return this.query;
}
