'use strict';
app.controller("attendanceController", function($scope, $http){

	//Getting Current Month
	$scope.getCurrentMonth = function(){
		var date = new Date(),
			month = date.getMonth();

		return month + 1;
	};

	//Initiated Tab for Calendar
	$scope.calendarTab = new Tab({
		activeTab : $scope.getCurrentMonth(),
		activeTabContainer : $scope.getCurrentMonth(),
		container: document.querySelector(".tab-main-container")
	});

	//Getting Week
	$http.get("static_data/weeks.json")
	.then(function(response){
		$scope.weekdays = response.data;

	});

	//Getting Months
	$http.get("static_data/months.json")
	.then(function(response){
		$scope.months = response.data;
	});
	
	$scope.getMonths = function(num){
		return new Array(num);
	};

	//Showing Pop Up for Mark Attendance
	$scope.showMarkAttendancePopup = function($event){
		var $attendancePopUp = $(".addAttendance"),
			$dispCurrentSelection = $attendancePopUp.find(".disp-today"),
			$overlay = $(".overlay"),
			$getCurrentSelection = $($event.currentTarget).data("today");

		//Showing currnt date in popup
		$dispCurrentSelection.html($getCurrentSelection);

		//Showing attendence popup
		$attendancePopUp.add($overlay).removeClass("hide");

		//Adding Current Selection ID in Pop up with data-id
		$attendancePopUp.attr("data-id", $event.currentTarget.id);
	};

	//Code for opening indexedDB database
	var db;

	//Open Database
	var request = indexedDB.open('AttendanceManager', 1);

	//Upgrade needed
	request.onupgradeneeded = function(e){
		var db = e.target.result;
		var objectStore = db.createObjectStore('Attendance', {keyPath: 'id', autoIncrement:true})
			.createIndex('selectedDateID', 'selectedDateID', {unique:true});
	};

	//Success
	request.onsuccess = function(e){
		console.log("Success: Opened Database...");
		db = e.target.result;

		//Showing Attendance
		$scope.showAttendance();
	};

	//Error
	request.onerror = function(e){
		console.log("Error: Could Not Open Database...");
	};

	//Marking Attendance
	$scope.markAttendance = function($event){
		var $attendancePopUp = $(".addAttendance"),
			$overlay = $(".overlay"),
			$workingHours = $attendancePopUp.find("#working-hours").val(),
			selectedDate = $attendancePopUp.find(".disp-today"),
			selectedDateID = $attendancePopUp.attr("data-id");

		//Hiding Mark Attendance Pop Up
		$attendancePopUp.add($overlay).addClass("hide");

		var transaction = db.transaction(['Attendance'], 'readwrite');

		//Ask for ObjectStore
		var store = transaction.objectStore('Attendance');

		//Define Attendance
		var attendance = {
			workingHours: $workingHours,
			selectedDateID: selectedDateID
		};
		
		//perform the Add
		var request = store.add(attendance);
		
		//Success
		request.onsuccess = function(e){
			console.log("You Have Successfully Marked Attendance for : " + selectedDate.text());
			//window.location.href="#/";
		};

		//Error
		request.onerror = function(e){
			alert("Sorry, Attendance was not added");
			console.log("Error: ", e.target.error.name);
		}

		console.log(selectedDateID);
	};

	$scope.showAttendance = function(){
		var transaction = db.transaction(['Attendance'], 'readonly');

		//Ask for ObjectStore
		var store = transaction.objectStore('Attendance');
		var index = store.index('selectedDateID');

		var output = "";

		index.openCursor().onsuccess = function(e){
			var cursor = e.target.result;
			//console.log(cursor)

			if(cursor){
				output = "<span class='attendance-record'>"+cursor.value.workingHours+"</span>";
				cursor.continue();
				$("#" + cursor.value.selectedDateID).append(output);
			}
		}
		
	};

});


