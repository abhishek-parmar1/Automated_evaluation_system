'use babel';

import EvaluatorPackageView from './evaluator-package-view';
import { CompositeDisposable, Disposable  } from 'atom';

var _fs_plus = require('fs-plus')
var _request = require('request');
var _chokidar = require('chokidar');

var treeView ={};
var dataElement = {
  "html":{},
  "css":{},
  "js":{}
};

export default {

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable(
      // Add an opener for our view.
      atom.workspace.addOpener(uri => {
        if (uri === 'atom://evaluator-package-result') {
          return new EvaluatorPackageView();
        }
      }),

      // Register command that toggles this view
      atom.commands.add('atom-workspace', {
        'evaluator-package:fetch': () => this.fetch()
      }),

      // Destroy any TestPackegeViews when the package is deactivated.
      new Disposable(() => {
        atom.workspace.getPaneItems().forEach(item => {
          if (item instanceof EvaluatorPackageView) {
            item.destroy();
          }
        });
      })

    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  deserializeTestPackageView(serialized) {
    return new EvaluatorPackageView();
  },

  // function to get the objectives using the api
  fetch() {
    let editor
    //  to check get the reference of active editor in atom
    if (editor = atom.workspace.getActiveTextEditor()) {
    // static url to call
    let selection = "https://acadstaging.com/py/api/student/projects/objectives?projectStudentId=1522";
    // call to download function to get the objectives from api
    this.download(selection).then( apiResponse => {
          console.log("api call successful");
          // call the method to display the result
          this.showResult(apiResponse).then( viewResponse => {
            console.log("back to functionality");
          });
        }).catch( error => {
          // if error in response display the error message on the modal
          atom.notifications.addWarning(error.reason);
        });
    // call the function to track user movement
    this.trackUser();
    /////////////////////////////////////////TESTING CODE//////////////////////////////////////////////////////////
    // on add new file and delete a file or change a file
    this.trackProject();
    }
  },

  trackProject() {
    // return the details of the current project in atom
    let object = atom.project;
    // get the path of the project folder in the atom
    let root_path = object['rootDirectories'][0]['realPath'];

    //console.log(root_path);
    var watcher = _chokidar.watch(root_path, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });

    watcher
    .on('add', path => this.updateTreeView(path, "add"))
    .on('change', path => this.updateTreeView(path, "change"))
    .on('unlink', path => this.updateTreeView(path,"uplink"));
  },

  // function to create and update tree view and add watcher on a file
  updateTreeView(path, type) {

    // function to create tree view
    let merge = (treeView, tempView, type) =>{
      // temp View has a single key always
      key = Object.keys(tempView);
      // if key not present then add it to treeView object
      if(Object.keys(treeView).indexOf(key[0]) == -1)
      {
        if(type == "add")
          treeView[key] = tempView[key];
      }
      // if key present then search for child key int treeView object
      else
      {
        merge(treeView[key], tempView[key], type);
      }
    }

    // function to create tree view
    let deleteFile = (treeView, tempView, type) =>{
      // temp View has a single key always
      key = Object.keys(tempView);
      // if key not present then add it to treeView object
      if(treeView[key[0]] == tempView[key[0]])
      {
        if(type == "uplink")
          delete treeView[key];
      }
      // if key present then search for child key int treeView object
      else
      {
        deleteFile(treeView[key], tempView[key], type);
      }
    }

    let update = (path, type) => {
      // return the details of the current project in atom
      let object = atom.project;
      // get the path of the project folder in the atom
      let root_path = object['rootDirectories'][0]['realPath'];
      // get the project folder name
      let projectFolderName = root_path.substring(root_path.lastIndexOf("\\")+1);
      // relative path = path according to tree view from project
      let itemRelativePathArray = path.substring(path.lastIndexOf(projectFolderName));
      itemRelativePathArray = itemRelativePathArray.split("\\");
      // actual path = original path of file on system
      let itemActualPath = path;
      // if path is of file
      if(itemRelativePathArray[itemRelativePathArray.length-1].indexOf(".")!=-1 && type != "uplink")
      {
        if(itemRelativePathArray[itemRelativePathArray.length-1].indexOf(".html")!=-1)
        {
          _fs_plus.readFile(itemActualPath, "utf8", (err,data) => {
            dataElement["html"][itemRelativePathArray[itemRelativePathArray.length-1]] = data;
          });
        }
        if (itemRelativePathArray[itemRelativePathArray.length-1].indexOf(".css")!=-1) {
          _fs_plus.readFile(itemActualPath, "utf8", (err,data) => {
            dataElement["css"][itemRelativePathArray[itemRelativePathArray.length-1]] = data;
          });
        }
        if (itemRelativePathArray[itemRelativePathArray.length-1].indexOf(".js")!=-1) {
          _fs_plus.readFile(itemActualPath, "utf8", (err,data) => {
            dataElement["js"][itemRelativePathArray[itemRelativePathArray.length-1]] = data;
          });
        }
        // create temp object of file
        for(let i = itemRelativePathArray.length - 1; i >= 0 ; i--)
        {
          if(i == itemRelativePathArray.length - 1)
            tempView = { [itemRelativePathArray[i]] : itemActualPath};        // assign the value
          else
            tempView = { [itemRelativePathArray[i]] : tempView};          //put the previous object
        }
        // merge current path object with original treeView object
        if(type != "change")
          merge(treeView, tempView, type);
        // reset the temp object
        tempView = {};
      }

      if(itemRelativePathArray[itemRelativePathArray.length-1].indexOf(".")!=-1 && type == "uplink")
      {
        if(itemRelativePathArray[itemRelativePathArray.length-1].indexOf(".html")!=-1)
        {
          delete  dataElement["html"][itemRelativePathArray[itemRelativePathArray.length-1]];
        }
        if (itemRelativePathArray[itemRelativePathArray.length-1].indexOf(".css")!=-1) {
          delete  dataElement["css"][itemRelativePathArray[itemRelativePathArray.length-1]];
        }
        if (itemRelativePathArray[itemRelativePathArray.length-1].indexOf(".js")!=-1) {
          delete  dataElement["js"][itemRelativePathArray[itemRelativePathArray.length-1]];
        }
        // create temp object of file
        for(let i = itemRelativePathArray.length - 1; i >= 0 ; i--)
        {
          if(i == itemRelativePathArray.length - 1)
            tempView = { [itemRelativePathArray[i]] : itemActualPath};        // assign the value
          else
            tempView = { [itemRelativePathArray[i]] : tempView};          //put the previous object
        }
        // merge current path object with original treeView object
        if(type != "change")
          deleteFile(treeView, tempView, type);
        // reset the temp object
        tempView = {};
      }
      console.log(treeView);
      console.log(dataElement);
    }

    if( type=="add")
    {
      update(path, "add");
    }
    if( type=="uplink")
    {
      update(path, "uplink");
    }
    if( type=="change")
    {
      update(path, "change");
    }
  },
////////////////////////////////////////////////////////////////////////////////////////////
  // function to request the api
  download(url) {
    // request structure
    var options = {
      url: url,
      headers: {
        'sessionid' : 'ttfro6401v022pm2i1uaho9fqt'
      }
    };
    // return the value obtained after the api request using promises
    return new Promise( ( resolve, reject) => {
      // request to api
      _request( options, ( error, response, body) => {
        if(!error && response.statusCode == 200) {
          // return response
          resolve(body);
        }
        else {
          // resturn error object for error
          reject({
            reason: 'Unable to download page'
          });
        }
      });
    });
  },

  // function to show the result in the resut view
  showResult(apiResponse){
    // using promise to call the result view function
    return new Promise( ( resolve, reject) => {
      // resgistered uri of the result view
      uri = 'atom://evaluator-package-result'
      // open the editor
      atom.workspace.open(uri, split= 'right', searchAllPanes= true).then( evaluatorPackageView => {
          if (evaluatorPackageView instanceof EvaluatorPackageView)
          {
            // call to method of result view class
            evaluatorPackageView.renderAnswer(apiResponse);
            resolve('view created');
          }
          else {
            // resturn error object for error
            reject({
              reason: 'Unable to create page view'
            });
          }
        });
    });
  },

  trackUser(){
    // get the current editor instance
    editor = atom.workspace.getActiveTextEditor();
    // observe the editor
    atom.workspace.observeTextEditors( editor => {
      editor.onDidStopChanging( () => {
        var text = editor.getText();
        atom.notifications.addWarning(text);
      });
    });
  }

};
