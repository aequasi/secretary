import {readFile} from 'fs';

import {AbstractAdapter, OptionsInterface, PathResult} from '../../';
import Configuration from './Configuration';

export default class Adapter extends AbstractAdapter {
    private secrets: any;

    public constructor(protected readonly config: Configuration) {
        super(config);
    }

    public async fetchSecretPath(path: string, _options?: OptionsInterface): Promise<PathResult> {
        if (!this.secrets) {
            await this.loadSecrets();
        }

        return this.resolve(path);
    }

    private async loadSecrets() {
        return new Promise((resolve, reject) => {
            readFile(this.config.file, (err, buffer) => {
                if (err) {
                    return reject(err);
                }

                this.secrets = buffer.toJSON();
                resolve();
            });
        });
    }

    private resolve(path: string) {
        const properties = Array.isArray(path) ? path : path.split('/');

        return properties.reduce((prev, curr) => prev && prev[curr], this.secrets);
    }
}
