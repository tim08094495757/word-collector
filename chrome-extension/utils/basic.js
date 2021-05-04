function isObjEmpty(obj){
	for (let key in obj){
		return false;
	}
	return true;
}
function getSorted(obj,reverse){
	const arr = [];
	for (let key in obj) { arr.push([key, obj[key]]); }
	arr.sort((x, y)=>
	         !reverse?(x[1] - y[1]):(y[1] - x[1]));
	return arr;
}

class Counter {
	constructor(arr){
		this.obj = {};
		this.get = this.obj;
		this.init(arr);
	}
	init(arr){
	    if(!arr){ return {}; }
		for (let x of arr){
			this.add(x);
		}
	}
	add(x, weight=1){
		if (!this.obj.hasOwnProperty(x)){
			this.obj[x] = weight;
		}
		else {this.obj[x] += weight;}	
	}
}
export { 
	isObjEmpty,
	getSorted,
	Counter,
};
