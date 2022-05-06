"use strict";

function listener(details) {
	const url = new URL(details.url);
	url.searchParams.set("confetti", "true");

	return {
		redirectUrl: url.href,
	};
}

function update() {
	chrome.storage.sync.get({
		hosts: ["*.instructure.com"],
	}, ({hosts}) => {
		const urls = hosts.map(host => "https://" + host + "/*/assignments/*");

		if (chrome.webRequest.onBeforeRequest.hasListener(listener)) chrome.webRequest.onBeforeRequest.removeListener(listener);

		chrome.webRequest.onBeforeRequest.addListener(listener, {
			urls,
			types: ["main_frame"]
		}, ["blocking"]);
	});
}

update();

chrome.runtime.onMessage.addListener(update);
