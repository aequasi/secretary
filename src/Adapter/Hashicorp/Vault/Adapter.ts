import * as nodeVault from 'node-vault';

import {AbstractPathAdapter, PathResult} from '../../';
import Configuration, {AppRoleOptions} from './Configuration';

export default class Adapter extends AbstractPathAdapter {
    private client: nodeVault.client;

    private loggedIn: boolean = false;

    private readonly appRole?: AppRoleOptions;

    private readonly secretPath: string;

    public constructor(protected readonly config: Configuration) {
        super(config);

        const {appRole, secretPath} = config;
        this.client                 = config.client;
        this.appRole                = appRole;
        if (!appRole) {
            this.loggedIn = true;
        }

        this.secretPath = secretPath || 'secret';
    }

    public getPath(path: string): Promise<PathResult> {
        return this.memoize<PathResult>(path, async () => {
            path = this.secretPath + '/' + path;
            if (!this.loggedIn) {
                await this.logIn();
            }

            const result = await this.client.read(path);

            return result.data;
        });
    }

    private async logIn(): Promise<void> {
        if (this.appRole) {
            await this.client.approleLogin(this.appRole);
        }

        this.loggedIn = true;
    }
}
