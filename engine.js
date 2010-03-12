var timer = null;
var version = "0.2";
var show_options_page = true;
var eventsCount = -1;
var maxProbesLimit = 9;



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
	
	get isFirstRun(){
		if(localStorage["version"] == null){
			return true;
		}
		return false;
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
	 * TODO: set example values from final release
	 */
	localStorage["probes"] = '{"843B7DA67FF1445287321462ABEA7375":{"id":"843B7DA67FF1445287321462ABEA7375","query":"gtugna","threshold":0,"shortTermTweetsPerHour":0.2,"longTermTweetsPerHour":0,"serviceId":"twitter","searchQuery":"http://search.twitter.com/search.json?&q="},"671F7B1266E94CA296B2313584D2D503":{"id":"671F7B1266E94CA296B2313584D2D503","query":"gtug","threshold":0,"shortTermTweetsPerHour":0.2,"longTermTweetsPerHour":0,"serviceId":"twitter","searchQuery":"http://search.twitter.com/search.json?&q="},"A6ED7BB95CCA425BB486565486BCE7B7":{"id":"A6ED7BB95CCA425BB486565486BCE7B7","query":"nexusone","threshold":0,"shortTermTweetsPerHour":0.2,"longTermTweetsPerHour":0.30442371340378577,"serviceId":"twitter","searchQuery":"http://search.twitter.com/search.json?&q="}}';
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
	if (callback && typeof(callback) === 'function'){
		getProbesCount(function(count) { callback(count); updateUnreadCount(count); }, showNoEvents);
	}else{
		getProbesCount(updateUnreadCount, showNoEvents);
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

function updateProbes(callback) {
	if (callback && typeof(callback) === 'function')
		getProbesCount(function(count) { callback(count); updateUnreadCount(count); }, showNoEvents);
	else
		getProbesCount(updateUnreadCount, showNoEvents);
}


function getProbesCount(onSuccess, onError) {
	probesArray = new Array();
	/*
	 * TODO: Refresh all probes
	 */

	// XXX Dummy action

	
	var probesCount = probeManager.countProbes();

	console.log('TODO: add communication with background.html\n port.postMessage({probeTagLoad: tagProbe})');
	console.log('probesCount:' + probesCount + ' eventsCount:' + eventsCount);
	
	if(probesCount > 0 && eventsCount > 0){
			chrome.browserAction.setIcon({"path":"img/icon.png"});
			chrome.browserAction.setBadgeBackgroundColor({color:[255,0,0,255]});
			chrome.browserAction.setBadgeText({text: "" + eventsCount});
		
			if(settings.soundAlert){
				/*
				 * TODO: Add sound alert
				 */
				console.log('rrrriiiiinnnnggg');
				
				pingSound = document.createElement('audio');
			    pingSound.setAttribute('src', settings.soundAlert);
			    pingSound.setAttribute('id', 'ping');
			    pingSound.load();
			    pingSound.play();
			    
			}
	}else{
		showNoEvents();
	}
}

function showNoEvents() {
	chrome.browserAction.setIcon({"path":"img/icon_nonew.png"});
	chrome.browserAction.setBadgeBackgroundColor({color:[190, 190, 190, 230]});
	chrome.browserAction.setBadgeText({text:"?"});
	eventsCount = 0;
}

function updateUnreadCount(count) {
	  if (eventsCount != count) {
	  
		  eventsCount = count;
		  chrome.browserAction.setIcon({"path":"img/icon.png"});
		  chrome.browserAction.setBadgeBackgroundColor({color:[190, 190, 190, 230]});
		  chrome.browserAction.setBadgeText({text:"?"});
			
	  }
}

