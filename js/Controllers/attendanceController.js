'use strict';
app.controller("attendanceController", function($scope, $http, $route){

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
		//Showing Attendance Popup
		$scope.showAttendancePopup = true;

		//Checking Attendance if it is marked
		$scope.isAttendanceMarked = $event.currentTarget.children.length == 1;

		//Showing current date in popup
		$scope.dispToday = $event.currentTarget.attributes.dataToday.value;

		//Putting selected ID in Popup attribute
		$scope.dataID = $event.currentTarget.id;

		//Putting Updated Working Hours for Update Attendance
		if($scope.isAttendanceMarked){
			$scope.keypathid = $event.currentTarget.children["0"].attributes[1].value;
			$scope.workingHours = Number($event.currentTarget.children["0"].children["0"].innerHTML);
		}else{
			$scope.workingHours="";
		}
	};


	//Close Attendance Popup
	$scope.closeAttendancePopup = function($event){
		$scope.showAttendancePopup = false;
	};


	//Marking Attendance
	$scope.markAttendance = function($event){

		//Hiding Mark Attendance Pop Up
		$scope.showAttendancePopup = false;

		var transaction = db.transaction(['Attendance'], 'readwrite');

		//Ask for ObjectStore
		var store = transaction.objectStore('Attendance');

		//Define Attendance
		var attendance = {
			workingHours: $scope.workingHours,
			selectedDateID: $scope.dataID
		};
		
		//perform the Add
		var request = store.add(attendance);
		
		//Success
		request.onsuccess = function(e){
			console.log("You Have Successfully Marked Attendance for : " + $scope.dispToday);
			$route.reload();
		};

		//Error
		request.onerror = function(e){
			alert("Sorry, Attendance was not added");
			console.log("Error: ", e.target.error.name);
		}
	};


	//Getting attendance from database
	$scope.showAttendance = function(){
		var transaction = db.transaction(['Attendance'], 'readonly');

		//Ask for ObjectStore
		var store = transaction.objectStore('Attendance');
		var index = store.index('selectedDateID');

		var output = "";

		index.openCursor().onsuccess = function(e){
			var cursor = e.target.result;

			if(cursor){
				output = "<span class='attendance-record' id='"+cursor.value.id+"'>Working Hours: <i>"+cursor.value.workingHours+"</i></span>";
				cursor.continue();
				$("#" + cursor.value.selectedDateID).append(output);
			}
		}
		
	};


	//Update Attendance
	$scope.updateAttendance = function(){

		//Get Transaction
		var transaction = db.transaction(['Attendance'], 'readwrite');

		//Ask for ObjectStore
		var store = transaction.objectStore('Attendance');

		var request = store.get(Number($scope.keypathid));

		request.onsuccess = function(){
			var data = request.result;

			data.workingHours = $scope.workingHours;

			//Store Updated working hours
			var requestUpdate = store.put(data);

			requestUpdate.onsuccess = function(){
				console.log("Success: Working hours updated...");
				$route.reload();
			};

			requestUpdate.onerror = function(){
				console.log("Error: Working hours not updated...");
			};

		};

		$scope.showAttendancePopup = false;
	};


	//Change marked and update attendance function
	$scope.changeMarkAndUpdateAttendance = function($event){
		$scope.isAttendanceMarked == true ? $scope.updateAttendance($event) : $scope.markAttendance($event);
	};

});


