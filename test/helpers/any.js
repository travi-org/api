'use strict';

const
    DEFAULT_STRING_LENGTH = 8,
    TLD_LENGTH = 3,
    HOST_LENGTH = 20;

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
    const
        chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomNumber,
        randomString = '',
        i;

    length = length || DEFAULT_STRING_LENGTH;
    for (i = 0; i < length; i += 1) {
        randomNumber = int(chars.length);
        randomString += chars.substring(randomNumber, randomNumber + 1);
    }

    return randomString;
}

function protocol() {
    const protocols = ['http', 'https'];

    return `${protocols[int(protocols.length)]}://`;
}

function domain() {
    return `${string(HOST_LENGTH)}.${string(TLD_LENGTH)}`;
}

function host() {
    return `${string()}.${domain()}`;
}

function url() {
    return `${protocol()}${host()}/${string()}`;
}

function email() {
    return `${string()}@${domain()}`;
}

function simpleObject() {
    return {
        [string()]: string()
    };
}

function listOf(constructor, options) {
    const list = [];
    let i,
        listSize = int();

    if (options && options.min) {
        listSize += options.min;
    }

    for (i = 0; i < listSize; i += 1) {
        list.push(constructor());
    }

    return list;
}

module.exports = {
    int,
    string,
    url,
    email,
    listOf,
    simpleObject
};
