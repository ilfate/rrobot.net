/**
 * ILFATE PHP ENGINE
 * @autor Ilya Rubinchik ilfate@gmail.com
 * 2012
 */

WSwrapper = function() {
  
  this.wsUri = ""; 
  this.output;
  
  this.init = function(uri)
  {
    if ("WebSocket" in window)
    {
      this.wsUri = uri;
      info(uri);
      this.output = document.getElementById("output"); 
      this.testwebsocket(); 
    } else {
      alert("WebSocket NOT supported by your Browser!")
    }
    
  }
  
  this.testwebsocket = function() { 
     this.websocket = new WebSocket("ws://rrobot.ru:8000/echo" ); //+ this.wsUri
     
     
     this.websocket.onopen = function(evt) { 
       WSwrapper.onOpen(evt);
       info('onopen');
     }; 
     this.websocket.onclose = function(evt) { 
       WSwrapper.onClose(evt);
       info('onclose');
     }; 
     this.websocket.onmessage = function(evt) { 
       WSwrapper.onMessage(evt);
       info('onmessage');
     }; 
     this.websocket.onerror = function(evt) { 
       WSwrapper.onError(evt);
       info('onerror');
     }; 
   }  
   
   this.onOpen = function(evt) { 
     this.writeToScreen("CONNECTED"); 
     this.doSend("this.websocket rocks"); 
   }  
   
   this.onClose = function(evt) { 
     this.writeToScreen("DISCONNECTED"); 
   }  
   
   this.onMessage = function(evt) { 
     this.writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data+'</span>'); 
     //this.websocket.close(); 
   }  
   
   this.onError = function (evt) { 
    // this.writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data); 
   }  
   
   this.doSend = function(message) { 
     this.writeToScreen("SENT: " + message);  
     this.websocket.send(message); 
   }  
   
   this.writeToScreen = function(message) { 
     info(message);
//     var pre = document.createElement("p"); pre.style.wordWrap = "break-word"; pre.innerHTML = message; output.appendChild(pre); 
   }  
}

WSwrapper = new WSwrapper();


