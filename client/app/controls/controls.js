angular.module('controls', [])
  .controller('controlsController', ['$scope', 'Socket', 'Appliance', '$state', function($scope, Socket, Appliance, $state){

    Socket.on('controlView', function(data) {
      $scope.$apply(function(){
        $scope.data = data;
      });
    });

    $scope.control = {
      minConsumption: '',
      maxConsumption: '',
      supplyMarginPercent: ''
    }

    $scope.appliance = {
      car: 85,
      tv: 27,
      refrigerator: 78,
      laundry: 9
    }

    $scope.use = Appliance.applianceStates;

    $scope.submitMin = function() {
      var data = $scope.control;
      if (data.maxConsumption === '') {
        data.maxConsumption = $scope.data.maxConsumption;
      }
      if (data.supplyMarginPercent === '') {
        data.supplyMarginPercent = +$scope.data.supplyMarginPercent.toFixed(4);
      }
      if (data.minConsumption >= data.maxConsumption) {
        alert('Minimum usage level must be less than maximum usage level');
        return;
      }
      Socket.emit('configChanges', data);
      $('input').val('');
    }

    $scope.submitMax = function() {
      var data = $scope.control;
      if (data.minConsumption === '') {
        data.minConsumption = $scope.data.minConsumption;
      }
      if (data.supplyMarginPercent === '') {
        data.supplyMarginPercent = +$scope.data.supplyMarginPercent.toFixed(4);
      }
      if (data.minConsumption >= data.maxConsumption) {
        alert('Maximum usage level must be greater than minimum usage level');
        return;
      }
      Socket.emit('configChanges', data);
      $('input').val('');
    }

    $scope.submitReserve = function() {
      var data = $scope.control;
      data.supplyMarginPercent = +data.supplyMarginPercent.toFixed(4);

      if (data.minConsumption === '') {
        data.minConsumption = $scope.data.minConsumption;
      }

      if (data.maxConsumption === '') {
        data.maxConsumption = $scope.data.maxConsumption;
      }
      if (data.minConsumption >= data.maxConsumption) {
        alert('Reserve percentage must be between 0 - 100 %');
        return;
      }
      Socket.emit('configChanges', data);
      $('input').val('');
    }

    $scope.controlCar = function() {
      Appliance.changeState('car');
      $scope.use.car = Appliance.applianceStates.car;
      var data = {};
      for (var key in Appliance.applianceStates) {
        data[key] = Appliance.applianceStates[key] ? $scope.appliance[key] : 0;
      }
      Socket.emit('applianceEngaged', data);

    }

    $scope.controlTV = function() {
       Appliance.changeState('tv');
      $scope.use.tv = Appliance.applianceStates.tv;
      var data = {};
      for (var key in Appliance.applianceStates) {
        data[key] = Appliance.applianceStates[key] ? $scope.appliance[key] : 0;
      }
      Socket.emit('applianceEngaged', data);

    }

    $scope.controlRefrigerator = function() {
       Appliance.changeState('refrigerator');
      $scope.use.refrigerator = Appliance.applianceStates.refrigerator;
      var data = {};
      for (var key in Appliance.applianceStates) {
        data[key] = Appliance.applianceStates[key] ? $scope.appliance[key] : 0;
      }
      Socket.emit('applianceEngaged', data);

    }

    $scope.controlLaundry = function() {
       Appliance.changeState('laundry');
      $scope.use.laundry = Appliance.applianceStates.laundry;
      var data = {};
      for (var key in Appliance.applianceStates) {
        data[key] = Appliance.applianceStates[key] ? $scope.appliance[key] : 0;
      }
      Socket.emit('applianceEngaged', data);

    }
    
  }]);