import { MinorServiceListing } from "../../models/MinorListings/minorServiceListings.js";
import { Service } from "../../models/MinorListings/minorServices.js";
import { MinorPredefinedIssues } from "../../models/MinorListings/minorServicesIssues.js";


// Controller for creating multiple MinorServiceListings for selected services
export const createMinorServiceListing = async (req, res) => {
  console.log("========== NEW REQUEST ==========");
  console.log("Request received at:", new Date().toISOString());
  console.log("Request headers:", req.headers);
  console.log("Request body:", req.body);

  try {
    const { 
      serviceIds, 
      issues, 
      pricePerIssue, 
      created_by, 
      diagnosticPrice, 
      location, 
      city, 
      description, 
      categoryName,
      latitude,
      longitude,
      timeSlots
    } = req.body;

    // Validate required location fields
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required"
      });
    }

    // Validate time slots
    if (!timeSlots || timeSlots.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one time slot must be selected"
      });
    }

    console.log("Validating services...");
    const services = await Service.find({ '_id': { $in: serviceIds } });
    console.log("Found services:", services);

    if (services.length !== serviceIds.length) {
      console.log("Service validation failed - some services not found");
      return res.status(404).json({ success: false, message: "Some services are invalid" });
    }

    console.log("Validating issues...");
    const allIssues = [];
    for (let serviceId of serviceIds) {
      console.log(`Checking issues for service ${serviceId}`);
      if (!issues[serviceId] || issues[serviceId].length === 0) {
        console.log(`No issues selected for service ${serviceId}`);
        continue;
      }
      
      const serviceIssues = await MinorPredefinedIssues.find({ 
        service: serviceId, 
        '_id': { $in: issues[serviceId] } 
      });
      
      console.log(`Found ${serviceIssues.length} issues for service ${serviceId}`);
      
      if (serviceIssues.length !== issues[serviceId].length) {
        console.log(`Issue validation failed for service ${serviceId}`);
        return res.status(400).json({ 
          success: false, 
          message: `Some issues for service ${serviceId} are invalid` 
        });
      }
      allIssues.push(...serviceIssues);
    }

    console.log("Creating listings...");
    const listings = [];
    
    for (let serviceId of serviceIds) {
      if (!issues[serviceId] || issues[serviceId].length === 0) {
        continue;
      }

      console.log(`Creating listing for service ${serviceId} with ${issues[serviceId].length} issues`);
      
      const serviceIssuePricing = issues[serviceId].map(issueId => {
        const issue = allIssues.find(i => i._id.toString() === issueId.toString());
        const priceObj = pricePerIssue.find(p => p.issueId.toString() === issueId.toString());
        return {
          issueName: issue?.issueName || 'Unknown Issue',
          price: priceObj?.price || 0
        };
      });

      const newListing = new MinorServiceListing({
        service: serviceId,
        predefinedIssues: issues[serviceId],
        issuePricing: serviceIssuePricing,
        pricePerIssue,
        created_by,
        city,
        description,
        location,
        coordinates: { // Add geolocation data
          type: 'Point',
          coordinates: [longitude, latitude] // MongoDB uses [long, lat] order
        },
        diagnosticPrice,
        timeSlots, // Add time slots
        status: 'Active',
        category: services.find(s => s._id.toString() === serviceId.toString())?.category
      });

      await newListing.save();
      listings.push(newListing);
      console.log(`Created listing with ID: ${newListing._id} for service ${serviceId}`);
    }

    console.log("Successfully created all listings");
    res.status(201).json({ success: true, data: listings });
  } catch (error) {
    console.error("ERROR PROCESSING REQUEST:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      success: false, 
      message: "Failed to create service listings", 
      error: error.message 
    });
  }
};
