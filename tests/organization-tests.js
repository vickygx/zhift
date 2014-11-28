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
});