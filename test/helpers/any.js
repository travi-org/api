'use strict';

function float(max) {
    if (undefined === max || 0 > max) {
        max = 100;
    }

    return Math.random() * max;
}

function int(max) {
    return Math.floor(float(max));
}

function string(length) {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        randomString = '',
        randomNumber,
        i;

    length = length || 8;
    for (i = 0; i < length; i += 1) {
        randomNumber = int(chars.length);
        randomString += chars.substring(randomNumber, randomNumber + 1);
    }

    return randomString;
}

function protocol() {
    var protocols = ['http', 'https'];

    return protocols[int(protocols.length)] + '://';
}

function domain() {
    return string(20) + '.' + string(3);
}

function host() {
    return string() + '.' + domain();
}

function url() {
    return protocol() + host() + '/' + string();
}

function email() {
    return string() + '@' + domain();
}

function simpleObject() {
    return {
        [string()]: string()
    };
}

function listOf(constructor, options) {
    var list = [],
        listSize = int(),
        i;

    if (options && options.min) {
        listSize += options.min;
    }

    for (i = 0; i < listSize; i += 1) {
        list.push(constructor());
    }

    return list;
}

module.exports = {
    int: int,
    string: string,
    url: url,
    email: email,
    listOf: listOf,
    simpleObject: simpleObject
};
