import AdapterInterface, {PathResult, Result} from './Adapter/AdapterInterface';
import Configuration from './Configuration';

export default class Secretary {
    private adapter: AdapterInterface;

    public constructor(private readonly config: Configuration) {
        this.adapter = this.config.adapter;
    }

    /**
     *
     * @param {string} path
     * @param {string?} key
     */
    public fetchSecret(path: string): Promise<PathResult>;
    public fetchSecret(path: string, key: string): Promise<string>;
    public fetchSecret(path: string, key?: string): Promise<Result> {
        if (this.config.namespace) {
            path = this.config.namespace + '/' + path;
        }

        return this.adapter.fetchSecret(path, key);
    }
}

export {AWSSecretsManagerAdapter, AWSSecretsManagerConfiguration} from './Adapter/AWS/SecretsManager';
export {HashicorpVaultAdapter, HashicorpVaultConfiguration} from './Adapter/Hashicorp/Vault';
export {AdapterInterface, AbstractAdapter} from './Adapter';
