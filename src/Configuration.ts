import {AWSSecretsManagerAdapter} from './Adapter/AWS/SecretsManager';
import {GenericJSONFileAdapter} from './Adapter/Generic/JSONFile';
import {HashicorpVaultAdapter} from './Adapter/Hashicorp/Vault';

export default interface Configuration {
    adapter: AWSSecretsManagerAdapter | HashicorpVaultAdapter | GenericJSONFileAdapter;

    namespace?: string;
}
