import { isObjEmpty } from "./utils/basic.js";

let common = JSON.parse(JSON.stringify(default_));
const csts = chrome.storage.sync;
const cstl = chrome.storage.local;
//csts.get(null, data => { console.log("csts", data) });
//cstl.get(null, data => { console.log("cstl", data) });

const _elm = {
	srchblLinkTable: { id: "srchbllink_table" },
	bpItrNum: { id: "bp_itr_num" },
	extraBreakModeTable: { id: "extrabreakmode_table" },
	ignoreCharsTarea: { id: "ignorechars_tarea" },
	ignoreTagsTarea: { id: "ignoretags_tarea" },
	historyTable: { id: "history_table" },
	clearSyncBtn: { id: "clearsync_btn" },
	clearLocalBtn: { id: "clearlocal_btn" },
	saveBtn: { id: "save_btn" },
};
const elm = {
	srchblLinkTable:  document.getElementById(_elm.srchblLinkTable.id) , 
	bpItrNum:  document.getElementById(_elm.bpItrNum.id) , 
	extraBreakModeTable:  document.getElementById(_elm.extraBreakModeTable.id) , 
	ignoreCharsTarea: document.getElementById(_elm.ignoreCharsTarea.id), 
	ignoreTagsTarea: document.getElementById(_elm.ignoreTagsTarea.id),
	historyTable: document.getElementById(_elm.historyTable.id) ,
	clearSyncBtn:  document.getElementById(_elm.clearSyncBtn.id),
	clearLocalBtn:  document.getElementById(_elm.clearLocalBtn.id),
	saveBtn: document.getElementById(_elm.saveBtn.id),
};

const _ui = {
	addDelTable: {
		tx: {
			cl:{
				add: "entry_add",
				del: "entry_del",
			}
			
		}
	},
	keyValDesk: {
		tx: {
			cl:{
				check: "entry_check",
				key: "entry_key",
				val: "entry_val",
				add: "entry_add",
				del: "entry_del",
			}
			
		}
	}
};

