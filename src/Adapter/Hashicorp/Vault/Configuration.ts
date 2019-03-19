import {VaultOptions} from 'node-vault';

import {ConfigurationInterface} from '../../';

export interface AppRoleOptions {
    role_id: string;
    secret_id: string;
}

export default interface Configuration extends VaultOptions, ConfigurationInterface {
    appRole?: AppRoleOptions;
    secretPath?: string
}
