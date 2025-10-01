import init, { init_solver, step_solver } from '@/pkg/rustwasm';
let ss = null;
let kfs = null;

async function loop() {
  while (true) {
    // If there is nothing to progress, we just wait for a new message
    // Since this a completely different thread, no issue with this busy wait on new message
    if (ss == null || ss.stage == "Finished") {
        await new Promise((resolve) => setTimeout(resolve));
        continue;
    }

    ss = step_solver(ss);
    postMessage(ss);
    await new Promise((resolve) => setTimeout(resolve)); 
  }
}

self.onmessage = function (e) {
  kfs = e.data;
  if (kfs.length > 1) { 
    ss = init_solver(kfs);
  } else {
    ss = null;
  }
  self.postMessage(ss);
};

init()
await loop();