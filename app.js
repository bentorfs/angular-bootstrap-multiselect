(function () {
    'use strict';

    var docs = angular.module('btorfs.multiselect.docs', ['btorfs.multiselect', 'vk.beautify', 'hljs']);

    docs.controller('DocsController', ['$scope', '$q', '$timeout', function ($scope, $q, $timeout) {

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
		
		$scope.fnOptions = function () {
            return $q(function (resolve, reject) {
                $timeout(function () {
                    resolve([$scope.searchFilter + '1', $scope.searchFilter + '2'])
                }, 1000);
            });
        }

        $scope.embed = '<script src="bower_components/angular-bootstrap-multiselect/dist/angular-bootstrap-multiselect.min.js"></script>';

        $scope.labels = {   itemsSelected: 'éléments sélectionnés',
                            selectAll: 'Tout Selectionner',
                            unselectAll: 'Tout Déselectionner',
                            search: 'Cherchez',
                            select: 'Selectez'
                        };

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
