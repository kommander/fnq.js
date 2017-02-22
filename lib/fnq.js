/**
 * FNQ - [Function Queue]
 * Queue functions to be run in guaranteed order (async)
 */

var fnq = module.exports = function(immediate){
  if(this instanceof fnq) {
    throw new Error('Use the function version of fnq, not the "new" keyword. ( var Q = fnq(); )');
  }

  var q = [],
    last = -1,
    executing = false,
    immediate = typeof immediate != 'undefined' ? immediate : true,
    stack = 0,
    running = false
  ;

  // Handle next fn in queue
  function next(){

    // Check sync execution stack and tick next when reaching a maximum
    if(executing){
      stack++;
      if(stack > 2000) {
        stack = 0;
        setImmediate(next);
        return;
      }
    }

    var it = q[++last];

    // Cut of handled part of the queue
    if(last > 1000000) {
      q = q.splice(last);
      last = -1;
    }

    // Handle next in queue
    if(it) {
      executing = true;
      it[0].apply(it[2], it[1]);
      executing = false;
      return;
    }

    // Reset queue after its emptied
    q = [];
    last = -1;
    running = false;

  }

  const api = {

    /**
     * Add a function to the queue
     */
    push: function(fn, args, context) {
      args = args || [];
      args.push(next);
      q.push([fn, args, context]);

      if(immediate) {
        this.run();
      }
    },

    /**
     * Run the queue (fnq will run automatically when fn is added by default)
     */
    run: function(){
      if(!running) {
        running = true;
        next();
      }
    }
  };

  Object.defineProperties(api, {
    length: {
      get: () => q.length,
    },
  });

  return api;
}
