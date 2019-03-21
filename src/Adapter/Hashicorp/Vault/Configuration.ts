import * as nodeVault from 'node-vault';

import {ConfigurationInterface} from '../../';

export interface AppRoleOptions {
    role_id: string;
    secret_id: string;
}

export default interface Configuration extends ConfigurationInterface {
    appRole?: AppRoleOptions;
    secretPath?: string;
    client: nodeVault.client;
}
