

export function flow(generator){

  return function(){
    let current;
    let currentIndex = 0;
    let local_memory = {};
    let live_this = new Proxy({}, {
      get(_,k){
        return local_memory[k];
      },
      set(_,k,v){
        local_memory[k] = v;
        this.addHistory(v);
      }
    })
    let sprint_this = new Proxy({},{
      get(_,k){
        return local_memory[k];
      },
      set(_,k,v){
        local_memory[k] = history[i++];
      }
    })
    let stack = [{
      history: [],
      iterator: null
    }]
    let history_stack = [[]];
    
    let stack = [generator.apply(this_proxy, arguments)];
    function save(val){
      last(history_stack).push()
    }
    return {
      next(ans){
        current = last(iterator_stack).next(ans);
        if(current.done){
          // We're done with this iterator
          iterator_stack.pop();
          // If there are still iterators left, send result to parent
          // Else, we're done, send result { value, done: true }
          if(iterator_stack.length > 0){
            return this.next(current.value);
          } else {
            return current;
          }
        }
        if(current.value && current.value[Symbol.iterator]){

          // We've just received a new iterator
          // eg: `yield otherGenerator()`
          iterator_stack.push(current.value[Symbol.iterator](/* TODO: specialized this */));
          // TODO: add to history stack
          // TODO: channel saves, titles, progress into parent
          // start new iterator
          
          return this.next(null);
        } else {
          return current;
        }
      },
      back(distance){
        // go back (by yields, not by saves)
      },
      load(history){

      },
      save(callback){

      },
      [Symbol.iterator]:  function(history) { return this }
    }
  }
}


let thread = {
  history: [],
  subthread: {},
  
}