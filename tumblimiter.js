var items, postCounts, toCheck, indecesChecked
loadTumblimitr()

function handlePostInserted() {
	var posts = document.getElementsByClassName('post')
	var post, liItem
	toCheck = {}
	for(var i=0; i<posts.length; i++) {
		post = posts[i]
		liItem = post.parentNode
		if(!$(liItem).hasClass('post_container') || $(liItem).index() <= indecesChecked)
			continue;
		var user = post.getAttribute('data-tumblelog-name')
		toCheck[post.id] = user
	}
	checkPosts()
}

function checkPosts() {
	for(var id in toCheck) {
		liItem = document.getElementById(id).parentNode
		indecesChecked = $(liItem).index()		
		var user = toCheck[id]
		if(user in items) {
			filterPost(id, user)
		}
		delete toCheck[id]		
	}
}

function filterPost(id, user) {
	var frequency = items[user]
	postCounts[user]++
	var postCount = postCounts[user]
	var remove = false
	switch(frequency) {
		case 0: 
			remove = true
			break;
		case 10:
			if(postCount % 10 !== 1) 
				remove = true
			break;
		case 25: 
			if(postCount % 4 !== 1)
				remove = true
			break;
		case 50:
			if(postCount % 2 === 0)
				remove = true
			break;
		case 75:
			if(postCount % 4 === 0)
				remove = true
			break;
		default: break;
	}
	if(remove) {
		//$('#'+id).attr('style','width:100px')
		$('#'+id).remove()
	}
}


function loadTumblimitr() {
	postCounts = {}
	toCheck = {}
	items = {}
	indecesChecked = -1
	chrome.storage.sync.get(function(data) {
		items = data['items']
		if(typeof items==="undefined")
			items={}

		for(var user in items) {
			postCounts[user] = 0
		}
		putNodesInTheShire()

	});
}




/* (Below is not code that I wrote - it originates from Tumblr Savior and addresses creating an event for posts being added as the user scrolls. */

function createStyle(styleId) {
	var elmStyle = document.createElement('style');
	elmStyle.type = 'text/css';
	elmStyle.id = styleId;

	return elmStyle;
}

function addGlobalStyle(styleId, newRules) {
	var elmHead, cStyle, hadStyle, i, newRule;

	elmHead = document.getElementsByTagName('head')[0];

	if (!elmHead) {
		return;
	}

	cStyle = document.getElementById(styleId);

	hadStyle = !!cStyle;

	cStyle = cStyle || createStyle(styleId);

	while (cStyle.sheet && cStyle.sheet.cssRules.length) {
		cStyle.sheet.deleteRule(0);
	}

	if (cStyle.innerText) {
		cStyle.innerText = '';
	}

	for (i = 0; i < newRules.length; i += 1) {
		newRule = newRules[i];
		if (cStyle.sheet && cStyle.sheet.cssRules[0]) {
			cStyle.sheet.insertRule(newRule, 0);
		} else {
			cStyle.appendChild(document.createTextNode(newRule));
		}
	}

	if (!hadStyle) {
		elmHead.appendChild(cStyle);
	}
}

function putNodesInTheShire() {
	var cssRules = [];

	document.addEventListener('animationstart', handlePostInserted, false);
	document.addEventListener('webkitAnimationStart', handlePostInserted, false);

	cssRules.push(
		'@keyframes nodeInserted {' +
		'    from { clip: rect(1px, auto, auto, auto); }' +
		'    to { clip: rect(0px, auto, auto, auto); }' +
		'}'
	);

	cssRules.push(
		'@-moz-keyframes nodeInserted {' +
		'    from { clip: rect(1px, auto, auto, auto); }' +
		'    to { clip: rect(0px, auto, auto, auto); }' +
		'}'
	);

	cssRules.push(
		'@-webkit-keyframes nodeInserted {' +
		'    from { clip: rect(1px, auto, auto, auto); }' +
		'    to { clip: rect(0px, auto, auto, auto); }' +
		'}'
	);

	cssRules.push(
		'li.post_container div.post, li.post, ol.posts li {' +
		'    animation-duration: 1ms;' +
		'    -moz-animation-duration: 1ms;' +
		'    -webkit-animation-duration: 1ms;' +
		'    animation-name: nodeInserted;' +
		'    -moz-animation-name: nodeInserted;' +
		'    -webkit-animation-name: nodeInserted;' +
		'}'
	);

	addGlobalStyle('shire', cssRules);
}