// I dont know how to make structs/my old method wasnt working as intended. Using parallel arrays to keep track of items
// WHEN ADDING STATS PAGE UPDATE THE PAGES ARRAY!!!
let pages = [document.getElementById("home_page"),document.getElementById("calendar_page"), document.getElementById("home_page")];
var icons = [document.getElementById("icon_home"), document.getElementById("icon_calendar"), document.getElementById("icon_stats")];
var buttons = [document.getElementById("home_btn"), document.getElementById("calendar_btn"), document.getElementById("stats_btn")];

const pos_home = 0, pos_calendar = 1, pos_stats = 2;

let pos_selectedItem = pos_home; // starting page is the home page

let hoverColor = "rgb(0, 128, 128)", selectedColor = "rgb(0, 128, 128)", defColor = "rgb(0, 85, 85)";


// Initalizes events
if(buttons.length != icons.length || icons.length != pages.length || buttons.length != pages.length){
	console.log("ERROR pageTransitions.js: button length doesnt match icon length.");
}
else{
	for(i =0; i < buttons.length;i++){
		buttons[i].addEventListener("click", clickBtn);
		buttons[i].addEventListener("mouseover", enterBtn);
		buttons[i].addEventListener("mouseleave", leaveBtn);

		icons[i].addEventListener("click", clickBtn);
		icons[i].addEventListener("mouseover", enterBtn);
		icons[i].addEventListener("mouseleave", leaveBtn);
	}
}

// Determines item clicked on, updates sidemenu and changes page
function clickBtn(item){

	let destinationPosition = getSelectedPosition(item);

	//updates sidebar and page
	if(destinationPosition == -1){
		console.log(`ERROR clickBtn: invalid item '${item}'`);
	}
	else{

		// if statements transated from orginal file
		if(destinationPosition != pos_home){
			closeCal1();
			alert("Not home");
		}
		if(destinationPosition != pos_calendar){
			closeBub();
			closeInfo();
		}

		pos_selectedItem = destinationPosition;
		focusListItem(destinationPosition);
		showPage();
	}
}

// Determines which item to highlight simular to clickBtn but without changing the page
function enterBtn(item){

	let highlightPosition = getSelectedPosition(item);

	//updates sidebar
	if(highlightPosition == -1){
		console.log(`ERROR enterBtn: invalid item '${item}'`);
	}
	else{
		focusListItem(highlightPosition);
	}
}

// Resets all selection colors by focusing on the associated page
function leaveBtn(){
	focusListItem(pos_selectedItem);
}

function getSelectedPosition(item){
	let position = -1;

	if(item.target.id.includes("stats")){
		position = pos_stats;
	}
	else if(item.target.id.includes("calendar")){
		position = pos_calendar;
	}
	else if(item.target.id.includes("home")){
		position = pos_home;
	}

	return position;
}

// Scans through arrays resetting their color. Then highlighting important items
function focusListItem(position){

	// resets all bgcolors to default state
	for(i =0; i < buttons.length; i++){
		console.log("Clearing color");
		buttons[i].style.backgroundColor = defColor;
		icons[i].style.backgroundColor = defColor;
	}

	//highlights item
	icons[position].style.backgroundColor = hoverColor;
	buttons[position].style.backgroundColor = hoverColor;

	//highlights current pos_selectedItem
	icons[pos_selectedItem].style.backgroundColor = selectedColor;
	buttons[pos_selectedItem].style.backgroundColor = selectedColor;
}

// Translated from original file
function showPage(){
	//hide every page except for currPage

	for(i = 0; i < pages.length;i++){
		pages[i].style.display = "none";
	}

	pages[pos_selectedItem].style.display = "flex";

	if (pos_selectedItem == pos_home)
	{
		menu.bubbles.forEach(element => {
			element.setDimensions(element.cx, element.cy, element.rad);
		});
		menu.generateBubbles();
	}
}


showPage();
focusListItem(pos_home);



/*
Functions from old code
homeBtn.addEventListener("click", function(e)
{
    if (currPage != homePage)
    {
        closeCal1();
    }

    currPage = homePage;
    showPage();
    currBtn = homeBtn;
    highlightBtn(e);
    resetTooltip()
});
homeBtn.addEventListener("mouseover", overBtn);
homeBtn.addEventListener("mouseleave", leaveBtn);

calendarBtn.addEventListener("click", function(e)
{
    if (currPage != calendarPage)
    {
        closeBub();
        closeInfo();
    }

    currPage = calendarPage;
    showPage(); currBtn = calendarBtn;
    highlightBtn(e);
    resetTooltip()
});
*/