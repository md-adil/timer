# Timer library for nodejs and web

## Some use cases

```js
import timer from "@adil.sudo/timer";

async function run() {
    await timer().wait(1000); // milliseconds
    // do something
    timer("some-uid"); // another instance of timer
    timer("some-another-id").timeout(() => {});
}

run().catch((e) => console.log(e.message));
```
