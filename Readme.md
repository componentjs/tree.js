
# component-tree

  Uber ugly hack module to give you a tree from a components dir.

### Example

 If you have `./components/component/events/1.0.5` you'll get something like:

```js
{ component:
   { events:
      { '1.0.5':
         { name: 'events',
           repo: 'component/events',
           description: 'Higher level dom event management',
           version: '1.0.5',
           keywords: [ 'event', 'events', 'subscriptions' ],
           dependencies: { 'component/event': '0.1.2', 'component/delegate': '0.2.1' },
           development: {},
           license: 'MIT',
           scripts: [ 'index.js' ] } } } }
```
