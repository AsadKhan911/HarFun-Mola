import { MinorPredefinedIssues } from "../../models/MinorListings/minorServicesIssues.js";
import { Service } from "../../models/MinorListings/minorServices.js";

// Controller to add a predefined issue and link it to the service
export const addPredefinedIssue = async (req, res) => {
  try {
    const { service, issueName, icon, description } = req.body;

    // Validate required fields
    if (!service || !issueName) {
      return res.status(400).json({ message: "Service ID and issue name are required." });
    }

    // Create the predefined issue
    const newIssue = new MinorPredefinedIssues({
      service,
      issueName,
      icon,
      description,
    });

    // Save the issue
    const savedIssue = await newIssue.save();

    // Push the new issue's ID into the corresponding MinorService document
    await Service.findByIdAndUpdate(service, { $push: { predefinedIssues: savedIssue._id } });

    res.status(201).json({ message: "Predefined issue added successfully", data: savedIssue });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Controller to get all predefined issues
export const getAllPredefinedIssues = async (req, res) => {
  try {
    const issues = await MinorPredefinedIssues.find().populate("service"); // Populating service details
    res.status(200).json({ success: true, data: issues });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch predefined issues", error: error.message });
  }
};

// Controller to get predefined issues for a specific service
export const getPredefinedIssuesByService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    // Fetch issues related to the given service ID
    const issues = await MinorPredefinedIssues.find({ service: serviceId }).populate("service");

    if (!issues.length) {
      return res.status(404).json({ message: "No predefined issues found for this service." });
    }

    res.status(200).json({ success: true, data: issues });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch issues", error: error.message });
  }
};
