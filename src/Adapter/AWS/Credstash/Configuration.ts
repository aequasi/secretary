import Credstash from 'nodecredstash';

import {ConfigurationInterface} from '../../';

export default interface Configuration extends ConfigurationInterface {
    client: Credstash;
}
