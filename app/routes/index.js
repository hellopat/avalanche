var consolidate = require('consolidate'),
    avalanche = require('../../lib/avalanche');

/*
 * GET home page.
 */

exports.index = function(req, res) {
  res.render('index', { title: 'Express' });
};

exports.spring = function(req, res) {
  var template = avalanche.use('spring', undefined, true);

  res.locals = {
    season: 'spring'
  }
  res.render(template.pages.main, {
    layout: template.layout,
    partials: template.partials
  });
};

exports.summer = function(req, res) {
  var template = avalanche.use('summer');

  res.render(template.pages.main, {
    layout: template.layout,
    partials: template.partials
  });
};

exports.winter = function(req, res) {
  var template = avalanche.use('winter');

  res.render(template.pages.main);
};

exports.fall = function(req, res) {
  var template = avalanche.use('fall');

  res.render(template.pages.main);
};