var timer = null;
var version = "0.1.1";
var show_options_page = true;
var eventsCount = -1;
var maxProbesLimit = 7;
var alreadyAlerted = false;
var markers = {}; // array of marked probes
const ALERT_RATIO = 3;

var settings = {
	get pollInterval() {
        if(localStorage['poll'] == 'NaN') return 1000 * 60 * 30;
		return localStorage['poll'] || 1000 * 60 * 30;
	},
	set pollInterval(val) {
		localStorage['poll'] = val;
	},
	get timeout() {
        return 1000*15;
	},
	set timeout(val) {
		localStorage['timeout'] = val;
	},
	get soundAlert() {
        return localStorage['sound_alert'];
	},
	set soundAlert(val) {
		localStorage['sound_alert'] = val;
	},

	/*
	 * default longitude
	 */
	get latitude() {
        return localStorage['latitude'];
	},
	set latitude(val) {
		localStorage['latitude'] = val;
	},

	/*
	 * default longitude
	 */
	get longitude() {
        return localStorage['longitude'];
	},
	set longitude(val) {
		localStorage['longitude'] = val;
	},

	/*
	 * default longitude
	 */
	get radius() {
        return localStorage['radius'];
	},
	set radius(val) {
		localStorage['radius'] = val;
	},
	
	get isFirstRun(){
		if(localStorage["version"] == null){
			return true;
		}
		return false;
	},

	get hideProbeLabels() {
        return localStorage['options_hide_probe_labels'];
	},
	set hideProbeLabels(val) {
		localStorage['options_hide_probe_labels'] = val;
	},
	
	/*
	 * default global_threshold_ratio
	 */
	get thresholdRatio() {
		if(localStorage["options_global_threshold_ratio"] == null || localStorage["options_global_threshold_ratio"] == undefined || localStorage["options_global_threshold_ratio"] == "undefined"){
			localStorage["options_global_threshold_ratio"] = ALERT_RATIO;
		}
        return localStorage['options_global_threshold_ratio'];
	},
	set thresholdRatio(val) {
		localStorage['options_global_threshold_ratio'] = val;
	}
	
}

function pluginInit() {
	showNoEvents();
	  
    if(show_options_page && (localStorage["version"] == null || localStorage["version"] != version)) {
    	populateExampleData();// on first run
    	localStorage["version"] = version;
        chrome.tabs.create({url : "options.html"});        
    } else if(show_options_page == false && (localStorage["version"] == null || localStorage["version"] != version)) {
		localStorage["version"] = version;
	}
	startRequest();
}

function populateExampleData(){
	/*
	 * set example values probes
	 */
	localStorage["probes"] = '{"DD24EC051A604188B611C8E92CE9B679":{"id":"DD24EC051A604188B611C8E92CE9B679","query":"earthquake","threshold":0,"shortTermTweetsPerMin":5.6000000000000005,"longTermTweetsPerMin":4.362914182350616,"serviceId":"twitter","searchQuery":"http://search.twitter.com/search.json?&q=","state":1},"CFBA803F393348F183575CFE2E1A7F2A":{"id":"CFBA803F393348F183575CFE2E1A7F2A","query":"gtugbattle","threshold":0,"shortTermTweetsPerMin":0.015043235198161718,"longTermTweetsPerMin":0.0021098137151584176,"serviceId":"twitter","searchQuery":"http://search.twitter.com/search.json?&q=","state":1,"latitude":"51.16569","longitude":"10.45153","radius":"200","locationAddress":"Germany"},"5700AD36547C44FB8E29BFC5E08DCEDB":{"id":"5700AD36547C44FB8E29BFC5E08DCEDB","query":"nexusone","threshold":0,"shortTermTweetsPerMin":0.002115316431176494,"longTermTweetsPerMin":0.003802670455748913,"serviceId":"twitter","searchQuery":"http://search.twitter.com/search.json?&q=","state":1,"latitude":"37.38605","longitude":"-122.08385","radius":"80","locationAddress":"Mountain View"}}';
}

