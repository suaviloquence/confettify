"use strict";

document.addEventListener("DOMContentLoaded", () => {
	const prefs = document.getElementById("prefs");
	const other = document.getElementById("other");
	const add = document.getElementById("add");

	const ul = prefs.firstElementChild;

	let i = 0;

	function create(host) {
		i++;
		const li = document.createElement("li");

		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.checked = true;
		checkbox.id = i;
		checkbox.value = host;
		checkbox.name = "host";

		const label = document.createElement("label");
		label["for"] = i;
		label.textContent = host;

		li.appendChild(checkbox);
		li.appendChild(label);

		ul.insertBefore(li, ul.lastElementChild);
	}

	chrome.storage.sync.get({
		hosts: ["*.instructure.com"],
	}, ({hosts}) => hosts.forEach(create));

	prefs.onsubmit = (e) => {
		e.preventDefault();

		const hosts = new FormData(prefs).getAll("host");

		chrome.permissions.request({origins: hosts.map(host => "https://" + host + "/*/assignments/*")}, accepted => {
			if (!accepted) return alert("This is required!");
			chrome.storage.sync.set({hosts}, () => {
				chrome.runtime.sendMessage({});
				ul.querySelectorAll("input[type=checkbox]").forEach(e => {
					if (!e.checked) {
						ul.removeChild(e.parentElement);
					}
				});
			});
		});


	};

	other.onsubmit = (e) => {
		e.preventDefault();
		create(add.value);
		add.value = "";
	};
});
