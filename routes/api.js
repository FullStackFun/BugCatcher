'use strict';

// adding mongoose and mongodb
let mongoose = require('mongoose')
let mongdob = require('mongodb')

let uri = 'mongodb+srv://mikeobilade:' + process.env.PW + '@fcc.kn1uzam.mongodb.net/'


module.exports = function (app) {

  mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})

  let database = mongoose.connection;
        database.on('error', console.error.bind(console, 'an error with connection'));
        database.once('open', function() {
          console.log('database active')
        })

  let bugSchema = new mongoose.Schema( {
      issue_title: {type: String, required: true},
      issue_text: {type: String, required: true},
      created_on: {type: Date, required: true},
      updated_on: {type: Date, required: true},
      created_by: {type: String, required: true},
      assigned_to: String,
      open: {type: Boolean, required: true},
      status_text: String,
      project: String
  })

  let Bug = mongoose.model('Bug', bugSchema)
        

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
  
      let filter = Object.assign(req.query)
      filter.project = project
    //  console.log(filter)
      Bug.find( 
        //{project: project},
        filter,
        function (err, array) {
          if(!err && array) {
              return res.json(array)
          }
        }

      )
      
    })
    
    .post(function (req, res){
      let project = req.params.project;

      if(!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        return res.json({error: 'required field(s) missing'})
      }

      let newBug = new Bug( {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_on: new Date().toDateString(),
        updated_on: new Date().toUTCString(),
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || '',
        open: true,
        status_text: req.body.status_text || '',
        project: project

      })
      newBug.save((error, data) => {
          if (!error && data) {
             // console.log(data)
             return res.json(data)
          }
      })

      
    })
    
    .put(function (req, res){
      let project = req.params.project;
    //  console.log(req.body, "req body")
      let update = {}
      Object.keys(req.body).forEach(function(key) {
        if (req.body[key] != '') {
          update[key] = req.body[key]
        }
      })

   if (!update['_id']) {
     return res.json({ error: 'missing _id' })

  }
   else if (Object.keys(update).length <2 && update['_id']) {
     let _id = update._id
      return res.json({ error: 'no update field(s) sent', '_id': _id })
     
   }
   update.updated_on = new Date().toUTCString()
//   console.log(update, "update")
  // console.log(update.updated_on, "update on")
   Bug.findByIdAndUpdate(
    
    req.body._id, 
  //  console.log(req.body._id, "req.body._id"),
    update,
    {new: true},
    function (err, data) {

      let _id = req.body['_id']
    
    if (err || !data) {
      return res.json({error: 'could not update', '_id': _id})
    }
      //     update.updated_on = new Date().toDateString()
  //         console.log(update, "successful update")
            return res.json({  result: 'successfully updated', '_id': _id })

    }
    
    
    )


    })
    
    .delete(function (req, res){
      let project = req.params.project;
      if (!req.body['_id']) {
        return res.json({ error: 'missing _id' })
     }

     Bug.findByIdAndDelete(
    
      req.body._id, 
      
      function (err, data) {
  
        let _id = req.body['_id']
      
      if (err || !data) {
        return res.json({error: 'could not delete', '_id': _id})
      }
              return res.json({  result: 'successfully deleted', '_id': _id })
  
      }
      
      
      )

      
    });
    
};
