const {app} = require('electron')
var wsDisaptch = require('./observer');

const WebSocket = require('erayt-elws');
const util = require('util');
const EventEmitter = require('events').EventEmitter;

const destroyEvents =  ['will-destroy', 'crashed', 'did-navigate']

if(!global.sharedObj )
    global.sharedObj={}

global.sharedObj.wsObserver=wsDisaptch;

app.on('web-contents-created', (e,webContents) => {
  console.log('created '+webContents.id) 
  webContents.once('did-finish-load',()=>{//生
    for (const event of destroyEvents) {
        webContents.once(event,(e)=>{//生
          console.log(e.sender.id+event)

          wsDisaptch._unsubscribeAll(e.sender)
        });
    }
  });
});

app.once('will-quit',function(){
    //关闭ws
    if(global.sharedObj._wsInstance){
        global.sharedObj._wsInstance.ws_stop();
        global.sharedObj._wsInstance = null;
    }
});

//只在被实例化后的实例中可调用
function wsclient(wsurl,retryInterval,retryMaxTimes) {
    this.wsurl_ = wsurl;
    this.retryInterval_ = retryInterval;
    this.retryMaxTimes_ = retryMaxTimes;
    EventEmitter.call(this)

    global.sharedObj._wsInstance= this;
}

util.inherits(wsclient, EventEmitter);

wsclient.prototype.ws_connect = function(){
    var that = this;

    //console.log(this.wsurl_);

    this.ws_ = new WebSocket(this.wsurl_,null,this.retryInterval_,this.retryMaxTimes_);

    this.ws_.onopen=function () {
        that.emit('ws-open');
        // that.ws_.send('Hello World!');
        console.info('open websocket success!');
    };

    this.ws_.onclose=function () {
        that.emit('ws-close');
        console.info('websocket closed!');
    };

    this.ws_.onmessage=function (event) {
        //that.emit('ws-message', data.toString());
        // console.log(event.data.toString());
        ws_disaptch(event.data.toString());
    };

    this.ws_.onerror=function (e) {
        that.emit('ws-error', e.message);
        console.error('problem with request: ' + e.message);
    };

    // connect
    this.ws_.connect();
};

wsclient.prototype.ws_stop = function(){
    this.ws_.forceClose();
    console.warn("ws client stop");
};

wsclient.prototype.ws_sendmsg = function(content){
     try {
            this.ws_.send(content);
        }
        catch (e) { /* handle error */
     }
    console.warn("ws client send:"+content);
};

function ws_disaptch(wsdata)
{    
    var title = wsdata.slice(0,wsdata.indexOf(':'));
    //console.info('ws title is:'+title);

    if(typeof wsDisaptch._send =='function')
        wsDisaptch._send(title,wsdata);
}

module.exports = wsclient;