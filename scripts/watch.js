// Inspiration from https://dev.to/obnoxiousnerd/watch-and-build-code-with-esbuild-2h6k
// My script is less safe, maybe I'll make it better later.
const build = async (op) => {
  const timerStart = Date.now();
  require('esbuild')
    .build({
      entryPoints: [`.//${op.entry}`],
      bundle: true,
      outfile: op.outfile,
    })
    .then(() => {
      const timerEnd = Date.now();
      console.log(`Built in ${timerEnd - timerStart}ms.`);
    });
};

const args = () => {
  const args = require('process').argv;
  console.log(args);
  if (args.length > 2) return { entry: args[2], outfile: args[3] };
};

let op = args();
let dirN = `${require('path').dirname(op.entry)}/**/*`;

const watcher = require('chokidar').watch([dirN]);
console.log('Watching files in', dirN, '\n');
build(op);
watcher.on('change', () => {
  build(op);
});
