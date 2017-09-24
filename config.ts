export const cappedKey='_ngz_date';
export interface DBOpts{
    version:number;
}
export interface CollectionOpts{
    keyPath:string;
    type?:'capped'|'index'|any;
    limit?:number;
    index?:any;
}
export interface InitItemOpts{
  name:string;
  opts:CollectionOpts;
}
