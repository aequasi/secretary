import {readFile} from 'fs';

import {AbstractPathAdapter, PathResult} from '../../';
import Configuration from './Configuration';

interface Secrets {
    [key: string]: string | Secrets;
}

export default class Adapter extends AbstractPathAdapter {
    private secrets: Secrets;

    public constructor(protected readonly config: Configuration) {
        super(config);
    }

    public getPath(path: string): Promise<PathResult> {
        return this.memoize<PathResult>(path, async () => {
            if (!this.secrets) {
                await this.loadSecrets();
            }

            const resolved = this.resolve(path);
            const response: PathResult = {};
            for (const key of Object.keys(resolved)) {
                if (typeof resolved[key] !== 'object') {
                    response[key] = resolved[key];
                }
            }

            return response;
        });
    }

    private async loadSecrets(): Promise<void> {
        return new Promise((resolve, reject) => {
            readFile(this.config.file, (err, buffer) => {
                if (err) {
                    return reject(err);
                }

                this.secrets = JSON.parse(buffer.toString('utf8'));
                resolve();
            });
        });
    }

    private resolve(path: string): any {
        const properties = Array.isArray(path) ? path : path.split('/');

        return properties.reduce((prev, curr) => prev && prev[curr], this.secrets as any);
    }
}
