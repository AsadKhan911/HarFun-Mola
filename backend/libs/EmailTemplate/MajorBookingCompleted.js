export const BookingCompletedUserTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Completed</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333; }
    .container { background-color: #fff; border-radius: 8px; padding: 30px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { color: #4CAF50; }
    .content { font-size: 16px; margin-bottom: 20px; }
    .details { margin: 20px 0; background-color: #f7f7f7; padding: 15px; border-radius: 8px; }
    .details p { margin: 5px 0; }
    .footer { font-size: 14px; text-align: center; color: #777; }
    .footer p { margin-top: 20px; }
    .button { text-align: center; padding: 10px 20px; background-color: #4CAF50; color: white; border-radius: 5px; text-decoration: none; display: inline-block; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Booking Completed! 🎉</h1>
    </div>
    <div class="content">
      <p>Hello <strong>{name}</strong>,</p>
      <p>We are happy to inform you that your booking for <strong>{service}</strong> has been completed by <strong>{provider}</strong>.</p>
      <p>Here are the details of your completed booking:</p>
    </div>
    <div class="details">
      <p><strong>Order Number:</strong> {orderNumber}</p>
      <p><strong>Service:</strong> {service}</p>
      <p><strong>Provider:</strong> {provider}</p>
      <p><strong>Booking Date:</strong> {date}</p>
      <p><strong>Time Slot:</strong> {time}</p>
      <p><strong>Address:</strong> {address}</p>
      <p><strong>Duration:</strong> {elapsedTime}</p>
      <p><strong>Completed On:</strong> {completedTime}</p>
    </div>
    <div class="footer">
      <p>Thank you for using our service!</p>
      <a href="#" class="button">View Your Booking</a>
    </div>
  </div>
</body>
</html>`

export const BookingCompletedProviderTemplate = `
<!-- Booking Completed Email - Provider Template -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Completed</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333; }
    .container { background-color: #fff; border-radius: 8px; padding: 30px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { color: #FF9800; }
    .content { font-size: 16px; margin-bottom: 20px; }
    .details { margin: 20px 0; background-color: #f7f7f7; padding: 15px; border-radius: 8px; }
    .details p { margin: 5px 0; }
    .footer { font-size: 14px; text-align: center; color: #777; }
    .footer p { margin-top: 20px; }
    .button { text-align: center; padding: 10px 20px; background-color: #FF9800; color: white; border-radius: 5px; text-decoration: none; display: inline-block; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Booking Completed! 🎉</h1>
    </div>
    <div class="content">
      <p>Hello <strong>{name}</strong>,</p>
      <p>Your booking for <strong>{service}</strong> with <strong>{customer}</strong> has been successfully completed.</p>
      <p>Here are the details of the completed service:</p>
    </div>
    <div class="details">
      <p><strong>Order Number:</strong> {orderNumber}</p>
      <p><strong>Service:</strong> {service}</p>
      <p><strong>Customer:</strong> {customer}</p>
      <p><strong>Booking Date:</strong> {date}</p>
      <p><strong>Time Slot:</strong> {time}</p>
      <p><strong>Address:</strong> {address}</p>
      <p><strong>Duration:</strong> {elapsedTime}</p>
      <p><strong>Completed On:</strong> {completedTime}</p>
    </div>
    <div class="footer">
      <p>Thank you for providing excellent service!</p>
      <a href="#" class="button">View Your Booking</a>
    </div>
  </div>
</body>
</html>`