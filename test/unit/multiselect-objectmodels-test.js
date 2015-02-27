'use strict';

describe("The multiselect directive, when using object models,", function () {

    var $scope;
    var $rootScope;
    var $compile;

    beforeEach(angular.mock.module('btorfs.multiselect'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $scope = _$rootScope_.$new();
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('initializes the list lazily, when the first item is chosen', function () {
        $scope.options = [
            {
                name: 'el1',
                id: '1'
            },
            {
                name: 'el2',
                id: '2'
            },
            {
                name: 'el3',
                id: '3'
            }
        ];
        var element = $compile("<multiselect ng-model='selection' id-prop='id' display-prop='name' options='options'></multiselect>")($scope);
        $scope.$digest();
        expect(element.isolateScope().selectedOptions).toBeUndefined();

        element.isolateScope().toggleItem($scope.options[0]);
        expect(element.isolateScope().selectedOptions).toBeDefined();
        expect(element.isolateScope().selectedOptions.length).toBe(1);
    });

    it('can toggle items in the selection', function () {
        $scope.options = [
            {
                name: 'el1',
                id: '1'
            },
            {
                name: 'el2',
                id: '2'
            },
            {
                name: 'el3',
                id: '3'
            }
        ];
        var element = $compile("<multiselect ng-model='selection'  id-prop='id' display-prop='name' options='options'></multiselect>")($scope);
        $scope.$digest();

        expect(element.isolateScope().unselectedOptions.length).toBe(3);
        element.isolateScope().toggleItem(element.isolateScope().unselectedOptions[0]);
        expect(element.isolateScope().selectedOptions).toBeDefined();
        expect(element.isolateScope().selectedOptions.length).toBe(1);
        expect(element.isolateScope().unselectedOptions.length).toBe(2);

        element.isolateScope().toggleItem(element.isolateScope().selectedOptions[0]);
        expect(element.isolateScope().selectedOptions.length).toBe(0);
        expect(element.isolateScope().unselectedOptions.length).toBe(3);
    });

    it('shows a label on the button when no items have been chosen', function () {
        $scope.options = [
            {
                name: 'el1',
                id: '1'
            },
            {
                name: 'el2',
                id: '2'
            },
            {
                name: 'el3',
                id: '3'
            }
        ];
        var element = $compile("<multiselect ng-model='selection'  id-prop='id' display-prop='name' options='options'></multiselect>")($scope);
        $scope.$digest();

        expect(element.isolateScope().getButtonText()).toBe('Select');
    });

    it('shows the name of the element when one item is chosen', function () {
        $scope.options = [
            {
                name: 'el1',
                id: '1'
            },
            {
                name: 'el2',
                id: '2'
            },
            {
                name: 'el3',
                id: '3'
            }
        ];
        $scope.selection = [{
            id: '1'
        }];
        var element = $compile("<multiselect ng-model='selection'  id-prop='id' display-prop='name' options='options'></multiselect>")($scope);
        $scope.$digest();

        expect(element.isolateScope().getButtonText()).toBe('el1');
    });

    it('shows the number of elements when multiple items are chosen', function () {
        $scope.options = [
            {
                name: 'el1',
                id: '1'
            },
            {
                name: 'el2',
                id: '2'
            },
            {
                name: 'el3',
                id: '3'
            }
        ];
        $scope.selection = [{
            id: '1'
        }, {
            id: '2'
        }];
        var element = $compile("<multiselect ng-model='selection'  id-prop='id' display-prop='name' options='options'></multiselect>")($scope);
        $scope.$digest();

        expect(element.isolateScope().getButtonText()).toBe('2 selected');
    });

    it('can select and unselect all at once', function () {
        $scope.options = [
            {
                name: 'el1',
                id: '1'
            },
            {
                name: 'el2',
                id: '2'
            },
            {
                name: 'el3',
                id: '3'
            }
        ];
        $scope.selection = [];
        var element = $compile("<multiselect ng-model='selection'  id-prop='id' display-prop='name' options='options'></multiselect>")($scope);
        $scope.$digest();

        element.isolateScope().selectAll();
        $scope.$digest();
        expect($scope.selection.length).toBe(3);
        expect(element.isolateScope().selectedOptions.length).toBe(3);
        expect(element.isolateScope().unselectedOptions.length).toBe(0);

        element.isolateScope().unselectAll();
        $scope.$digest();
        expect($scope.selection.length).toBe(0);
        expect(element.isolateScope().selectedOptions.length).toBe(0);
        expect(element.isolateScope().unselectedOptions.length).toBe(3);
    });

    it('knows which items are selected', function () {
        $scope.options = [
            {
                name: 'el1',
                id: '1'
            },
            {
                name: 'el2',
                id: '2'
            },
            {
                name: 'el3',
                id: '3'
            }
        ];
        $scope.selection = [{
            id: '2'
        }];
        var element = $compile("<multiselect ng-model='selection'  id-prop='id' display-prop='name' options='options'></multiselect>")($scope);
        $scope.$digest();

        expect(element.isolateScope().isSelected($scope.options[1])).toBeTruthy();
        expect(element.isolateScope().isSelected($scope.options[2])).toBeFalsy();
    });

    it('can search inside the options', function () {
        $scope.options = [
            {
                name: 'el1',
                id: '1'
            },
            {
                name: 'el2',
                id: '2'
            },
            {
                name: 'el3',
                id: '3'
            }
        ];
        $scope.selection = [{
            id: '2'
        }];
        var element = $compile("<multiselect ng-model='selection' id-prop='id' display-prop='name' options='options'></multiselect>")($scope);
        $scope.$digest();

        element.isolateScope().searchFilter = '2';
        expect(element.isolateScope().search()($scope.options[0])).toBeFalsy();
        expect(element.isolateScope().search()($scope.options[1])).toBeTruthy();
        expect(element.isolateScope().search()($scope.options[2])).toBeFalsy();

        element.isolateScope().searchFilter = '5';
        expect(element.isolateScope().search()($scope.options[0])).toBeFalsy();
        expect(element.isolateScope().search()($scope.options[1])).toBeFalsy();
        expect(element.isolateScope().search()($scope.options[2])).toBeFalsy();
    });

});
