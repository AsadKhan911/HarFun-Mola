export const Booking_Accepted_User_Template = `
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
            background-color: #007bff;
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
            color: #007bff;
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
        Booking Confirmed! 🎉
    </div>
    <div class="content">
        <p>Hello <strong>{name}</strong>,</p>
        <p>Your booking for <strong>{service}</strong> has been <span style="color: green;">accepted</span> by <strong>{provider}</strong>.</p>

        <div class="details">
            <p>📅 Date: {date}</p>
            <p>⏰ Time: {time}</p>
            <p>📍 Address: {address}</p>
        </div>

        <p>If you have any questions, feel free to contact us.</p>

        <a href="https://yourwebsite.com/bookings" class="button">View Booking Details</a>
    </div>

    <div class="footer">
        Thank you for choosing <strong>HarFunMola ⚒</strong>!<br>
        Need help? <a href="mailto:kidsgardenus@gmail.com">Contact Support</a>
    </div>
</div>

</body>
</html>
`;

export const Booking_Accepted_Provider_Template = `
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
            background-color: #28a745;
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
            color: #28a745;
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
            background-color: #28a745;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .button:hover {
            background-color: #218838;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        New Booking Accepted! ✅
    </div>
    <div class="content">
        <p>Hello <strong>{name}</strong>,</p>
        <p>You have successfully <span style="color: green;">accepted</span> a booking for <strong>{service}</strong> from <strong>{customer}</strong>.</p>

        <div class="details">
            <p>📅 Date: {date}</p>
            <p>⏰ Time: {time}</p>
            <p>📍 Address: {address}</p>
        </div>

        <p>Make sure to be prepared and provide the best service! 🚀</p>

        <a href="https://yourwebsite.com/provider-dashboard" class="button">Manage Bookings</a>
    </div>

    <div class="footer">
        Thank you for being part of <strong>HarFunMola ⚒</strong>!<br>
        Need help? <a href="mailto:kidsgardenus@gmail.com">Contact Support</a>
    </div>
</div>

</body>
</html>

`

