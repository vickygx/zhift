/**
 * Tests for Organization routes.
 * @author Lily Seropian
 */

QUnit.module('Organization');

QUnit.asyncTest('GET', function(assert) {
    $.ajax('/org/CC', {
        type: 'GET',
        success: function(data, textStatus, jqxhr) {
            assert.equal(data._id, 'CC', 'Existing org');
            QUnit.start();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            assert.equal(errorThrown, null, 'Existing org');
            QUnit.start();
        }
    });

    QUnit.stop();
    $.ajax('/org/asdf', {
        type: 'GET',
        success: function(data, textStatus, jqxhr) {
            assert.equal(data, null, 'Nonexistent org');
            QUnit.start();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            assert.equal(jqXHR.status, 404, 'Nonexistent org');
            QUnit.start();
        }
    });

    QUnit.stop();
    $.ajax('/org/', {
        type: 'GET',
        success: function(data, textStatus, jqxhr) {
            assert.equal(data, null, 'Empty org');
            QUnit.start();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            assert.equal(jqXHR.status, 404, 'Empty org');
            QUnit.start();
        }
    });
});

QUnit.asyncTest('POST', function(assert) {
    $.ajax('/org', {
        type: 'POST',
        data: {
            name: 'Test',
        },
        success: function(data, textStatus, jqxhr) {
            assert.equal(data._id, 'Test', 'Valid org')
            QUnit.start();

            QUnit.stop();
            $.ajax('/org', {
                type: 'POST',
                data: {
                    name: 'Test',
                },
                success: function(data, textStatus, jqxhr) {
                    assert.equal(data, null, 'Duplicate org')
                    QUnit.start();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    assert.equal(jqXHR.status, 403, 'Duplicate org');
                    QUnit.start();
                }
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            assert.equal(errorThrown, null, 'Valid org');
            QUnit.start();
        }
    });

    QUnit.stop();
    $.ajax('/org', {
        type: 'POST',
        data: {},
        success: function(data, textStatus, jqxhr) {
            assert.equal(data, null, 'Invalid org')
            QUnit.start();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            assert.equal(jqXHR.status, 403, 'Invalid org');
            QUnit.start();
        }
    });
});