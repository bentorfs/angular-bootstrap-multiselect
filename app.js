(function () {
    'use strict';

    var docs = angular.module('btorfs.multiselect.docs', ['btorfs.multiselect', 'vk.beautify', 'hljs']);

    docs.controller('DocsController', ['$scope', function ($scope) {

        $scope.options = ['France', 'United Kingdom', 'Germany', 'Belgium', 'Netherlands', 'Spain', 'Italy', 'Poland', 'Austria'];

        $scope.options2 = [
            {
                id: '1',
                name: 'France',
                capital: 'Paris'
            },
            {
                id: '2',
                name: 'United Kingdom',
                capital: 'London'
            },
            {
                id: '3',
                name: 'Germany',
                capital: 'Berlin'
            }
        ];

        $scope.options3 = [];
        _.forEach(_.range(0, 100000), function (number) {
            $scope.options3.push({
                name: 'country' + number,
                id: number
            });
        });

        $scope.embed = '<script src="bower_components/angular-bootstrap-multiselect/dist/angular-bootstrap-multiselect.min.js"></script>';

        $scope.exampleBasic = '<multiselect ng-model="selection" options="options"></multiselect>';
        $scope.exampleSearchBox = '<multiselect ng-model="selection" options="options" show-search="true"></multiselect>';
        $scope.exampleSelectAll = '<multiselect ng-model="selection" options="options" show-select-all="true" show-unselect-all="true"></multiselect>';
        $scope.exampleSelectionLimit = '<multiselect ng-model="selection" options="options" selection-limit="2"></multiselect>';
        $scope.exampleSearchLimit = '<multiselect ng-model="selection" options="options" show-search="true" search-limit="3"></multiselect>';
        $scope.exampleObjects = '<multiselect ng-model="selection" options="options" id-prop="id" display-prop="name"></multiselect>';
        $scope.exampleLargeDatasets = '<multiselect ng-model="selection" options="options" show-search="true" id-prop="id" display-prop="name" search-limit="10"></multiselect>';


    }]);

    docs.filter('prettyprint', ['vkBeautify', function (vkBeautify) {
        return function (data) {
            if (angular.isObject(data)) {
                data = angular.toJson(data);
            }
            if (data) {
                if (data.charAt(0) === '<') {
                    return vkBeautify.xml(data);
                } else if (data.charAt(0) === '{' || data.charAt(0) === '[') {
                    return vkBeautify.json(data);
                } else {
                    return data;
                }
            } else {
                return data;
            }
        };
    }]);


}());