const ui = {
	
	addDelTableBase: {
		_table: `<thead>
					<tr>
					<th class="${_ui.addDelTable.tx.cl.add}"></th>
					<th class="${_ui.addDelTable.tx.cl.del}"></th>
					</tr>
				</thead>
				<tbody>
				</tbody>
				`,
		itemTr: function(item){
				return `<tr>
						<td class="${_ui.addDelTable.tx.cl.add}"><button>+</button></td>
						<td class="${_ui.addDelTable.tx.cl.del}"><button>-</button></td>
						</tr>
						`;
		},
		initItemTr: function(tr, tableId, trFunc, addFunc){
			if(trFunc){ trFunc(tr); }
			const del = function(btn){
				const tr=btn.parentElement.parentElement;
				const tbody=tr.parentElement;
				if(tbody.children.length>1){ tr.remove(); }	
			};
			
			const add = function(btn){
				//console.log("btn", btn);
				const table = document.getElementById(tableId);

				const tr = btn.parentElement.parentElement;
				//console.log("tr", tr);
				const newTr = tr.cloneNode(true); ////will not cloen event listener
				if(addFunc){ addFunc(newTr); }
				
				table.querySelector("tbody").appendChild(newTr);
				
				const btnAdd = newTr.querySelector(`.${_ui.addDelTable.tx.cl.add} button`);						
				btnAdd.addEventListener("click", e => { add(e.target); });

				const btnDel = newTr.querySelector(`.${_ui.addDelTable.tx.cl.del} button`);						
				btnDel.addEventListener("click", e => { del(e.target); });
			};
			
			tr.querySelector(`.${_ui.addDelTable.tx.cl.add} button`)
			.addEventListener("click", e => { add(e.target); });
			
			tr.querySelector(`.${_ui.addDelTable.tx.cl.del} button`)
			.addEventListener("click", e => { del(e.target); });
			//console.log(">", tr.querySelector(".entry_del"));
		},
		initTbody: function(table, items, my=this){
			
			let _trs = "";
			for(let key in items){
				_trs += my.itemTr(items[key]);
			}
			//console.log("~", table, my,_trs);
			const tbody = table.querySelector("tbody");
			//console.log("tbody", tbody);
			tbody.innerHTML = _trs;
			
		} ,
		initItemTrs: function(tableId, my=this){
			const table = document.getElementById(tableId);
			const trs = table.querySelectorAll("tbody tr");
			for(let tr of trs){
				my.initItemTr(tr, tableId);
			}
		},
		init: function(table, items, tableId, my=this){
			table.innerHTML = my._table;
			my.initTbody(table,items);
			my.initItemTrs(tableId);
		}
	},
	keyValADTableBase: {
		_table: `<thead>
					<tr>
					<th class="${_ui.keyValDesk.tx.cl.key}">name</th>
					<th class="${_ui.keyValDesk.tx.cl.val}">src</th>
					<th class="${_ui.addDelTable.tx.cl.add}"></th>
					<th class="${_ui.addDelTable.tx.cl.del}"></th>
					</tr>
				</thead>
				<tbody>
				</tbody>`,
		itemTr: function(item){
			//console.log("item", item);
			return `<tr>
					<td class="${_ui.keyValDesk.tx.cl.key}"><textarea>${item.key}</textarea></td>
					<td class="${_ui.keyValDesk.tx.cl.val}"><textarea>${item.val}</textarea></td>
					<td class="${_ui.addDelTable.tx.cl.add}"><button>+</button></td>
					<td class="${_ui.addDelTable.tx.cl.del}"><button>-</button></td>
					</tr>
					`;
		},
		initTbody: function(table, items, my=this){
			
			ui.addDelTableBase.initTbody(
				table,
				isObjEmpty(items)?
				{"": {key:"",val:""} }:items,
				my
			);
		} ,
		init: function(table, items, tableId, my=this){
			
			table.innerHTML = my._table;
			my.initTbody(table,items);
			ui.addDelTableBase.initItemTrs(tableId);			
		}
	},
	srchblLinkTable: {
		
		init: function(table, tableId){
			
			ui.keyValADTableBase.init(table, common.srchblLinks, tableId);
		}
	} , 
	extraBreakModeTable:  {
		extractItems: function(items){
			const out = {};
			//console.log("items",items);
			for(let key in items){
				//console.log("items[key]",items[key]);
				if (items[key].type==="c"){
					out[key] = items[key];
				}
			}
			return out;
		},
		init: function(table, tableId){
			//console.log("items",items);
			const items=this.extractItems(common.breakModes);
			ui.keyValADTableBase.init(table, items, tableId);
		}
	}, 
	bpItrNum: { 
		init: function(number){
			number.value = common.breakModes.bp.itr;
		} 
	},
	ignoreCharsTarea: { 
		init: function(textArea){
			textArea.value = common.ignore.charsStrg;
		} 
	},
	ignoreTagsTarea: {
		init: function(textArea){
			textArea.value = common.ignore.tagsStrg;
		} 
	},
	historyTable: {} ,
	clearSyncBtn: {
		init: function(btn){
			btn.addEventListener("click", e => {
				csts.clear();
			})
		}
	},
	clearLocalBtn: {
		init: function(btn){
			btn.addEventListener("click", e => {
				cstl.clear();
			})
		}
	},
	saveBtn: {
		isKeyValid: function(table, startSetArr=[]){
			//duplicate?
			const keySet = new Set(startSetArr);
			for (let el of table.querySelectorAll(`tbody .${_ui.keyValDesk.tx.cl.key} textarea`)){
				//console.log("~", el.value,keySet);
				if (keySet.has(el.value)){
					//console.log("duplicate");
					alert("Error: duplicated key in name!");
					return false;
				}
				keySet.add(el.value);
			}
			
			return true;
		},
		extractKeyValDesk: function(table){
			const out = {
				//extraBreakModes: null,
				//check: "",
			}
			//const extraBreakModes={};
			for (let el of table.querySelectorAll("tbody tr")){
				const key = el.querySelector(`.${_ui.keyValDesk.tx.cl.key} textarea`).value;
				const val = el.querySelector(`.${_ui.keyValDesk.tx.cl.val} textarea`).value;
				out[key] = { type: "c", key: key, val: val};
				
				//if (el.querySelector(`.${_ui.keyValDesk.tx.cl.check} input`).checked){
					//out.check = key;
				//}
				
			}
			//out.extraBreakModes=extraBreakModes;
			return out;
		},
		init: function(btn){
			btn.addEventListener("click", e => {
				//console.log("~",this,e.target);
				if (!this.isKeyValid(elm.srchblLinkTable)){ return; }
				if (!this.isKeyValid(elm.extraBreakModeTable,
				                     Object.keys(default_.breakModes))){ return; }	

				
				
				const srchblLinks = this.extractKeyValDesk(elm.srchblLinkTable);
				common.srchblLinks = srchblLinks;
				//csts.set({srchblLinkCheck: obj.check});	
				
				const extraBreakModes = this.extractKeyValDesk(elm.extraBreakModeTable);
				common.breakModes={...default_.breakModes, ...extraBreakModes};
				//csts.set({breakModes: obj.keyVals});
				//csts.set({breakModeCheck: obj.check});
				
				//csts.set({iggyTagsStrg: e.target.checked});
				
				common.breakModes.bp.itr = elm.bpItrNum.value;
				common.ignore.charsStrg = elm.ignoreCharsTarea.value;
				common.ignore.tagsStrg = elm.ignoreTagsTarea.value;
				
				csts.set({srchblLinks: common.srchblLinks});
				csts.set({breakModes: common.breakModes});
				csts.set({ignore: common.ignore});
			});
		}
	},
};


const init={
	storage: async function (){
		return new Promise((resolve, reject) => {
			csts.get(Object.keys(common), resolve);
		})
		.then(data => {
			common = { ...common, ...data};
		});
	},
	elms: function(){
		ui.srchblLinkTable.init(elm.srchblLinkTable,
								_elm.srchblLinkTable.id);
		ui.extraBreakModeTable.init(elm.extraBreakModeTable,
								    _elm.extraBreakModeTable.id);
		ui.bpItrNum.init(elm.bpItrNum);
		ui.ignoreCharsTarea.init(elm.ignoreCharsTarea);
		ui.ignoreTagsTarea.init(elm.ignoreTagsTarea);
		ui.clearSyncBtn.init(elm.clearSyncBtn);
		ui.clearLocalBtn.init(elm.clearLocalBtn);
		ui.saveBtn.init(elm.saveBtn);
	}
	
};

init.storage()
.then(() => {
	init.elms();
	
});


