import Credstash from 'nodecredstash';

import {AbstractContextAdapter, Context, PathResult, Result} from '../../';
import Configuration from './Configuration';

export default class Adapter extends AbstractContextAdapter {
    private client: Credstash;

    public constructor(protected readonly config: Configuration) {
        super(config);

        this.client = config.client;
    }

    public getContext(context: Context): Promise<PathResult> {
        return this.memoize<PathResult>(JSON.stringify(context), async () => this.client.getAllSecrets(context));
    }

    public async getSecret(key: string, context?: Context): Promise<Result> {
        return this.memoize<Result>(JSON.stringify({key, context}), async () => {
            const result = await this.client.getSecret({name: key, ...context});

            return result[name];
        });
    }
}
