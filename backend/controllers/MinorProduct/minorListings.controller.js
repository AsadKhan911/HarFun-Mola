import mongoose from "mongoose";
import { MinorBooking } from "../../models/MinorListings/minorProductBookings.js";
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

// controllers/bookingController.js
// Create a new booking
// controllers/bookingController.js
export const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { 
      serviceListingId, 
      date,
      timeSlot,
      latitude,
      longitude,
      address,
      instructions,
      paymentMethod,
      pricingType,
      amount
    } = req.body;

    const serviceUser = req.user;

    // Validate inputs
    if (!serviceListingId || !date || !timeSlot || !latitude || !longitude || !address) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get the service listing
    const serviceListing = await MinorServiceListing.findById(serviceListingId)
      .populate('service')
      .populate('predefinedIssues')
      .session(session);

    if (!serviceListing || serviceListing.status !== 'Active' || !serviceListing.availability) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Service listing not available" });
    }

    // For diagnostic pricing type, we'll use the diagnosticPrice from the listing
    // For service pricing type, we'll need to select the first predefined issue or implement a different logic
    let selectedIssue;
    let issuePrice = 0;
    
    if (pricingType === 'diagnostic') {
      issuePrice = serviceListing.diagnosticPrice;
    } else {
      // For service type, we'll select the first predefined issue (you may want to modify this)
      if (serviceListing.predefinedIssues.length === 0) {
        await session.abortTransaction();
        return res.status(400).json({ message: "No service issues available for this listing" });
      }
      selectedIssue = serviceListing.predefinedIssues[0];
      
      const issuePricing = serviceListing.issuePricing.find(
        item => item.issueName === selectedIssue.issueName
      );
      
      if (!issuePricing) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Pricing not available for selected issue" });
      }
      issuePrice = issuePricing.price;
    }

    // Create the booking
    const newBooking = new MinorBooking({
      serviceListing: serviceListingId,
      serviceUser,
      serviceProvider: serviceListing.created_by,
      selectedIssue: selectedIssue?._id || null,
      issueName: selectedIssue?.issueName || 'Diagnostic Check',
      price: pricingType === 'service' ? issuePrice : 0,
      diagnosticPrice: pricingType === 'diagnostic' ? issuePrice : 0,
      totalPrice: issuePrice,
      bookingDate: new Date(date),
      timeSlot,
      address,
      coordinates: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      specialInstructions: instructions,
      status: 'Pending',
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      paymentMethod
    });

    await newBooking.save({ session });

    await session.commitTransaction();
    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Booking creation error:", error);
    res.status(500).json({ message: "Error creating booking", error: error.message });
  } finally {
    session.endSession();
  }
};

// Add this new endpoint to get booked time slots
export const getBookedTimeSlots = async (req, res) => {
  try {
    const { serviceListingId, date } = req.params;
    
    const bookings = await MinorBooking.find({
      serviceListing: serviceListingId,
      bookingDate: {
        $gte: new Date(`${date}T00:00:00.000Z`),
        $lte: new Date(`${date}T23:59:59.999Z`)
      },
      status: { $nin: ['Cancelled', 'Rejected'] }
    });

    const bookedSlots = bookings.map(booking => booking.timeSlot);
    
    res.status(200).json({
      bookedSlots,
      count: bookedSlots.length
    });
  } catch (error) {
    console.error("Error fetching booked time slots:", error);
    res.status(500).json({ message: "Error fetching booked time slots", error: error.message });
  }
};

