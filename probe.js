function Probe() {
	this.query = "";
	this.threshold = 0;
	this.shortTermTweetsPerHour = 0;
	this.longTermTweetsPerHour = 0;
	this.serviceId = 'twitter';
	this.geo = null;
	this.searchQuery = "http://search.twitter.com/search.json?&q=" + this.query;

}

Probe.prototype.setQuery = function(query){
	this.query = query;
}

Probe.prototype.getQuery = function(){
	return this.query;
}
