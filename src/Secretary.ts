import AdapterInterface, {PathResult, Result} from './Adapter/AdapterInterface';
import Configuration from './Configuration';

export default class Secretary {
    private adapter: AdapterInterface;

    public constructor(private readonly config: Configuration) {
        this.adapter = this.config.adapter;
    }

    public fetchSecret(path: string): Promise<PathResult>;
    public fetchSecret(path: string, key: string): Promise<string>;
    public fetchSecret(path: string, key?: string): Promise<Result> {
        if (this.config.namespace) {
            path = this.config.namespace + '/' + path;
        }

        if (!/[A-Za-z0-9/]+/.test(path)) {
            throw new Error('Path must only contain alphanumeric characters or `/`');
        }

        if (!/^\/|\/$/.test(path)) {
            throw new Error('Path not start or end with a `/`');
        }

        return this.adapter.fetchSecret(path, key);
    }
}

export {AWSSecretsManagerAdapter, AWSSecretsManagerConfiguration} from './Adapter/AWS/SecretsManager';
export {HashicorpVaultAdapter, HashicorpVaultConfiguration} from './Adapter/Hashicorp/Vault';
export {GenericJSONFileAdapter, GenericJSONFileConfiguration} from './Adapter/Generic/JSONFile';
export {AdapterInterface, AbstractAdapter} from './Adapter';
