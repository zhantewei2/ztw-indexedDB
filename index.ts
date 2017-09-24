import {inheritMethod} from './method/method';

import {filterModel,initTypeDB} from './model';
import {DBOpts,CollectionOpts,InitItemOpts} from './config';

export class IndexDB{
    init:Function;
    destroy:Function;
    db:any;
    storeModels:any={};
    models:any={};
    constructor(dataName:string,opts:DBOpts){
        const
        version=opts.version,
        indexDB=(window as any).indexedDB,
        getModel=(modelName:string)=>this.db.transaction(modelName, 'readwrite').objectStore(modelName),
        newModel=(modelName:string,opts:CollectionOpts)=> {
          const objectStore=this.db.createObjectStore(modelName, {keyPath: opts.keyPath});
          filterModel(objectStore,opts);
        },
        initModel=(modelName:string,opts:CollectionOpts)=>{
          let model_ztw:any={};
          model_ztw.__proto__=getModel(modelName);
          inheritMethod(model_ztw,this,modelName,opts);
          return initTypeDB(model_ztw,opts);
        };

        this.destroy=()=>indexDB.deleteDatabase(dataName);
        this.init=(initItemsOpts:Array<InitItemOpts>):any=>{
            return new Promise((resolve)=>{
                const req=indexDB.open(dataName,version);
                //define modelObj:
                initItemsOpts.forEach((i:InitItemOpts)=>{
                  Object.defineProperty(this.models,i.name,{
                    get:()=>this.storeModels[i.name]||(this.storeModels[i.name]=initModel(i.name,i.opts))
                  })
                });
                req.onupgradeneeded=(e:any)=>{
                    this.db=req.result;
                    initItemsOpts.forEach((i:InitItemOpts)=>{
                      newModel(i.name,i.opts);
                    });
                };
                req.onsuccess=(e:any)=>{
                    this.db=req.result;
                    resolve(this.models);
                };
            })
        };
    }
}
