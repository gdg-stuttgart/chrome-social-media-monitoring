var timer = null;
var version = "0.1";
var show_options_page = true;
var eventsCount = -1;


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
	}

	
}

function pluginInit() {
	showNoEvents();
	  
    if(show_options_page && (localStorage["version"] == null || localStorage["version"] != version)) {
        localStorage["version"] = version;
        chrome.tabs.create({url : "options.html"});        
    } else if(show_options_page == false && (localStorage["version"] == null || localStorage["version"] != version)) {
		localStorage["version"] = version;
	}
	startRequest();
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

	
	var probeTags = probeManager.loadProbes();

	console.log('TODO: add communication with background.html\n port.postMessage({probeTagLoad: tagProbe})');
		
	if(probeTags){
		var count = 0;
		for (var i in probeTags) {
			count++;
			chrome.browserAction.setBadgeText({text:"" + count});
		}
		if (count > eventsCount){
			chrome.browserAction.setIcon({"path":"img/icon.png"});
			chrome.browserAction.setBadgeBackgroundColor({color:[255,0,0,255]});
			chrome.browserAction.setBadgeText({text: "" + count});
		
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
		}
		
	}else{
		chrome.browserAction.setIcon({"path":"img/icon_nonew.png"});
		chrome.browserAction.setBadgeBackgroundColor({color:[190, 190, 190, 230]});
		chrome.browserAction.setBadgeText({text:"\u203c"});
	}
}

function showNoEvents() {
	chrome.browserAction.setIcon({"path":"img/icon_nonew.png"});
	chrome.browserAction.setBadgeBackgroundColor({color:[190, 190, 190, 230]});
	chrome.browserAction.setBadgeText({text:"?"});
	eventsCount = -1;
}

function updateUnreadCount(count) {
	  if (eventsCount != count) {
	  
		  eventsCount = count;
		  chrome.browserAction.setIcon({"path":"img/icon.png"});
		  chrome.browserAction.setBadgeBackgroundColor({color:[190, 190, 190, 230]});
		  chrome.browserAction.setBadgeText({text:"?"});
			
	  }
	}

