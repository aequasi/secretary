import * as LRUCache from 'lru-cache';
import {AdapterInterface, ConfigurationInterface, OptionsInterface, PathResult, Result} from './';

export default abstract class AbstractAdapter implements AdapterInterface {
    protected cache?: LRUCache<string, any>;

    protected constructor(protected readonly config: ConfigurationInterface) {
        if (this.shouldCache) {
            const {enabled, ...cacheOptions} = this.config.cache;
            this.cache                       = new LRUCache<string, any>(cacheOptions);
        }
    }

    public async fetchSecret(path: string, key?: string, options?: OptionsInterface): Promise<Result> {
        let cache: { [key: string]: string };
        if (!this.shouldCache(options) || !this.cache.has(path)) {
            cache = await this.fetchSecretPath(path, options);
            if (this.shouldCache(options)) {
                this.cache.set(path, cache);
            }
        } else {
            cache = this.cache.get(path);
        }

        return key === undefined ? cache : cache[key];
    }

    public abstract fetchSecretPath(path: string, options?: OptionsInterface): Promise<PathResult>;

    private shouldCache(options: OptionsInterface = {}): boolean {
        return this.config.cache && this.config.cache.enabled && options.cache !== false;
    }
}
