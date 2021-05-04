import { aClick } from "./dom.js";

function blob2url(blob){
	const url = window.URL || window.webkitURL;
	return url.createObjectURL(blob);
}
function blob2download(blob,name){
	console.log("bn",blob,name);
	if (window.navigator.msSaveBlob){ 
		window.navigator.msSaveOrOpenBlob(blob,name);
	}
	else
	{   
		aClick(blob2url(blob),
		function(a){
			a.setAttribute('download',name);
		})
	}
}
function getCsvBlob(rows){
	/*
	rows=> e.g.[ [a,b,c], [a2,b2,c2]]
	*/
	const  content = rows.map(x => x.join(",")).join("\n");
	
	const blob = new Blob([content], {type: "text/csv;charset=utf-8;"});
	return blob;
}

export { 
	blob2url,
	blob2download,
	getCsvBlob,
};

