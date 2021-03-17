// import { Thread } from '../src/Thread'
// let example = Flow(function*({ menu, fill, choice, collect, cook }){
//   let woah = yield choice;
//   woah = yield choice;
//   woah = yield choice;
//   return woah;
// })

// let flow = example()
// console.log(flow.next())
// for(let step of flow){
//   console.log(step)
// }
// console.log(flow.next("OMG"))

import { Flow } from '../src/Thread'

let sub = Flow(function*(test){
  yield test
  this.save("in the subflow")
  return "YES"
})

let example = Flow(function*(test){
  yield test
  yield 2;
  this.save("Here between 2 and 3")
  let three = yield* this.to(sub("BOOYA"))
  yield three
  return 4
})

// function to(gen){
//   gen.throw({ to, save: (value) => console.log(value), message: "Not a flow!"})
//   return gen;
// }

// let f = example("hello")
// f.throw({ to: (value) => console.log('to'+value), save: (value) => console.log(value), message: "Not a flow!"})
let f = example("hello")
console.log(f.next())
console.log(f.next())
console.log(f.next())
console.log(f.next())