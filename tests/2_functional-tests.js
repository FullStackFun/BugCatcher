const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let id1 = ''
let id2 = ''
let id3 = ''

suite('Functional Tests', function() {

   
    test ('Dummy 3', function(done) {
        chai.request(server)
            .post('/api/issues/test')
            .send({
                issue_text: 'Text',
                issue_title: 'Title',
                created_by: 'Required fields filled in',
              /*   assigned_to: 'Tester',
                status_text: 'Unresolved' */
            })
            .end(function(err, res) {
          /*       assert.equal(res.status, 200)
                assert.equal(res.body.issue_title, 'Title')
                assert.equal(res.body.issue_text, 'Text')
                assert.equal(res.body.created_by, 'Required fields filled in')
                assert.equal(res.body.status_text, '')
                assert.equal(res.body.assigned_to, '')
                assert.equal(res.body.project, 'test') */
                id3 = res.body._id
                console.log('id3 has been set as ' + id3)
            })
            done()
    })


    test ('All fields filled in', function(done) {
        chai.request(server)
            .post('/api/issues/test')
            .send({
                issue_text: 'Text',
                issue_title: 'Title',
                created_by: 'All fields filled in',
                assigned_to: 'Tester',
                status_text: 'Unresolved'
            })
            .end(function(err, res) {
                assert.equal(res.status, 200)
                assert.equal(res.body.issue_title, 'Title')
                assert.equal(res.body.issue_text, 'Text')
                assert.equal(res.body.created_by, 'All fields filled in')
                assert.equal(res.body.status_text, 'Unresolved')
                assert.equal(res.body.assigned_to, 'Tester')
                assert.equal(res.body.project, 'test')
                id1 = res.body._id
                console.log('id1 has been set as ' + id1)
            })
            done()
    })

    test ('Required fields filled in', function(done) {
        chai.request(server)
            .post('/api/issues/test')
            .send({
                issue_text: 'Text',
                issue_title: 'Title',
                created_by: 'Required fields filled in',
              /*   assigned_to: 'Tester',
                status_text: 'Unresolved' */
            })
            .end(function(err, res) {
                assert.equal(res.status, 200)
                assert.equal(res.body.issue_title, 'Title')
                assert.equal(res.body.issue_text, 'Text')
                assert.equal(res.body.created_by, 'Required fields filled in')
                assert.equal(res.body.status_text, '')
                assert.equal(res.body.assigned_to, '')
                assert.equal(res.body.project, 'test')
                id2 = res.body._id
                console.log('id2 has been set as ' + id2)
            })
            done()
    })

    test ('Required fields missing', function(done) {
        chai.request(server)
            .post('/api/issues/test')
            .send({
                issue_title: 'Title'   
            })
            .end(function(err, res) {
              //  assert.equal(res.body.error, {error: 'required field(s) missing'})
              assert.equal(res.body.error, 'required field(s) missing')
            })
            done()
    })
    
    test ('View issues on a project', function(done) {
        chai.request(server)
            .get('/api/issues/test')
            .query({
              
            })
            .end(function(err, res) {
                assert.equal(res.status, 200)
                assert.isArray(res.body)
                assert.property(res.body[0], 'issue_title')
                assert.property(res.body[0], 'issue_text')
                assert.property(res.body[0], 'created_by')
                assert.property(res.body[0], 'status_text')
                assert.property(res.body[0], 'assigned_to')
                assert.property(res.body[0], 'project')
               
            })
            done()
    })

    test ('View one filter', function(done) {
        chai.request(server)
            .get('/api/issues/test')
            .query({
              created_by: 'View one filter',
            })
            .end(function(err, res) {
                res.body.forEach(function(data) {
                    assert.equal(data.created_by, 'View one filter')
                })
               done()
            })
            
    })
 
    test ('View more than one filter', function(done) {
        chai.request(server)
            .get('/api/issues/test')
            .query({
              created_by: 'View more than one filter',
              issue_text: 'Text'
            })
            .end(function(err, res) {
                res.body.forEach(function(data) {
                    assert.equal(data.created_by, 'View more than one filter')
                    assert.equal(data.issue_text, 'Text')
                })
               done()
            })
            
    })


   suite('put /api/issues{project} => text', function(){ 
    
    
                test ('Missing _id to update', function(done) {
                    chai.request(server)
                        .put('/api/issues/test')
                        .send({
                            _id: '',
                            issue_text: 'Text'
                        })
                        .end(function(err, res) {
                            assert.equal(res.body.error, 'missing _id')
                            done()
                        })
                })
            
                test ('No updated field sent', function(done) {
                    chai.request(server)
                        .put('/api/issues/test')
                        .send({
                            _id: 'test'

                        })
                        .end(function(err, res) {
                            assert.equal(res.body.error, 'no update field(s) sent')
                            assert.equal(res.body._id, 'test')
                            done()
                        })
                })

                test ('One update sent', function(done) {
                    chai.request(server)
                        .put('/api/issues/test')
                        .send({
                            _id: id1,
                            issue_title: 'Title'
                        })
                        .end(function(err, res) {
                            assert.equal(res.status, 200)
                            assert.equal(res.body.result, 'successfully updated')
                            assert.equal(res.body._id, id1)

                            done()
                        })
                })

                test ('Multiple updates sent', function(done) {
                    chai.request(server)
                        .put('/api/issues/test')
                        .send({
                            _id: id2,
                            issue_title: 'Title',
                            issue_text: 'Text'
                        })
                        .end(function(err, res) {
                            assert.equal(res.status, 200)
                            assert.equal(res.body.result, 'successfully updated')
                            assert.equal(res.body._id, id2);
                            done()
                        })
                })


                test ('Update invalid _id', function(done) {
                    chai.request(server)
                        .put('/api/issues/test')
                        .send({
                            _id: 'one',
                            issue_title: 'Title',
                        
                        })
                        .end(function(err, res) {
                            assert.equal(res.body.error, 'could not update')
                            assert.equal(res.body._id, 'one');
                            done()
                        })
                })

        })
        test ('Delete invalid _id', function(done) {
            chai.request(server)
                .delete('/api/issues/test')
                .send({
                    _id: 'one',
                    issue_title: 'Title',
                
                })
                .end(function(err, res) {
                    assert.equal(res.body.error, 'could not delete')
                    assert.equal(res.body._id, 'one');
                    done()
                })
        })

        test ('Missing _id to delete', function(done) {
            chai.request(server)
                .delete('/api/issues/test')
                .send({
                    _id: '',
                    issue_text: 'Text'
                })
                .end(function(err, res) {
                    assert.equal(res.body.error, 'missing _id')
                    done()
                })
        })
        
        test ('Delete sent', function(done) {
            chai.request(server)
                .delete('/api/issues/test')
                .send({
                    _id: id3
                })
                .end(function(err, res) {
                   // assert.equal(res.status, 200)
                    assert.equal(res.body.result, 'successfully deleted')
                    assert.equal(res.body._id, id3)

                    done()
                })
        })


});
