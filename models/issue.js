const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  project_name: { type: String, required: true, select: false },
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date },
  created_by: { type: String, required: true },
  assigned_to: { type: String, default: "" },
  open: { type: Boolean, default: true },
  status_text: { type:String, default: "" }
});

module.exports = mongoose.model("Issue", issueSchema);

