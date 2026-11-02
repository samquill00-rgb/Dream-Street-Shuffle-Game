const assert=require("node:assert/strict");var audioClock=null;const performance={now:()=>10000};
  function audibleTime(mediaMs) {
    if(!audioClock||audioClock.state!=='running')return mediaMs;
    var delay=(audioClock.baseLatency||0)+(audioClock.outputLatency||0);
    if(audioClock.getOutputTimestamp){
      var stamp=audioClock.getOutputTimestamp();
      if(stamp.contextTime>0&&stamp.performanceTime>0){
        delay=audioClock.currentTime-stamp.contextTime-(performance.now()-stamp.performanceTime)/1000;
      }
    }
    return Math.max(0,mediaMs-Math.max(0,Math.min(.25,delay))*1000);
  }

assert.equal(audibleTime(6000),6000);
audioClock={state:'running',baseLatency:.01,outputLatency:.04};assert.equal(audibleTime(6050),6000);
audioClock={state:'running',currentTime:10.1,getOutputTimestamp:()=>({contextTime:10,performanceTime:9990})};assert(Math.abs(audibleTime(6090)-6000)<.001);
assert.equal(audibleTime(20),0);audioClock.state='suspended';assert.equal(audibleTime(6000),6000);console.log('audible clock checks passed');
