import { Model, Context } from 'ctex';

let Thread = (flow) => Model({
  // think of [null] as arguments. This would be fn() //null parameter
  // may not need, if context state is enough instead of parameters
  history: [[null]], // double array to keep track of nested histories
  value: null,
  done: false,
  current: null,
  set current({ value, done}={}){
    if(done){
      this.done = true;
    }
    this.value = value;
    return { value, done};
  },
  inSubflow: false,
  flow,
  i: 0,
  init(){
    // Spring based on history
    this[Symbol.iterator] = () => this
  },
  next(x){
    do{
      this.current = this.flow.next(this.save(x))
    }while(this.i < this.history.length && !this.done) // sprint to catch up if behind
    return this.current;
  },
  to(generator){
    if(generator.subscribe){
      generator.subscribe('history', (history) => {
        this.resave(history)
      })
      generator.subscribe('done', (isDone, gen) => {
        if(isDone){
          this.resave(gen.value)
        }
      })
    }
    if(this.i < this.history.length-1){
      // Mimic going into the original subthread and obtaining return value (all we care about)
      return function*(){ return this.save() }.bind(this)()
    } else if(this.i === this.history.length-1 && this.inSubflow){
      if(this.inSubflow){
        // TODO: return the "else" function, but with history passed into function
      } else {
        return function*(){ return this.save() }.bind(this)()
      }
    }
    else {
      // TODO: REFACTOR to just literally return flow but subscribe to flow's `done` and `history` endpoints
      return function*(withObj){
        // TODO: mark as inside this inner flow
        // TODO: subcribe to save() to keep up-to-date history
        // maybe even a root subscribe to inner flow to update a this property (will get saved bc it's in values())
        let subthread = generator(withObj);
        subthread.subscribe(history, function(h){
          this.resave(history); // replace the final value from history
        }.bind(this))
        this.inSubflow = false;
        let a = yield* subthread;
        this.inSubflow = false;
        this.resave(a); // replace history with result from the generator
      }.bind(this);
    }
  },
  save(v){
    if(this.i < this.history.length){
      // when sprinting to current, return value from memory, not value passed
      return this.history[this.i++]
    } else { 
      // when we don't have history, return the passed value, and remember it
      this.i++;
      this.history = [...this.history, v];
      return v;
    }
  },
  resave(v){
    this.history[i]=v;
    return v;
  }
})


// input: generator function
// output: function that outputs an iterator (generator function)
// function.with() => attach arguments to generator context
// function[Symbol.iterator] = 
let Flow = (flow) => {
  let fn = function(){
    let params = {...this,...arguments[0]}
    let thread = Thread(flow(params))(params)
    return thread
  }
  fn.with = function(obj){
    return fn.bind({ ...fn, ...obj });
  }
  // fn[Symbol.iterator] = function(){ return this }
  return fn;
}

// Idea: Set this[Symbol.iterator] on returned function from Flow that wraps inner generator