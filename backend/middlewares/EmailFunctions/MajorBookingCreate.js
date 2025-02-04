import { transporter } from "../emailConfig.js";
import { BookingPendingTemplate, BookingReceivedTemplate } from "../../libs/EmailTemplate/MajorBookingCreate.js";

export const sendBookingPendingEmail = async (user, service, booking) => {
    try {
        const { fullName: userName, email: userEmail } = user;
        const { serviceName, created_by , price } = service;
        const { date, timeSlot, address } = booking;

        // Service Provider Details
        const providerName = created_by?.fullName || "Unknown Provider";
        const providerEmail = created_by?.email;

        // Email to Service User (Customer)
        const userMailOptions = {
            from: '"HarFunMola ⚒" <kidsgardenus@gmail.com>',
            to: userEmail,
            subject: "Your Booking is Pending Confirmation ⏳",
            text: `Hello ${userName}, your booking for '${serviceName}' is pending provider confirmation.`,
            html: BookingPendingTemplate
                .replace("{name}", userName)
                .replace("{service}", serviceName)
                .replace("{provider}", providerName)
                .replace("{date}", date)
                .replace("{time}", timeSlot)
                .replace("{address}", address),
        };

        // Email to Service Provider
        if (providerEmail) {
            const providerMailOptions = {
                from: '"HarFunMola ⚒" <kidsgardenus@gmail.com>',
                to: providerEmail,
                subject: "New Service Booking Request 📢",
                text: `Hello ${providerName}, you have a new booking request for '${serviceName}'. Please review and accept it in the app.`,
                html: BookingReceivedTemplate
                    .replace("{provider}", providerName)
                    .replace("{service}", serviceName)
                    .replace("{service}", serviceName)
                    .replace("{price}", price)
                    .replace("{user}", userName)
                    .replace("{date}", date)
                    .replace("{time}", timeSlot)
                    .replace("{address}", address),
            };

            await transporter.sendMail(providerMailOptions);

        }

        await transporter.sendMail(userMailOptions);


    } catch (error) {
        console.error("Error sending booking emails:", error);
    }
};

