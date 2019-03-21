import {SecretsManager} from 'aws-sdk';

import {AbstractPathAdapter, PathResult} from '../../';
import Configuration from './Configuration';

export default class Adapter extends AbstractPathAdapter {
    private readonly client: SecretsManager;

    public constructor(protected readonly config: Configuration) {
        super(config);

        this.client = config.client;
    }

    public getPath(path: string): Promise<PathResult> {
        return this.memoize<PathResult>(path, async () => {
            const options: SecretsManager.GetSecretValueRequest = {SecretId: path};
            if (this.config.versionId) {
                options.VersionId = this.config.versionId;
            }
            if (this.config.versionStage) {
                options.VersionStage = this.config.versionStage;
            }

            const data = await this.client.getSecretValue(options).promise();

            return JSON.parse(data['SecretString']);
        });
    }
}
