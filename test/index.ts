import * as assert from 'assert';
import {AWSSecretsManagerAdapter, GenericJSONFileAdapter, HashicorpVaultAdapter, Secretary} from '../src/';

async function testGenericJSONFileAdapter() {
    const manager = new Secretary({
        adapter: new GenericJSONFileAdapter({
            file: __dirname + '/generic.json',
        }),
    });

    await runTests(manager);
}

async function testHashicorpVaultAdapter() {
    const manager = new Secretary({
        adapter: new HashicorpVaultAdapter({
            endpoint: process.env.VAULT_ADDR,
            appRole:  {
                role_id:   process.env.VAULT_ROLE_ID,
                secret_id: process.env.VAULT_SECRET_ID,
            },
        }),
    });

    await runTests(manager);
}

async function testAWSSecretsManagerAdapter() {
    const manager = new Secretary({
        adapter: new AWSSecretsManagerAdapter({
            credentials: {
                accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
            region:      'us-east-1',
        }),
    });

    await runTests(manager);
}

async function runTests(manager: Secretary) {
    assert.deepEqual({baz: 'foo'}, await manager.fetchSecret('test'));
    assert.deepEqual('foo', await manager.fetchSecret('test', 'baz'));
    assert.deepEqual({bar: 'baz'}, await manager.fetchSecret('test/foo'));
    assert.deepEqual('baz', await manager.fetchSecret('test/foo', 'bar'));
    assert.deepEqual({baz: 'Hello World'}, await manager.fetchSecret('test/foo/foobar'));
    assert.deepEqual('Hello World', await manager.fetchSecret('test/foo/foobar', 'baz'));
}

Promise.all([testGenericJSONFileAdapter(), testHashicorpVaultAdapter(), testAWSSecretsManagerAdapter()])
       .then(() => console.log('All tests pass!'))
       .catch(console.error);
