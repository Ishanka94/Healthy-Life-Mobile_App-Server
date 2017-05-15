var User = require('../models/user');
var Appointment = require('../models/appointment');
//var Session = require('../models/session');
var jwt  = require('jwt-simple');
var config = require('../config/database');

var functions = {
    authenticate: function(req, res) {
        User.findOne({
            name: req.body.name
        }, function(err, user){
            if (err) throw err;
            if(!user){
                return res.status(403).send({success: false, msg: 'Authenticaton failed, user not found.'});
            } else {
                user.comparePassword(req.body.password, function(err, isMatch){
                    if(isMatch && !err) {
                        var token = jwt.encode(user, config.secret);
                        res.json({success: true, token: token});
                    } else {
                        return res.status(403).send({success: false, msg: 'Authenticaton failed, wrong password.'});
                    }
                })
            }
        })
    },
    addNew: function(req, res){
        if((!req.body.name) || (!req.body.password)){
            console.log(req.body.name);
            console.log(req.body.password);
            
            res.json({success: false, msg: 'Enter all values'});
        }
        else {
            var newUser = User({
                name: req.body.name,
                password: req.body.password
            });
            
            newUser.save(function(err, newUser){
                if (err){
                    res.json({success:false, msg:'Failed to save'})
                }
                
                else {
                    res.json({success:true, msg:'Successfully saved'});
                }
            })
        }
    },
    getinfo: function(req, res){
        if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1];
            var decodedtoken = jwt.decode(token, config.secret);
            return res.json({success: true, msg: 'hello '+decodedtoken.name});
        }
        else {
            return res.json({success:false, msg: 'No header'});
        }
    },

    makeAppointment: function(req, res){
        if ((!req.body.speciality) || (!req.body.date) || (!req.body.time)) {
            console.log(req.body.speciality);
            console.log(req.body.date);
            console.log(req.body.time);
            
            res.json({success: false, msg: 'Enter all values'});
        }
        else{
            var newAppointment = Appointment({
                speciality: req.body.speciality,
                date: req.body.date,
                time: req.body.time
            });

            newAppointment.save(function(err){
        if (err) {
            console.log("some error: ", err);
            return res.json({"success": false, "msg": "error creating", "error": err});
        }
        res.status(201).send({"success": true, "msg": 'successfuly created'});

    });
        }
    }



}


module.exports = functions;