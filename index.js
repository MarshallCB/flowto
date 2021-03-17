function* child(){
  yield console.log(this);
}

function* parent(){
  console.log(this)
  yield* child()
}

function flow(gen){
  let fn = function(){
    return gen.apply(this.thisObj, arguments)
  }
  return fn.bind({
    thisObj: {
      to(gen2){
        return gen2.with()
      }
    },
    with(obj){
      return Object.assign(this.thisObj, obj)
    }
  })

}

let flow = parent.call({ hello: 'world' })
console.log(flow.next())
console.log(flow.next())


