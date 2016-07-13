##wsobserver
A node module for receive websocket message in electron main process,and routing  to render process.

## Introduction

In electron main process start a websocket client, use thrid party module to connect remote websocket server.

If Electron render process want to  receive websocket message from Electron main process, must subscribe title and ipc channel throught wsobserver module.we only to add render page's webcontent into wsobserver.

##Install
	npm install wsobserver --save
	
##Usage
Require the module in an Electron web page.

    var wswrap = require('wsobserver')

##UsageAPI

**subscribe(object, title, ipc_name)**

object:Electron's BrowserWindow property webContent, 
title:string, ipc_name:string

**unsubscribe(object, title)**

object:Electron's BrowserWindow property webContent,  title:string

**unsubscribeAll(object)**
object:Electron's BrowserWindow property webContent

**send(title, data)**

title:string, data:string

### In main process
	
	//share object in render process and main process
	global.sharedObj.wsObserver =wswrap.observer;
    
	var ws = new wswrap.wsclient('ws://localhost:8088');
    ws.ws_connect();

### In render process

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