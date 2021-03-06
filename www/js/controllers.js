angular.module('app.controllers', [])

.controller('menuCtrl', ['$window', '$state', '$scope', '$rootScope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($window, $state, $scope, $rootScope, $stateParams) {
    $scope.logOut = function() {
        // Logout to firebase and remove the token from session
        firebase.auth().signOut().then( function() {
            $window.sessionStorage.removeItem('auth');
            alert("Thank you for using this app! See you soon.")
            $state.go("login");
        }).catch(function(error) {
            alert(error.message);
        });
    };

    $scope.bookParking = function() {
        $state.go("bookParking");
    };

    $scope.myBooking = function() {
        $state.go("booking");
    };

    $scope.myProfile = function() {
        $state.go("tabsController.account");
    };
}])

.controller('loginCtrl', ['$window', '$state', '$scope', '$rootScope', '$stateParams', '$http', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($window, $state, $scope, $rootScope, $stateParams, $http) {
    $scope.initialize = function() {
        $scope.forms = {
            loginUser: true,
            createAccount: false,
            resetPassword: false
        }

        $scope.user = {
            email: '',
            password: '',
            name: '',
            mobile_no: ''
        };
    };

    $scope.validateName = function(name) {
        return name.length > 0;
    };

    $scope.validateMobile = function(mobile) {
        return true;
    };

    $scope.validateEmail = function(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    $scope.validatePassword = function(password) {
        return password.match(/\d/g) && password.match(/[a-z]/) && password.match(/[A-Z]/);
    };

    $scope.clearUserFields = function() {
        for (var field in $scope.user) {
            $scope.user[field] = '';
        }
    }

    $scope.hideAllForms = function() {
        for (var form in $scope.forms) {
            $scope.forms[form] = false;
        }
    };

    $scope.showLoginUserForm = function() {
        $scope.clearUserFields();
        $scope.hideAllForms();
        $scope.forms.loginUser = true;
    };

    $scope.showResetPasswordForm = function() {
        $scope.clearUserFields();
        $scope.hideAllForms();
        $scope.forms.resetPassword = true;
    };

    $scope.showCreateAccountForm = function() {
        $scope.clearUserFields();
        $scope.hideAllForms();
        $scope.forms.createAccount = true;
    };

    $scope.logIn = function() {
        if (!$scope.validateEmail($scope.user.email)) {
            alert("Please enter valid email.");
        } else {
            $rootScope.showLoader = true;
            // Signin to firebase using email and password
            firebase.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password).then( function(auth) {
                var user = firebase.auth().currentUser;
                // Get generated token and store it to session
                // Use the token for rest api authentication
                user.getIdToken(true).then( function(idToken) {
                    $window.sessionStorage.auth = JSON.stringify({
                        id: user.uid,
                        name: user.displayName,
                        email: user.email,
                        token: idToken
                    });
                    $rootScope.showLoader = false;
                    $state.go("bookParking");
                }).catch(function(error) {
                    $rootScope.showLoader = false;
                    alert(error.message);
                });
            }).catch(function(error) {
                $rootScope.showLoader = false;
                alert(error.message);
            });
        }
    };

    $scope.createAccount = function() {
        if (!$scope.validateName($scope.user.name)) {
            alert("Please enter your name.");
        } else if (!$scope.validateMobile($scope.user.mobile_no)) {
            alert("Please enter your mobile number.");
        } else if (!$scope.validateEmail($scope.user.email)) {
            alert("Please enter valid email.");
        } else if (!$scope.validatePassword($scope.user.password)) {
            alert("Please enter valid passsword.");
        } else {
            firebase.auth().createUserWithEmailAndPassword($scope.user.email, $scope.user.password).then( function(auth) {
                var user = firebase.auth().currentUser;
                user.updateProfile({
                    displayName: $scope.user.name,
                    photoURL: ""
                }).then(function() {
                    alert("You are now registered! Please login to continue using the application");
                    $state.go("login");
                }).catch(function(error) {
                    alert(error.message);
                });
            }).catch(function(error) {
                alert(error.message);
            });
        }
    };

    $scope.resetPassword = function() {
        if (!$scope.validateEmail($scope.user.email)) {
            alert("Please enter valid email.");
        } else {
            firebase.auth().sendPasswordResetEmail($scope.user.email).then( function(auth) {
                alert("An email has been sent to your email address. This email describes how to get your new password");
                $scope.showLoginUser();
            }).catch(function(error) {
                alert(error.message);
            });
        }
    };
}])

