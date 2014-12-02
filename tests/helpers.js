/**
 * Testing helper methods.
 * @author Lily Seropian
 */

/**
 * Assert that an error with the correct status code is returned.
 * @param {Object} assert QUnit's assert.
 * @param {String} title  The name of the test.
 * @param {Number} status The expected status.
 */
var expectedError = function(assert, title, status) {
    return function(jqXHR, textStatus, errorThrown) {
        assert.equal(jqXHR.status, status, title);
        QUnit.start();
    };
};

/**
 * Handle an error being thrown when it should not be.
 * @param {[type]} assert QUnit's assert.
 * @param {String} title  The name of the test.
 */
var unexpectedError = function(assert, title) {
    return function(jqXHR, textStatus, errorThrown) {
        assert.equal(errorThrown, null, title);
        QUnit.start();
    };
};

/**
 * Assert that the response has the correct contents.
 * @param {Object} assert QUnit's assert.
 * @param {String} title  The name of the test.
 * @param {Object} expectedDate The expected response body.
 */
var expectedSuccess = function(assert, title, expectedData) {
    return function(data, textStatus, jqXHR) {
        var expectedKeys = Object.keys(expectedData);
        for (var i = 0; i < expectedKeys.length; i++) {
            var key = expectedKeys[i];
            assert.equal(data[key], expectedData[key], title);
        }
        QUnit.start();
    };
};

/**
 * Handle a request succeeding when it should not.
 * @param {Object} assert QUnit's assert.
 * @param {String} title  The name of the test.
 */
var unexpectedSuccess = function(assert, title) {
    return function(data, textStatus, jqXHR) {
        assert.equal(data, null, title);
        QUnit.start();
    };
};

/**
 * Send a request to clear and seed the test database.
 */
function clearAndSeed() {
    $.ajax({
        url: '/test',
        method: 'DELETE',
        success: function() {
            $.ajax({
                url: '/test',
                method: 'POST',
                success: function(data, textStatus, jqXHR) {
                    $.ajax({
                        url: '/login',
                        type: 'POST',
                        data: {
                            email: 'test@zhift.com',
                            password: 'uepxcqkmxr3w7grs4qew',
                            org: 'ZhiftTest'
                        },
                        success: function() {
                            testOrganizationRoutes();
                            testScheduleRoutes();
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(jqXHR.status, errorThrown);
                        }
                    });
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR.status, errorThrown);
                }
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status, errorThrown);
        }
    });
}

clearAndSeed();