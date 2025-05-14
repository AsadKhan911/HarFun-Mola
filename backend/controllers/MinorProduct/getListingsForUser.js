// import { MinorService } from "../models/MinorService.js";
// import { MinorCategory } from "../models/MinorCategory.js";
// import { MinorPredefinedIssues } from "../models/MinorPredefinedIssues.js";

import { MinorServiceListing } from "../../models/MinorListings/minorServiceListings.js";

// Controller for getting listings by category, service, and issue
// export const getListingsByIssue = async (req, res) => {
//   try {
//     const { categoryId, serviceId, issueId } = req.params;

//     // Fetch the category to ensure it exists
//     const category = await MinorCategory.findById(categoryId);
//     if (!category) {
//       return res.status(404).json({ success: false, message: "Category not found" });
//     }

//     // Fetch the service to ensure it exists within the category
//     const service = await MinorService.findOne({ _id: serviceId, category: categoryId });
//     if (!service) {
//       return res.status(404).json({ success: false, message: "Service not found in the selected category" });
//     }

//     // Fetch the predefined issue to ensure it exists for this service
//     const issue = await MinorPredefinedIssues.findOne({ _id: issueId, service: serviceId });
//     if (!issue) {
//       return res.status(404).json({ success: false, message: "Issue not found for the selected service" });
//     }

//     // Fetch all active listings for this issue
//     const listings = await MinorServiceListing.find({ service: serviceId, predefinedIssues: issueId, status: "Active" })
//       .populate("predefinedIssues") // Populate issues for display
//       .populate("providerId"); // Populate provider details (assuming provider info is needed)

//     res.status(200).json({ success: true, data: listings });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Failed to fetch service listings", error: error.message });
//   }
// };

export const getListingsByIssue = async (req, res) => {
  try {
    console.log("aya to h")
    const { issueId, serviceId, categoryId, issueName } = req.query;
    console.log("Received query params:", { issueId, serviceId, categoryId, issueName });

    if (!issueId || !serviceId || !categoryId) {
      console.log("Missing one or more required parameters");
      return res.status(400).json({
        success: false,
        message: "Missing required parameters"
      });
    }

    const baseQuery = {
      predefinedIssues: issueId,
      service: serviceId,
      category: categoryId,
      status: 'Active',
      availability: true
    };

    // Get all listings matching the query
    const listings = await MinorServiceListing.find(baseQuery)
    .populate('category', 'name')
      .populate({
        path: 'created_by',
        select: '-password',
        model: 'user' // explicitly specify the model
      })
      .sort({ createdAt: -1 })
      .lean();

    // Filter pricing for the selected issue and ensure created_by exists
    const filteredListings = listings.map(listing => {
      const issuePrice = listing.issuePricing?.find(
        issue => issue.issueName === issueName
      );

      // Ensure created_by has at least a name property
      if (!listing.created_by) {
        listing.created_by = { name: 'Provider' };
      } else if (!listing.created_by.name) {
        listing.created_by.name = listing.created_by.fullName || 'Provider';
      }

      return {
        ...listing,
        price: issuePrice?.price || listing.diagnosticPrice
      };
    });

    res.status(200).json({
      success: true,
      data: filteredListings
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch service listings",
      error: error.message
    });
  }
};