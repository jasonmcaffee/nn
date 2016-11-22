const nn = require('../../lib/nevernull');

//program arguments
const iterationsToRun = parseInt(process.argv[2]);


console.log(`performance test of ${iterationsToRun} iterations starting...`);

const timeThis = functionToTime =>{
    let start = process.hrtime();
    functionToTime();
    let end = process.hrtime(start);
    let duration = end[0] * 1e9 + end[1];
    return duration;
};

const measureMemoryUsageInKB = (functionToGatherMemoryUsageFor, funcWhichAcceptsResults=(functionToGatherMemoryUsageForResult, memoryUsageResult)=>0) =>{
    gc();
    let start = process.memoryUsage().heapUsed;
    let resultFromFunctionToGatherMemoryUsageFor = functionToGatherMemoryUsageFor();
    let totalMemoryUsedInKB = (process.memoryUsage().heapUsed - start) / 1024;
    gc();
    return funcWhichAcceptsResults(resultFromFunctionToGatherMemoryUsageFor, totalMemoryUsedInKB);
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
        let result = nn(example).a5.b.c.d.e();
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
        let result = nn(example).a5.b.c();
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

const generateMarkdownForPerfTestOverviewSection = ()=>{
    return `
# Performance Test Results for Node ${process.version}
Time and compare traditional safeguarded access to nevernull safeguarded access.

## How Testing is Done
A given test for N iterations is performed by timing access to nested properties.

Access is tested using traditional property safeguarded access, as well as the nevernull safeguarded access.

Each individual property access is timed in nanoseconds, and accumulated into totals.

### Access Property Nested 3 Layers Deep
e.g.
\`\`\`
//traditional
if(example && example.a5 && example.a5.b){
    result = example.a5.b.c;
}

//nevernull
result = nn(example).a5.b.c();
\`\`\`

### Access Property Nested 5 Layers Deep
e.g.
\`\`\`
//traditional
if(example && example.a5 && example.a5.b && example.a5.b.c && example.a5.b.c.d){
    result = example.a5.b.c.d.e;
}

//nevernull
result = nn(example).a5.b.c.d.e();
\`\`\`


## Results of Iteration Series

`
};

const generateMarkdownForPerfTestResult = (result) =>{
    return `
### ${ nn(result).iterationsRan() } Iterations Result

#### Access Property Nested 3 Layers Deep
Results Table

|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | ${ nn(result).traditional3LayersDeep.totalTimes.nanoseconds() } | ${ nn(result).traditional3LayersDeep.totalTimes.milliseconds() } | ${ nn(result).traditional3LayersDeep.memory.usedInKB() } |
| nevernull   | ${ nn(result).nevernull3LayersDeep.totalTimes.nanoseconds() } | ${ nn(result).nevernull3LayersDeep.totalTimes.milliseconds() } | ${ nn(result).nevernull3LayersDeep.memory.usedInKB() } |


Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| ${ nn(result).comparison.threeLayersDeep.nevernullIsXtimesSlower() } | ${ nn(result).comparison.threeLayersDeep.nevernullUsesXtimesMoreMemory() } |

#### Access Property Nested 5 Layers Deep
Results Table

|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | ${ nn(result).traditional5LayersDeep.totalTimes.nanoseconds() } | ${ nn(result).traditional5LayersDeep.totalTimes.milliseconds() } | ${ nn(result).traditional5LayersDeep.memory.usedInKB() } |
| nevernull   | ${ nn(result).nevernull5LayersDeep.totalTimes.nanoseconds() } | ${ nn(result).nevernull5LayersDeep.totalTimes.milliseconds() } | ${ nn(result).nevernull5LayersDeep.memory.usedInKB() } |

Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| ${ nn(result).comparison.fiveLayersDeep.nevernullIsXtimesSlower() } | ${ nn(result).comparison.fiveLayersDeep.nevernullUsesXtimesMoreMemory() } |

`;
};

const writePerformanceResultsToMdFile = (resultMarkdown)=>{
    var fs = require('fs');
    fs.writeFile(`perftest-results/Node-${process.version}.md`, resultMarkdown, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
};

const formatTestResult = (timeTotalResult, memoryUsageResult)=> {
    return {
        totalTimes: {
            nanoseconds: timeTotalResult,
            milliseconds: timeTotalResult / 1000000
        },
        memory: {
            usedInKB: memoryUsageResult
        }
    };
};

const runPerfTests = (iterations) =>{
    let result = {
        iterationsRan: iterations,
        traditional3LayersDeep : measureMemoryUsageInKB(()=>timeTotal(timeTraditionalSafeguardedAccess3LayersDeep, iterations), formatTestResult),
        nevernull3LayersDeep: measureMemoryUsageInKB(()=>timeTotal(timeNevernullSafeguardedAccess3LayersDeep, iterations), formatTestResult),
        traditional5LayersDeep : measureMemoryUsageInKB(()=>timeTotal(timeTraditionalSafeguardedAccess5LayersDeep, iterations), formatTestResult),
        nevernull5LayersDeep: measureMemoryUsageInKB(()=>timeTotal(timeNevernullSafeguardedAccess5LayersDeep, iterations), formatTestResult),

        get comparison() {
            return {
                threeLayersDeep:{
                    nevernullIsXtimesSlower: Math.round(nn(this).nevernull3LayersDeep.totalTimes.nanoseconds() / nn(this).traditional3LayersDeep.totalTimes.nanoseconds() * 100) / 100,
                    nevernullUsesXtimesMoreMemory: Math.round(nn(this).nevernull3LayersDeep.memory.usedInKB() / nn(this).traditional3LayersDeep.memory.usedInKB() * 100) / 100
                },
                fiveLayersDeep:{
                    nevernullIsXtimesSlower: Math.round(nn(this).nevernull5LayersDeep.totalTimes.nanoseconds() / nn(this).traditional5LayersDeep.totalTimes.nanoseconds() * 100) / 100,
                    nevernullUsesXtimesMoreMemory: Math.round(nn(this).nevernull5LayersDeep.memory.usedInKB() / nn(this).traditional5LayersDeep.memory.usedInKB() * 100) / 100
                }
            };
        }
    };

    return result;
};

const runIterationsAndGenerateReportMd = iterationsToRun =>{
    let perfTestResult = runPerfTests(iterationsToRun);
    let perftestResultMarkdown = generateMarkdownForPerfTestResult(perfTestResult);
    console.log(perftestResultMarkdown);
    return perftestResultMarkdown;
};

const runPredefinedSetOfIterationsAndWriteReportMdToDisk = ()=>{
    let perfTestResultMarkdown = [20, 200, 2000].map(runIterationsAndGenerateReportMd).join('\n');
    writePerformanceResultsToMdFile(
      generateMarkdownForPerfTestOverviewSection() +
      perfTestResultMarkdown);
};

/**
 * If iterations are passed in, only run the number of iterations specified.
 * Otherwise, run a series of iterations and write out a report in md so it can be viewed on github.
 */
if(iterationsToRun > 0){
    runIterationsAndGenerateReportMd(iterationsToRun);
}else{
    runPredefinedSetOfIterationsAndWriteReportMdToDisk();
}

