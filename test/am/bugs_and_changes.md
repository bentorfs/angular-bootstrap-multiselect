angular-bootstrap-multiselect:
## BUG 1
display-prop Worked only for String type values.
### FIX
```
var result = displayName;
if(angular.isString(result)) {
	result = result.toLowerCase();
	result = result.indexOf($scope.searchFilter.toLowerCase()) > -1;
}
```
### CODE
```
$scope.search = function () {
	var counter = 0;
	return function (item) {
		if (counter > $scope.searchLimit) {
			return false;
		}
		var displayName = $scope.getDisplay(item);
		if (displayName) {
			var result = displayName;
			if(angular.isString(result)) {
				result = result.toLowerCase();
				result = result.indexOf($scope.searchFilter.toLowerCase()) > -1;
			}
			if (result)
				counter++;
			return result;
		}
	}
};
```

## BUG 2
In my experience, I always wanted my the id property and not the entire item.
### FIX
Added attribute item-value. false as default, and when true will do what I described.
### CODE
Add ```itemValue: '=?'``` to scope
(Instead of selectAll, unselectAll, and toggleItem)
```
function getItemValue(item) {
    return $scope.itemValue && angular.isObject(item)? item[$scope.idProp] : item;
}

function ngChange() {
    if(angular.isFunction($scope.ngChange))
        return $scope.ngChange;
    return function(){};
}

$scope.selectAll = function () {
    $scope.selectedOptions = $scope.resolvedOptions.map(getItemValue);
    $scope.unselectedOptions = [];
    ngChange();
};

$scope.unselectAll = function () {
    $scope.selectedOptions = [];
    $scope.unselectedOptions = $scope.resolvedOptions.map(getItemValue);
    ngChange();
};

$scope.toggleItem = function (item) {
    if (typeof $scope.selectedOptions === 'undefined')
        $scope.selectedOptions = [];

    var itemData = getItemValue(item);

    var selectedIndex = $scope.selectedOptions.indexOf(itemData);
    if (selectedIndex !== -1) {
        $scope.unselectedOptions.push($scope.selectedOptions[selectedIndex]);
        $scope.selectedOptions.splice(selectedIndex, 1);
    } else if ($scope.selectionLimit === 0 || $scope.selectedOptions.length < $scope.selectionLimit) {
        var unselectedIndex = $scope.unselectedOptions.indexOf(itemData);
        $scope.unselectedOptions.splice(unselectedIndex, 1);
        $scope.selectedOptions.push(itemData);
    }
    ngChange();
};
```

## Note 1
I don't believe this note is required at all.
### Code
```
var updateSelectionLists = function () {
    if (!$ngModelCtrl.$viewValue) {
        if ($scope.selectedOptions) {
            $scope.selectedOptions = [];
        }
        $scope.unselectedOptions = $scope.resolvedOptions.slice(); // Take a copy
    } else {
        /*$scope.selectedOptions = $scope.resolvedOptions.filter(function (el) {
            var id = $scope.getId(el);
            for (var i = 0; i < $ngModelCtrl.$viewValue.length; i++) {
                var selectedId = $scope.getId($ngModelCtrl.$viewValue[i]);
                if (id === selectedId) {
                    return true;
                }
            }
            return false;
        });
        $scope.unselectedOptions = $scope.resolvedOptions.filter(function (el) {
            return $scope.selectedOptions.indexOf(el) < 0;
        });*/
    }
};
```

## Feature 1
I added a no-parameters ng-change option
### Example
```
ng-change="log()"
$scope.log = function() { console.log($scope.selection) };
```
### Code
The code above includes the ngChange feature (BUG 2),
The only change required is add ```ngChange: '&'``` to scope

## Note 2
All e2e test successfully ran