'use babel';

// import './bandwidth-view.js';

var tile = null;

function getNetworkInfo(element){
  fetch("http://ip.appspot.com")
     .then(function(txt){return txt.text()})
     .then(function(val){element.innerHTML = "IP: "+val;});
}

export function activate(){

}

export function consumeStatusBarService(statusBar){
   let element = document.createElement('span');
   tile = statusBar.addLeftTile({item: element, priority: 100});

   window.addEventListener('online', function(){
     getNetworkInfo(element);
   });

   window.addEventListener('offline', function(){
     element.innerHTML = "";
   });

   getNetworkInfo(element);

}

export function deactivate(){
   if(tile){
     tile.getItem().destroy();
     tile.destroy();
     tile = null;
   }
}
