import { flow } from '../src/Thread'

let sub = flow(function*(){
  this.x = Math.random()*5;
  let ans = yield this.x;
  return ans;
})

let example = flow(function*(){
  let three = yield sub()
  yield three
  return 4
})

// let f = example("hello")
// f.throw({ to: (value) => console.log('to'+value), save: (value) => console.log(value), message: "Not a flow!"})
let f = example()
console.log(f.next())
console.log(f.next())
console.log(f.next())
console.log(f.next())