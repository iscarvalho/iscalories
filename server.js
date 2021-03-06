var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var cors 	   = require('cors');

// use it before all route definitions
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set our port
var port = process.env.PORT || 8080;

// ROUTES FOR OUR API
var router = express.Router();

router.use(function(req, res, next) {
    // do logging
    console.log('API Working');
    next(); // make sure we go to the next routes and don't stop here
});

// TEST ROUTE
router.get('/', function(req, res) {
    res.json({ message: 'Calories REST API' });   
});

// REGISTER OUR ROUTES
app.use('/api', router);

// START THE SERVER
app.listen(port);
console.log('Magic happens on port ' + port);

// CONNECT TO DATABASE
var mongoose   = require('mongoose');
mongoose.connect('mongodb://calories:calories123@ds019996.mlab.com:19996/calories'); 

// mongoose.connection.on('open', function (ref) {
//   console.log('Connected to mongo server.');
// });

// mongoose.connection.on('error', function (err) {
//   console.log('Could not connect to mongo server!');
//   console.log(err);
// });


var Users = require('./app/models/users');
var Roles = require('./app/models/roles');
var Meals = require('./app/models/meals');

// Users routes
router.route('/users')
    // CREATE user
	.post(function(req, res) {
        
        var users = new Users();

        users.name = req.body.name;
        users.password = req.body.password;
        users.role = req.body.role;
        users.maxCals = req.body.maxCals;

        users.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User created!' });
        });
        
    })
    // GET all users
    .get(function(req, res) {
        Users.find(function(err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });

// Authentication route
router.route('/auth')
    // Auth user
	.post(function(req, res) {
        Users.findOne({
        	name : req.body.name,        	
        }, function(err, user) {
            if (err)
                res.send(err);

            // Check if user exists
            if (!user) {
            	res.json({ success : false, message : 'User not found!'});
            } else if (user) {
            	// Check if user name && password matches
            	if (user.password != req.body.password) {
            		res.json({ success : false, message : 'Wrong password!'});
            	} else {
            		res.json({ success : true, user });
            	}
            }
        });
    });

// Roles routes
router.route('/roles')
	// GET roles
    .get(function(req, res) {
        Roles.find(function(err, roles) {
            if (err)
                res.send(err);
            res.json(roles);
        });
    });

/* MEALS */
router.route('/meals/user/:user_id')
    // GET user meals
    .get(function(req, res) {
        Meals.find( {'userId' : req.params.user_id}, function(err, meals) {
            if (err)
                res.send(err);
            res.json(meals);
        });
    });

router.route('/meals')
    // CREATE user meal	
    .post(function(req, res) {
        
        var meals = new Meals();
        meals.name = req.body.name;
        meals.cals = req.body.cals;
        meals.created = req.body.created;
        meals.userId = req.body.userId;

        meals.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Meal created!' });
        });
        
    });

router.route('/meals/:meal_id')
    // DELETE meal
    .delete(function(req, res) {
        Meals.remove({
            _id: req.params.meal_id
        }, function(err, meal) {
            if (err)
                res.send(err);

            res.json({ message: 'Meal deleted' });
        });
    })
    // UPDATE meal
    .put(function(req, res) {
        Meals.findById(req.params.meal_id, function(err, meal) {
            if (err)
                res.send(err);

            meal.cals = req.body.cals;

            meal.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Meal updated!' });
            });

        });
    });
