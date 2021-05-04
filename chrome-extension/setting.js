const default_= {
	autoStart: false, 
	reverse: true,
	srchblLinks: {
		//e.g.
		//key: link?q=,
		//key: link2, ....
		oxfordLeaner: {
			key: "oxfordLeaner",
			val: "https://www.oxfordlearnersdictionaries.com/definition/english/{}"
		},
		goo: {
			key: "goo",
			val: "https://dictionary.goo.ne.jp/srch/all/{}/m0u/"
		},
		rae: {
			key: "rae",
			val: "https://dle.rae.es/{}"
		}
	},
	
	breakModes: {
		//type=>o: original, c: customized
		split: {
			type: "o",
		},
		bp: {
			type: "o",
			itr: 100,
		},
		/*
		custom1: {
			type: "c",
			key: "custom1",
			val: "url...", //src
		},
		*/
	},

	srchblLinkCheck: "oxfordLeaner",
	breakModeCheck: "split",
	//myBreakMode: {
		
	//},
	//breakModeCheck: "",
	//myBreakModeCheck: "", //key
	ignore: {
		charsStrg: `\\\\\\d\r\n[\\]!"#$%&'()*+,-./:;<=>?@^_\`{|}~`,
		tagsStrg: "script style",
	},
	entries: [
		
	],
};