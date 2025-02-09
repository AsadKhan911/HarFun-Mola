import {userEmailTemplate} from '../../libs/EmailTemplate/MajorBookingInProgress.js'
import {providerEmailTemplate} from '../../libs/EmailTemplate/MajorBookingInProgress.js'
import { transporter } from '../emailConfig.js';

export const BookingInProgressEmail = async (serviceUser, serviceProvider, booking) => {
    try {
        const { service, date, timeSlot, address, orderNumber } = booking;

        const userEmailOptions = {
            from: '"HarFunMola ⚒" <kidsgardenus@gmail.com>',
            to: serviceUser.email,
            subject: "Your Service is On the Way! 🚀",
            html: userEmailTemplate
                .replace("{name}", serviceUser.fullName)
                .replace("{provider}", serviceProvider.fullName)
                .replace("{service}", service.serviceName)
                .replace("{date}", date)
                .replace("{time}", timeSlot)
                .replace("{address}", address)
                .replace("{orderNumber}", orderNumber)
        };


        const providerEmailOptions = {
            from: '"HarFunMola ⚒" <kidsgardenus@gmail.com>',
            to: serviceProvider.email,
            subject: "Your Booking Has Started! ✅",
            html: providerEmailTemplate
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

        console.log("Booking in-progress emails sent successfully");
    } catch (error) {
        console.log("Email sending error:", error);
    }
};
