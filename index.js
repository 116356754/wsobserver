module.exports ={
    wsclient,
    observer:require('./observer')
};

var WebSocket = require('ws');
const util = require('util');
const EventEmitter = require('events').EventEmitter;

var logger = require('ellog');

//只在被实例化后的实例中可调用
function wsclient(wsurl) {
    var wsurl_;
    var ws_;
    this.wsurl_ = wsurl;

    EventEmitter.call(this)
}

util.inherits(wsclient, EventEmitter);

wsclient.prototype.ws_connect = function(){
    var that = this;

    console.log(this.wsurl_);

    this.ws_ = new WebSocket(this.wsurl_);
 
    this.ws_.on('open', function () {
        that.emit('ws-open');
        logger.info('open websocket success!');
    });

    this.ws_.on('close', function () {
        that.emit('ws-close');
        logger.info('websocket closed!');
    });

    this.ws_.on('message', function (data) {
        //that.emit('ws-message', data.toString());
        ws_disaptch(data.toString());
    });

    this.ws_.on('error', function (e) {
        that.emit('ws-error', e.message);
        logger.error('problem with request: ' + e.message);
    });
};

wsclient.prototype.ws_stop = function(){
    this.ws_.terminate();
    logger.warn("ws client stop");
};

wsclient.prototype.ws_sendmsg = function(content){
     try {
            this.ws_.send(content);
        }
        catch (e) { /* handle error */
     }
    logger.warn("ws client send:"+content);
};

function ws_disaptch(wsdata)
{
    //logger.debug(wsdata.toString());
    var title = wsdata.slice(0,wsdata.indexOf(':'));
    logger.info('ws title is:'+title);

    if(typeof global.sharedObj.wsObserver.send =='function')
        global.sharedObj.wsObserver.send(title,wsdata);
}
