import { DBOpts } from './config';
export declare class IndexDB {
    init: Function;
    destroy: Function;
    db: any;
    storeModels: any;
    models: any;
    constructor(dataName: string, opts: DBOpts);
}
