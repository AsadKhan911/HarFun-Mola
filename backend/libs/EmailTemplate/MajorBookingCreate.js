export const BookingPendingTemplate = `
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
            background-color: #FFA500;
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
            color: #FFA500;
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
            background-color: #FFA500;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .button:hover {
            background-color: #e69500;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        🏷️ Your Booking is Registered!
    </div>
    <div class="content">
        <p>Hello <strong>{name}</strong>,</p>
        <p>Thank you for booking <strong>{service}</strong> with us! Your request has been successfully registered and is currently <strong style="color: orange;">pending confirmation</strong> from the service provider.</p>

        <div class="details">
            <p>📅 Date: {date}</p>
            <p>⏰ Time: {time}</p>
            <p>📍 Address: {address}</p>
            <p>👤 Service Provider: {provider}</p>
        </div>

        <p>The service provider is reviewing your request. Once they accept your booking, you will receive an <strong>email notification</strong> and an <strong>in-app notification</strong> confirming the status.</p>

        <p>If you have any questions, feel free to reach out to us.</p>

        <a href="https://yourwebsite.com/bookings" class="button">View Booking</a>
    </div>

    <div class="footer">
        Thank you for choosing <strong>HarFunMola ⚒</strong>!<br>
        Need help? <a href="mailto:kidsgardenus@gmail.com">Contact Support</a>
    </div>
</div>

</body>
</html>
`;

export const  BookingReceivedTemplate = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
  <h2 style="color: #2C3E50; text-align: center;">📢 New Service Order Received</h2>
  <p>Dear <strong>{provider}</strong>,</p>
  <p>You have received a new service order for <strong>{service}</strong>. Please log in to the HarFunMola app to review and accept the order.</p>

  <h3>📌 Order Details:</h3>
  <ul>
    <li><strong>Service:</strong> {service}</li>
    <li><strong>Price:</strong> {price} Pkr</li>
    <li><strong>Customer Name:</strong> {user}</li>
    <li><strong>Date:</strong> {date}</li>
    <li><strong>Time Slot:</strong> {time}</li>
    <li><strong>Location:</strong> {address}</li>
  </ul>

  <p><strong>Action Required:</strong> Please log in to the HarFunMola app to accept or reject this booking. Prompt response ensures customer satisfaction.</p>

  <p style="text-align: center;">
    <a href="https://yourapp.com/bookings" style="background: #28A745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Review Booking</a>
  </p>

  <p>Best regards, <br/> <strong>HarFunMola Team</strong></p>
</div>
`;