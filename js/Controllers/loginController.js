'use strict';
app.controller("loginController", function($scope, $rootScope, $location){

	$scope.submit = function(){
		if($scope.username == "Admin" && $scope.password == "Admin"){
			sessionStorage.setItem('uName', $scope.username);
			sessionStorage.setItem('password', $scope.password);
			$rootScope.isloggedIn = true;
			$location.path("/");
		}else{
			$scope.msg = "Wrong Credentials...! Please enter Username : Admin and Password : Admin";
			$scope.loginMsg = true;
			$scope.logoutMsg = false;
		}
	};

});