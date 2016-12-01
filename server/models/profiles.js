var mongoose = require('mongoose');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

var ProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    // managerName: {
    //     type: String,
    //     required: [true, 'Manager name is required.'],
    // },
    // managerEmail: {
    //     type: String,
    //     required: 'Email address is required',
    //     validate: [validateEmail, 'Please fill a valid email address'],
    //     match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    // },
    designation: {
        type: String,
        required: [true, 'Manager name is required.'],
    },
    resume: {
        fileName: String,
        resumeId: mongoose.Schema.Types.ObjectId,
    },
    skills: { type: Array, 'default': [] },
    updated: { type: Date, default: Date.now },
});

mongoose.model('Profile', ProfileSchema);
