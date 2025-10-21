import cluster  from "node:cluster"
import os from "node:os"

const CPU_LEN = Math.min(os.cpus().length, 4); // now Limit to 4 workers we can scale as needed

console.log(`Number of CPUs: ${CPU_LEN}`);

if(cluster.isPrimary){
    // Primary process
    console.log(`Primary ${process.pid} is running`);
    
    // Fork workers
    for(let i = 0; i < CPU_LEN; i++){
        cluster.fork()
    }

  // restart on worker exit
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
    console.log(`Worker ${process.pid} started`);
    // handle server
    import("./app");

}