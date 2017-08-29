'use babel';

export default class TestPackageView {

  constructor(serializedState) {


    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('test-package');

    // Create objectives message element
    const message = document.createElement('div');
    message.classList.add('objectives');
    this.element.appendChild(message);

  }

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

  // to restore the view of the package
  serialize() {
    return {
      // This is used to look up the deserializer function. It can be any string, but it needs to be
      // unique across all packages!
      deserializer: 'test-package/TestPackageView'
    };
  }

  // function to display the objectives on the result view
  renderAnswer(objectiveArray){
    htmlMessage = "";
    var i=0;
    while(i<objectiveArray.length)
    {
      htmlMessage += "<li> <input type='checkbox'> <b>" + objectiveArray[i] + "</b></li>"
      i++;
    }
    htmlMessage = "<ul>" + htmlMessage + "</ul>";
    document.querySelector("div.objectives").innerHTML = htmlMessage;
  }

}
