/*jshint node:true*/
module.exports = {
  normalizeEntityName: function() {
    // no-op
  },

  afterInstall: function(options) {
    return this.addBowerPackagesToProject([{ name: 'syncano', target: '^0.4.4' }]);
  }
};
