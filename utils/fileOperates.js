const consolidate = require('consolidate');
const async = require('async');

const fileOperates = {};

fileOperates.filter = function(files) {
  var filter = ['.DS_Store'];
  delete files[filter[0]];
}

fileOperates.replaceText = function(files, data, additional, callback) {
  var keys = Object.keys(files);
  async.each(keys, run, callback);
  
  function run(file, callback){
    var str = files[file].contents.toString();
    consolidate.ejs.render(str, data, function(err, res){
      if (err) {
        console.log('wrong', file, err);
        return callback(err);
      }
      console.log('success', file);

      if (additional) {
        Object.keys(additional).forEach((originName) => {
          res = res.replace(new RegExp(originName, 'g'), additional[originName]);
          files[file].contents = new Buffer(res);
        })
      }
      
      callback();
    });
  }
}

module.exports = fileOperates;
