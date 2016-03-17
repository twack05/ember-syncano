import DS from 'ember-data';
import Ember from 'ember';

export default DS.Adapter.extend({
  defaultSerializer: '-default',
  findRecord(store, type, id) {
    let instance = this.get('syncano.instance');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      instance.class(type.modelName).dataobject(id).detail()
        .then(function(data) {
          Ember.run(null, resolve, data);
        })
        .catch(function(error) {
          Ember.run(null, reject, error);
        });
    });
  },
  createRecord(store, type, snapshot) {
    let instance = this.get('syncano.instance');
    let record = this.serialize(snapshot);
    console.log(record);
    return new Ember.RSVP.Promise(function(resolve, reject) {
      instance.class(type.modelName).dataobject().add(record)
        .then(function(data) {
          Ember.run(null, resolve, data);
        })
        .catch(function(error) {
          Ember.run(null, reject, error);
        });
    });
  },
  updateRecord(store, type, snapshot) {
    let instance = this.get('syncano.instance');
    let record = this.serialize(snapshot, { includeId: true });
    return new Ember.RSVP.Promise(function(resolve, reject) {
      instance.class(type.modelName).dataobject(record.id).update(record)
        .then(function(data) {
          Ember.run(null, resolve, data);
        })
        .catch(function(error) {
          Ember.run(null, reject, error);
        });
    });
  },
  deleteRecord(store, type, snapshot) {
    let instance = this.get('syncano.instance');
    let record = this.serialize(snapshot, { includeId: true });
    return new Ember.RSVP.Promise(function(resolve, reject) {
      instance.class(type.modelName).dataobject(record.id).delete()
        .then(function() {
          Ember.run(null, resolve);
        })
        .catch(function(error) {
          Ember.run(null, reject, error);
        });
    });
  },
  findAll(store, type) {
    let instance = this.get('syncano.instance');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      instance.class(type.modelName).dataobject().list()
        .then(function(data) {
          Ember.run(null, resolve, data.objects);
        })
        .catch(function(error) {
          Ember.run(null, reject, error);
        });
    });
  },
  query(store, type, query) {
    let instance = this.get('syncano.instance');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      instance.class(type.modelName).dataobject().list(query)
        .then(function(data) {
          Ember.run(null, resolve, data.objects);
        })
        .catch(function(error) {
          Ember.run(null, reject, error);
        });
    });
  },
  findMany(store, type, ids) {
    return this.query(store, type, { 'query': { 'id': { '_in': ids }}});
  },
});
