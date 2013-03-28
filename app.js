#!/usr/bin/env node

var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    mongoose = require('mongoose'),
    //gju = require('geojson-utils');
    inBox = require('./inBox.js');

var app = express();

// Database

mongoose.connect('mongodb://localhost/toronto');

// Config

app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var Schema = mongoose.Schema;  

var LocationSchema = new Schema({  
      ADDRESS_PO: { type: Number, required: true },
      LINEAR_NAM: { type: Number, required: false },
      CENTRELINE: { type: Number, required: false },
      ADDRESS_NU: { type: String, required: false },
      LINEAR_N_1: { type: String, required: false },
      LO_NUM: { type: Number, required: false },
      LO_NUM_SUF: { type: String, required: false },
      HI_NUM: { type: Number, required: false },
      HI_NUM_SUF: { type: String, required: false },
      CENTRELI_1: { type: String, required: false },
      CENTRELI_2: { type: String, required: false },
      GENERAL_US: { type: String, required: false },
      GENERAL__1: { type: String, required: false },
      ADDRESS_CL: { type: String, required: false },
      ADDRESS__1: { type: String, required: false },
      PLACE_NAME: { type: String, required: false },
      X: { type: Number, required: false },
      Y: { type: Number, required: false },
      LONGITUDE: { type: Number, required: true },
      LATITUDE: { type: Number, required: true },
      OBJECTID: { type: Number, required: true },
    },
    { collection : 'location' } // We have to specify the collection manually
  );

var LocationModel = mongoose.model('Location', LocationSchema, 'location');

var NeighbourhoodSchema = new Schema({
    type: { type: String },
    properties: { type: Array },
    geometry: { type: Array }
  },
  { collection: 'neighbourhood' } // We have to specify the collection manually
);

var NeighbourhoodModel = mongoose.model('Neighbourhood', NeighbourhoodSchema, 'neighbourhood');

app.get('/api', function (req, res) {
  res.send('Toronto location API is running');
});

app.get('/api/location', function (req, res) {
  res.send('Toronto location API is running');
  /* The size of the whole DB is way WAY to big to return in a single request
  return LocationModel.find({}, function (err, location) {
    if (!err) {
      return res.send(location);
    } else {
      return res.send('Something went terribly wrong');
    }
  });
  */
});

// Given a geoid return the location information
app.get('/api/location/:id', function (req, res){
  return LocationModel.findOne({ ADDRESS_PO: req.params.id }, function (err, location) {
    if (!err) {
      return res.send(location);
    } else {
      return res.send(err);
    }
  });
});

// Return a list of all Toronto neighbourhoods
app.get('/api/neighbourhood', function (req, res){
  return NeighbourhoodModel.find({}, function (err, neighbourhood) {
    if (!err) {
      var hoods = [];
      for (var key in neighbourhood) {
        var hood = neighbourhood[key];
        hoods.push(hood.properties[0].HOOD);
      }
      return res.send(hoods);
    } else {
      return res.send(err);
    }
  });
});

// Given a lat/long combination return the neighbourhood it belongs to
app.get('/api/neighbourhood/:latitude/:longitude', function (req, res){
  return NeighbourhoodModel.find({}, function (err, neighbourhood) {
    if (!err) {
      return res.send(inBox.getNeighbourhood(req.params.longitude, req.params.latitude, neighbourhood));
    } else {
      return res.send(err);
    }
  });
});

// Launch server

app.listen(4242);
