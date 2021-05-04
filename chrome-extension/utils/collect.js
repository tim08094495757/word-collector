import { inner2dom, getPlainStrg } from "./dom.js";
import { getSorted,
         Counter } from "./basic.js";

const breakTools = {

	split: function(strg, ignoreCharsStrg){

		//const re = new RegExp(`[${ignoreCharsStrg}]+`);
		const re = new RegExp(`[\\s${ignoreCharsStrg}]+`); //because pad = " "
		
		//console.log("re", re);
		const parts = strg.split(re);
		//console.log("parts", parts);
		return parts;
	},
	
	initVocab: function(strg, ignoreCharsStrg, pad=" "){
	    let parts = this.split(strg, ignoreCharsStrg)
		          .filter(x => x) //remove ""
		          .map( x => x.toLowerCase());
		if (pad){ parts = parts.map(x => x.split("").join(pad)); }
		let out = new Counter(parts).get;
		//console.log("out", out);
		return out; //key（ｗｏｒｄ, sentence, ...） :　val(ｆｒｅｑ)
	},
	updateVocab: function(pair, vocab, pad=" "){
		for (let key in vocab) {
			const parts = key.split(pad);
			const freq = vocab[key];
			let change = false;
			for(let i=0;i<parts.length-1;i++){
			    if (pair===parts[i]+parts[i+1]){
					parts[i] = pair;
					parts[i+1] = "";
					i++; //prevent next i also hit the pair
					change = true;
				}
			}
			if (change) { 
			    //console.log("key", key);
			    delete vocab[key];
				vocab[parts.filter(x => x).join(" ")] = freq; 
			}
		}
	},
	getPairs: function(vocab, pad=" "){
		const counter = new Counter();
		let change = false;
		for (let key in vocab) {
			const parts = key.split(pad);
			const freq = vocab[key];
			for(let i=0;i<parts.length-1;i++){
				counter.add(parts[i] + parts[i+1],freq);
				change = true;
				
			}
		}
		if (!change) { return null; }
		return counter.get; //must have key
	},
	getMost: function(obj){
		return Object.keys(obj).reduce((x, y) => obj[x] > obj[y] ? x : y);
	}
	
};

const breakAlgo={
	simpleSplit: function(strg, ignoreCharsStrg){
	    const out = breakTools.initVocab(strg, ignoreCharsStrg, ""); 
		
		return out;//key（ｗｏｒｄ, sentence, ...） :　val(ｆｒｅｑ)
	},

	bytePairVar: function(strg, ignoreCharsStrg, maxItr){
		const vocab = breakTools.initVocab(strg, ignoreCharsStrg);
		//console.log("vocab", vocab);
		const sorted = [];
		for (let i=0;i<maxItr;i++){
			const pairs = breakTools.getPairs(vocab);
			//console.log("~", pairs,pairs.length, "in" in vocab);
			if (!pairs){ break; }
			const most = breakTools.getMost(pairs); //best key
			//console.log("most", most);
			sorted.push(most.replace(/ /g, ""));
			
			breakTools.updateVocab(most,vocab);
			//console.log("vocab", vocab);
		}
		const out = sorted.reduce((obj, x, i)=>{
									if(!(x in obj)){obj[x] = -i;} //not really sure, but edge case may happened
									return obj;
								}, {});
		return out; //key（ｗｏｒｄ, sentence, ...） :　val(weight)
	},
	api: async function(strg, ignoreCharsStrg, src){
		const raw = {
			content: strg,
			ignoreCharsStrg: ignoreCharsStrg
		};
		return fetch(src, {
		  method: 'post',
		  headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
		  },
		  body: JSON.stringify(raw)
		})
		.then(resp => resp.json())
		.then(json => json.data);
	}
	
}



async function collect(
						inner,
						breakModeCheck,
						breakModes,
						ignore,
						reverse
					  ){
			
	//console.log("~", inner,breakModeCheck,breakModes,ignore);
	//const tempBody = document.body.cloneNode(true);
	//ignore.TagsStrg: "script style"
	const contentDom = inner2dom(inner);
	const strg = getPlainStrg(ignore.tagsStrg.split(" "),contentDom);
	//console.log("strg", strg);

	let keyWeights = null;
	const breakMode = breakModes[breakModeCheck];
	switch (breakModeCheck){
		case "bp":
			keyWeights = breakAlgo.bytePairVar(strg, ignore.charsStrg, 
											   breakMode.itr);
			break;
		case "split":
			keyWeights = breakAlgo.simpleSplit(strg, ignore.charsStrg);
			break;
		default:
			if(breakMode){
				keyWeights = await breakAlgo.api(strg, ignore.charsStrg, 
												 breakMode.val);
			}
			else{
				keyWeights = breakAlgo.simpleSplit(strg, ignore.charsStrg);
			}
	}

	//console.log("keyWeights", keyWeights);
	const entries = getSorted(keyWeights, reverse);
	//console.log("entries", entries);
	return entries;	
}

export { 
	collect,
};



