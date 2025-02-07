export const BookingRejectedUserTemplate = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #dc3545;
            color: #ffffff;
            text-align: center;
            padding: 20px;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            font-size: 24px;
            font-weight: bold;
        }
        .content {
            padding: 20px;
            font-size: 16px;
            color: #333333;
            line-height: 1.6;
        }
        .details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .details p {
            margin: 8px 0;
            font-weight: bold;
            color: #dc3545;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #666666;
            padding: 15px;
            border-top: 1px solid #dddddd;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        Booking Rejected ❌
    </div>
    <div class="content">
        <p>Hello <strong>{name}</strong>,</p>
        <p>We regret to inform you that the booking for <strong>{service}</strong> has been <span style="color: red;">rejected</span>.</p>

        <div class="details">
            <p><strong>📦 Order Number: #{orderNumber}</strong></p>
            <p>📅 Date: {date}</p>
            <p>⏰ Time: {time}</p>
            <p>📍 Address: {address}</p>
        </div>

        <p>We apologize for the inconvenience. If you need assistance, feel free to contact our support team.</p>

        <a href="https://yourwebsite.com/bookings" class="button">Find Another Provider</a>
    </div>

    <div class="footer">
        Thank you for choosing <strong>HarFunMola ⚒</strong>!<br>
        Need help? <a href="mailto:kidsgardenus@gmail.com">Contact Support</a>
    </div>
</div>

</body>
</html>
`;

export const BookingRejectedProviderTemplate = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
        .header { background-color: #28a745; color: #fff; text-align: center; padding: 20px; font-size: 24px; font-weight: bold; }
        .content { padding: 20px; font-size: 16px; color: #333; line-height: 1.6; }
        .details { background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .details p { margin: 8px 0; font-weight: bold; color: #28a745; }
        .footer { text-align: center; font-size: 14px; color: #666; padding: 15px; border-top: 1px solid #ddd; }
        .button { display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .button:hover { background-color: #0056b3; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Booking Rejection Confirmed ✅</div>
        <div class="content">
            <p>Hello <strong>{name}</strong>,</p>
            <p>You have successfully rejected the booking request for <strong>{service}</strong>.</p>
            <div class="details">
                <p><strong>📦 Order Number: #{orderNumber}</strong></p>
                <p>📅 Date: {date}</p>
                <p>⏰ Time: {time}</p>
                <p>📍 Address: {address}</p>
            </div>
            <p>If this was a mistake or you have any concerns, please contact our support team.</p>
            <a href="https://yourwebsite.com/provider-dashboard" class="button">View Dashboard</a>
        </div>
        <div class="footer">
            Thank you for using <strong>HarFunMola ⚒</strong>!<br>
            Need help? <a href="mailto:kidsgardenus@gmail.com">Contact Support</a>
        </div>
    </div>
</body>
</html>
`;