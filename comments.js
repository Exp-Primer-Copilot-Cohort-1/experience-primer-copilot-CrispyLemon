// Create web server application
var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Comment = require("./models/comment");
var Campground = require("./models/campground");
var seedDB = require("./seeds");

// Connect to database
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});

// Use body-parser
app.use(bodyParser.urlencoded({extended: true}));

// Set view engine
app.set("view engine", "ejs");

// Set path to public folder
app.use(express.static(path.join(__dirname, "public")));

// Remove all campgrounds
seedDB();

// Home page
app.get("/", function(req, res) {
    res.render("landing");
});

// INDEX - Show all campgrounds
app.get("/campgrounds", function(req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});

// CREATE - Add new campground to DB
app.post("/campgrounds", function(req, res) {
    // Get data from form and add to campgrounds array
    var name = req.body.name; // name="name" in new.ejs
    var image = req.body.image; // name="image" in new.ejs
    var description = req.body.description; // name="description" in new.ejs
    var newCampground = {name: name, image: image, description: description};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        }
        else {
            // Redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// NEW - Show form to create new campground
app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});

// SHOW - Show more info about one campground
app.get("/campgrounds/:id", function(req, res) {
    // Find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
