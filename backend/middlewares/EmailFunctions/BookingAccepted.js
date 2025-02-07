import { transporter } from "../emailConfig.js";
import { Booking_Accepted_User_Template } from "../../libs/EmailTemplate/MajorBookingAccepted.js";
import { Booking_Accepted_Provider_Template } from "../../libs/EmailTemplate/MajorBookingAccepted.js";
import { BookingRejectedProviderTemplate , BookingRejectedUserTemplate } from "../../libs/EmailTemplate/MajorBookingRejected.js";

export const BookingAcceptedEmail = async (serviceUser, serviceProvider, booking) => {
    try {
        const { service, date, timeSlot, address, orderNumber } = booking;

        const userEmailOptions = {
            from: '"HarFunMola ⚒" <kidsgardenus@gmail.com>',
            to: serviceUser.email,
            subject: "Your Booking is Confirmed! 🎉",
            text: `Hello ${serviceUser.fullName}, your booking for '${service.serviceName}' has been confirmed by ${serviceProvider.fullName}.`,
            html: Booking_Accepted_User_Template
                .replace("{name}", serviceUser.fullName)
                .replace("{service}", service.serviceName)
                .replace("{provider}", serviceProvider.fullName)
                .replace("{date}", date)
                .replace("{time}", timeSlot)
                .replace("{address}", address)
                .replace("{orderNumber}", orderNumber)
        };

        const providerEmailOptions = {
            from: '"HarFunMola ⚒" <kidsgardenus@gmail.com>',
            to: serviceProvider.email,
            subject: "New Booking Accepted! ✅",
            text: `Hello ${serviceProvider.fullName}, you have accepted a booking for '${service.serviceName}' from ${serviceUser.fullName}.`,
            html: Booking_Accepted_Provider_Template
                .replace("{name}", serviceProvider.fullName)
                .replace("{service}", service.serviceName)
                .replace("{customer}", serviceUser.fullName)
                .replace("{date}", date)
                .replace("{time}", timeSlot)
                .replace("{address}", address)
                .replace("{orderNumber}", orderNumber)
        };

        // Send emails to both user and provider
        await transporter.sendMail(userEmailOptions);
        await transporter.sendMail(providerEmailOptions);

        console.log("Booking confirmation emails sent successfully");
    } catch (error) {
        console.log("Email sending error:", error);
    }
};

//Booking Rejected Email

export const BookingRejectedEmail = async (serviceUser, serviceProvider, booking) => {
    try {
        const { service, date, timeSlot, address, orderNumber } = booking;

        // Email for Service User
        let serviceUserOptions = {
            from: '"HarFunMola ⚒" <kidsgardenus@gmail.com>',
            to: serviceUser.email,
            subject: "Your Booking Was Rejected ❌",
            text: `Hello ${serviceUser.fullName}, unfortunately, your booking for '${service.serviceName}' was rejected.`,
            html: BookingRejectedUserTemplate
                .replace("{name}", serviceUser.fullName)
                .replace("{service}", service.serviceName)
                .replace("{date}", date)
                .replace("{time}", timeSlot)
                .replace("{address}", address)
                .replace("{orderNumber}", orderNumber)
        };

        // Email for Service Provider (Confirmation of Rejection)
        let serviceProviderOptions = {
            from: '"HarFunMola ⚒" <kidsgardenus@gmail.com>',
            to: serviceProvider.email,
            subject: "Booking Rejection Confirmed ✅",
            text: `Hello ${serviceProvider.fullName}, you have successfully rejected the booking request for '${service.serviceName}'.`,
            html: BookingRejectedProviderTemplate
                .replace("{name}", serviceProvider.fullName)
                .replace("{service}", service.serviceName)
                .replace("{date}", date)
                .replace("{time}", timeSlot)
                .replace("{address}", address)
                .replace("{orderNumber}", orderNumber)
        };

        // Send emails asynchronously
        await Promise.all([
            transporter.sendMail(serviceUserOptions),
            transporter.sendMail(serviceProviderOptions)
        ]);

        console.log(`Booking rejection emails sent to ${serviceUser.fullName} and ${serviceProvider.fullName}`);
    } catch (error) {
        console.log("Error sending rejection emails:", error);
    }
};

