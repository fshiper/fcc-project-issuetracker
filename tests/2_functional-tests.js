/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json', "Response should be json");
          assert.equal(res.body.issue_title, 'Title', 'res.body.issue_title should be "Title"');
          assert.equal(res.body.issue_text, 'text', 'res.body.issue_text should be "text"'); 
          assert.isDefined(res.body.created_on, 'res.body_created_on should be defined');
          assert.isDefined(res.body.updated_on, 'res.body_updated_on should be defined');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in', 'res.body.created_by should be "Functional Test - Every field filled in"'); 
          assert.equal(res.body.assigned_to, 'Chai and Mocha', 'res.body.assigned_to should be "Chai and Mocha"');
          assert.equal(res.body.open, true, 'res.body.open should be "true"');
          assert.equal(res.body.status_text, 'In QA', 'res.body.status_text should be "In QA"');           
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title_req',
          issue_text: 'text_req',
          created_by: 'REQ_Functional Test - Every field filled in'
        })
        .end((err, res)=> {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json', "Response should be json");
          assert.equal(res.body.issue_title, 'Title_req', 'res.body.issue_title should be "Title_req"');
          assert.equal(res.body.issue_text, 'text_req', 'res.body.issue_text should be "text_req"'); 
          assert.isDefined(res.body.created_on, 'res.body_created_on should be defined');
          assert.isDefined(res.body.updated_on, 'res.body_updated_on should be defined');
          assert.equal(res.body.created_by, 'REQ_Functional Test - Every field filled in', 'res.body.created_by should be "REQ_Functional Test - Every field filled in"'); 
          assert.equal(res.body.assigned_to, '', 'res.body.assigned_to should be ""');
          assert.equal(res.body.open, true, 'res.body.open should be "true"');
          assert.equal(res.body.status_text, '', 'res.body.status_text should be ""');           
          done();
        });
      });
      
      test('Missing required fields', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title_req',
          issue_text: ''
        })
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.body.error, 'Missing required fields', 'res.body.error should be "Missing required fields"');
          done();
       })
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({})
          .end((err, res) => {
          assert.equal(res.status,200);
          assert.equal(res.text, 'no updated field sent', 'res.text should be "no updated field sent"')
          done();
        })
      });
      
      test('One field to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id:'5e5fb99cb6023e11c261f7c4',
            issue_title: 'Issue title'
          })
          .end((err, res) => {
            assert.equal(res.status,200);
            assert.equal(res.type, 'text/html', "Response should be text");
            assert.equal(res.text, 'successfully updated', 'res.text should be "successfully updated"')
            done();
          })  
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id:'5e5fb99cb6023e11c261f7c4',
            issue_title: 'Issue title',
            issue_text: 'Issue text',
            created_by: 'Created by',
            assigned_to: 'Assigned to'
          })
          .end((err, res) => {
            assert.equal(res.status,200);
            assert.equal(res.type, 'text/html', "Response should be text");
            assert.equal(res.text, 'successfully updated', 'res.text should be "successfully updated"')
            done();
          })         
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({issue_title: 'Title'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });        
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({issue_title: 'Title', issue_text: 'text'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });          
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .send({})
          .end((err, res) => {
          assert.equal(res.status,400);
          assert.equal(res.text, '_id error', 'res.text should be "_id error"')
          done();
        })        
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .send({_id:'5e5fbb0a5354e6145f187f43'})
          .end((err, res) => {
          assert.equal(res.status,200);
          assert.equal(res.text, 'deleted 5e5fbb0a5354e6145f187f43', 'res.text should be "deleted 5e5fbb0a5354e6145f187f43"')
          done();
        })          
      });
      
    });

});
