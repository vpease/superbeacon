angular.module('starter.controllers', [])

.controller('DashCtrl', function($window,$scope,$log) {
    var uuid = "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0";
    var major = "207";
    var minor = "4113";

    $scope.region = {
        uuid: uuid,
        identifier: 'superBeacon',
        major: major,
        typeName: 'BeaconRegion'
    };

    $scope.updateRangeRegions = function(){
        cordova.plugins.locationManager.getRangedRegions()
            .then(function(rangedRegios){
            $log.debug('Ranged regions:',JSON.stringify(rangedRegions,null,'\\t'));
            $scope.rangedRegions= rangedRegions;
        })
    };
    $scope.startRanging = function(){
        $log.debug('startRanging()');
        var beaconRegion = cordova.plugins.locationManager.Regions.fromJson($scope.region);
        $log.debug('Parsed BeaconRegion object: ' +JSON.stringify(beaconRegion,null,'\\t'));
        cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
        .fail($log.error)
        .done();
    };

    var delegate = new cordova.plugins.locationManager.Delegate();
    delegate.didRangeBeaconsInRegion = function (pluginResult) {
        $log.debug('didRangeBeaconsInRegion()', pluginResult);
        pluginResult.id = new Date().getTime();
        pluginResult.timestamp = new Date();

        console.log('el resultado plugin es: '+ JSON.stringify(pluginResult));
    };
    cordova.plugins.locationManager.requestAlwaysAuthorization();
    cordova.plugins.locationManager.setDelegate(delegate);
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