function refresh() {
	showNoEvents();
	  resetTimer();
	  pluginInit();
}

chrome.tabs.onUpdated.addListener(function(method) {

	if (method.UpdateProbes){
		console.log("update probes...");
		updateProbes();
	}

});

function goOptions() {
	chrome.tabs.create({url : "options.html"}); 
}

function scheduleRequest() {
    timer = window.setTimeout(startRequest, settings.pollInterval);
}

function startRequest() {
	updateProbes();
	scheduleRequest();
}

function updateProbes(callback) {
	alreadyAlerted = false;
	if (callback && typeof(callback) === 'function'){
		getProbesCount(function(count) { callback(count); updateEventsCount(count); }, showNoEvents);
	}else{
		getProbesCount(updateEventsCount, showNoEvents);
	}
}

function resetTimer() {
  if(timer != null) {
    clearTimeout(timer);
  }
}

function refresh() {
  showNoEvents();
  resetTimer();
  pluginInit();
}

function getProbesCount(onSuccess, onError) {

	var probesCount = probeManager.countProbes();

	if(probesCount == 0){
		showNoActiveProbes();
		if (onSuccess){
			  onSuccess(0);
		}
		return false;
	}
	
	var probes = probeManager.loadProbes();
	/*
	 * hier werden die updates getriggert und long und short term tweets geladen
	 * und GUI nomral mit events informiert. Da asyncer call stimmt der tweet
	 * count unten evtl nicht...
	 */
	if(probes){
		for (var i in probes) {
			loadTweets(probes[i]);
		}
	}
	
// if (onSuccess){
// onSuccess(2);
// }
	
}

function showNoEvents() {
	chrome.browserAction.setIcon({"path":"img/icon.png"});
	// chrome.browserAction.setBadgeBackgroundColor({color:[190, 190, 190,
	// 230]});
	chrome.browserAction.setBadgeText({text:""});
	eventsCount = 0;
}

function showNoActiveProbes() {
	chrome.browserAction.setIcon({"path":"img/icon_nonew.png"});
	chrome.browserAction.setBadgeBackgroundColor({color:[190, 190, 190, 230]});
	chrome.browserAction.setBadgeText({text:""});
	eventsCount = 0;
}

function updateEventsCount(count) {
	  
	eventsCount = count;

	if(eventsCount > 0){
		chrome.browserAction.setIcon({"path":"img/icon.png"});
		chrome.browserAction.setBadgeBackgroundColor({color:[255,0,0,255]});
		chrome.browserAction.setBadgeText({text: "" + eventsCount});
		
		if(settings.soundAlert && !alreadyAlerted){
			
			console.log('rrrriiiiinnnnggg');
				
			pingSound = document.createElement('audio');
			pingSound.setAttribute('src', settings.soundAlert);
			pingSound.setAttribute('id', 'ping');
			pingSound.load();
			pingSound.play();
			
			alreadyAlerted = true;
			    
		}
	}else{
		showNoEvents();
	}
			
}

function onNewEvent(probe){
	
	if(markers[probe.id]){
		/*
		 * refresh marker timestamp
		 */
		markers[probe.id] = new Date().getTime();
		return false;
	}
	
	/*
	 * add activate marker
	 */
	markers[probe.id] = new Date().getTime();
	        
	updateEventsCount(countMarkers());
}
function resetAlerts(){
	resetMarkers();
	showNoEvents();
	alreadyAlerted = false;
}

function resetMarkers() {
	for (var j in markers) {
		delete markers[j] 
	}
}

function countMarkers(){
	count = 0;
	for (var j in markers) {
		count++;
	}
	return count;
}

function ifMarkerSet(id){
	try {
		if(markers[id]){
			delete markers[id]; 
			return true;
		}else{
			return false;
		}
	} catch (e) {
		return false;
	}
}


