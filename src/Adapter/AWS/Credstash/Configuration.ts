import {ConfigurationInterface} from '../../';
import Credstash from 'nodecredstash';

export default interface Configuration extends ConfigurationInterface {
    client: Credstash;
}
