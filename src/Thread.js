// this.to(Flow) --> bind our save function to this Flow
// this.save() --> no-op, unless a part of a thread (in which case, it saves!)
// Thread is a proxy for generators. It saves all values from next(v) and values from this.save() in child flows.
// Thread will auto-sprint to the current index if it's given a history context

import { Model } from 'ctex'

let ThreadModel = Model({
  history: [[null]],
  index: 0,
  value: null,
  done: false,
  current: null,
  *flow(){},
  set current({ value, done}={}){
    if(done){
      this.done = true;
    }
    this.value = value;
    return { value, done};
  },
  save(value){
    if(this.index >= this.history.length){
      this.history = [...this.history, value]
      this.index++;
      return value;
    } else {
      let savedValue = this.history[this.index];
      this.index += 1;
      return savedValue;
    }
  },
  to(flow){
    flow.next(null)
    flow.throw({ save, to, message: "Not a Flow!" })
    return flow;
  },
  next(value){
    this.current = this.flow(this.save(value))
    return this.current;
  },
  init(){
    let curr;
    while(this.index < this.history.length){
      curr = this.flow.next(this.save())
    }
    this.current = curr;
  }
})

export let Thread = (flow) => {
  return ThreadModel({ flow })
}

function to(gen){
  gen.throw({ to, save: (value) => console.log(value), message: "Not a flow!"})
  return gen;
}

export let Flow = function(generator){
  // let g = function*(){
  //   // default to no-ops
  //   let runtime = {to:v=>v,save:v=>v}
  //   while(1){
  //     try{
  //       yield null;
  //       return yield* generator.apply(runtime, arguments);
  //     } catch(e){
  //       // special trick to pass save() function down the chain of nested generators
  //       if(e.to && e.save){
  //         Object.assign(runtime, { to: e.to, save: e.save })
  //       }
  //     }
  //   }
    
  // }.bind(generator)
  // return a function that returns an instantiated generator that skips the first step (to get inside try/catch)
  let g = function(){
    let flow = generator.apply(this, arguments)
    return flow;
  }.bind(this)
  return g
}.bind({ save: console.log,to:v=>v })


function to(generator){
  
}