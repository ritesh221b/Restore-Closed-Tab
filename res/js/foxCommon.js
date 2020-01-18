const foxCommon = {
	JSONToCSVConvertor: function(JSONData, fileName="data", showColumnName=true) {
	    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
	    let arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
	    
	    // let CSV = 'sep=,' + '\r\n\n';
	    let CSV = '';

	    //This condition will generate the Label/Header
	    if (showColumnName) {
	    	let row = "";

	        //This loop will extract the label from 1st index of on array
	        for (let index in arrData[0]) {

	            //Now convert each value to string and comma-seprated
	            row += index + ',';
	        }

	        row = row.slice(0, -1);
	        
	        //append Label row with line break
	        CSV += row + '\r\n';
	    }
	    
	    //1st loop is to extract each row
	    for (let i = 0; i < arrData.length; i++) {
	    	let row = "";

	        //2nd loop will extract each column and convert it in string comma-seprated
	        for (let index in arrData[i]) {
	        	row += '"' + arrData[i][index] + '",';
	        }

	        row.slice(0, row.length - 1);
	        
	        //add a line break after each row
	        CSV += row + '\r\n';
	    }

	    if (CSV == '') {        
	    	alert("Invalid data");
	    	return;
	    }   
	    
	    //this will remove the blank-spaces from the title and replace it with an underscore
	    fileName = fileName.replace(/ /g,"_");   
	    

	    function saveData(CSVString, fileName) {
	    	var a = document.createElement("a");
	    	document.body.appendChild(a);
	    	a.style = "display: none";

	    	var blob = new Blob([CSVString], {type: "text/csv;charset=utf-8"});
	    	url = window.URL.createObjectURL(blob);
	    	a.href = url;
	    	a.download = fileName;
	    	a.click();
	    	window.URL.revokeObjectURL(url);
	    };

	    saveData(CSV, fileName+'.csv');
	},

	downloadAsText :(data,fileName)=>{
		var a = document.createElement("a");
		document.body.appendChild(a);
		a.style = "display: none";

		var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
		url = window.URL.createObjectURL(blob);
		a.href = url;
		a.download = fileName+".txt";
		a.click();
		window.URL.revokeObjectURL(url);
	},

	getTabUrl : ()=>{
		return window.location.href;
	},
	
}