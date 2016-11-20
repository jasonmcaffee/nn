const nn = require('../../lib/nevernull');

const iterationsToRun = parseInt(process.argv[2]);
if(!iterationsToRun){
    console.error('unable to run test because number of iterations to run was not passed');
    process.exit();
}

console.log(`performance test of ${iterationsToRun} iterations starting...`);

const timeThis = functionToTime =>{
    let start = process.hrtime();
    functionToTime();
    let end = process.hrtime(start);
    let duration = end[0] * 1e9 + end[1];
    return duration;
};

const measureMemoryUsageInKB = (functionToGatherMemoryUsageFor, funcWhichAcceptsResults=(functionToGatherMemoryUsageForResult, memoryUsageResult)=>0) =>{
    let start = process.memoryUsage().heapUsed;
    let resultFromFunctionToGatherMemoryUsageFor = functionToGatherMemoryUsageFor();
    let totalMemoryUsedInKB = (process.memoryUsage().heapUsed - start) / 1024;
    gc();
    funcWhichAcceptsResults(resultFromFunctionToGatherMemoryUsageFor, totalMemoryUsedInKB);
};

let example = {
    //1 layer deep
    a1: 'some value',

    //5 layers deep
    a5: {
        b: {
            c: {
                d: {
                    e: 'some value'
                }
            }
        }
    }
};

const timeTraditionalSafeguardedAccess5LayersDeep = ()=>{
    return timeThis(()=>{
        let result;
        if(example && example.a5 && example.a5.b && example.a5.b.c && example.a5.b.c.d){
            result = example.a5.b.c.d.e;
        }
    });
};

const timeNevernullSafeguardedAccess5LayersDeep = ()=>{
    return timeThis(()=>{
        let result = nn(example).a.b.c.d.e();
    });
};


const timeTraditionalSafeguardedAccess3LayersDeep = ()=>{
    return timeThis(()=>{
        let result;
        if(example && example.a5 && example.a5.b){
            result = example.a5.b.c;
        }
    });
};

const timeNevernullSafeguardedAccess3LayersDeep = ()=>{
    return timeThis(()=>{
        let result = nn(example).a.b.c();
    });
};

const timeTotal = (timeReturningFunction, iterations) =>{
    let totalTime = 0;
    for(let i=0; i < iterations; ++i){
        let time = timeReturningFunction();
        totalTime += time;
    }
    return totalTime;
};

const runPerfTests = (iterations) =>{
    const fiveLayersOfNestingLabel = "5 layers of nesting";
    const threeLayersOfNestingLabel = "3 layers of nesting";
    const traditionalKbLabel = "total KB memory used for traditional";
    const nnKbLabel = "total KB memory used for nevernull";

    let totalTimes = {
        nanoseconds:{
            [fiveLayersOfNestingLabel]:{},
            [threeLayersOfNestingLabel]:{}
        },
        milliseconds:{
            [fiveLayersOfNestingLabel]:{},
            [threeLayersOfNestingLabel]:{}
        },
        percentage:{
            [fiveLayersOfNestingLabel]:{},
            [threeLayersOfNestingLabel]:{}
        }
    };
    let memoryUsage = {
        [fiveLayersOfNestingLabel]:{
            [traditionalKbLabel]:"",
            [nnKbLabel]:""
        },
        [threeLayersOfNestingLabel]:{
            [traditionalKbLabel]:"",
            [nnKbLabel]:""
        }
    };

    measureMemoryUsageInKB(()=>timeTotal(timeTraditionalSafeguardedAccess5LayersDeep, iterations), (timeTotalResult, memoryUsageResult)=>{
        totalTimes.nanoseconds[fiveLayersOfNestingLabel]["total nano for traditional"] = timeTotalResult;
        totalTimes.milliseconds[fiveLayersOfNestingLabel]["total ms for traditional"] = timeTotalResult / 1000000;
        memoryUsage[fiveLayersOfNestingLabel][traditionalKbLabel] = memoryUsageResult;
    });

    measureMemoryUsageInKB(()=>timeTotal(timeNevernullSafeguardedAccess5LayersDeep, iterations), (timeTotalResult, memoryUsageResult)=>{
        totalTimes.nanoseconds[fiveLayersOfNestingLabel]["total nano for nevernull"] = timeTotalResult;
        totalTimes.milliseconds[fiveLayersOfNestingLabel]["total ms for nevernull"] = timeTotalResult / 1000000;
        memoryUsage[fiveLayersOfNestingLabel][nnKbLabel] = memoryUsageResult;
    });

    measureMemoryUsageInKB(()=>timeTotal(timeTraditionalSafeguardedAccess3LayersDeep, iterations), (timeTotalResult, memoryUsageResult)=>{
        totalTimes.nanoseconds[threeLayersOfNestingLabel]["total nano for traditional"] = timeTotalResult;
        totalTimes.milliseconds[threeLayersOfNestingLabel]["total ms for traditional"] = timeTotalResult / 1000000;
        memoryUsage[threeLayersOfNestingLabel][traditionalKbLabel] = memoryUsageResult;
    });

    measureMemoryUsageInKB(()=>timeTotal(timeNevernullSafeguardedAccess3LayersDeep, iterations), (timeTotalResult, memoryUsageResult)=>{
        totalTimes.nanoseconds[threeLayersOfNestingLabel]["total nano for nevernull"] = timeTotalResult;
        totalTimes.milliseconds[threeLayersOfNestingLabel]["total ms for nevernull"] = timeTotalResult / 1000000;
        memoryUsage[threeLayersOfNestingLabel][nnKbLabel] = memoryUsageResult;
    });

    let threeLayersTraditionalNano = totalTimes.nanoseconds[threeLayersOfNestingLabel]["total nano for traditional"];
    let threeLayersNevernullNano = Math.floor(totalTimes.nanoseconds[threeLayersOfNestingLabel]["total nano for nevernull"]);

    totalTimes.percentage[threeLayersOfNestingLabel] = {
        "traditional is faster by ":  Math.floor(threeLayersNevernullNano / threeLayersTraditionalNano * 100)
    };


    let fiveLayersTraditionalNano = totalTimes.nanoseconds[fiveLayersOfNestingLabel]["total nano for traditional"];
    let fiveLayersNevernullNano = Math.floor(totalTimes.nanoseconds[fiveLayersOfNestingLabel]["total nano for nevernull"]);

    totalTimes.percentage[fiveLayersOfNestingLabel] = {
        "traditional is faster by ":  Math.floor(fiveLayersNevernullNano / fiveLayersTraditionalNano * 100)
    };

    console.log(JSON.stringify(totalTimes, null, 2));
    console.log(JSON.stringify(memoryUsage, null, 2));
};

runPerfTests(iterationsToRun);
