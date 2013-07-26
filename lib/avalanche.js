var _        = require('underscore'),
    extend   = require('node.extend'),
    file     = require('file'),
    path     = require('path'),
    traverse = require('traverse');

var avalanche = module.exports = {};

// Hash for templates
avalanche.templates = {};

// Hash for avalanche options
avalanche.options = {
  'defaultFolder': 'default', // Location of the default template folder
  'joinType': '.'
};

// Initialize options
avalanche.init = function(options) {
  _.extend(this.options, options);
};

avalanche.read = function(viewFolder) {

  var self = this,
      relPathArr;

  // Walk views directory
  file.walk(viewFolder, function(n, dirPath, dirs, files) {
    // Filter hidden files
    files = _.filter(files, function(f) {
      return f.indexOf('/.') < 0;
    });

    // Loop through all files in directory
    _.each(files, function(file, i) {
          // Currently referenced object
      var ref = self.templates,
          // Array of folder names relative to base view folder
          fPathArr = path.relative(viewFolder, file).split(path.sep);

      // Loop through each folder name
      _.each(fPathArr, function(part, j) {
        // References to the object key and value
        var fKey, fVal;

        // Check to see if the key is a file
        if (fPathArr[j] == fPathArr[fPathArr.length - 1]) {
          fKey = part.split('.')[0];
          fVal = file;
        // File is a folder, create a new object
        } else {
          fKey = part;
          fVal = {};
        }

        // If the currently referenced object does not have
        // the currently referenced key as a property, set it
        if (!_.has(ref, fKey)) {
          ref[fKey] = fVal;
        }

        // Change reference
        ref = ref[fKey];
      });

    });
  });

};

// Pick a template folder to pass through to partial hook
avalanche.use = function(templates, defaultFolder, createKeys) {
  var args = _.values(_.pick(this.templates, templates));

  args.unshift(this.templates[defaultFolder || this.options.defaultFolder]);
  args.unshift({});   // Copy onto a new object
  args.unshift(true); // Deep copy

  return createKeys ? this.createKeys(extend.apply(null, args)) : extend.apply(null, args);
};

// Helper function to create a set of keys from an object
// containing partials and their paths.
avalanche.createKeys = function(partials, joinType) {
  var newObj = {},
      joinType = joinType || '.';

  traverse(partials).forEach(function(node) {
    if (typeof node === 'string') {
      newObj[this.path.join(joinType)] = node;
    }
  });

  return newObj;
}