import { test } from 'uvu';
import { expect } from 'uvu-expect'
import core from '../dist/core.js'
import {MemoryStore} from '../dist/utils/MemoryStore.js'

const store = new MemoryStore()

test.only('get(root)', () => {
  const db = core(store)
  const root = db.get();
  expect(root.currentPath).to.be.equal('root')
  const users = root.get('users')
  expect(users.currentPath).to.be.equal('root.users')
  // db.get().get('users').get('rob').once((val) => console.log(`val`, val))
});

// test('get() chained', () => {
//   const db = Core({store})
//   db.get().get('users').get('rob')
//   expect(root.currentPath).to.be.equal('root.users.rob')
// });

// test('get() dot-separated path', () => {
//   const db = Core({store})
//   const root = db.get('root.users.rob')
//   expect(root.currentPath).to.be.equal('root.users.rob')
// });

// test('stores off path for later use', () => {
//   const db = Core({store})
//   const rob = db.get().get('users').get('rob')
//   const glenda = db.get().get('users').get('glenda')

//   rob.put({name: 'rob'})
//   glenda.put({name: 'glenda'})
//   rob.once((val) => console.log(`val`, val))
//   glenda.once((val) => console.log(`val`, val))
//   // rob.once((val) => expect(val.name).to.be.equal('rob'))
//   // glenda.once((val) => expect(val.name).to.be.equal('glenda'))
// })

// test('put()', async () => {
//   const db = Core({store})
//   db.get().get('users').get('rob').put({name: 'rob'}).once((val) => console.log(`val`, val))
// })

test.run();