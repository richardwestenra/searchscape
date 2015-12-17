var fs = require('fs');
var mustache = require('mustache');


fs.readFile('input.html', 'utf8', function (err, input) {
  if (err) {
    return console.log(err);
  }
  // console.log('Input file was read!');

  fs.readFile('template.html', 'utf8', function (err, tmpl) {
    if (err) {
      return console.log(err);
    }
    // console.log('Template file was read!');


    writeFile('output.html', toHtml(tmpl, formatData(input) ) );

  });

});


function formatData(text) {
  return text.split('===').map(function (d, i) {
    return {
      id: i,
      image: get(d, 'image'),
      caption: get(d, 'caption'),
      video: get(d, 'video'),
      quote: get(d, 'quote'),
      citation: get(d, 'citation')
    };
  });
}


function toHtml(template, data) {
  return data.map(function (section) {
    return mustache.render(template, section);
  }).join('');
}

function get(text, id) {
  var regex = new RegExp('\{\{'+id+'\}\}([^\{]+)\{\{\/'+id+'\}\}','i');
  var result = text.match(regex);
  return result ? result[1] : console.error('No match for ID '+id);
}

function writeFile(location, content) {
  fs.writeFile(location, content, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log('Output file saved successfully :)');
  });
}