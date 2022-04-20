import { suite, test } from 'uvu';
import { expect } from 'uvu-expect'
import sinon from 'sinon'
import {MemoryStore} from '../dist/utils/MemoryStore.js'

const ms = suite('MemoryStore')

ms('instantiation', async() => {
  const s = new MemoryStore()
  await s.put('foo', {name: 'rob'})
  let v = await s.get('foo')
  expect(v.name).to.be.equal('rob')
  await s.put('foo', {name: 'hicks'})
  v = await s.get('foo')
  expect(v.name).to.be.equal('hicks')
})


// ms.run()