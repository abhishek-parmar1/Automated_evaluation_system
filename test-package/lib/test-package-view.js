'use babel';

export default class TestPackageView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('test-package');
    // Create message element
    const message = document.createElement('div');
    message.textContent = "good work buddy, view created";
    message.classList.add('message');
    this.element.appendChild(message);

  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
    //this.subscriptions.dispose();
  }

  getTitle() {
    // Used by Atom for tab text
    return 'Test Package Result';
  }

  getURI() {
    // Used by Atom to identify the view when toggling.
    return 'atom://test-package';
  }

  getDefaultLocation() {
    // This location will be used if the user hasn't overridden it by dragging the item elsewhere.
    // Valid values are "left", "right", "bottom", and "center" (the default).
    return 'right';
  }

  getAllowedLocations() {
    // The locations into which the item can be moved.
    return ['left', 'right', 'bottom'];
  }

  serialize() {
    return {
      // This is used to look up the deserializer function. It can be any string, but it needs to be
      // unique across all packages!
      deserializer: 'test-package/TestPackageView'
    };
  }

  renderAnswer(objective){
    console.log(objective);
  }
}
