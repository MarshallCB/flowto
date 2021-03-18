<div align="center">
  <img src="https://github.com/marshallcb/flowto/raw/main/meta/flowto.png" alt="flowto" width="100" />
</div>

<h1 align="center">flowto</h1>
<h3 align="center">Enhanced generator functions</h3>

<div align="center">
  <a href="https://npmjs.org/package/flowto">
    <img src="https://badgen.now.sh/npm/v/flowto" alt="version" />
  </a>
  <a href="https://packagephobia.com/result?p=flowto">
    <img src="https://badgen.net/packagephobia/install/flowto" alt="install size" />
  </a>
</div>

# Overview
- Conforms to `Iterable` and `Iterator` protocols (just like generators)
- Supports `back()` and `forward()` (similar to browser navigation)
- Serializable state (respawn at same position)
  - `save((state) => { })` callback is invoked every time the state changes
  - `load(state)` will return the iterator with equivalent state
- Composable (sub-iterator states are maintained)

