# ztw-indexedDB

### Install
```shell
  npm install ztw-indexeddb
```

## Import to your project

**A simple example to use it:**

> *EXAMPLE*
```js
  import {IndexDB} from 'ztw-indexeddb';
  const db= new IndexDB('myDataBase',{version:1});
 
  db.init([
    
    {name:'article',opts:{keyPath:'title'}},
    {name:'reply',opts:{keyPath:'userName'}}
    
  ]).then(collections=>{
   
    collections['article'].insert({...},(err)=>{...});
    collections['article'].findOne('titleKey',(err,doc)=>{...})
    
  })

```

**You can even use it by this way:**
> *EXAMPLE*
```js
  ...
  let collections;
  
  db.init([...]).then(_colls=>collections=_colls)
  
  element.onclick=()=>collections['modelName'].findOne(...);
  
```
It works well,because ztw-indexeddb will regain transaction if the objectStore transaction is closed;

**But some situation , you don't kown if the db is already initialized. now you can use method `use` even in all cases:**

> *EXAMPLE*:
```js
  const db=new IndexDB(...);
  
  db.init([{name:'modelName',opts:{keyPath:'key'}}]);
  
  db.use('modelName').then(model=>{
    model.findMany([...],(err,data)=>{});
    model.upsert({...},(err)=>{});
  })
```

# API

### collectionOpts:

- keyPath : string
- type? : 'capped'|'index'
- limit? : number;
> type=='capped' must specify
- index? : string;
> type=='index' must specify

### collectionMethod:

| method  |   arguments  |
| --------|--------------|
 findOne | (keyPath,cb) 
findMany | ([keyPath],cb)
insert   | (document,cb)
remove | (keyPath,cb)
removeAll | (cb)
upsert | (`partialDoc` or `fullDoc`,cb)
size | (cb)
purePut | (fullDoc,cb)
useCursor | (`cursorOpts`,cb)
genKey | (obj:{}):string
... | include all objectStore method

### indexCollectionMethod 

-  getList
