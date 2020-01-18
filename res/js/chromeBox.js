"use strict";

// Chrome Box
var $box = undefined;

(function(){

	// Chrome Box
	const chromeBox = {

		info : {
			version : "1.0",
			name : "Chrome Box",
		},

		manifest : chrome.runtime.getManifest(),

		notify : (msg)=>{
			let defaultConfig = {
				type: 'basic',
				iconUrl : "/res/images/logo.png",
				title : '',
				message: msg
			};
			if (typeof msg === "object") {
				let defaultConfig = {...defaultConfig,msg};
			}
			let notificationId = Math.ceil(Math.random()*100).toString()
			chrome.notifications.create(notificationId,defaultConfig);
		},

		// ------------------ Local -----------------

		localName : chrome.runtime.getManifest().name.replace(/ /g,'_')+"_local_",

		getLocal : (callback, name="default")=>{
			name = $box.localName+name;
			chrome.storage.local.get(name,(fromChromeLocal)=>{
				console.log(fromChromeLocal[name]);
				if (fromChromeLocal[name]) {
					callback(fromChromeLocal[name]);
				}else{
					console.log("Local is not defined in getLocal()");
				}
			});
		},

		setLocal : (data, name="default")=>{
			name = $box.localName+name;
			let collect = {}
			collect[name] = data;
			console.log(data);
			chrome.storage.local.set(collect);
		},

		updateLocal : (newData)=>{
			$box.getLocal((oldData)=>{
				let updatedData = Object.assign(oldData,newData);
				console.log(updatedData);
				$box.setLocal(updatedData);
			});
		},

		flushLocal : (newData)=>{			
			$box.setLocal({});
		},

		onLocalChange : (callback)=>{
			chrome.storage.local.onChanged.addListener((r)=>{
				callback(r)
			});
		},

		addBadge : (text)=>{
			chrome.browserAction.setBadgeText({
				text :text
			});
		},

		// ------------ Broadcast and Listen -------------
		broadcastToContentScript : (data)=>{
			let defaultData = {listenFor:name};
			data = {...defaultData,...data};

			// If Chrome Tabs is defined means this can't be fired from content.js
			if (chrome.tabs) {
				chrome.tabs.query({currentWindow: true,active: true}, (tabs)=>{
					chrome.tabs.sendMessage(tabs[0].id, data)
				});
			}
		},

		listen : (callback)=>{
			chrome.runtime.onMessage.addListener(callback);
		},

		broadcast : (data) =>{
			chrome.runtime.sendMessage(data);
			$box.broadcastToContentScript(data);
		},

		// ------------ Do and Doing -------------
		do:(what,data)=>{
			$box.broadcast({what:what,data:data});
		},

		doing:(callback)=>{
			$box.listen((r)=>{
				callback(r.what,r.data);
			});
		},

		// Link
		openLink : {

			inBackground : (link)=>{
				chrome.tabs.create({url: link, active: false});
			},
			inForeground : (link)=>{
				chrome.tabs.create({url: link, active: true});
			}

		},

		// Context Menu
		createMenu: (options = {id : "default",title : "I'm Awesome",contexts : ['page']})=>{
			chrome.contextMenus.create(options);
		},

		onMenuClick: (menuId,callback)=>{
			chrome.contextMenus.onClicked.addListener(function(e){
				if (e.menuItemId==menuId) {
					callback()
				}
			});
		},

		activeTab: (callback)=>{
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				callback(tabs[0]);
			});
		}


}; // Chrome Box Ends

$box = typeof $box === "undefined" ? chromeBox : console.error("$box is already defined");

})();


// If Chrome Box Started
if ($box.info.name) {
	console.log(`%c ${$box.info.name} v${$box.info.version} `,`background:#3B83C0;color:white;padding:5px;`+`border-radius:1.4em;`,' ~ Making Chrome Extension easy for you!');
}else{
	console.error("Failed to load Chrome Box");
}