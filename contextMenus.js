// let contextList = ['selection','image','link','page'];

$box.createMenu({
	id:'extractUrl',
	title : "Restore closed tabs",
	contexts : ['page']
});

$box.onMenuClick('extractUrl',()=>{
	chrome.sessions.restore();
});