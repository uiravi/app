'use strict';

var app = angular.module("app", ["ngRoute"]);

app.config(function($routeProvider){
	$routeProvider
	.when("/", {
		title : "EP | Home",
		templateUrl : "views/home.html",
		controller : "mainController"
	})
	.when("/Login", {
		title : "EP | login",
		templateUrl : "views/login.html",
		controller : "loginController"
	})
	.when("/Dashboard", {
		title : "EP | Dashboard",
		templateUrl : "views/dashboard.html",
		controller : "mainController"
	})
	.when("/Attendance", {
		title : "EP | Attendance",
		templateUrl : "views/attendance.html",
		controller : "attendanceController"
	})
	.when("/Profile", {
		title : "EP | My Profile",
		templateUrl : "views/profile.html",
		controller : "mainController"
	})
	.when("/LeaveRequest", {
		title : "EP | Leave Request",
		templateUrl : "views/leave-request.html",
		controller : "mainController"
	})
	.when("/LeaveBalances", {
		title : "EP | Leave Balances",
		templateUrl : "views/leave-balances.html",
		controller : "mainController"
	})
	.when("/workExperience", {
		title : "EP | Work Experience",
		templateUrl : "views/work-experience.html",
		controller : "mainController"
	})
	.otherwise({redirectTo : "/"});
});


app.run(function($rootScope, $route){
    $rootScope.$on('$routeChangeSuccess', function() {
        document.title = $route.current.title;
    });
});