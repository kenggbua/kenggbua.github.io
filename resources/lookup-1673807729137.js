(function(window, undefined) {
  var dictionary = {
    "53d2c749-f59f-43d7-9af2-220c4eafca23": "Audio command",
    "59ac0a0a-6360-4e1d-812b-9c2845067146": "Living room",
    "17bd9aea-5834-4df8-b6a2-e051a08a0113": "home screen",
    "3fdc8e60-5599-4003-b1ba-eff72f8203d0": "Motion sensor",
    "d12245cc-1680-458d-89dd-4f0d7fb22724": "Screen 1",
    "f39803f7-df02-4169-93eb-7547fb8c961a": "Template 1",
    "bb8abf58-f55e-472d-af05-a7d1bb0cc014": "default"
  };

  var uriRE = /^(\/#)?(screens|templates|masters|scenarios)\/(.*)(\.html)?/;
  window.lookUpURL = function(fragment) {
    var matches = uriRE.exec(fragment || "") || [],
        folder = matches[2] || "",
        canvas = matches[3] || "",
        name, url;
    if(dictionary.hasOwnProperty(canvas)) { /* search by name */
      url = folder + "/" + canvas;
    }
    return url;
  };

  window.lookUpName = function(fragment) {
    var matches = uriRE.exec(fragment || "") || [],
        folder = matches[2] || "",
        canvas = matches[3] || "",
        name, canvasName;
    if(dictionary.hasOwnProperty(canvas)) { /* search by name */
      canvasName = dictionary[canvas];
    }
    return canvasName;
  };
})(window);