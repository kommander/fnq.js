/**
 * Tests
 */
var expect = require('expect.js');
var sinon = require('sinon');

var fnq = require('../');

describe('fnq', function(){

  //
  //
  describe('#constructor', function(){
    //
    //
    it('should create q with #push and #run methods', function(){
      var q = fnq();

      expect(q).to.have.property('push');
      expect(q).to.have.property('run');
    });

    //
    //
    it('should run automatically by default', function(done){
      var q = fnq();

      q.push(function(){
        done();
      });
    });

    //
    //
    it('should run immediate in a row', function(done){
      var q = fnq();

      var counter = 0;

      q.push(function(next){
        next();
      });  

      q.push(function(){
        done();
      });

    });

  });

  //
  //
  describe('#push', function(){
    
    //
    //
    it('should add a function to the queue with arguments to execute', function(done){
      var q = fnq();

      q.push(function(value) {
        expect(value).to.be('value');
        done();
      }, ['value']);
    });

    //
    //
    it('should allow to set the execution context for a function', function(done){
      var q = fnq();

      q.push(function() {
        expect(this.local).to.be('value');
        done();
      }, null, { local: 'value' });
    });



  });

  //
  //
  describe('#run', function(){
    //
    //
    it('should start the queue if "immediate" is set to false', function(done){
      var q = fnq(false);

      var ran = false;
      var spy = sinon.spy(function(next){
        ran = true;
        next();
      });

      q.push(spy);  

      expect(ran).to.be(false);
      
      q.push(function(){
        expect(spy.callCount).to.be(1);
        done();
      });

      q.run();
    });

  });

 
});
