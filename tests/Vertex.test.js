import { suite, test } from 'uvu';
import { expect } from 'uvu-expect'
import sinon from 'sinon'
import Vertex from '../dist/Vertex.js';
import {MemoryStore} from '../dist/utils/MemoryStore.js'

const store = new MemoryStore()

const vt = suite('Vertex')

let sandbox

vt.before.each(() => {
  sandbox = sinon.createSandbox()
})

vt.after.each(() => {
  sandbox.reset()
})

vt('should have certain methods and properties', () => {
  const v = new Vertex({path: 'foo', store})
  expect(v.path).to.be.equal('foo')
  expect(v.del).to.be.a('function')
  expect(v.emit).to.be.a('function')
  expect(v.once).to.be.a('function')
  expect(v.on).to.be.a('function')
  expect(v.off).to.be.a('function')
  expect(v.put).to.be.a('function')
  expect(v.set).to.be.a('function')
})

vt('should put a value', async() => {
  const v = new Vertex({path: 'foo', store})
  v.put({name: 'rob'})
  v.once((val) => {
    expect(val).to.be.an('object')
    expect(val.name).to.be.equal('rob')
  })
})

vt('should get the value of the vertex once', () => {
  const rob = {name: 'rob'}
  const v = new Vertex({path: 'foo', store})
  v.put(rob)
  v.once((val) => {
    expect(val.name).to.be.equal('rob')
  })
  v.put({city: 'saratoga springs'})
  v.once((val) => {
    expect(val.city).to.be.equal('saratoga springs')
  })
})

vt('should listen for changes to the values of the vertex', async () => {
  const rob = {name: 'rob'}
  const v = new Vertex({path: 'foo', store})
  const l = sandbox.spy()
  await v.on(l)
  await v.put(rob)
  await v.put({city: 'saratoga springs'})
  await v.put({state: 'utah'})

  expect(l.callCount).to.be.equal(3)
})

vt('should remove a listener', () => {
  const rob = {name: 'rob'}
  const v = new Vertex({path: 'foo', store})
  const listener = sandbox.spy()
  v.on(listener)
  expect (v.listeners.size).to.be.equal(1)
  v.put(rob)
  v.off(listener)
  expect (v.listeners.size).to.be.equal(0)

})


vt.run()