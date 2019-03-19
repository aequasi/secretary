import * as nodeVault from 'node-vault';

import {AbstractAdapter, OptionsInterface, PathResult} from '../../';
import Configuration, {AppRoleOptions} from './Configuration';

export default class Adapter extends AbstractAdapter {
    private client: nodeVault.client;

    private appRole?: AppRoleOptions;

    private loggedIn: boolean = false;

    private secretPath: string;

    public constructor(protected readonly config: Configuration) {
        super(config);
        const {appRole, secretPath, ...options} = config;
        this.client                             = nodeVault(options);
        this.appRole                            = appRole;
        if (options.token || !appRole) {
            this.loggedIn = true;
        }

        this.secretPath = secretPath || 'secret';
    }

    public async fetchSecretPath(path: string, _options?: OptionsInterface): Promise<PathResult> {
        path = this.secretPath + '/' + path;
        if (!this.loggedIn) {
            await this.logIn();
        }

        const result = await this.client.read(path);

        return result.data;
    }

    private async logIn(): Promise<void> {
        if (this.appRole) {
            await this.client.approleLogin(this.appRole);
        }

        this.loggedIn = true;
    }
}
