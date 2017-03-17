'use strict';
app.controller("attendanceController", function($scope, $http, $route){

	$scope.attendanceMsg = false;

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
		var $attendancePopUp = $(".addAttendance"),
			$dispCurrentSelection = $attendancePopUp.find(".disp-today"),
			$overlay = $(".overlay"),
			$getCurrentSelection = $($event.currentTarget).data("today"),
			$submitAttendanceBtn = $attendancePopUp.find("#submitAttendance"),
			$workingHours = $attendancePopUp.find("#working-hours"),
			isAttendanceMarked = $($event.currentTarget).find(".attendance-record").length == 1;

		//Showing currnt date in popup
		$dispCurrentSelection.html($getCurrentSelection);

		//Showing attendence popup
		$attendancePopUp.add($overlay).removeClass("hide");

		//Adding Current Selection ID in Pop up with data-id
		$attendancePopUp.attr({
			"data-id": $event.currentTarget.id,
			"data-keyPathId": $($event.currentTarget).find(".attendance-record").data("id"),
			"isAttendanceMarked": isAttendanceMarked
		});

		if(isAttendanceMarked){
			$workingHours.val($($event.currentTarget).find(".attendance-record i").text());
		}else{
			$workingHours.val("");
		}
	};


	//Close Attendance Popup
	$scope.closeAttendancePopup = function($event){
		$($event.target.offsetParent).add(".overlay").addClass("hide");
	};


	//Marking Attendance
	$scope.markAttendance = function($event){
		var $attendancePopUp = $(".addAttendance"),
			$overlay = $(".overlay"),
			$workingHours = $attendancePopUp.find("#working-hours").val(),
			selectedDate = $attendancePopUp.find(".disp-today"),
			selectedDateID = $attendancePopUp.attr("data-id");

		if($workingHours == ""){
			alert("Please enter working hours");
			return false;
		}else if(Number($workingHours) > 24){
			alert("Please enter less than and equal to 24 hours");
			return false;
		}

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
			$route.reload();
		};

		//Error
		request.onerror = function(e){
			alert("Sorry, Attendance was not added");
			console.log("Error: ", e.target.error.name);
		}

		console.log(selectedDateID);

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
				output = "<span class='attendance-record' data-id='"+cursor.value.id+"'>Working Hours: <i>"+cursor.value.workingHours+"</i></span>";
				cursor.continue();
				$("#" + cursor.value.selectedDateID).append(output);
			}
		}
		
	};


	//Update Attendance
	$scope.updateAttendance = function(){
		var $attendancePopUp = $(".addAttendance"),
			$overlay = $(".overlay"),
			$updatedWorkingHours = $attendancePopUp.find("#working-hours").val(),
			keyPathID = $attendancePopUp.data("keypathid");

		if($updatedWorkingHours == ""){
			alert("Please enter working hours");
			return false;
		}else if(Number($updatedWorkingHours) > 24){
			alert("Please enter less than and equal to 24 hours");
			return false;
		}

		//Get Transaction
		var transaction = db.transaction(['Attendance'], 'readwrite');

		//Ask for ObjectStore
		var store = transaction.objectStore('Attendance');

		var request = store.get(keyPathID);

		request.onsuccess = function(){
			var data = request.result;

			data.workingHours = $updatedWorkingHours;

			//Store Updated working hours
			var requestUpdate = store.put(data);

			requestUpdate.onsuccess = function(){
				console.log("Success: Working hours updated...");
				$route.reload();
			};

			requestUpdate.onerror = function(){
				console.log("Error: Working hours not updated...");
			};

			$attendancePopUp.add($overlay).addClass("hide");;
		};
	};


	//Chanhe marked and update attendance function
	$scope.changeMarkAndUpdateAttendance = function($event){
		var isAttendanceMarked = $(".addAttendance").attr("isattendancemarked");
		isAttendanceMarked == "true" ? $scope.updateAttendance() : $scope.markAttendance();
	};

});


