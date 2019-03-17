export interface PathResult { [key: string]: string; }
export type Result = string | PathResult;

export default interface AdapterInterface {
    fetchSecret(path: string, key?: string, options?: any): Promise<Result>;

    fetchSecretPath(path: string, options?: any): Promise<PathResult>;
}
