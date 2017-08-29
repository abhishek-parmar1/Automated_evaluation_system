'use babel';

export default class EvaluatorPackageView {

  constructor(serializedState) {
    // Create root element
      this.element = document.createElement('div');
      this.element.classList.add('test-package');

      // Create main message element
      const message = document.createElement('div');
      message.classList.add('main');
      this.element.appendChild(message);

      // create project view header
      const header = document.createElement('div');
      header.classList.add('project-header');
      message.appendChild(header);

        // title
        const title = document.createElement('span');
        title.classList.add('project-title');
        title.innerHTML = "<hr><h1>Title : </h1>";
        header.appendChild(title);
        // details
        const description = document.createElement('span');
        description.classList.add('project-description');
        description.innerHTML = "<h1>Description : </h1>";
        header.appendChild(description);
        // assets
        const asset = document.createElement('div');
        asset.classList.add('project-asset');
        asset.innerHTML = "<h1>Tools Required : </h1>";
        header.appendChild(asset);
        // skills
        const skill = document.createElement('div');
        skill.classList.add('project-skill');
        skill.innerHTML = "<h1>Skills Required : </h1>";
        header.appendChild(skill);

      // create project objectives view
      const body = document.createElement('div');
      body.classList.add('project-body');
      message.appendChild(body);

        // objectives
        const objective = document.createElement('div');
        objective.classList.add('project-objectives');
        objective.innerHTML = "<hr>";
        body.appendChild(objective);

      // create project footer view
      const footer = document.createElement('div');
      footer.classList.add('project-footer');
      message.appendChild(footer);

        // extraDetails
        const extra = document.createElement('div');
        extra.classList.add('project-extra-detail');
        extra.innerHTML = "<hr><h1>Extras : </h1>";
        footer.appendChild(extra);
  }

  // Tear down any state and detach
  destroy() {
    this.element.remove();
    //this.subscriptions.dispose();
  }

  getTitle() {
    // Used by Atom for tab text
    return 'Evaluator Package Result';
  }

  getURI() {
    // Used by Atom to identify the view when toggling.
    return 'atom://evaluator-package';
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
      deserializer: 'evaluator-package/EvaluatorPackageView'
    };
  }

  // function to display the objectives on the result view
  renderAnswer(apiResponse){
    console.log("Called")
    apiResponse = JSON.parse(apiResponse);

    projectName = apiResponse["result"]["project"]["projectName"];

    projectDescription = apiResponse["result"]["project"]["projectDescription"];

    assetArray = apiResponse["result"]["project"]["assets"]["assets"];
    assetHtml = "";
    for(asset in assetArray)
      assetHtml += "<p>" + assetArray[asset]["name"] + "</p>";

    extraDetails =  apiResponse["result"]["project"]["extraDetails"];
    extraHtml = "";
    for(extra in extraDetails)
      extraHtml += "<p>" + extra + " : " + extraDetails[extra] + "</p>";

    skillArray = apiResponse["result"]["project"]["skills"];
    skillHtml = "";
    for(skill in skillArray)
      skillHtml += "<p>" + skillArray[skill] + "</p>";

    objectivesArray = apiResponse["result"]["project"]["module"];
    objectiveHtml = "";
    for(objective in objectivesArray)
      objectiveHtml += "<p><input type='checkbox'>&nbsp;" + objectivesArray[objective]["moduleName"] + "</p>";

    document.querySelector("span.project-title").innerHTML += "<h2>" + projectName + "</h2>";
    document.querySelector("span.project-description").innerHTML += "<h3>" + projectDescription + "</h3>";
    document.querySelector("div.project-asset").innerHTML += assetHtml;
    document.querySelector("div.project-skill").innerHTML += skillHtml;
    document.querySelector("div.project-objectives").innerHTML += objectiveHtml;
    document.querySelector("div.project-extra-detail").innerHTML += extraHtml;
  }

}
