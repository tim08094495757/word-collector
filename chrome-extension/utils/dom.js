function inner2dom(inner,parent_="div"){
	//this may not work properly for inner e.g.:  <tr> is not wrapped correctly
	const el = document.createElement(parent_);
	el.innerHTML = inner;
	return el;
}
function removeTag(tagName, parent_){
	Array.prototype.slice
	.call(parent_.getElementsByTagName(tagName))
	.forEach(elm =>{ elm.remove(); });
}
function getPlainStrg(ignores, parent_){
	for (let tagName of ignores) {
		removeTag(tagName,parent_);
	}
	return parent_.textContent;
}

function aClick(src,func){
	//should not be in this js but,...
	const a=document.createElement('a');
	a.setAttribute('href',src);
	a.setAttribute('target','_blank');
	
	if (func!==undefined){
		func(a);
	}		
	
	a.style.display='none';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

export { 
	inner2dom,
	removeTag,
	getPlainStrg,
	aClick,
};


