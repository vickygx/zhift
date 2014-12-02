/**
 * Tests for Organization routes.
 * @author Lily Seropian
 */

function testOrganizationRoutes() {
    QUnit.module('Organization');

    QUnit.asyncTest('GET', function(assert) {
        $.ajax({
            url: '/org/ZhiftTest',
            type: 'GET',
            success: expectedSuccess(assert, 'Existing org', {_id: 'ZhiftTest'}),
            error: unexpectedError(assert, 'Existing org')
        });

        QUnit.stop();
        $.ajax('/org/asdf', {
            type: 'GET',
            success: unexpectedSuccess(assert, 'Nonexistent org'),
            error: expectedError(assert, 'Nonexistent org', 404)
        });

        QUnit.stop();
        $.ajax('/org/', {
            type: 'GET',
            success: unexpectedSuccess(assert, 'Empty org'),
            error: expectedError(assert, 'Empty org', 404)
        });
    });

    QUnit.asyncTest('POST', function(assert) {
        $.ajax('/org', {
            type: 'POST',
            data: {
                name: 'Test',
            },
            success: function(data, textStatus, jqXHR) {
                expectedSuccess(assert, 'Valid org', {_id: 'Test'})(data, textStatus, jqXHR);

                QUnit.stop();
                $.ajax('/org', {
                    type: 'POST',
                    data: {
                        name: 'Test',
                    },
                    success: unexpectedSuccess(assert, 'Duplicate org'),
                    error: expectedError(assert, 'Duplicate org', 403)
                });
            },
            error: unexpectedError(assert, 'Valid org')
        });

        QUnit.stop();
        $.ajax('/org', {
            type: 'POST',
            data: {},
            success: unexpectedSuccess(assert, 'Invalid org'),
            error: expectedError(assert, 'Invalid org', 403)
        });
    });
}