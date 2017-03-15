/*
Plugin Name: Tab
Dependency: JavaScript, CSS 3.0
Complete Reference on: https://github.com/ravianexpert/tab

Developer: Ravi Shankar Kumar
Website: http://uiravi.com
*/


function Tab(option){
	//Private variables
	var container = option.container,
		activeTab = option.activeTab || 1,
		activeTabContainer = option.activeTabContainer || 1,
		tabs = container.querySelectorAll(".tabs > li"),
		tabContainer = container.querySelectorAll(".tab-container > li");


	this.tab = function(e){
		// getting the current tab for show and hide tab container
		for(var i=0; i<tabContainer.length; i++){
			e.target.getAttribute("rel") == i + 1 ? tabContainer[i].className = "show" : tabContainer[i].classList.remove("show");
		}

		//getting the current tab for show and hide tabs
		for(var i=0; i<tabs.length; i++){
			e.target.getAttribute("rel") == i + 1 ? tabs[i].className = "active" : tabs[i].classList.remove("active");
		}
	};

	//init
	(function(instance){
		//setting the tab which shows first
		activeTab = tabs[activeTab - 1].className = "active";
		activeTabContainer = tabContainer[activeTabContainer - 1].className  = "show";

		// Event bindings
		for(var i = 0; i<tabs.length; i++){
			tabs[i].onclick = instance.tab;
		}
	})(this);
}

/*var calendarTab = new Tab({
	activeTab : 2,
	activeTabContainer : 2,
	container: document.querySelector(".tab-main-container")
});*/