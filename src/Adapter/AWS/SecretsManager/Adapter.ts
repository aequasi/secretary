import {SecretsManager} from 'aws-sdk';

import {AbstractAdapter, OptionsInterface, PathResult} from '../../';
import Configuration from './Configuration';

export default class Adapter extends AbstractAdapter {
    private readonly client: SecretsManager;

    public constructor(protected readonly config: Configuration = {}) {
        super(config);
        this.client = new SecretsManager({
            endpoint: config.endpoint,
            region:   config.region,
        });
    }

    public async fetchSecretPath(path: string, _options?: OptionsInterface): Promise<PathResult> {
        const data = await this.client.getSecretValue({
            SecretId:     path,
            VersionId:    this.config.versionId,
            VersionStage: this.config.versionStage,
        }).promise();

        return JSON.parse(data['SecretString']);
    }
}
