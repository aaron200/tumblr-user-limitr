var maxRow = 999
$(document).ready(function() {
	//chrome.storage.sync.clear()
	fillData()
	listenForAdd()
})

function listenForAdd() {
	$("#addBtn").click(function(event) {
		var newItem = $(event.target).siblings()[0].value
		if(newItem==="")
			return;
		chrome.storage.sync.get(function(data) {
			var newPercentage = $(event.target).siblings()[1].value

			var row = $(event.target).parent()
			var items = data['items']
			var itemCount = data['item_count']

			newPercentage = parseInt(newPercentage)
			if(typeof items==="undefined" || items==={}) {
				items = {}
				itemCount = 0
			}
			items[newItem] = newPercentage
			itemCount++
			maxRow++
			chrome.storage.sync.set({'items':items})
			chrome.storage.sync.set({'item_count':itemCount})
			
			var removeButton = "<img src='remove_button.png' id='removeBtn"+maxRow+"' alt='x' height='15' width='15' style='cursor:pointer'>"
			$(row).prepend(removeButton)
			$('#removeBtn'+maxRow).click(function(event) {
				removeItem(event)
			})
			var select = $('#removeBtn'+maxRow).siblings()[1];
			
			$(select).change(function() {
				var dropdown = $(this)
				chrome.storage.sync.get(function(data) {
					var items = data['items']
					var toModify = dropdown.siblings()[1].value
					items[toModify] = parseInt(dropdown.val())
					chrome.storage.sync.set({'items':items})
				});
				
			})
			
			addRow(maxRow+1, true)
		}) 
	})
}

function addRow(rowNum, last) {
	var form =   "<form id='row"+rowNum+"'>"
			+	 "<input type='text' name='item' style='margin-right:50px; width:100px;'>"
			+	 "<select id='select"+rowNum+"'>"
			+	 " <option value='75'>75%</option>"
			+	 " <option value='50' selected='selected'>50%</option>"
			+	 " <option value='25'>25%</option>"
			+	 " <option value='10'>10%</option>"
	//		+	 " <option value='0'>0%!</option>"
			+	"</select>"			
			+"</form>"
	$("#rows").append(form) 
	row = $('#row'+rowNum)
	if(last) {
		$(row).append($('#addBtn'))
		$('#addBtn').attr('style','display:inline')
	}
	else {		
		var removeButton = 	"<img src='remove_button.png' id='removeBtn"+rowNum+"' alt='x' height='15' width='15' style='cursor:pointer'>"
		$(row).prepend(removeButton)
		$('#removeBtn'+rowNum).click(function(event) {
			removeItem(event)
		})
		$('#select'+rowNum).change(function() {
			var select = $(this)
			chrome.storage.sync.get(function(data) {
				var items = data['items']
				var toModify = select.siblings()[1].value
				items[toModify] = parseInt(select.val())
				chrome.storage.sync.set({'items':items})
			});
			
		}) 
		
		
	}
	return $(row)
}

function removeItem(event) {
	chrome.storage.sync.get(function(data) {
		var items = data['items']
		var itemCount = data['item_count']
		var toRemove = $(event.target).siblings()[0].value
		delete items[toRemove]
		chrome.storage.sync.set({'items':items})
		chrome.storage.sync.set({'item_count':itemCount-1})
		$(event.target).parent().remove()
	});
}

function fillData() {
	chrome.storage.sync.get(function(data) {
		var items = data['items']
		var itemCount = data['item_count']
		if(typeof items=="undefined") {
			addRow(1, true)
			return;
		}
		var i = 1
		for(key in items) {
			var row = addRow(i,false)
			var textField = $(row).children()[1]
			var percentageField = $(row).children()[2]
			textField.value = key
			percentageField.value = items[key]
			i++		
		}
		addRow(i, true)
		maxRow = i
	})
}




