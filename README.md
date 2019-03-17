# Secretary - NodeJS Secrets Management

Secretary (etiology: Keeper of secrets) provides an abstract way to manage (currently only retrieve) secrets.

Currently supports:

* AWS Secrets Manager
* Hashicorp Vault


## Installation 

```bash
$ npm install secretary-secrets
```

## Usage

```typescript
import Secretary, {AWSSecretsManagerAdapter} from 'secretary-secrets';

const manager = new Secretary({
    adapter: new AWSSecretsManagerAdapter({
        region: 'us-east-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    })
});

async function main() {
    const someSecret = await manager.fetchSecret('some/secret/path', 'redis_host');
    
    console.log(someSecret); // redis://localhost:6379
}
```
