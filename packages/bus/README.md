# @accelint/bus

## Installation

```sh
npm install @accelint/bus
```

## Usage

### Vanilla

```js
const bus = Broadcast.getInstance();

const off = bus.on('some-event', (payload) => {
  console.log(payload);
});

bus.emit('some-event', {
  some: 'payload',
});

off(); // unsubscribe from event
```

### React

```jsx
function MyComponent(props) {
  const { foo } = props;
  const [thing, setMyThing] = useState(false);

  const emit = useEmit('some-event');

  useEvent('some-event', (payload) => {
    // this callback is stable and you can access props / state without
    // the values becoming stale. Event is automatically cleaned up.

    console.log(foo);
    console.log(thing);
    console.log(payload);
  });

  const onClick = () => {
    emit({ some: 'payload' })
  }

  return (
    <button onClick={onClick}>Fire Event</button>
  )
}
