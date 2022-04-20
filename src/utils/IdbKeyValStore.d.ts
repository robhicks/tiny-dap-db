export declare class IdbKeyValStore {
    pendingPromise: Promise<any>;
    store: any;
    constructor(dbName: any, storeName: any);
    clear(): Promise<any>;
    del(key: any): Promise<any>;
    get(key: any): Promise<any>;
    put(key: any, data: any): Promise<any>;
    set(key: any, data: any): Promise<any>;
}
