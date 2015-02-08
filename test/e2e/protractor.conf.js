var ScreenShotReporter = require('protractor-screenshot-reporter');

exports.config = {
    onPrepare: function () {

        // Store screenshots on test failure
        jasmine.getEnv().addReporter(new ScreenShotReporter({
            baseDirectory: 'test/e2e/screenshots/',
            pathBuilder: function pathBuilder(spec, descriptions, results, capabilities) {
                return descriptions.join('-');
            },
            takeScreenShotsOnlyForFailedSpecs: true
        }));

        // Maximize the browser window
        browser.driver.manage().window().maximize();

        // Disable all animations
        var disableNgAnimate = function () {
            angular.module('disableNgAnimate', []).run(['$animate', function ($animate) {
                $animate.enabled(false);
            }]);
        };
        browser.addMockModule('disableNgAnimate', disableNgAnimate);
    },
    specs: ['**/*.js'],
    multiCapabilities: [{
        'browserName': 'chrome',
        'chromeOptions': {
            'args': ['show-fps-counter=true']
        }
    }]
};
