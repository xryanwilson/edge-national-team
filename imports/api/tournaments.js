import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';

const Tournaments = new Mongo.Collection('tournaments');

if (Meteor.isServer) {
  Meteor.publish('tournaments', function() {
    return Tournaments.find({ userId: this.userId });
  });
}

Meteor.methods({
  'tournaments.insert'() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return Tournaments.insert({
      name: '',
      location: '',
      startDate: '',
      endDate: '',
      weighins: '',
      alternateWeighins: '',
      division: '',
      weightClasses: '',
      allowance: 0,
      year: '',
      season: '',
      published: false,
      userId: this.userId,
      updatedAt: moment().valueOf()
    });
  },

  'tournaments.remove'(_id) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      _id: {
        type: String,
        min: 1
      }
    }).validate({ _id });

    Tournaments.remove({ _id, userId: this.userId });
  },

  'tournaments.update'(_id, updates) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      _id: {
        type: String,
        min: 1
      },
      name: {
        type: String,
        optional: true
      },
      location: {
        type: String,
        optional: true
      },
      startDate: {
        type: String,       // TODO - modify to support Date for sorting?
        optional: true
      },
      endDate: {
        type: String,       // TODO - modify to support Date for sorting?
        optional: true
      },
      weighins: {
        type: String,
        optional: true
      },
      alternateWeighins: {
        type: String,
        optional: true
      },
      division: {
        type: String,
        optional: true
      },
      weightClasses: {
        type: String,
        optional: true
      },
      allowance: {
        type: String,
        optional: true
      },
      year: {
        type: String,
        optional: true
      },
      season: {
        type: String,
        optional: true
      },
      published: {
        type: Boolean,
        optional: true
      }
    }).validate({ _id, ...updates });

    Tournaments.update({ _id, userId: this.userId }, {
      $set: { updatedAt: moment().valueOf(), ...updates }
    });
  }
});

export { Tournaments };
