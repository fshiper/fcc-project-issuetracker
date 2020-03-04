/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const mongoose = require("mongoose");
var expect = require("chai").expect;
const Issue = require("../models/issue");

module.exports = function(app) {
  app
    .route("/api/issues/:project")

    .get(function(req, res) {
      let project = req.params.project;
      let qry = {project_name: project}
      Object.keys(req.query).forEach(a=> {
        qry[a]=req.query[a]
      })
      Issue.find(qry, (err, data)=> {
        if (err) return res.status(400).json(err)
        res.status(200).json(data)
      })
    })

    .post(function(req, res) {
      let projectName = req.params.project;
      let {
        issue_title: issue_title,
        issue_text: issue_text,
        created_by: created_by,
        assigned_to: assigned_to,
        status_text: status_text
      } = req.body;
      
      if (!issue_title || !issue_text || !created_by) {
        return res.status(400).json({ error: "Missing required fields" });
      }
    
      let newIssue = new Issue({
        project_name: projectName,
        issue_title: issue_title,
        issue_text: issue_text,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: created_by,
        assigned_to: assigned_to,
        open: true,
        status_text: status_text
      });
      newIssue.save((err, data) => {
        if (err) {
          return res.status(400).json(err);
        }
        res.status(200).json(data);
      });
    })

    .put( (req, res) => {
      let projectName = req.params.project;
      let {
        _id: issueId,
        issue_title: issueTitle,
        issue_text:  issueText,
        created_by:  createdBy,
        assigned_to: assignedTo,
        status_text: statusText,
        open: open
      } = req.body;
      if (!issueId || (!issueTitle && !issueText && !createdBy && !assignedTo && !statusText && !open)) {
        return res.send("no updated field sent")
      }
      let issueUpdate = {}
      Object.keys(req.body).forEach(a=> {
        issueUpdate[a]=req.body[a]
      })
      Issue.findById(issueId, (err, doc) => {
        if (err) return res.status(400).json(err)
        Object.assign(doc,issueUpdate, {updatedOn: new Date()})
        doc.save((err, updatedDoc) => {
          if (err) return res.status(400).json(err)
          res.status(200).send("successfully updated")
        })
      })
    })

    .delete(function(req, res) {
      let project = req.params.project;
      let _id = req.body._id
      if (!_id) return res.status(400).send("_id error")
      Issue.findByIdAndDelete(_id, (err, data) => {
        if (err) return res.status(400).send(`could not delete ${_id}`)
        res.status(200).send(`deleted ${_id}`)
      })
    });
};
