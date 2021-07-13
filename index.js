//ONLINE WEBSOCKET SERVER SETTINGS
const websocket_endpoint = "wss://relay.aricodes.net/ws";

//LOCAL JSON SERVER SETTINGS
var JSON_ADDRESS = "127.0.0.1";
const JSON_PORT = 7190;
const POLLING_RATE = 333;
var JSON_ENDPOINT = `http://${JSON_ADDRESS}:${JSON_PORT}/`;

window.onload = function () {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	// CHECK FOR AUTH TOKEN
	const token = urlParams.get('token');
	if (token != null) {
		const socket = new WebSocket(websocket_endpoint);
		socket.onopen = () => socket.send(`listen:${token}`);
		socket.onmessage = (event) => appendData(JSON.parse(event.data));
	}
	else {
		getData();
		setInterval(getData, POLLING_RATE);
	}
};

var Asc = function (a, b) {
	if (a > b) return +1;
	if (a < b) return -1;
	return 0;
};

var Desc = function (a, b) {
	if (a > b) return -1;
	if (a < b) return +1;
	return 0;
};

function getData() {
	fetch(JSON_ENDPOINT)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			appendData(data);
		})
		.catch(function (err) {
			console.log("Error: " + err);
		});
}

function appendData(data) {
	//console.log(data);
	var craftItem = data.PlayerInventory.filter((item) => {
		return item.IsCraftable;
	});
	craftItem.map((c) => { SetCraftItems(c) });
	console.log("Craft Items", craftItem);
}

function SetCraftItems(item) {
	let HerbStack = document.getElementById("HerbStack");
	let ChemFluidStack = document.getElementById("ChemFluidStack");
	let GunPowderStack = document.getElementById("GunPowderStack");
	let RustedScrapStack = document.getElementById("RustedScrapStack");
	let MetalScrapStack = document.getElementById("MetalScrapStack");

	//RESET OLD DATA
	HerbStack.innerHTML = 0;
	ChemFluidStack.innerHTML = 0;
	GunPowderStack.innerHTML = 0;
	RustedScrapStack.innerHTML = 0;
	MetalScrapStack.innerHTML = 0;
	
	switch (item.ItemName) {
		case "Herb":
			HerbStack.innerHTML = item.StackSize;
			return;
		case "ChemFluid":
			ChemFluidStack.innerHTML = item.StackSize;
			return;
		case "GunPowder":
			GunPowderStack.innerHTML = item.StackSize;
			return;
		case "RustedScraps":
			RustedScrapStack.innerHTML = item.StackSize;
			return;
		case "MetalScraps":
			MetalScrapStack.innerHTML = item.StackSize;
			return;
	}
}
