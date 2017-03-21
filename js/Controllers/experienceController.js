'use strict';
app.controller("experienceController", function($scope, $route){
	
	//Code for opening indexedDB database
	var db;

	//Open Database
	var request = indexedDB.open('ExperienceManager', 1);

	//Upgrade needed
	request.onupgradeneeded = function(e){
		var db = e.target.result;
		var objectStore = db.createObjectStore('Experience', {keyPath: 'id', autoIncrement:true})
			.createIndex('experience', 'experience', {unique:true});
	};

	//Success
	request.onsuccess = function(e){
		console.log("Success: Opened Database...");
		db = e.target.result;

		//Showing Experience
		$scope.showExperience();
	};

	//Error
	request.onerror = function(e){
		console.log("Error: Could Not Open Database...");
	};



	$scope.addExperience = function(){
		var transaction = db.transaction(['Experience'], 'readwrite');

		//Ask for ObjectStore
		var store = transaction.objectStore('Experience');

		var experience = {
			employerName : $scope.employerName,
			startDate : $scope.startDate,
			endDate : $scope.endDate,
			exp : $scope.exp
		};

		//perform the Add
		var request = store.add(experience);

		//Success
		request.onsuccess = function(e){
			console.log("You Have Successfully Added Experience for");
			$route.reload();
		};

		//Error
		request.onerror = function(e){
			alert("Sorry, Experience was not added");
			console.log("Error: ", e.target.error.name);
		}
	};


	$scope.showExperience = function(){
		var transaction = db.transaction(['Experience'], 'readonly');

		//Ask for ObjectStore
		var store = transaction.objectStore('Experience');
		var index = store.index('experience');


	};



});


