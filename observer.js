"use strict";

var Observer = function() {
  this.subscriber = [];
};

Observer.prototype.subscribe = function(who,title, ipc_name) {  
  //console.log(title+' subscribe!');
  // if(process.type !== 'renderer')
  //   return;
  
  if (!this.subscriber[title]) {
    this.subscriber[title] = [];
  }

  // var who = require('electron').remote.getCurrentWebContents();
  
  for(var i = 0; i < this.subscriber[title].length; i++) {
    var o = this.subscriber[title][i];
    if (o.webInstance == who && o.channel == ipc_name) {
      return;
    }
  }

  this.subscriber[title].push({webInstance: who, channel: ipc_name });
};

Observer.prototype.unsubscribe = function(who,title) {
    
  if (!this.subscriber[title]) return;    
  
  for(var i = 0; i < this.subscriber[title].length; i++) {
    var o = this.subscriber[title][i];
    if (o.webInstance == who) {
      this.subscriber[title].splice(i, 1);
      return;
    }
  }

};

Observer.prototype._unsubscribeAll = function(who) {  
  for (var title in this.subscriber) {
    if (!this.subscriber[title]) continue;

    for (var i = 0; i < this.subscriber[title].length; i++) {
      var o = this.subscriber[title][i];
      if (o.webInstance == who) {        
        this.subscriber[title].splice(i, 1);
          continue;
      }
    }
    // console.log('unsubscribeAll '+this.subscriber[title].length);
  }
};

Observer.prototype._send = function(title, data) {
  if (!this.subscriber[title]) return;
  
  for(var i = 0; i < this.subscriber[title].length; i++) {
    var o = this.subscriber[title][i];
    try{
      o.webInstance.send(o.channel, data);
    }
    catch(e)
    {
      console.error(e.message);
    }
  }
};

module.exports = new Observer();