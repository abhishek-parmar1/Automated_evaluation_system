'use babel';

import EvaluatorPackageView from './evaluator-package-view';
import { CompositeDisposable, Disposable  } from 'atom';
import request from 'request'

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
          this.showResult(apiResponse);
        }).catch( error => {
          // if error in response display the error message on the modal
          atom.notifications.addWarning(error.reason);
        });
    }
  },

  // function to request the api
  download(url) {
    // a request variable which uses request
    var request = require('request');
    // request structure
    var options = {
      url: url,
      headers: {
        'sessionid' : 'ushtml0018uvkcod133aq39bnk'
      }
    };
    // return the value obtained after the api request using promises
    return new Promise( ( resolve, reject) => {
      // request to api
      request( options, ( error, response, body) => {
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
    // resgistered uri of the result view
    uri = 'atom://evaluator-package-result'
    // open the editor
    atom.workspace.open(uri, split= 'right', searchAllPanes= true).then( evaluatorPackageView => {
        if (evaluatorPackageView instanceof EvaluatorPackageView)
        {
          // call to method of result view class
          evaluatorPackageView.renderAnswer(apiResponse);
          // to activate the previous editor
          atom.workspace.activatePreviousPane();
        }
      });
  }

};
