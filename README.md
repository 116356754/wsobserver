##wsobserver

websocket client for Electron applications.

we use wsobserver module in electron main process,wsobserver use thrid party module to connect remote websocket server.

Electron render process receive websocket message from Electron main process throught wsobserver module.we only to add render page's webcontent into wsobserver.

		
##Usage
    npm install wsobserver --save

Require the module in an Electron web page.

    var wsobser = require('wsobserver')

### Electron main process
#### set up gloabl object
	
	//share object in render process and main process
	global.sharedObj = {
	wsObserver:require('wsobserver/observer')};

####websocket usage
 open a websocket client:
	
    var ws = new wsobser('ws://localhost:8088');
    ws.ws_connect();
    
 open a websocket client:

	ws.ws_sendmsg('hello server');

 close a websocket client:

	ws.ws_stop();


### Electron render process

    var ipcRenderer = require('electron').ipcRenderer;
    var remote = require('electron').remote;
	
	//get wsobserver in main process share object 
	var observer = remote.getGlobal('sharedObj').wsObserver;

	//websocket handle function
    ipcRenderer.on('ws-title-message', function (e, data) {
         alert(data.toString());
    });

    //listen for websocket message from the main process   
    function setupWSObserver(title) {
       observer.subscribe(remote.getCurrentWebContents(), title, 'ws-title-message');
    }

    function clearWSObserver(title) {
        observer.unsubscribe(remote.getCurrentWebContents(), title);
    }