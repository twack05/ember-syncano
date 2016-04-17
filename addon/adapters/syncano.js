import DS from 'ember-data';
import Ember from 'ember';

export default DS.Adapter.extend({
  /**
   * Uses the default serialize (JSONSerializer).
   */
  defaultSerializer: '-default',

  /**
   * Used by the store to retrieve a single record.
   */
  findRecord(store, type, id) {
    let instance = this.get('syncano.instance');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      // instance.class(type.modelName).dataobject(id).detail()
      instance.DataObject.please().get({id: id, className: type.modelName})
        .then(function(data) {
          Ember.run(null, resolve, data);
        })
        .catch(function(error) {
          Ember.run(null, reject, error);
        });
    });
  },

  /**
   * Used by the store to create a record.
   */
  createRecord(store, type, snapshot) {
    let instance = this.get('syncano.instance');
    let record = this.serialize(snapshot, { includeId: true });
    record.className = type.modelName;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      // instance.class(type.modelName).dataobject().add(record)
      instance.DataObject.please().create(record)
        .then(function(data) {
          Ember.run(null, resolve, data);
        })
        .catch(function(error) {
          Ember.run(null, reject, error);
        });
    });
  },

  /**
   * Used by the store to update a record.
   */
  updateRecord(store, type, snapshot) {
    let instance = this.get('syncano.instance');
    let record = this.serialize(snapshot, { includeId: true });
    return new Ember.RSVP.Promise(function(resolve, reject) {
      // instance.class(type.modelName).dataobject(record.id).update(record)
      instance.DataObject.please().update({id: record.id, className: type.modelName}, record)
        .then(function(data) {
          Ember.run(null, resolve, data);
        })
        .catch(function(error) {
          Ember.run(null, reject, error);
        });
    });
  },

  /**
   * Used by the store to delete a record.
   */
  deleteRecord(store, type, snapshot) {
    let instance = this.get('syncano.instance');
    let record = this.serialize(snapshot, { includeId: true });
    return new Ember.RSVP.Promise(function(resolve, reject) {
      // instance.class(type.modelName).dataobject(record.id).delete()
      instance.DataObject.please().delete({id: record.id, className: type.modelName})
        .then(function() {
          Ember.run(null, resolve);
        })
        .catch(function(error) {
          Ember.run(null, reject, error);
        });
    });
  },

  /**
   * Used by the store to retrieve the entire collection of records of a
   * certain model.
   */
  findAll(store, type) {
    let instance = this.get('syncano.instance');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      // instance.class(type.modelName).dataobject().list()
      instance.DataObject.please().list({className: type.modelName})
        .then(function(data) {
          Ember.run(null, resolve, data.objects);
        })
        .catch(function(error) {
          Ember.run(null, reject, error);
        });
    });
  },

  /**
   * Used by the store to retrieve a collection of records according to the
   * filters in `query`. `query` should be formatted exactly as a query obeject
   * as shown in the Syncano docs.
   */
  query(store, type, query) {
    let instance = this.get('syncano.instance');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      // instance.class(type.modelName).dataobject().list(query)
      instance.DataObject.please().list({className: type.modelName}).filter(query)
        .then(function(data) {
          Ember.run(null, resolve, data.objects);
        })
        .catch(function(error) {
          Ember.run(null, reject, error);
        });
    });
  },

  /**
   * Used by the store to retrieve a collection that is a subset of records of
   * based on their ids. It is an optimization for retrieving large sets of
   * records.
   */
  findMany(store, type, ids) {
    return this.query(store, type, { 'query': { 'id': { '_in': ids }}});
  },
});
