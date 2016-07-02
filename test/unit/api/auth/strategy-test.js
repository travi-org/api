import auth from '../../../../lib/api/auth/strategy';
import apps from '../../../../lib/api/auth/apps';
import grants from '../../../../lib/api/auth/grants';

suite('api authorization', () => {
    test('that the plugin is defined', () => {
        assert.equals(auth.register.attributes, {
            name: 'auth-strategy',
            dependencies: 'scarecrow'
        });
    });

    test('that oz is registered as a strategy', () => {
        const
            next = sinon.spy(),
            strategy = sinon.spy();

        auth.register({auth: {strategy}}, null, next);

        assert.calledWith(strategy, 'oz', 'oz', 'optional', {oz: {
            encryptionPassword: 'reallylongpasswordthatisntverysecureyet',
            loadAppFunc: apps.getById,
            loadGrantFunc: grants.getById
        }});
        assert.calledOnce(next);
    });
});
