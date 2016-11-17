const nn = require('../../lib/nevernull');

const iterationsToRun = parseInt(process.argv[2]);
if(!iterationsToRun){
    console.error('unable to run test because number of iterations to run was not passed');
    process.exit();
}

console.log(`performance test of ${iterationsToRun} iterations starting...`);

const timeThis = functionToTime =>{
    let start = process.hrtime();//Date.now();
    functionToTime();
    //let end = Date.now();
    //let duration = end - start;
    let end = process.hrtime(start);
    let duration = end[0] * 1e9 + end[1];
    return duration;
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
        let result = nn(example).a.b.c();
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
    let traditionalTimeInNano5LayersDeep =  timeTotal(timeTraditionalSafeguardedAccess5LayersDeep, iterations);
    let nevernullTimeInNano5LayersDeep = timeTotal(timeNevernullSafeguardedAccess5LayersDeep, iterations);
    let percentageFasterOfTraditional5LayersDeep = Math.floor(nevernullTimeInNano5LayersDeep / traditionalTimeInNano5LayersDeep * 100);

    let traditionalTimeInNano3LayersDeep = timeTotal(timeTraditionalSafeguardedAccess3LayersDeep, iterations);
    let nevernullTimeInNano3LayersDeep = timeTotal(timeNevernullSafeguardedAccess3LayersDeep, iterations);
    let percentageFasterOfTraditional3LayersDeep = Math.floor(nevernullTimeInNano3LayersDeep / traditionalTimeInNano3LayersDeep * 100);

    let totalTimes = {
        nanoseconds:{
            "3 layers of nesting":{
                "total nano for traditional " : traditionalTimeInNano3LayersDeep,
                "total nano for nevernull " : nevernullTimeInNano3LayersDeep
            },
            "5 layers of nesting":{
                "total nano for traditional " : traditionalTimeInNano5LayersDeep,
                "total nano for nevernull " : nevernullTimeInNano5LayersDeep
            }

        },
        milliseconds:{
            "3 layers of nesting": {
                "total ms for traditional ": traditionalTimeInNano3LayersDeep / 1000000,
                "total ms for nevernull ": nevernullTimeInNano3LayersDeep / 1000000
            },
            "5 layers of nesting": {
                "total ms for traditional ": traditionalTimeInNano5LayersDeep / 1000000,
                "total ms for nevernull ": nevernullTimeInNano5LayersDeep / 1000000
            }
        },
        percentage:{
            "3 layers of nesting":{
                "traditional is faster by ": percentageFasterOfTraditional3LayersDeep + '%'
            },
            "5 layers of nesting":{
                "traditional is faster by ": percentageFasterOfTraditional5LayersDeep + '%'
            }
        }

    };

    console.log(JSON.stringify(totalTimes, null, 2));
};

runPerfTests(iterationsToRun);

