import {AbstractAdapter, PathResult, Result, ContextAdapterInterface, Context} from './';

export default abstract class AbstractContextAdapter extends AbstractAdapter implements ContextAdapterInterface {
    public abstract getContext(context: Context): Promise<PathResult>;

    public abstract getSecret(key: string, context?: Context): Promise<Result>;
}
