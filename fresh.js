import { Context } from 'ctex'

function Flow(gen){
  function itra(){
    if(!(this instanceof itra)){ return new itra(...arguments)}
    let to = function(flow){
      return flow.with(this)
    }
    let fn = gen.apply({ to }, arguments)
    let args = arguments
    fn.with = function(obj){
      // Object.assign(this.thisObj, obj)
      if(!obj.to){
        obj.to = to
      }
      return gen.apply(obj, args);
    }.bind(this)
    return fn;
  }
  return itra
}

function Thread(flow){
  return flow.with({
    save(){
      console.log(arguments)
    },
    now(){
      return Date.now()
    },
    to(flow){
      return flow.with(this)
    }
  })
}

let child = Flow(function*(x){
  console.log(this)
  yield x;
})

let example = Flow(function*(){
  yield 2;
  yield* this.to(child(3))
  yield 4;
  return 5;
}).with({
  // TODO: model definition
})



let f = Thread(example())
let f2 = example()
console.log(f.next())
console.log(f.next())
console.log(f.next())
console.log(f2.next())
console.log(f2.next())
console.log(f2.next())