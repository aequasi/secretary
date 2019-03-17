import {AWSSecretsManagerAdapter} from './Adapter/AWS/SecretsManager';
import {HashicorpVaultAdapter} from './Adapter/Hashicorp/Vault';

export default interface Configuration {
    adapter: AWSSecretsManagerAdapter | HashicorpVaultAdapter;

    namespace?: string;
}
