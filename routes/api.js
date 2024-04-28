'use strict';

const IssueModel = require("../models").Issue;
const ProjectModel =  require("../models").Project;

const { Issue, Project } = require("../models");
 

module.exports = function (app) {

  app.route('/api/issues/:project')
  
  .get(async (req, res) => {
    let projectName = req.params.project;
    try {
      const project = await ProjectModel.findOne({ name: projectName });
      if (!project) {
        res.json([{ error: "project not found" }]);
        return;
      } else {
        const issues = await IssueModel.find({
          projectId: project._id,
          ...req.query,
        });
        if(!issues){
          res.json([{error: "no issue found"}]);
          return;
        }
        res.json(issues);
        return;
        }
      } catch(err){
        res.json({ error: "could not get", _id: _id});
      }

  })
    
    .post(async (req, res) => {
      let projectName = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text} =
        req.body;
      if(!issue_title || !issue_text || !created_by){
        res.json({error: "required field(s) missing" });
        return;
      }
      try{
        let projectModel = await ProjectModel.findOne({name: projectName});
        if(!projectModel){
          projectModel = new ProjectModel({name: projectName});
          projectModel = await projectModel.save();
        }

        const issueModel = new IssueModel({
          projectId: projectModel._id,
          issue_title: issue_title || "",
          issue_text: issue_text || "",
          created_on: new Date(),
          updated_on: new Date(),
          created_by: created_by || "",
          assigned_to: assigned_to || "",
          open: true,
          status_text: status_text || ""
        });
        const issue = await issueModel.save();
        res.json(issue);        
      } catch(err){
        res.json({ error: "could not post", _id: _id});
      }      
    })
    
    .put(async (req, res) => {
      try {
        const projectName = req.params.project;
        const { _id } = req.body;
    
        // Check if _id is provided
        if (!_id) {
          return res.json({ error: "missing _id" });
        }
    
        // Check if update fields are provided
        const updateFields = ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'open'];
        const updateData = {};
        for (const field of updateFields) {
          if (req.body[field] !== undefined) {
            updateData[field] = req.body[field];
          }
        }
    
        // Check if any update fields are provided
        if (Object.keys(updateData).length === 0) {
          return res.json({ error: "no update field(s) sent", _id });
        }
    
        // Update issue
        const updatedIssue = await Issue.findByIdAndUpdate(_id, { ...updateData, updated_on: new Date() }, { new: true });
        if (!updatedIssue) {
          return res.json({ error: "could not update", _id });
        }
    
        res.json({ result: "successfully updated", _id });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "could not update issue" });
      }
    })
    
    .delete(async (req, res) => {
      try {
        const projectName = req.params.project;
        const { _id } = req.body;
    
        // Check if _id is provided
        if (!_id) {
          return res.json({ error: "missing _id" });
        }
    
        // Delete issue
        const deletedIssue = await IssueModel.findOneAndDelete({ _id });
        if (!deletedIssue) {
          return res.json({ error: "could not delete", _id });
        }
    
        res.json({ result: "successfully deleted", _id });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "could not delete issue" });
      }
    })
    
};