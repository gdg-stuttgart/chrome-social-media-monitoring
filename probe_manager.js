function ProbeManager() {
	this.probesCache = {};
}

ProbeManager.prototype.loadProbes = function() {
	try {
		if(localStorage['probes']){
			return JSON.parse(localStorage['probes']);		
		}else{
			probes = new Object();
			localStorage['probes'] = JSON.stringify(probes);
		}
	} catch (e) {
		// TODO: handle exception
	}
};

ProbeManager.prototype.setProbe = function(probe) {
	try {
		console.log('Set Probe:[' + probe.serviceId + '_' + probe.query
				+ ']');

		var probes = JSON.parse(localStorage['probes']);

		/*
		 * added probes if not exist
		 */
		if (!probes) {
			probes = new Object();
			window.localStorage.setItem('probes', probes);
			console.log('No probes found add create new probes array');
		}

		probes[probe.serviceId + '_' + probe.query] = probe;

		localStorage['probes'] = JSON.stringify(probes);

		// window.localStorage.setItem('probes', probes);
	} catch (e) {
		console.log("Error writing probe to localstorage");
		console.log(e);
	}
}

ProbeManager.prototype.getProbe = function(key) {
	console.log('Get Probe:' + key);
	try {

		var probes = JSON.parse(localStorage['probes']);

		/*
		 * added probes if not exist
		 */
		if (!probes) {
			console.log('No probe found[' + key + ']:');
			return null;
		}

		var probe = probes[escape(key)];

		return probe;

	} catch (e) {
		console.log("Error getting item to localstorage for key:" + key);
		console.log(e);
		return null;
	}

}

ProbeManager.prototype.removeProbeByKey = function(key) {
	console.log('remove Probe:' + key);
	try {

		var probes = JSON.parse(localStorage['probes']);

		/*
		 * added probes if not exist
		 */
		if (!probes) {
			console.log('No probe found[' + key + ']:');
			return null;
		}

		var probe = probes[escape(key)];

		if (probe) {
			delete probes[escape(key)];
			localStorage['probes'] = JSON.stringify(probes);
			return true;
		}

	} catch (e) {
		console.log("Error getting item to localstorage for key:" + key);
		console.log(e);
		return null;
	}

}