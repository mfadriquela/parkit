angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
    })

    .state('tabsController', {
        url: '/profile',
        templateUrl: 'templates/tabsController.html',
        abstract:true
    })

    .state('tabsController.account', {
        url: '/account',
        views: {
            'tabAccount': {
                templateUrl: 'templates/account.html',
                controller: 'accountCtrl'
            }
        }
    })

    .state('tabsController.payment', {
        url: '/payment',
        views: {
            'tabPayment': {
                templateUrl: 'templates/payment.html',
                controller: 'paymentCtrl'
            }
        }
    })

    .state('tabsController.vehicle', {
        url: '/vehicle',
        views: {
            'tabVehicle': {
                templateUrl: 'templates/vehicle.html',
                controller: 'vehicleCtrl'
            }
        }
    })

    .state('tabsController.parking', {
        url: '/parking',
        views: {
            'tabParking': {
                templateUrl: 'templates/parking.html',
                controller: 'parkingCtrl'
            }
        }
    })

    .state('bookParking', {
        url: '/bookparking',
        templateUrl: 'templates/bookParking.html',
        controller: 'bookParkingCtrl'
    })

    .state('booking', {
        url: '/booking',
        templateUrl: 'templates/booking.html',
        controller: 'bookingCtrl'
    })

    $urlRouterProvider.otherwise('/login')

});