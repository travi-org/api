const auth = require('../../../lib/api/auth');

suite('api authorization', function () {
    test('that the plugin is defined', () => {
        assert.equals(auth.register.attributes, {
            name: 'auth-strategy',
            dependencies: 'scarecrow'
        });
    });

    test('that oz is registered as a strategy', function () {
        const
            next = sinon.spy(),
            strategy = sinon.spy();

        auth.register({auth: {strategy: strategy}}, null, next);

        assert.calledWith(strategy, 'oz', 'oz', 'optional', {oz: {
            encryptionPassword: 'password'
        }});
        assert.calledOnce(next);
    });
});