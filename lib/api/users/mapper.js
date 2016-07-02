import md5 from 'md5';
import _ from 'lodash';

function mapToView(user, size, scopes) {
    user.avatar = {
        src: `https://www.gravatar.com/avatar/${md5(user.email)}?size=${size}`,
        size
    };

    if (scopes) {
        return user;
    }

    return _.omit(user, 'email');
}

function mapListToView(users, size, scopes) {
    return _.map(users, (user) => {
        return mapToView(user, size, scopes);
    });
}

export default {
    mapToView,
    mapListToView
};
