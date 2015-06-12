angular.module('starter.controllers', [])
    .controller('WelcomeCtrl', function ($scope) {
        $scope.beacons = [
            {
                "minor": 4079,
                "rssi": -87,
                "major": 207,
                "proximity": "ProximityFar",
                "accuracy": 62.62,
                "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0"
            },
            {
                "minor": 4113,
                "rssi": -87,
                "major": 207,
                "proximity": "ProximityFar",
                "accuracy": 62.62,
                "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0"
            },
            {
                "minor": 4159,
                "rssi": -87,
                "major": 207,
                "proximity": "ProximityFar",
                "accuracy": 62.62,
                "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0"
            }
        ];
        var uuid = "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0";
        var major = "207";
        var minor = "4159";

        $scope.getLogo = function (minor) {
            var res;
            if (minor == 4159){
                res = 'img/logos/tienda01.png';
            }
            if (minor == 4113){
                res = 'img/logos/tienda02.png';
            }
            if (minor == 4079){
                res = 'img/logos/tienda03.png';
            }
            console.log('la imagen es: '+ res);
            return res;
        };

        $scope.tienda = {
            uuid: uuid,
            identifier: 'superTienda',
            major: major,
            typeName: 'BeaconRegion'
        };
        $scope.updateRangedRegions = function () {
            cordova.plugins.locationManager.getRangedRegions()
                .then(function (rangedRegions) {
                    console.log('Updated Ranged regions:', JSON.stringify(rangedRegions, null, '\\t'));
                    //$scope.beacons = rangedRegions;
                })
        };
        $scope.startRanging = function () {
            console.log('startRanging()');
            var beaconRegion = cordova.plugins.locationManager.Regions.fromJson($scope.tienda);
            console.log('Started Parsed BeaconRegion object: ' + JSON.stringify(beaconRegion, null, '\\t'));
            cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
                .fail(function (error) {
                    console.log('Error al terminar el monitoreo');
                })
                .done();
        };
        var delegate = new cordova.plugins.locationManager.Delegate();
        delegate.didRangeBeaconsInRegion = function (pluginResult) {
            console.log('didRangeBeaconsInRegion()', pluginResult);
            pluginResult.id = new Date().getTime();
            pluginResult.timestamp = new Date();

            console.log('el resultado plugin es: ' + JSON.stringify(pluginResult));
            if (pluginResult.beacons.length>0){
                $scope.beacons = pluginResult.beacons;
                $scope.$apply();
                $scope.updateRangedRegions();
            }

        };

        cordova.plugins.locationManager.requestAlwaysAuthorization();
        cordova.plugins.locationManager.setDelegate(delegate);

        $scope.startRanging();

    })
    .controller('DashCtrl', function ($scope, $window, $state) {
        var uuid = "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0";
        var major = "207";
        var minor = "4159";

        $scope.tienda = {
            uuid: uuid,
            identifier: 'superTienda',
            major: major,
            typeName: 'BeaconRegion'
        };
        $scope.mall = {
            uuid: uuid,
            identifier: 'superMall',
            typeName: 'BeaconRegion'
        };

        $scope.entrar = function () {
            $state.go('tab.welcome');
        };

        $scope.monitoredRegions;

        $scope.updateRangedRegions = function () {
            cordova.plugins.locationManager.getMonitoredRegions()
                .then(function (monitoredRegions) {
                    console.log('Monitored regions:', JSON.stringify(monitoredRegions, null, '\\t'));
                    $scope.monitoredRegions = monitoredRegions;
                })
        };
        /*$scope.startRanging = function () {
            console.log('startRanging()');
            var beaconRegion = cordova.plugins.locationManager.Regions.fromJson($scope.tienda);
            console.log('Started Parsed BeaconRegion object: ' + JSON.stringify(beaconRegion, null, '\\t'));
            cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
                .fail($log.error)
                .done();
        };*/

        $scope.startMonitoring = function () {
            console.log('startMonitoring()');
            var beaconRegion = cordova.plugins.locationManager.Regions.fromJson($scope.mall);
            console.log('Started Parsed BeaconRegion object: ' + JSON.stringify(beaconRegion, null, '\\t'));
            $window.cordova.plugins.locationManager.stopMonitoringForRegion(beaconRegion)
                .fail(function (error) {
                    console.log('Error al terminar el monitoreo');
                })
                .done(function () {
                    console.log('Monitoreo termino Ok');
                });
            cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
                .fail(function (error) {
                    console.log('Error al iniciar el monitoreo');
                })
                .done(function () {
                    console.log('Monitoreo comenzo Ok');
                });
        };

        var delegate = new cordova.plugins.locationManager.Delegate();
        delegate.didStartMonitoringForRegion = function (pluginResult) {
            console.log('Estoy en el evento didStartMonitoringForRegion: ' + JSON.stringify(pluginResult));
            $scope.updateRangedRegions();
            if (pluginResult.state == "CLRegionStateInside") {
                console.log('Exito!!:');
                $state.go('tab.welcome');
            } else {
                console.log('Fracaso El estado es: ' + pluginResult.state);
            }
        };
        delegate.didRangeBeaconsInRegion = function (pluginResult) {
            console.log('didRangeBeaconsInRegion()', pluginResult);
            pluginResult.id = new Date().getTime();
            pluginResult.timestamp = new Date();

            console.log('hay beacons: ' + JSON.stringify(pluginResult));
            $scope.updateRangedRegions();
        };

        delegate.didDetermineStateForRegion = function (pluginResult) {
            pluginResult.id = new Date().getTime();
            pluginResult.timestamp = new Date();
            console.log('Estoy en el evento y el objeto es: ' + JSON.stringify(pluginResult));

            if (pluginResult.state == "CLRegionStateInside") {
                console.log('Exito!!:');
                $state.go('tab.welcome');
            } else {
                console.log('Fracaso El estado es: ' + pluginResult.state);
                $state.go('tab.dash');
            }

        };
        cordova.plugins.locationManager.requestAlwaysAuthorization();
        cordova.plugins.locationManager.setDelegate(delegate);

        $scope.startMonitoring();
    })

.controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
        Chats.remove(chat);
    }
})

.controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function ($scope) {
    $scope.settings = {
        enableFriends: true
    };
});
