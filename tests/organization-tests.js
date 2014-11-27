/**
 * Tests for Organization routes.
 * @author Lily Seropian
 */

QUnit.asyncTest('Organization Tests', function(assert) {
    $.ajax('/org/CC', {
        type: 'GET',
        success: function(data, textStatus, jqxhr) {
            assert.equal(data._id, 'CC', 'GET org');
            QUnit.start();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            assert.equal(errorThrown, null, 'GET org');
            QUnit.start();
        }
    });
});