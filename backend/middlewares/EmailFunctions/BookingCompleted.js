import { transporter } from "../emailConfig.js";
import { BookingCompletedUserTemplate } from "../../libs/EmailTemplate/MajorBookingCompleted.js";
import { BookingCompletedProviderTemplate } from "../../libs/EmailTemplate/MajorBookingCompleted.js";

export const BookingCompletedEmail = async (serviceUser, serviceProvider, booking) => {
    try {
        const { service, date, timeSlot, address, orderNumber, elapsedTime, completedTime } = booking;

        const userEmailOptions = {
            from: '"HarFunMola ⚒" <kidsgardenus@gmail.com>',
            to: serviceUser.email,
            subject: "Your Booking is Completed! 🎉",
            text: `Hello ${serviceUser.fullName}, your booking for '${service.serviceName}' has been completed by ${serviceProvider.fullName}.`,
            html: BookingCompletedUserTemplate
                .replace("{name}", serviceUser.fullName)
                .replace("{service}", service.serviceName)
                .replace("{service}", service.serviceName)
                .replace("{provider}", serviceProvider.fullName)
                .replace("{provider}", serviceProvider.fullName)
                .replace("{date}", date)
                .replace("{time}", timeSlot)
                .replace("{address}", address)
                .replace("{orderNumber}", orderNumber)
                .replace("{elapsedTime}", elapsedTime)
                .replace("{completedTime}", completedTime)
        };

        const providerEmailOptions = {
            from: '"HarFunMola ⚒" <kidsgardenus@gmail.com>',
            to: serviceProvider.email,
            subject: "Your Service Booking is Completed! ✅",
            text: `Hello ${serviceProvider.fullName}, you have completed the booking for '${service.serviceName}' with ${serviceUser.fullName}.`,
            html: BookingCompletedProviderTemplate
                .replace("{name}", serviceProvider.fullName)
                .replace("{service}", service.serviceName) //jab 2 jaga ek he name use ho to, do dfa replace krna h
                .replace("{service}", service.serviceName)
                .replace("{customer}", serviceUser.fullName)
                .replace("{customer}", serviceUser.fullName)
                .replace("{date}", date)
                .replace("{time}", timeSlot)
                .replace("{address}", address)
                .replace("{orderNumber}", orderNumber)
                .replace("{elapsedTime}", elapsedTime)
                .replace("{completedTime}", completedTime)
        };

        // Send emails to both user and provider
        await transporter.sendMail(userEmailOptions);
        await transporter.sendMail(providerEmailOptions);

        console.log("Booking completed emails sent successfully");
    } catch (error) {
        console.log("Email sending error:", error);
    }
};
