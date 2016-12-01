var mongoose = require('mongoose');
var _ = require('lodash');
var multiparty = require('multiparty');
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs = new Grid(mongoose.connection.db);
var util = require('util');
var fs = require('fs');
var Profile = mongoose.model('Profile');

var removeId = function(doc, ret, options) {
    // remove the _id of every document before returning the result
    delete ret._id;
};

module.exports.getProfileById = function(req, res) {
    if (!req.payload._id) return res.status(401).send({
        'message': 'UnauthorizedError: private profile',
    });
    Profile
        .findOne({
            'userId': mongoose.Types.ObjectId(req.payload._id),
        })
        .populate('managerId', 'name email')
        .exec(function(err, user) {
            res.status(200).json(user);
        });
};

module.exports.getProfilesBySkills = function(req, res) {
    if (!req.payload._id) return res.status(401).send({
        'message': 'UnauthorizedError: private profile',
    });
    var skills = req.params.skills.split(',');
    Profile.find({
        'skills.skill': {
            $in: skills,
        },
    })
        .populate('userId')
        .exec(function(err, profile) {
            if (err) return res.status(400).send(err);
            res.status(200).send(profile);
        });
};

module.exports.getSkills = function(req, res) {
    if (!req.payload._id) return res.status(401).send({
        'message': 'UnauthorizedError: private profile',
    });
    var query = req.params.query;
    Profile.aggregate({
        $unwind: '$skills',
    }, {
        $unwind: '$skills.skill',
    }, {
        $match: {
                'skills.skill': {
                    $regex: query,
                    $options: 'i',
                },
            },
    }, {
            $group: {
                _id: '$skills.skill',
            },
        },
        function(err, results) {
            if (err) return res.status(400).send(err);
            // returns result
            res.status(200).send(results);
        });
};

module.exports.getDesignations = function(req, res) {
    if (!req.payload._id) return res.status(401).send({
        'message': 'UnauthorizedError: private profile',
    });
    var query = req.params.query;
    User.find({
        'designation': new RegExp(query, 'i'),
    }, 'designation')
        .exec(function(err, designations) {
            if (err) return res.status(400).send(err);
            res.status(200).send(designations);
        });
};

module.exports.getAllSkills = function(req, res) {
    // if (!req.payload._id) return res.status(401).send({
    //     'message': 'UnauthorizedError: private profile'
    // });
    // Profile.find({}, 'skills', function(err, results) {
    //     if (err) return res.status(400).send(err);

    //     var skills = _
    //         .chain(results)
    //         .map('skills')
    //         .flatten()
    //         .groupBy('skill')
    //         .value();

    //     res.status(200).send(skills);
    // });

    Profile.aggregate({
        $unwind: '$skills',
    }, {
        $group: {
            _id: { skill: '$skills.skill', rating: '$skills.rating' },
            count: { '$sum': 1 },
        },
    },
        {
            $group: {
                _id: '$_id.skill',
                count: { '$sum': '$count' },
                children: { $addToSet: { rating: '$_id.rating', count: '$count' } },
            },
        },
        function(err, results) {
            if (err) return res.status(400).send(err);
            // returns result
            res.status(200).send(results);
        });
};

module.exports.getAllProfiles = function(req, res) {
    if (!req.payload._id) return res.status(401).send({
        'message': 'UnauthorizedError: private profile',
    });
    var searchQuery, userQuery, managerQuery;

    // searchQuery = userQuery = managerQuery = {};

    if (req.params.query) {
        var query = JSON.parse(req.params.query);
        var employees = _.map(query.employees, '_id');
        var designations = query.designations;
        var managers = _.map(query.managers, '_id');
        var skills = _.map(query.skills, '_id');

        if (employees.length > 0) {
            userQuery = _.assign(userQuery, {
                _id: {
                    $in: employees,
                },
            });
        }
        if (managers.length > 0) {
            managerQuery = _.assign(managerQuery, {
                _id: {
                    $in: managers,
                },
            });
        }
        if (designations.length > 0) {
            searchQuery = _.assign(searchQuery, {
                'designation': {
                    $in: designations,
                },
            });
        }

        if (skills.length > 0) {
            searchQuery = _.assign(searchQuery, {
                'skills.skill': {
                    $in: skills,
                },
            });
        }
    }
    Profile.find(searchQuery)
        .populate('userId', 'name email', userQuery)
        .populate('managerId', 'name email', managerQuery)
        .exec(function(err, profile) {
            if (err) return res.status(400).send(err);
            profile = profile.filter(function(profile) {
                return (profile.userId !== null && profile.managerId !== null);
            });
            res.status(200).send(profile);
        });
};

module.exports.uploadFile = function(req, res) {

    if (!req.payload._id) return res.status(401).send({
        'message': 'UnauthorizedError: private profile',
    });
    var userId = req.payload._id;
    var form = new multiparty.Form();
    var fileId = new mongoose.Types.ObjectId();

    form.parse(req, function(err, fields, files) {
        if (err) return res.status(400).send(err);
        var isFile = (files && files.resumeFile) ? true : false;
        var profile = new Profile(fields);
        var upsertData = profile.toObject({
            transform: removeId,
        });
        upsertData.skills = JSON.parse(fields.skills);
        upsertData.userId = userId;

        Profile.findOneAndUpdate({
            userId: mongoose.Types.ObjectId(userId),
        }, upsertData, {
            upsert: true,
            'new': true,
        }, function(err, profile) {
            if (err) return res.status(400).send(err);
            if (isFile && profile) {
                    newProfileId = profile._id;
                } else {
                    res.status(200).send(profile);
                }
        });
        if (isFile) {
            var fileName = files.resumeFile[0].originalFilename;
            var filepath = files.resumeFile[0].path;
            var file_content_type = files.resumeFile[0].headers['content_type'];
            var fsReadStream = fs.createReadStream(filepath);

            var writeStream = gfs.createWriteStream({
                _id: fileId,
                filename: fileName,
                mode: 'w',
                content_type: file_content_type,
                metadata: {
                    uploadedBy: userId,
                },
            });

            fsReadStream.on('end', function() {
                fs.unlink(filepath, function(err) {
                    if (err) return res.status(400).send(err);
                    Profile.findOne({
                        'userId': mongoose.Types.ObjectId(userId),
                    }, function(err, profile) {
                        if (err) return res.status(400).send(err);



                        // delete old resume
                        if (profile && profile.resume) {
                            gfs.remove({
                                _id: mongoose.Types.ObjectId(profile.resume.resumeId),
                            }, function(err) {
                                if (err) return res.status(400).send(err);
                            });
                        }
                        // add resume in document
                        profile.set('resume', {
                            fileName: fileName,
                            resumeId: mongoose.Types.ObjectId(fileId),
                        });
                        // profile.resume = ;
                        profile.save(function(err, data) {
                            if (err) return res.status(400).send(err);
                            res.status(200).send(data);
                        });

                    });
                });
            });

            fsReadStream.pipe(writeStream);
        }
    });
};

module.exports.getFile = function(req, res) {
    // if (!req.payload._id) return res.status(401).send({ 'message': 'UnauthorizedError: private profile' });

    gfs.findOne({
        _id: req.params.id,
    }, function(err, file) {
        if (err) return res.status(400).send(err);
        if (!file) return res.status(404).send('file is not available');

        res.set('Content-Type', file.contentType);
        res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');

        var readstream = gfs.createReadStream({
            _id: file._id,
        });

        readstream.on('error', function(err) {
            console.log('Got error while processing stream ' + err.message);
            res.end();
        });

        readstream.pipe(res);
    });
};
