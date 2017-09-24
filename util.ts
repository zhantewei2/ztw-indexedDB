export function toCB(colle:any,method:string,val:any,cb:Function){
  const req=colle['__proto__'][method].call(colle['__proto__'],val);
  req.onsuccess=(e:any)=>{cb(null,e.target.result)};
  req.onerror=(e:any)=>{cb(e.target.result,null)};
};
export function asyncForEach(arr:Array<any>,every:Function,end:Function){
  arr.length?every(arr[0],(out:boolean)=>{if(!out)asyncForEach(arr.slice(1),every,end)}):end();
}


export class Subject{
  constructor(){}
  obs:Array<any>=[];
  subscribe(cb){
    this.obs.push(cb);
    return {unsubscribe:()=>this.obs.splice(this.obs.indexOf(cb),1)}
  }
  next(val?:any){
    this.obs.forEach((ob:any)=>ob(val));
  }
}
