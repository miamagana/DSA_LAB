const zmq = require("zeromq/v5-compat");
let cli = [],
  req = [],
  workers = [];

let sw = zmq.socket("router");
// comunicación entre colas
let lbqrec = zmq.socket("sub");
let lbqsend = zmq.socket("push");

lbqrec.connect(`tcp://lbq:9996`);
lbqsend.connect(`tcp://lbq:9997`);
sw.bind("tcp://*:9999");
lbqrec.subscribe("work");

lbqrec.on("message", (topic, data) => {
  if (workers.length > 0) {
    console.log(data.toString());
    const { c, m } = JSON.parse(data.toString());
    console.log(`Message received from another queue c: ${c}, m:${m}`);
    sw.send([workers.shift(), "", c, "", m]);
  }
});

sw.on("message", (w, sep, c, sep2, r) => {
  console.log("Queue Message Received from server");
  if (c == "") {
    console.log(`Worker ${w} available`);
    workers.push(w);
    return;
  }
  if (cli.length > 0) {
    console.log(`Queued msg sent to worker`);
    sw.send([w, "", cli.shift(), "", req.shift()]);
  } else {
    console.log(`Worker ${w} available`);
    workers.push(w);
  }
  lbqsend.send(["results", r], () => console.log(`Results ${r} sent`));
});
