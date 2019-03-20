import {SecretsManager} from 'aws-sdk';

import {AbstractAdapter, OptionsInterface, PathResult} from '../../';
import Configuration from './Configuration';

export default class Adapter extends AbstractAdapter {
    private readonly client: SecretsManager;

    public constructor(protected readonly config: Configuration) {
        super(config);

        const options: SecretsManager.ClientConfiguration = {
            region:      config.region,
            credentials: config.credentials,
        };
        if (config.endpoint) {
            options.endpoint = config.endpoint;
        }

        this.client = new SecretsManager(options);
    }

    public async fetchSecretPath(path: string, _options?: OptionsInterface): Promise<PathResult> {
        const options: SecretsManager.GetSecretValueRequest = {
            SecretId: path,
        };
        if (this.config.versionId) {
            options.VersionId = this.config.versionId;
        }
        if (this.config.versionStage) {
            options.VersionStage = this.config.versionStage;
        }

        const data = await this.client.getSecretValue(options).promise();

        return JSON.parse(data['SecretString']);
    }
}