.controller('accountCtrl', ['$window','$state', '$scope', '$rootScope', '$stateParams', '$http', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($window, $state, $scope, $rootScope, $stateParams, $http) {
    $scope.initialize = function(){
        $scope.forms = {
            changeName: false,
            changeEmail: false,
            changePassword: false
        }
    };

    $scope.hideAllForms = function() {
        for (var form in $scope.forms) {
            $scope.forms[form] = false;
        }
    };

    $scope.changeName = function(){
        $scope.hideAllForms();

        var auth = JSON.parse($window.sessionStorage.auth);
        $scope.tempUser = {
            name: auth.name,
        };
        $scope.forms.changeName = true;
    };

    $scope.changeEmail = function(){
        $scope.hideAllForms();

        var auth = JSON.parse($window.sessionStorage.auth);
        $scope.tempUser = {
            email: auth.email,
        };
        $scope.forms.changeEmail = true;
    };

    $scope.changePassword = function(){
        $scope.hideAllForms();

        var auth = JSON.parse($window.sessionStorage.auth);
        $scope.tempUser = {
            password: '',
            confirm_password: '',
        };
        $scope.forms.changePassword = true;
    };

    $scope.validateName = function(name){
        return name.length > 0;
    };

    $scope.validateEmail = function(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    $scope.validatePassword = function(password) {
        return password.match(/\d/g) && password.match(/[a-z]/) && password.match(/[A-Z]/);
    };

    $scope.validateConfirmPassword= function(password, confirm_password) {
        return password == confirm_password;
    };

    $scope.saveName = function(){
        if (!$scope.validateName($scope.tempUser.name)) {
            alert("Invalid name!");
        } else {
            var user = firebase.auth().currentUser;
            user.updateProfile({
                displayName: $scope.tempUser.name,
                photoURL: ""
            }).then(function() {
                alert("Successfully updated!")
            }).catch(function(error) {
                alert(error.message);
            });
        }
    }

    $scope.saveEmail = function(){
        if (!$scope.validateEmail($scope.tempUser.email)) {
            alert("Invalid email!");
        } else {
            var user = firebase.auth().currentUser;
            user.updateEmail(
                $scope.tempUser.email
            ).then(function() {
                alert("Successfully updated!")
            }).catch(function(error) {
                alert(error.message);
            });
        }
    }

    $scope.savePassword = function(){
        if (!$scope.validatePassword($scope.tempUser.password)) {
            alert("Invalid password!");
        } else if (!$scope.validateConfirmPassword($scope.tempUser.password, $scope.tempUser.confirm_password)) {
            alert("Passwords doesn't match!");
        } else {
            var user = firebase.auth().currentUser;
            user.updatePassword(
                $scope.tempUser.password
            ).then(function() {
                alert("Successfully updated!")
            }).catch(function(error) {
                alert(error.message);
            });
        }
    }

    $scope.discardChanges = function(){
        $scope.initialize();
    };
}])

.controller('paymentCtrl', ['$window', '$state', '$scope', '$rootScope', '$stateParams', '$http', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($window, $state, $scope, $rootScope, $stateParams, $http) {
    $scope.initialize = function(){
        $scope.showForm = false;
        $scope.payments = [];

        if ($window.sessionStorage.auth) {
            var auth = JSON.parse($window.sessionStorage.auth);
            var url = 'https://parkit-10834.firebaseio.com/payment.json?orderBy="user_id"&equalTo="' + auth.id + '"&auth=' + auth.token;
            $rootScope.showLoader = true;
            $http.get(url).success(function (data, status, headers, config) {
                if (data) {
                    for (var key in data) {
                        $scope.payments.push({
                            id: key,
                            card_type: data[key].card_type,
                            card_no: data[key].card_no,
                            expiry_mm: data[key].expiry_mm,
                            expiry_yy: data[key].expiry_yy,
                            security_code: data[key].security_code,
                            user_id: data[key].user_id
                        });
                    }
                }
                $rootScope.showLoader = false;
            }).error(function (data, status, header, config) {
                $rootScope.showLoader = false;
                alert($rootScope.errorHandler(status, data));
            });
        } else {
            alert($rootScope.errorHandler(401, {}));
        }
    };

    $scope.generateId = function(){
        var result = '';
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (var i = 28; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    $scope.validateCardType = function(card_type){
        return card_type.length > 0;
    };

    $scope.validateCardNo = function(card_no){
        return card_no > 999999999999999 && card_no < 10000000000000000;
    };

    $scope.validateExpiryMM = function(expiry_mm){
        return expiry_mm > 1 && expiry_mm < 100;
    };

    $scope.validateExpiryYY = function(expiry_yy){
        return expiry_yy > 1 && expiry_yy < 100;
    };

    $scope.validateSecurityCode = function(security_code){
        return security_code > 99 && security_code < 1000;
    };

    $scope.addPaymentMethod = function(){
        $scope.tempPayment = {
            action: 'Add',
            id: $scope.generateId(),
            card_type: '',
            card_no: '',
            expiry_mm: '',
            expiry_yy: '',
            security_code: '',
            user_id: ''
        };
        $scope.showForm = true;
    };

    $scope.editPaymentMethod = function(payment){
        $scope.tempPayment = {
            action: 'Edit',
            id: payment.id,
            card_type: payment.card_type,
            card_no: payment.card_no,
            expiry_mm: parseInt(payment.expiry_mm),
            expiry_yy: parseInt(payment.expiry_yy),
            security_code: parseInt(payment.security_code),
            user_id: payment.user_id
        };
        $scope.showForm = true;
    };

    $scope.deletePaymentMethod = function(payment){
        if (confirm('Are you sure you want to delete the payment method?')) {
            var auth = JSON.parse($window.sessionStorage.auth);
            var url = "https://parkit-10834.firebaseio.com/payment/" + payment.id + ".json" + "?auth=" + auth.token;
            $rootScope.showLoader = true;
            $http.delete(url).success(function (data, status, headers, config) {
                $scope.initialize();
            }).error(function (data, status, header, config) {
                $rootScope.showLoader = false;
                alert($scope.errorHandler(status, data));
            });
        }
    }

    $scope.saveChanges = function(){
        if (!$scope.validateCardType($scope.tempPayment.card_type)) {
            alert("Please select card type.");
        } else if (!$scope.validateCardNo($scope.tempPayment.card_no)) {
            alert("Invalid card number!");
        } else if (!$scope.validateExpiryMM($scope.tempPayment.expiry_mm)) {
            alert("Invalid expiry month!");
        } else if (!$scope.validateExpiryYY($scope.tempPayment.expiry_yy)) {
            alert("Invalid expiry year!");
        } else if (!$scope.validateSecurityCode($scope.tempPayment.security_code)) {
            alert("Invalid security code!");
        } else {
            var auth = JSON.parse($window.sessionStorage.auth);
            var url = "https://parkit-10834.firebaseio.com/payment/" + $scope.tempPayment.id + ".json" + "?auth=" + auth.token;
            var data = {
                card_type: $scope.tempPayment.card_type,
                card_no: $scope.tempPayment.card_no,
                expiry_mm: $scope.tempPayment.expiry_mm,
                expiry_yy: $scope.tempPayment.expiry_yy,
                security_code: $scope.tempPayment.security_code,
                user_id: auth.id,
            };
            $rootScope.showLoader = true;
            $http.put(url, data).success(function (data, status, headers, config) {
                $scope.tempPayment = false;
                $scope.initialize();
            }).error(function (data, status, header, config) {
                $rootScope.showLoader = false;
                alert($scope.errorHandler(status, data));
            });
        }
    };

    $scope.discardChanges = function(){
        $scope.initialize();
    };
}])

.controller('vehicleCtrl', ['$window', '$state', '$scope', '$rootScope', '$stateParams', '$http', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($window, $state, $scope, $rootScope, $stateParams, $http) {
    $scope.initialize = function(){
        $scope.showForm = false;
        $scope.vehicles = [];

        if ($window.sessionStorage.auth) {
            var auth = JSON.parse($window.sessionStorage.auth);
            var url = 'https://parkit-10834.firebaseio.com/vehicle.json?orderBy="user_id"&equalTo="' + auth.id + '"&auth=' + auth.token;
            $rootScope.showLoader = true;
            $http.get(url).success(function (data, status, headers, config) {
                if (data) {
                    for (var key in data) {
                        $scope.vehicles.push({
                            id: key,
                            plate_no: data[key].plate_no,
                            model: data[key].model,
                            year: data[key].year,
                            color: data[key].color,
                            user_id: data[key].user_id
                        });
                    }
                }
                $rootScope.showLoader = false;
            }).error(function (data, status, header, config) {
                $rootScope.showLoader = false;
                alert($rootScope.errorHandler(status, data));
            });
        } else {
            alert($rootScope.errorHandler(401, {}));
        }
    };

    $scope.generateId = function(){
        var result = '';
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (var i = 28; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    $scope.validatePlateNo = function(plate_no){
        return plate_no.length == 7;
    };

    $scope.validateModel = function(model){
        return model.length > 0
    };

    $scope.validateYear = function(year){
        return year > 999 && year < 10000;
    };

    $scope.validateColor = function(color){
        return color.length > 0
    };

    $scope.addVehicle = function(){
        $scope.tempVehicle = {
            action: 'Add',
            id: $scope.generateId(),
            plate_no: '',
            model: '',
            year: '',
            color: '',
            user_id: ''
        };
        $scope.showForm = true;
    };

    $scope.editVehicle = function(vehicle){
        $scope.tempVehicle = {
            action: 'Edit',
            id: vehicle.id,
            plate_no: vehicle.plate_no,
            model: vehicle.model,
            year: parseInt(vehicle.year),
            color: vehicle.color,
            user_id: vehicle.user_id
        };
        $scope.showForm = true;
    };

    $scope.deleteVehicle = function(vehicle){
        if (confirm('Are you sure you want to delete the vehicle?')) {
            var auth = JSON.parse($window.sessionStorage.auth);
            var url = "https://parkit-10834.firebaseio.com/vehicle/" + vehicle.id + ".json" + "?auth=" + auth.token;
            $rootScope.showLoader = true;
            $http.delete(url).success(function (data, status, headers, config) {
                $scope.initialize();
            }).error(function (data, status, header, config) {
                $rootScope.showLoader = false;
                alert($rootScope.errorHandler(status, data));
            });
        }
    }

    $scope.saveChanges = function(){
        if (!$scope.validatePlateNo($scope.tempVehicle.plate_no)) {
            alert("Invalid Plate Number!");
        } else if (!$scope.validateModel($scope.tempVehicle.model)) {
            alert("Invalid vehicle model!");
        } else if (!$scope.validateYear($scope.tempVehicle.year)) {
            alert("Invalid vehicle year of purchase!");
        } else if (!$scope.validateColor($scope.tempVehicle.color)) {
            alert("Invalid vehicle color!");
        } else {
            var auth = JSON.parse($window.sessionStorage.auth);
            var url = "https://parkit-10834.firebaseio.com/vehicle/" + $scope.tempVehicle.id + ".json" + "?auth=" + auth.token;
            var data = {
                plate_no: $scope.tempVehicle.plate_no,
                model: $scope.tempVehicle.model,
                year: $scope.tempVehicle.year,
                color: $scope.tempVehicle.color,
                user_id: auth.id
            };
            $rootScope.showLoader = true;
            $http.put(url, data).success(function (data, status, headers, config) {
                $scope.initialize();
            }).error(function (data, status, header, config) {
                $rootScope.showLoader = false;
                alert($rootScope.errorHandler(status, data));
            });
        }
    };

    $scope.discardChanges = function(){
        $scope.initialize();
    };
}])

.controller('parkingCtrl', ['$window', '$state', '$scope', '$rootScope', '$stateParams', '$http', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($window, $state, $scope, $rootScope, $stateParams, $http) {
    $scope.initialize = function(){
        $scope.forms = {
            editParking: false,
            manageImage: false,
            setAvailableDay: false,
            setAvailableTime: false
        };

        $scope.parkings = [];

        if ($window.sessionStorage.auth) {
            var auth = JSON.parse($window.sessionStorage.auth);
            var url = 'https://parkit-10834.firebaseio.com/parking.json?orderBy="user_id"&equalTo="' + auth.id + '"&auth=' + auth.token;
            $rootScope.showLoader = true;
            $http.get(url).success(function (data, status, headers, config) {
                if (data) {
                    for (var key in data) {
                        var images = [];
                        for (var indx in data[key].images) { images.push(data[key].images[indx]); }

                        $scope.parkings.push({
                            id: key,
                            slot_no: data[key].slot_no,
                            title: data[key].title,
                            location: data[key].location,
                            description: data[key].description,
                            rate: data[key].rate,
                            images: images,
                            user_id: data[key].useer_id
                        });
                    }
                }
                $rootScope.showLoader = false;
                $scope.showParking = true;
            }).error(function (data, status, header, config) {
                $rootScope.showLoader = false;
                alert($rootScope.errorHandler(status, data));
            });
        } else {
            alert($rootScope.errorHandler(401, {}));
        }
    };

    $scope.hideAllForms = function() {
        for (var form in $scope.forms) {
            $scope.forms[form] = false;
        }
    };

    $scope.generateId = function(){
        var result = '';
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (var i = 28; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    $scope.generateSlotNo = function(){
        var result = '';
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (var i = 5; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    $scope.generateImageName = function(){
        var result = '';
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (var i = 5; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    $scope.validateTitle = function(title){
        return title.length > 0;
    };

    $scope.validateLocation = function(location){
        return location.length > 0;
    };

    $scope.validateDescription = function(description){
        return description.length > 0;
    };

    $scope.validateRate = function(rate){
        return rate > 0;
    };

    $scope.addParkingSpace = function(){
        $scope.hideAllForms();
        $scope.tempParking = {
            action: 'Add',
            id: $scope.generateId(),
            slot_no: $scope.generateSlotNo(),
            title: '',
            location: '',
            description: '',
            rate: '',
            images: [],
            user_id: ''
        }
        $scope.forms.editParking = true;
    };

    $scope.editParkingSpace = function(parking){
        $scope.hideAllForms();
        $scope.tempParking = {
            action: 'Edit',
            id: parking.id,
            slot_no: parking.slot_no,
            title: parking.title,
            location: parking.location,
            description: parking.description,
            rate: parking.rate,
            images: parking.images,
            user_id: parking.user_id
        }
        $scope.forms.editParking = true;
    };

    $scope.deleteParkingSpace = function(parking){
        if (confirm('Are you sure you want to delete the parking space?')) {
            var auth = JSON.parse($window.sessionStorage.auth);
            var url = "https://parkit-10834.firebaseio.com/parking/" + parking.id + ".json" + "?auth=" + auth.token;
            $rootScope.showLoader = true;
            $http.delete(url).success(function (data, status, headers, config) {
                $scope.initialize();
            }).error(function (data, status, header, config) {
                $rootScope.showLoader = false;
                alert($scope.errorHandler(status, data));
            });
        }
    }

    $scope.saveChanges = function(){
        if (!$scope.validateTitle($scope.tempParking.title)) {
            alert("Please enter parking space title!");
        } else if (!$scope.validateLocation($scope.tempParking.location)) {
            alert("Please enter location!");
        } else if (!$scope.validateDescription($scope.tempParking.description)) {
            alert("Please enter description!");
        } else if (!$scope.validateRate($scope.tempParking.rate)) {
            alert("Please enter rate per hour!");
        } else {
            var auth = JSON.parse($window.sessionStorage.auth);
            var url = "https://parkit-10834.firebaseio.com/parking/" + $scope.tempParking.id + ".json" + "?auth=" + auth.token;
            var data = {
                user_id: auth.id,
                slot_no: $scope.tempParking.slot_no,
                title: $scope.tempParking.title,
                location: $scope.tempParking.location,
                description: $scope.tempParking.description,
                rate: $scope.tempParking.rate,
                images: $scope.tempParking.images,
            };
            $rootScope.showLoader = true;
            $http.put(url, data).success(function (data, status, headers, config) {
                $scope.initialize();
            }).error(function (data, status, header, config) {
                $rootScope.showLoader = false;
                alert($scope.errorHandler(status, data));
            });
        }
    };

    $scope.discardChanges = function(){
        $scope.initialize();
    };

    $scope.manageImage = function(parking){
        $scope.hideAllForms();
        $scope.tempParking = {
            id: parking.id,
            slot_no: parking.slot_no,
            title: parking.title,
            location: parking.location,
            description: parking.description,
            rate: parking.rate,
            images: parking.images,
            user_id: parking.user_id,
            availability: {id:[], date: [], hours: []}
        }
        $scope.forms.manageImage = true;
    }

    $scope.uploadImage = function(){
        navigator.camera.getPicture( function (imageURI){
            window.resolveLocalFileSystemURL(imageURI, 
                function(data){
                    data.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function () {
                            var blob = new Blob([this.result], { type: "image/jpeg" });
                            var storageRef = firebase.storage().ref();
                            var imageName = generateImageName()
                            var imageRef = storageRef.child("parking/" + parking.id + "/" + imageName + ".jpg");
                            imageRef.put(blob).then(function(snapshot) {
                                parking.images.push(snapshot.downloadURL);
                                alert("Uploaded!");
                            });
                        };
                        reader.readAsArrayBuffer(file);
                    });
                },
                function(data){
                    alert('Failed!');
                }
            );
        },
        function(message){
            alert(message);
        },
        {
            quality: 50,
            destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
        });
    };

    $scope.deleteImage = function(image) {
        if (confirm('Are you sure you want to delete the image?')) {
            alert(image);
        }
    }

    $scope.closeManageImage = function(parking){
        $scope.forms.manageImage = false;
    }

    $scope.setAvailability = function(parking){
        $scope.hideAllForms();
        $scope.tempParking = {
            id: parking.id,
            slot_no: parking.slot_no,
            title: parking.title,
            location: parking.location,
            description: parking.description,
            rate: parking.rate,
            images: parking.images,
            user_id: parking.user_id,
            availability: {id:[], date: [], hours: []}
        }
        $scope.months = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'];
        $scope.currentDate = new Date();
        $scope.setDate();
        $scope.forms.setAvailableDay = true;
    }

    $scope.prevMonth = function(){
        $scope.currentDate.setMonth($scope.currentDate.getMonth() - 1);
        $scope.setDate();
    }

    $scope.nextMonth = function(){
        $scope.currentDate.setMonth($scope.currentDate.getMonth() + 1);
        $scope.setDate();
    }

    $scope.prevDay = function(){
        var day = $scope.currentDay - 1;
        $scope.selectDay(day)
    }

    $scope.nextDay = function(){
        var day = $scope.currentDay + 1;
        $scope.selectDay(day)
    }

    $scope.closeCalendar = function(){
        $scope.forms.setAvailableDay = false;
    }

    $scope.setDate = function(){
        $scope.currentMonth = $scope.currentDate.getMonth();
        $scope.currentYear = $scope.currentDate.getFullYear();
        $scope.currentDay = $scope.currentDate.getDate();
        $scope.setDays();
    }

    $scope.setDays = function(){
        var firstDay = new Date($scope.currentYear + "-" + ($scope.currentMonth + 1) + "-1").getDay();
        var numberOfDays = new Date($scope.currentYear, $scope.currentMonth + 1, 0).getDate();

        $scope.tempParking.availability = {id:[], date: [], hours: []};
        $scope.weekDays = ['SU','MO','TU','WE','TH','FR','SA'];
        $scope.blankDays = Array.apply(null, Array(firstDay)).map(function (_, i) {return '';});
        $scope.numDays = Array.apply(null, Array(numberOfDays)).map(function (_, i) {return i+1;});

        var auth = JSON.parse($window.sessionStorage.auth);
        var url = 'https://parkit-10834.firebaseio.com/availability.json?orderBy="parking_id"&equalTo="' + $scope.tempParking.id + '"&auth=' + auth.token;
        $rootScope.showLoader = true;
        $http.get(url).success(function (data, status, headers, config) {
            if (data) {
                for (var dkey in data) {
                    $scope.tempParking.availability.id.push(dkey);
                    $scope.tempParking.availability.date.push(data[dkey].date);
                    hrs = [];
                    for (var hkey in data[dkey].hours) {
                        hrs.push(data[dkey].hours[hkey]);
                    }
                    $scope.tempParking.availability.hours.push(hrs);
                }
            }

            $scope.availDays = Array.apply(null, Array(numberOfDays)).map(function (_, d) {
                var year = $scope.currentYear;
                var month = ("0" + ($scope.currentMonth + 1)).slice(-2);
                var day = ("0" + (d+1)).slice(-2);
                var date = year + "-" + month + "-" + day;
                var indx = $scope.tempParking.availability.date.indexOf(date)
                var color = '#fff';
                var cnt = 0;

                if (new Date(date) < (new Date()).setHours(0,0,0,0)) {
                    return color;
                }

                if (indx > -1){
                    for (i=0; i<$scope.tempParking.availability.hours[indx].length; ++i) {
                        if ($scope.tempParking.availability.hours[indx][i].available) { cnt += 1; }
                    }
                }

                if (cnt > 23) { color = '#1abc9c'; }
                else if (cnt > 0 && cnt < 24) { color = '#ffe764'; }
                else { color = '#e6e6e6'; }
                return color;
            });
            $rootScope.showLoader = false;
        }).error(function (data, status, header, config) {
            $rootScope.showLoader = false;
            alert($rootScope.errorHandler(status, data));
        });
    }

    $scope.selectDay = function(day){
        $scope.currentDay = day;
        var year = $scope.currentYear;
        var month = ("0" + ($scope.currentMonth + 1)).slice(-2);
        var day = ("0" + $scope.currentDay).slice(-2);
        var date = year + "-" + month + "-" + day;

        $scope.hours = ['01','02','03','04','05','06','07','08','09','10','11','12'];

        $scope.tempAvailability = {
            id: $scope.generateId(),
            date: date,
            hours: [
                {time: '01', available: false, booked: false, bookedby: ''},
                {time: '02', available: false, booked: false, bookedby: ''},
                {time: '03', available: false, booked: false, bookedby: ''},
                {time: '04', available: false, booked: false, bookedby: ''},
                {time: '05', available: false, booked: false, bookedby: ''},
                {time: '06', available: false, booked: false, bookedby: ''},
                {time: '07', available: false, booked: false, bookedby: ''},
                {time: '08', available: false, booked: false, bookedby: ''},
                {time: '09', available: false, booked: false, bookedby: ''},
                {time: '10', available: false, booked: false, bookedby: ''},
                {time: '11', available: false, booked: false, bookedby: ''},
                {time: '12', available: false, booked: false, bookedby: ''},
                {time: '13', available: false, booked: false, bookedby: ''},
                {time: '14', available: false, booked: false, bookedby: ''},
                {time: '15', available: false, booked: false, bookedby: ''},
                {time: '16', available: false, booked: false, bookedby: ''},
                {time: '17', available: false, booked: false, bookedby: ''},
                {time: '18', available: false, booked: false, bookedby: ''},
                {time: '19', available: false, booked: false, bookedby: ''},
                {time: '20', available: false, booked: false, bookedby: ''},
                {time: '21', available: false, booked: false, bookedby: ''},
                {time: '22', available: false, booked: false, bookedby: ''},
                {time: '23', available: false, booked: false, bookedby: ''},
                {time: '24', available: false, booked: false, bookedby: ''}
            ],
            parking_id: $scope.tempParking.id
        };

        if (new Date(date) < (new Date()).setHours(0,0,0,0)) {
            alert("Not allowed!");
        } else {
            var indx = $scope.tempParking.availability.date.indexOf(date)

            if (indx > -1){
                $scope.tempAvailability = {
                    id: $scope.tempParking.availability.id[indx],
                    date: $scope.tempParking.availability.date[indx],
                    hours: $scope.tempParking.availability.hours[indx],
                    parking_id: $scope.tempParking.id
                };
            }

            $scope.availableTime = {
                checkAll: false,
                checkAllAm: false,
                checkAllPm: false
            }
            $scope.forms.setAvailableTime = true;
        }
    };

    $scope.toggleAllTime = function(){
        for (i=0; i<24; ++i) {
            $scope.selectTime(i);
        }
    };

    $scope.toggleAllAm = function(){
        for (i=0; i<12; ++i) {
            $scope.selectTime(i);
        }
    };

    $scope.toggleAllPm = function(){
        for (i=12; i<24; ++i) {
            $scope.selectTime(i);
        }
    };

    $scope.selectTime = function(indx){
        if ($scope.tempAvailability.hours[indx].booked == false){
            $scope.tempAvailability.hours[indx].available = !$scope.tempAvailability.hours[indx].available;
        }
    };

    $scope.saveAvailability = function(){
        var auth = JSON.parse($window.sessionStorage.auth);
        var url = "https://parkit-10834.firebaseio.com/availability/" + $scope.tempAvailability.id + ".json" + "?auth=" + auth.token;
        var data = {
            date: $scope.tempAvailability.date,
            hours:  $scope.tempAvailability.hours,
            parking_id: $scope.tempAvailability.parking_id
        };
        $rootScope.showLoader = true;
        $http.put(url, data).success(function (data, status, headers, config) {
            $rootScope.showLoader = false;
            $scope.forms.setAvailableTime = false;
            $scope.setDays();
        }).error(function (data, status, header, config) {
            $rootScope.showLoader = false;
            alert($scope.errorHandler(status, data));
        });
    }

    $scope.cancelAvailability = function(){
        $scope.forms.setAvailableTime = false;
        $scope.setDays();
    }   
}])

.controller('bookParkingCtrl', ['$window', '$state', '$scope', '$rootScope', '$stateParams', '$http', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($window, $state, $scope, $rootScope, $stateParams, $http) {
    $scope.initialize = function(){
        $scope.search = {
            word: "",
            advance: false
        }

        $scope.forms = {
            searchResult: false,
            parkingDetails: false,
            selectAvailableDay: false,
            selectAvailableTime: false,
            selectDateTime: false,
            bookingDetails: false
        }

        $scope.parkings = [];
    }

    $scope.hideAllForms = function() {
        for (var form in $scope.forms) {
            $scope.forms[form] = false;
        }
    };

    $scope.generateId = function(){
        var result = '';
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (var i = 28; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    $scope.generateBookingNo = function(){
        var result = '';
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (var i = 5; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    $scope.searchLocation = function() {
        if ($window.sessionStorage.auth) {
            var auth = JSON.parse($window.sessionStorage.auth);
            var url = 'https://parkit-10834.firebaseio.com/parking.json?auth=' + auth.token;

            $scope.parkings = [];
            $rootScope.showLoader = true;
            $http.get(url).success(function (data, status, headers, config) {
                if (data) {
                    for (var key in data) {
                        var images = [];
                        for (var indx in data[key].images) { images.push(data[key].images[indx]); }
                        $scope.parkings.push({
                            id: key,
                            slot_no: data[key].slot_no,
                            title: data[key].title,
                            location: data[key].location,
                            description: data[key].description,
                            rate: data[key].rate,
                            images: images,
                            user_id: data[key].useer_id
                        });
                    }
                }
                $rootScope.showLoader = false;
                $scope.forms.searchResult = true;
            }).error(function (data, status, header, config) {
                $rootScope.showLoader = false;
                alert($rootScope.errorHandler(status, data));
            });
        } else {
            alert($rootScope.errorHandler(401, {}));
        }
    }

    $scope.closeSearchResult = function() {
        $scope.forms.searchResult = false;
    }

    $scope.viewParking = function(parking) {
        $scope.tempParking = parking;
        $scope.hideAllForms();
        $scope.forms.parkingDetails = true;
    }

    $scope.backToSearch = function(){
        $scope.hideAllForms();
        $scope.forms.searchResult = true;
    }

    $scope.checkAvailability = function(parking){
        var auth = JSON.parse($window.sessionStorage.auth);
        $scope.userId = auth.id;
        $scope.months = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'];
        $scope.currentDate = new Date();
        $scope.setDate();
        $scope.forms.selectAvailableDay = true;
    }

    $scope.closeAvailability = function(parking){
        $scope.forms.selectAvailableDay = false;
    }

    $scope.prevMonth = function(){
        $scope.currentDate.setMonth($scope.currentDate.getMonth() - 1);
        $scope.setDate();
    }

    $scope.nextMonth = function(){
        $scope.currentDate.setMonth($scope.currentDate.getMonth() + 1);
        $scope.setDate();
    }

    $scope.prevDay = function(){
        var day = $scope.currentDay - 1;
        $scope.selectDay(day)
    }

    $scope.nextDay = function(){
        var day = $scope.currentDay + 1;
        $scope.selectDay(day)
    }

    $scope.closeCalendar = function(){
        $scope.showCalendar = false;
    }

    $scope.setDate = function(){
        $scope.currentMonth = $scope.currentDate.getMonth();
        $scope.currentYear = $scope.currentDate.getFullYear();
        $scope.currentDay = $scope.currentDate.getDate();
        $scope.setDays();
    }

    $scope.setDays = function(){
        var firstDay = new Date($scope.currentYear + "-" + ($scope.currentMonth + 1) + "-1").getDay();
        var numberOfDays = new Date($scope.currentYear, $scope.currentMonth + 1, 0).getDate();

        $scope.tempParking.availability = {id:[], date: [], hours: []};
        $scope.weekDays = ['SU','MO','TU','WE','TH','FR','SA'];
        $scope.blankDays = Array.apply(null, Array(firstDay)).map(function (_, i) {return '';});
        $scope.numDays = Array.apply(null, Array(numberOfDays)).map(function (_, i) {return i+1;});

        $scope.bookingDate = {
            date: $scope.months[$scope.currentMonth] + " " + 01 + ", " + $scope.currentYear,
            from: '00:00:00',
            to: '00:00:00'
        }

        $scope.frmHrs = ['00:00:00'];
        $scope.toHrs = ['00:00:00'];

        var auth = JSON.parse($window.sessionStorage.auth);
        var url = 'https://parkit-10834.firebaseio.com/availability.json?orderBy="parking_id"&equalTo="' + $scope.tempParking.id + '"&auth=' + auth.token;
        $rootScope.showLoader = true;
        $http.get(url).success(function (data, status, headers, config) {
            if (data) {
                for (var dkey in data) {
                    $scope.tempParking.availability.id.push(dkey);
                    $scope.tempParking.availability.date.push(data[dkey].date);
                    hrs = [];
                    for (var hkey in data[dkey].hours) {
                        hrs.push(data[dkey].hours[hkey]);
                    }
                    $scope.tempParking.availability.hours.push(hrs);
                }
            }

            $scope.availDays = Array.apply(null, Array(numberOfDays)).map(function (_, d) {
                var year = $scope.currentYear;
                var month = ("0" + ($scope.currentMonth + 1)).slice(-2);
                var day = ("0" + (d+1)).slice(-2);
                var date = year + "-" + month + "-" + day;
                var indx = $scope.tempParking.availability.date.indexOf(date)
                var color = '#fff';
                var cnt = 0;

                if (new Date(date) < (new Date()).setHours(0,0,0,0)) {
                    return color;
                }

                if (indx > -1){
                    for (i=0; i<$scope.tempParking.availability.hours[indx].length; ++i) {
                        if ($scope.tempParking.availability.hours[indx][i].available) { cnt += 1; }
                    }
                }

                if (cnt > 23) { color = '#1abc9c'; }
                else if (cnt > 0 && cnt < 24) { color = '#ffe764'; }
                return color;
            });
            $rootScope.showLoader = false;
        }).error(function (data, status, header, config) {
            $rootScope.showLoader = false;
            alert($rootScope.errorHandler(status, data));
        });
    }

    $scope.selectDay = function(day){
        $scope.currentDay = day;
        var year = $scope.currentYear;
        var month = ("0" + ($scope.currentMonth + 1)).slice(-2);
        var day = ("0" + $scope.currentDay).slice(-2);
        var date = year + "-" + month + "-" + day;

        $scope.hours = ['01','02','03','04','05','06','07','08','09','10','11','12'];

        $scope.tempAvailability = {
            id: $scope.generateId(),
            date: date,
            hours: [
                {time: '01', available: false, booked: false, bookedby: ''},
                {time: '02', available: false, booked: false, bookedby: ''},
                {time: '03', available: false, booked: false, bookedby: ''},
                {time: '04', available: false, booked: false, bookedby: ''},
                {time: '05', available: false, booked: false, bookedby: ''},
                {time: '06', available: false, booked: false, bookedby: ''},
                {time: '07', available: false, booked: false, bookedby: ''},
                {time: '08', available: false, booked: false, bookedby: ''},
                {time: '09', available: false, booked: false, bookedby: ''},
                {time: '10', available: false, booked: false, bookedby: ''},
                {time: '11', available: false, booked: false, bookedby: ''},
                {time: '12', available: false, booked: false, bookedby: ''},
                {time: '13', available: false, booked: false, bookedby: ''},
                {time: '14', available: false, booked: false, bookedby: ''},
                {time: '15', available: false, booked: false, bookedby: ''},
                {time: '16', available: false, booked: false, bookedby: ''},
                {time: '17', available: false, booked: false, bookedby: ''},
                {time: '18', available: false, booked: false, bookedby: ''},
                {time: '19', available: false, booked: false, bookedby: ''},
                {time: '20', available: false, booked: false, bookedby: ''},
                {time: '21', available: false, booked: false, bookedby: ''},
                {time: '22', available: false, booked: false, bookedby: ''},
                {time: '23', available: false, booked: false, bookedby: ''},
                {time: '24', available: false, booked: false, bookedby: ''}
            ],
            parking_id: $scope.tempParking.id
        };

        if (new Date(date) < (new Date()).setHours(0,0,0,0)) {
            alert("Not allowed!");
        } else {
            var indx = $scope.tempParking.availability.date.indexOf(date)

            if (indx > -1){
                $scope.tempAvailability = {
                    id: $scope.tempParking.availability.id[indx],
                    date: $scope.tempParking.availability.date[indx],
                    hours: $scope.tempParking.availability.hours[indx],
                    parking_id: $scope.tempParking.id
                };
            }

            $scope.availableTime = {
                checkAll: false,
                checkAllAm: false,
                checkAllPm: false
            }
            $scope.forms.selectAvailableTime = true;
        }
    };

    $scope.toggleAllAm = function(){
        for (i=0; i<12; ++i) {
            $scope.selectTime(i);
        }
    };

    $scope.toggleAllPm = function(){
        for (i=12; i<24; ++i) {
            $scope.selectTime(i);
        }
    };

    $scope.selectTime = function(indx){
        if ($scope.tempAvailability.hours[indx].available == true) {
                $scope.tempAvailability.hours[indx].booked = !$scope.tempAvailability.hours[indx].booked;
                if ($scope.tempAvailability.hours[indx].booked){
                    $scope.tempAvailability.hours[indx].bookedby == $scope.userId;
                } else {
                    $scope.tempAvailability.hours[indx].bookedby == '';
                }
        }
    };

    $scope.closeSelectAvailableTime = function(){
        $scope.forms.selectAvailableTime = false;
    };

    $scope.validateHours = function(hrs){
        if (hrs.length < 2) {
            return false;
        }

        for (var i = 0; i < (hrs.length-1); i++) {
            if ((hrs[i+1] - hrs[i]) > 1){
                return false;
            }
        }
        return true;
    };

    $scope.book = function() {
        var hrs = [];
        for (i=0; i<24; ++i) {
            if ($scope.tempAvailability.hours[i].available == true && $scope.tempAvailability.hours[i].booked == true) {
                hrs.push(i+1);
            }
        }

        if (!$scope.validateHours(hrs)) {
            alert("Invalid hours!");
        } else {
            var id = $scope.generateId();
            var intFrom = parseFloat(hrs[0]);
            var intTo = parseFloat(hrs[hrs.length-1]);
            var rate = parseFloat($scope.tempParking.rate);
            var total = (intTo - intFrom) * rate;

            var today = new Date();
            var year = today.getFullYear() ;
            var month = ("0" + (today.getMonth() + 1)).slice(-2);
            var day = ("0" + (today.getDate())).slice(-2);
            var hr = ("0" + (today.getHours())).slice(-2);
            var min = ("0" + (today.getMinutes())).slice(-2);

            var auth = JSON.parse($window.sessionStorage.auth);
            var url = "https://parkit-10834.firebaseio.com/booking/" + id + ".json" + "?auth=" + auth.token;
            var data = {
                booking_no: $scope.generateBookingNo(),
                date: year + '-' + month + '-' + day + ' ' + hr + ':' + min,
                parking_slot_no: $scope.tempParking.slot_no,
                parking_title: $scope.tempParking.title,
                parking_location: $scope.tempParking.location,
                parking_date: $scope.tempAvailability.date,
                parking_hours: hrs,
                rate: total.toFixed(2),
                user_id: auth.id,
                availability_id: $scope.tempAvailability.id,
                status: "Reserved"
            };
            $rootScope.showLoader = true;
            $http.put(url, data).success(function (data, status, headers, config) {
                for (var i = 0; i < (hrs.length); i++) {
                    $scope.tempAvailability.hours[hrs[i]-1].available = false;
                }
                url = "https://parkit-10834.firebaseio.com/availability/" + $scope.tempAvailability.id + ".json" + "?auth=" + auth.token;
                data = {
                    date: $scope.tempAvailability.date,
                    hours:  $scope.tempAvailability.hours,
                    parking_id: $scope.tempAvailability.parking_id
                };
                $http.put(url, data).success(function (data, status, headers, config) {
                    $rootScope.showLoader = false;
                    alert("Successfully booked!")
                }).error(function (data, status, header, config) {
                    $rootScope.showLoader = false;
                    alert($scope.errorHandler(status, data));
                });
            }).error(function (data, status, header, config) {
                $rootScope.showLoader = false;
                alert($rootScope.errorHandler(status, data));
            });
        }
    }

    $scope.showBookingDetails = function() {
        var auth = JSON.parse($window.sessionStorage.auth);
        var url = "https://parkit-10834.firebaseio.com/booking/" + $scope.bookingId + ".json?&auth=" + auth.token;
        console.log(url);
        $rootScope.showLoader = true;
        $http.get(url).success(function (data, status, headers, config) {
            if (data) {
                $scope.tempBooking = {
                    id: $scope.bookingId,
                    from_date: data.from_date,
                    to_date: data.to_date,
                    status: data.status,
                    rate: data.rate,
                    user_id: data.user_id,
                    parking_id: data.parking_id,
                    parking_slot_no: data.parking_slot_no,
                    parking_title: data.parking_title,
                    parking_location: data.parking_location
                };
            }
            $rootScope.showLoader = false;
        }).error(function (data, status, header, config) {
            $rootScope.showLoader = false;
            alert($rootScope.errorHandler(status, data));
        });
    }

    $scope.confirmBooking = function(){
        var auth = JSON.parse($window.sessionStorage.auth);
        var url = "https://parkit-10834.firebaseio.com/booking/" + $scope.tempBooking.id + ".json" + "?auth=" + auth.token;
        var data = {
            from_date: $scope.tempBooking.from_date,
            to_date: $scope.tempBooking.to_date,
            rate: $scope.tempBooking.rate,
            user_id: $scope.tempBooking.user_id,
            parking_id: $scope.tempBooking.parking_id,
            parking_slot_no: $scope.tempBooking.parking_slot_no,
            parking_title: $scope.tempBooking.parking_title,
            parking_location: $scope.tempBooking.parking_location,
            status: 'Arrived',
        };
        $rootScope.showLoader = true;
        $http.put(url, data).success(function (data, status, headers, config) {
            $scope.showBookingDetails();
        }).error(function (data, status, header, config) {
            $rootScope.showLoader = false;
            alert($rootScope.errorHandler(status, data));
        });
    };

    $scope.clearBooking = function(){
        var auth = JSON.parse($window.sessionStorage.auth);
        var url = "https://parkit-10834.firebaseio.com/booking/" + $scope.tempBooking.id + ".json" + "?auth=" + auth.token;
        var data = {
            from_date: $scope.tempBooking.from_date,
            to_date: $scope.tempBooking.to_date,
            rate: $scope.tempBooking.rate,
            user_id: $scope.tempBooking.user_id,
            parking_id: $scope.tempBooking.parking_id,
            parking_slot_no: $scope.tempBooking.parking_slot_no,
            parking_title: $scope.tempBooking.parking_title,
            parking_location: $scope.tempBooking.parking_location,
            status: 'Cleared',
        };
        $rootScope.showLoader = true;
        $http.put(url, data).success(function (data, status, headers, config) {
            $scope.showBookingDetails();
        }).error(function (data, status, header, config) {
            $rootScope.showLoader = false;
            alert($rootScope.errorHandler(status, data));
        });
    };

    $scope.cancelBooking = function(){
        var auth = JSON.parse($window.sessionStorage.auth);
        var url = "https://parkit-10834.firebaseio.com/booking/" + $scope.tempBooking.id + ".json" + "?auth=" + auth.token;
        var data = {
            from_date: $scope.tempBooking.from_date,
            to_date: $scope.tempBooking.to_date,
            rate: $scope.tempBooking.rate,
            user_id: $scope.tempBooking.user_id,
            parking_id: $scope.tempBooking.parking_id,
            parking_slot_no: $scope.tempBooking.parking_slot_no,
            parking_title: $scope.tempBooking.parking_title,
            parking_location: $scope.tempBooking.parking_location,
            status: 'Cancelled',
        };
        $rootScope.showLoader = true;
        $http.put(url, data).success(function (data, status, headers, config) {
            $scope.showBookingDetails();
        }).error(function (data, status, header, config) {
            $rootScope.showLoader = false;
            alert($rootScope.errorHandler(status, data));
        });
    };

    $scope.closeBookingDetail = function(booking) {
        $scope.initialize();
    }
}])

.controller('bookingCtrl', ['$window', '$state', '$scope', '$rootScope', '$stateParams', '$http', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($window, $state, $scope, $rootScope, $stateParams, $http) {
    $scope.initialize = function(){
        $scope.forms = {
            showBookingDetail: false,
        };

        $scope.bookings = [];

        if ($window.sessionStorage.auth) {
            var auth = JSON.parse($window.sessionStorage.auth);
            var url = 'https://parkit-10834.firebaseio.com/booking.json?orderBy="user_id"&equalTo="' + auth.id + '"&auth=' + auth.token;
            $rootScope.showLoader = true;
            $http.get(url).success(function (data, status, headers, config) {
                if (data) {
                    for (var key in data) {
                        $scope.bookings.push({
                            id: key,
                            booking_no: data[key].booking_no,
                            date: data[key].date,
                            parking_id: data[key].parking_id,
                            parking_slot_no: data[key].parking_slot_no,
                            parking_title: data[key].parking_title,
                            parking_location: data[key].parking_location,
                            parking_date: data[key].parking_date,
                            parking_hours: data[key].parking_hours,
                            rate: data[key].rate,
                            status: data[key].status,
                            user_id: data[key].user_id,
                            availability_id: data[key].availability_id,
                        });
                    }
                }
                $rootScope.showLoader = false;
            }).error(function (data, status, header, config) {
                $rootScope.showLoader = false;
                alert($rootScope.errorHandler(status, data));
            });
        } else {
            alert($rootScope.errorHandler(401, {}));
        }
    }

    $scope.hideAllForms = function() {
        for (var form in $scope.forms) {
            $scope.forms[form] = false;
        }
    };

    $scope.bookParking = function() {
        $state.go("bookParking");
    };

    $scope.viewBookingDetail = function(booking) {
        $scope.tempBooking = {
            id: booking.id,
            booking_no: booking.booking_no,
            date: booking.date,
            parking_id: booking.parking_id,
            parking_slot_no: booking.parking_slot_no,
            parking_title: booking.parking_title,
            parking_location: booking.parking_location,
            parking_date: booking.parking_date,
            parking_hours: booking.parking_hours,
            rate: booking.rate,
            status: booking.status,
            user_id: booking.user_id,
            availability_id: booking.availability_id,
        };
        $scope.hideAllForms();
        $scope.forms.showBookingDetail = true;
    }

    $scope.closeBookingDetail = function(booking) {
        $scope.initialize();
    }

    $scope.confirmBooking = function(){
        var auth = JSON.parse($window.sessionStorage.auth);
        var url = "https://parkit-10834.firebaseio.com/booking/" + $scope.tempBooking.id + ".json" + "?auth=" + auth.token;
        var data = {
            from_date: $scope.tempBooking.from_date,
            to_date: $scope.tempBooking.to_date,
            rate: $scope.tempBooking.rate,
            user_id: $scope.tempBooking.user_id,
            parking_id: $scope.tempBooking.parking_id,
            parking_slot_no: $scope.tempBooking.parking_slot_no,
            parking_title: $scope.tempBooking.parking_title,
            parking_location: $scope.tempBooking.parking_location,
            status: 'Arrived',
        };
        $rootScope.showLoader = true;
        $http.put(url, data).success(function (data, status, headers, config) {
            $scope.showBookingDetail = false;
            $scope.initialize();
        }).error(function (data, status, header, config) {
            $rootScope.showLoader = false;
            alert($rootScope.errorHandler(status, data));
        });
    };

    $scope.clearBooking = function(){
        var auth = JSON.parse($window.sessionStorage.auth);
        var url = "https://parkit-10834.firebaseio.com/booking/" + $scope.tempBooking.id + ".json" + "?auth=" + auth.token;
        var data = {
            from_date: $scope.tempBooking.from_date,
            to_date: $scope.tempBooking.to_date,
            rate: $scope.tempBooking.rate,
            user_id: $scope.tempBooking.user_id,
            parking_id: $scope.tempBooking.parking_id,
            parking_slot_no: $scope.tempBooking.parking_slot_no,
            parking_title: $scope.tempBooking.parking_title,
            parking_location: $scope.tempBooking.parking_location,
            status: 'Cleared',
        };
        $rootScope.showLoader = true;
        $http.put(url, data).success(function (data, status, headers, config) {
            $scope.showBookingDetail = false;
            $scope.initialize();
        }).error(function (data, status, header, config) {
            $rootScope.showLoader = false;
            alert($rootScope.errorHandler(status, data));
        });
    };

    $scope.cancelBooking = function(){
        if (confirm('Are you sure you want to cancel the booking?')) {
            var auth = JSON.parse($window.sessionStorage.auth);
            var url = "https://parkit-10834.firebaseio.com/booking/" + $scope.tempBooking.id + ".json" + "?auth=" + auth.token;
            var data = {
                booking_no: $scope.tempBooking.booking_no,
                date: $scope.tempBooking.date,
                parking_id: $scope.tempBooking.parking_id,
                parking_slot_no: $scope.tempBooking.parking_slot_no,
                parking_title: $scope.tempBooking.parking_title,
                parking_location: $scope.tempBooking.parking_location,
                parking_date: $scope.tempBooking.parking_date,
                parking_hours: $scope.tempBooking.parking_hours,
                rate: $scope.tempBooking.rate,
                status: 'Cancelled',
                user_id: $scope.tempBooking.user_id,
                availability_id: $scope.tempBooking.availability_id,
            };
            $rootScope.showLoader = true;
            $http.put(url, data).success(function (data, status, headers, config) {
                $rootScope.showLoader = false;
                $scope.initialize();
            }).error(function (data, status, header, config) {
                $rootScope.showLoader = false;
                alert($rootScope.errorHandler(status, data));
            });
        }
    };
}])