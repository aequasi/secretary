import Credstash = require('nodecredstash');

const assert       = require('assert');
const {existsSync} = require('fs');
const {join}       = require('path');
const AWSMock      = require('aws-sdk-mock');
const AWS          = require('aws-sdk');
const nodeVault    = require('node-vault');

AWSMock.setSDKInstance(AWS);

const {AWSCredstashAdapter, AWSSecretsManagerAdapter, GenericJSONFileAdapter, HashicorpVaultAdapter, Secretary}
          = require('../src/');

if (existsSync(join(__dirname, '.env'))) {
    require('dotenv').config({path: join(__dirname, '.env')});
}

async function testAWSCredstashAdapter() {
    const client = Credstash({table: 'test', awsOpts: {region: 'us-east-1'}});

    const manager = new Secretary(new AWSCredstashAdapter({client}));

    assert(manager !== null);
}

async function testAWSSecretsManagerAdapter() {
    AWSMock.mock('SecretsManager', 'getSecretValue', (args) => {
        return Promise.resolve({SecretString: JSON.stringify(getExpectedPathSecret(args.SecretId))});
    });
    const manager = new Secretary(new AWSSecretsManagerAdapter({
        client: new AWS.SecretsManager(),
    }));

    return runPathTests(manager);
}

async function testGenericJSONFileAdapter() {
    const manager = new Secretary(
        new GenericJSONFileAdapter({
            file: __dirname + '/generic.json',
        }),
    );

    return runPathTests(manager);
}

async function testHashicorpVaultAdapter() {
    const manager = new Secretary(
        new HashicorpVaultAdapter({
            client:  nodeVault({endpoint: process.env.VAULT_ADDR}),
            appRole: {
                role_id:   process.env.VAULT_ROLE_ID,
                secret_id: process.env.VAULT_SECRET_ID,
            },
        }),
    );

    return runPathTests(manager);
}

function getExpectedContextSecret(key) {
    switch (key) {
        case 'baz':
            return 'foo';
        case 'bar':
            return 'baz';
    }
}

/*
 function getExpectedContextSecrets(type) {
 switch (type) {
 case 'test':
 return {baz: 'foo'};
 }
 }*/

function getExpectedPathSecret(key) {
    switch (key) {
        case 'test':
            return {baz: 'foo'};
        case 'test/foo':
            return {bar: 'baz'};
        case 'test/foo/foobar':
            return {baz: 'Hello World'};
    }
}

/**
 *
 * @param {Secretary<AbstractPathAdapter>} manager
 * @returns {Promise<void>}
 */
async function runPathTests(manager) {
    // Single Keys
    assert.deepEqual('foo', await manager.getSecret('baz', 'test'));
    assert.deepEqual('baz', await manager.getSecret('bar', 'test/foo'));
    assert.deepEqual('Hello World', await manager.getSecret('baz', 'test/foo/foobar'));

    // Entire Paths
    assert.deepEqual({baz: 'foo'}, await manager.getSecrets('test'));
    assert.deepEqual({bar: 'baz'}, await manager.getSecrets('test/foo'));
    assert.deepEqual({baz: 'Hello World'}, await manager.getSecrets('test/foo/foobar'));

    AWSMock.restore();
}

/**
 * @param {Secretary<AbstractContextAdapter>} manager
 * @returns {Promise<void>}
 */
async function runContextTests(manager) {
    // Single Keys
    assert.deepEqual('foo', await manager.getSecret('baz'));
    assert.deepEqual('baz', await manager.getSecret('bar', {context: {type: 'test'}}));

    // Entire Paths
    assert.deepEqual({bar: 'baz'}, await manager.getSecrets({context: {type: 'test'}}));
}

function run(name, func) {
    return new Promise((resolve, reject) => {
        func().then(() => {
            console.log(name + ' passed.');
            resolve();
        }).catch((e) => {
            console.error('Error with: ' + name, e);
            reject();
        });
    });
}

Promise.all([
           run('AWSCredstash', testAWSCredstashAdapter),
           run('AWSSecretsManager', testAWSSecretsManagerAdapter),
           run('GenericJSONFile', testGenericJSONFileAdapter),
           run('HashicorpVault', testHashicorpVaultAdapter),
       ])
       .then(() => console.log('\nAll tests pass!'))
       .catch((e) => console.error('Tests failed!', e));
