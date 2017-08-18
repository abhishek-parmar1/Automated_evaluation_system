'use babel';

import TestPackageView from './test-package-view';
import { CompositeDisposable } from 'atom';
import request from 'request'

export default {

  testPackageView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.testPackageView = new TestPackageView(state.testPackageViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.testPackageView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'test-package:fetch': () => this.fetch()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.testPackageView.destroy();
  },

  serialize() {
    return {
      testPackageViewState: this.testPackageView.serialize()
    };
  },

  fetch() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText();
      this.download(selection).then( function(objective) {
            editor.insertText(objective);
          }).catch( function(error) {
            atom.notifications.addWarning(error.reason);
          });
    }
  },

    download(url) {
      return new Promise( function(resolve, reject) {
        request(url, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            resolve(body);
          } else {
            reject({
              reason: 'Unable to download page'
            });
          }
        });
      });
    }

};
