import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
    try {
        const { authorization } = req.headers; // 'authorization' is the header name where the token is stored from the frontend

        if (!authorization) {
            return res.status(401).json({
                message: "Authorization token is missing or user not authenticated",
                success: false,
            });
        }

        const refineToken = authorization.replace("Bearer ", ""); // removing "Bearer " from token header , replacing bearer with empty space

        // JWT token verification
        const decode = jwt.verify(refineToken, process.env.SECRET_KEY);

        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }

        // Attach the user ID to the request object
        req.id = decode.userID; 
        
        /* If the token is valid, it extracts the userID from the decoded token payload and assigns it to req.id.
        this is the id which we sent from backend user controller at login  const tokenData = { userID: user._id }
        like this */

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error(error); // Log the error for debugging purposes

        // Send error response if verification fails or an error occurs
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export default isAuthenticated;
