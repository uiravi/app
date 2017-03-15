'use strict';
app.controller("mainController", function($scope, $rootScope, $http, $location){

	$http.get("static_data/static_data.json")
	.then(function(response){
		$scope.staticData = response.data;
	});

	$scope.$on('$routeChangeStart', function(event, next, current) {
		$rootScope.isloggedIn = false;

		if(sessionStorage.getItem("uName") == "Admin" && sessionStorage.getItem("password") == "Admin"){
			$location.path(next.$$route.orignalPath);
			$rootScope.isloggedIn = true;
		}else if($rootScope.isloggedIn == false){
			$location.path("/Login");
		} 
	});

	$scope.logout = function(){
		sessionStorage.clear();
		$scope.msg = "You have successfully logged out";
		$scope.logoutMsg = true;
	};


});