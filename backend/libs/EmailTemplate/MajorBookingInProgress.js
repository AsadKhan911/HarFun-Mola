// User Email Template
export const userEmailTemplate = `
<h2>🚀 Your Service Provider is On the Way! </h2>
<p>Hello {name},</p>
<p>Your service provider <strong>{provider}</strong> is on the way for your booking of <strong>{service}</strong>.</p>
<p>You can track their live location from the <strong>"On-Going" bookings</strong> section.</p>
<p>📅 Date: {date} <br> ⏰ Time: {time} <br> 📍 Address: {address} <br> 🏷 Order Number: {orderNumber}</p>
<p>Thank you for choosing our service! 🎉</p>
`;


// Provider Email Template
export const providerEmailTemplate = `
<h2>✅ Your Booking Has Started!</h2>
<p>Hello {name},</p>
<p>Your booking for <strong>{service}</strong> with <strong>{customer}</strong> has officially started.</p>
<p>You can see the time log in your <strong>"Order Activity"</strong> section.</p>
<p>You can also check the live location of the service user.</p>
<p>📅 Date: {date} <br> ⏰ Time: {time} <br> 📍 Address: {address} <br> 🏷 Order Number: {orderNumber}</p>
<p>Best of luck with your service! 🚀</p>
`;