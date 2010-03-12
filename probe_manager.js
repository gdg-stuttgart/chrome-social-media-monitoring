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

		if (probe.id == undefined){
			probe.id = this._createUUID();
		}
		
		probes[escape(probe.id)] = probe;

		localStorage['probes'] = JSON.stringify(probes);

		// window.localStorage.setItem('probes', probes);
	} catch (e) {
		console.log("Error writing probe to localstorage");
		console.log(e);
	}
}

ProbeManager.prototype.removeProbeById = function(id) {
	console.log('remove Probe:' + id);
	try {

		var probes = JSON.parse(localStorage['probes']);

		/*
		 * added probes if not exist
		 */
		if (!probes) {
			console.log('No probe found[' + id + ']:');
			return null;
		}

		var probe = probes[escape(id)];

		if (probe) {
			delete probes[escape(id)];
			localStorage['probes'] = JSON.stringify(probes);
			return true;
		}

	} catch (e) {
		console.log("Error getting item to localstorage for id:" + id);
		console.log(e);
		return null;
	}
}

ProbeManager.prototype.getProbeById = function(id) {
	console.log('get Probe:' + id);
	try {

		var probes = JSON.parse(localStorage['probes']);

		/*
		 * added probes if not exist
		 */
		if (!probes) {
			console.log('No probe found[' + id + ']:');
			return null;
		}

		var probe = probes[escape(id)];

		if (probe) {
			return probe;
		}

	} catch (e) {
		console.log("Error getting item to localstorage for id:" + id);
		console.log(e);
		return null;
	}
}

ProbeManager.prototype._createUUID = function() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789ABCDEF";
    for (var i = 0; i < 32; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[12] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1);  // bits 6-7 of the
														// clock_seq_hi_and_reserved
														// to 01

    var uuid = s.join("");
    return uuid;
}
