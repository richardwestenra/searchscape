var fs = require('fs'),
 mustache = require('mustache'),
 marked = require('marked');


var inputFile = 'content.md';


fs.readFile(inputFile, 'utf8', function (err, input) {
  if (err) { return console.log(err); }

  var data = formatData(input);

  var template = processData(data);
  template('sections');
  template('nav');

});


function formatData(text) {
  return text.split(/---+/).map(function (d, i) {
    var get = makeRegex(d);
    return {
      id: i,
      intro: marked( get('intro') || '' ),
      // intro: get('intro'),
      image: get('image'),
      caption: get('caption'),
      video: get('video'),
      quote: get('quote'),
      citation: get('citation')
    };
  });
}


function processData(data) {
  return function (name) {
    fs.readFile('templates/'+name+'.html', 'utf8', function (err, tmpl) {
      if (err) { return console.log(err); }

      var obj = {};
      obj[name] = data;

      writeFile(
        'output/'+name+'.html',
        mustache.render(tmpl, obj)
      );
    });
  };
}


function makeRegex(text) {
  return function (id) {
    var regex = new RegExp('\{\{'+id+'\}\}([^\{]+)\{\{\/'+id+'\}\}','i');
    var result = text.match(regex);
    return result ? result[1] : console.error('No match for ID '+id);
  };
}


function writeFile(location, content) {
  fs.writeFile(location, content, function(err) {
    if (err) { return console.log(err); }
    console.log('Output file saved successfully :)');
  });
}