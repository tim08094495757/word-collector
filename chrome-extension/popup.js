import { collect } from "./utils/collect.js";
import { getCsvBlob, blob2download } from "./utils/file.js";

let common = JSON.parse(JSON.stringify(default_));
const csts = chrome.storage.sync;
const cstl = chrome.storage.local;

const _elm = {
	autoStartCbox: { id: "autostart_cbox" },
	reverseCbox: { id: "reverse_cbox" },
	collectorBtn: { id: "collector_btn" },
	breakModeSelect: { id: "breakmode_select" },
	srchblLinkSelect: { id: "srchbllink_select" },
	collectionTable: { id: "collection_table" },
	downloadBtn: { id: "download_btn" },
};
const elm = {
	autoStartCbox:  document.getElementById(_elm.autoStartCbox.id) , 
	reverseCbox:  document.getElementById(_elm.reverseCbox.id) , 
	collectorBtn:  document.getElementById(_elm.collectorBtn.id) ,
	breakModeSelect:  document.getElementById(_elm.breakModeSelect.id) ,
	srchblLinkSelect: document.getElementById(_elm.srchblLinkSelect.id), 
	collectionTable: document.getElementById(_elm.collectionTable.id) , 
	downloadBtn: document.getElementById(_elm.downloadBtn.id) ,
};


const ui = {
	
	autoStartCbox: {
		init: function(checkbox){
			checkbox.checked = common.autoStart;
			checkbox.addEventListener("change", e => {
				const checked = e.target.checked;
				common.autoStart = checked;
				csts.set({autoStart: checked}); 
				//console.log("checked",checked);
			});
		}
	},
	reverseCbox: {
		init: function(checkbox){
			checkbox.checked = common.reverse;
			checkbox.addEventListener("change", e => {
				const checked = e.target.checked;
				common.reverse = checked;
				csts.set({reverse: checked}); 
			});
		}
	},
	collectorBtn: {
		init: function(btn){
			btn.addEventListener("click", async () => {

				let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
				chrome.scripting.executeScript({
					target: { tabId: tab.id },
					function: () => {
						return document.body.innerHTML;
					},
				},
				resps => {
					if(!resps || resps.length===0){ return; }
					//console.log("resps", resps);
					const innerHtml = resps[0].result;
					//console.log("~", innerHtml, elm.breakModeSelect)
					const entriesPromise = collect(
							innerHtml,
							elm.breakModeSelect.value,
							common.breakModes,							
							common.ignore,
							common.reverse							
					);	
					entriesPromise.then(entries => {
						ui.collectionTable.initTbody(elm.collectionTable, entries);
						ui.collectionTable.initItemTrs(elm.collectionTable);
						common.entries = entries;
						//csts.set({entries: entries}); 
						cstl.set({entries: entries});//may need to use chunk	
					});
				});
			});

		}
		
	},
	selectBase: {
		createOption: function(val, inner){
			inner = inner||val;
			const el = document.createElement("option");
			el.value = val;
			el.innerHTML = inner;
			return el;
		},
		
		init: function(select, keys){
			for(let key in keys){
				if(key){
					select.appendChild(this.createOption(key));
				}
			}
		}
	},
	breakModeSelect: {
		init: function(select){
			ui.selectBase.init(select, common.breakModes);
			select.value = common.breakModeCheck;
			select.addEventListener("change", e => {
				csts.set({breakModeCheck: e.target.value});
			});
		}
	},
	srchblLinkSelect: {
		init: function(select){
			ui.selectBase.init(select, common.srchblLinks);
			select.value = common.srchblLinkCheck;
			select.addEventListener("change", e =>{
				csts.set({srchblLinkCheck: e.target.value});
			});
		}
		
	},
	collectionTable: {
		
		_table: `<thead>
					<tr>
					<th>[key]</th>
					<th>weight</th>
					<th>link</th>
					</tr>
				</thead>
				<tbody>
				</tbody>
				`,
		
		itemTr: function(item){
				//note: replace first {}
				return `<tr>
						<td>${item[0]}</td>
						<td>${item[1]}</td>
						<td>
							<button 
								value=${item[0]}
							>
							search
							</button>
						</td>
						</tr>
						`;
		},
		initTbody: function(table, items, my=this){
			let _trs="";
			//for(let item of items){
				//_trs+=my.itemTr(item);
			for(let key in items){
				_trs += my.itemTr(items[key]); //can also work in arr
			}
			const tbody = table.querySelector("tbody");
			tbody.innerHTML = _trs;
		} ,

		initItemTr: function(tr){
			//call this only when the btn is new elm
			const btn = tr.querySelector("button");
			btn.addEventListener("click",() => {
				
				window.open(common.srchblLinks[elm.srchblLinkSelect.value].val
							.replace("{}",btn.value));

			});
		},
		initItemTrs: function(table, my=this){
			const trs = table.querySelectorAll("tbody tr");
			for(let tr of trs){
				my.initItemTr(tr);
			}
		},
		init: function(table,items,  my=this){
			items = common.entries;
			table.innerHTML = my._table;
			my.initTbody(table,items);
			my.initItemTrs(table);
		}
	},
	downloadBtn: {
		init: function(btn){
			btn.addEventListener("click",() => {
				const blob = getCsvBlob(common.entries);
				blob2download(blob, "wcl-entries.csv");
			})
		}
	},

};

const init = {
	storage: async function (){
		return new Promise((resolve, reject) => {
			csts.get(Object.keys(common), resolve);
		})
		.then(data => {
			common = { ...common, ...data};
		})
		.then(() => {
			return new Promise((resolve, reject) => {
				cstl.get(Object.keys(common), resolve);
			})
		})
		.then(data => {
			common = { ...common, ...data};
		});
	},
	elms: function(){
		ui.autoStartCbox.init(elm.autoStartCbox);
		ui.reverseCbox.init(elm.reverseCbox);
		ui.collectorBtn.init(elm.collectorBtn);
		ui.breakModeSelect.init(elm.breakModeSelect);
		ui.srchblLinkSelect.init(elm.srchblLinkSelect);
		ui.collectionTable.init(elm.collectionTable);
		ui.downloadBtn.init(elm.downloadBtn);
		
		//elm.collectorBtn.click();
		if(common.autoStart){
			elm.collectorBtn.click();
		}
	}
	
};

//csts.clear();
init.storage()
.then(() => {
	console.log("common", common);
	init.elms();
});