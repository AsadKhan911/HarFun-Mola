import { User } from "../models/User/user.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { sendVerificationCode } from "../middlewares/EmailFunctions/EmailVerification.js";
import { WelcomeEmail } from "../middlewares/EmailFunctions/WelcomeEmail.js";
import { getDataUri } from '../utils/dataURI.js'
import cloudinary from "../utils/cloudinary.js";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config(); 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); 

export const register = async (req, res) => {
    try {
        const { fullName, email, city, phoneNumber, password, role, isEmailVerified, area, bio, firebaseUID } = req.body;

        console.log("firebase uid ", firebaseUID);

        // Validate input fields
        if (!fullName || !email || !phoneNumber || !password || !city || !role || !area || !firebaseUID) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        // Check for duplicate email
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                message: "A user with this email already exists",
                success: false,
            });
        }

        let profilePic = null;
        let file = req.file;

        if (file) {
            try {
                const fileUri = getDataUri(file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                    folder: 'HFM/userprofilepic',
                });
                profilePic = cloudResponse.secure_url;
            } catch (error) {
                console.error('Error uploading profile picture to Cloudinary:', error);
                profilePic = null;
            }
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Create the new user
        const newUser = await User.create({
            fullName,
            email: email.toLowerCase(),
            phoneNumber,
            city,
            password: hashedPassword,
            role,
            isEmailVerified,
            verificationCode,
            area,
            firebaseUID,
            profile: {
                profilePic,
                bio
            },
        });

        // Send verification code
        sendVerificationCode(newUser?.email, verificationCode, newUser?.fullName);

        // Stripe account creation (Only for Service Providers)
        let stripeAccountId = null;
        if (role === "Service Provider") {
            try {
                const account = await stripe.accounts.create({
                    type: 'express',
                    country: 'US',
                    email: email,
                    capabilities: {
                        card_payments: { requested: true },
                        transfers: { requested: true },
                    },
                });

                console.log("Stripe Connected Account ID:", account.id);
                stripeAccountId = account.id;

                // Update user with Stripe account ID
                newUser.stripeAccountId = stripeAccountId;
                await newUser.save();

                // Onboarding link for Stripe
                const accountLink = await stripe.accountLinks.create({
                    account: stripeAccountId,
                    refresh_url: "https://yourwebsite.com/reauth",
                    return_url: "https://yourwebsite.com/dashboard",
                    type: "account_onboarding",
                });

                newUser.onboardingLink = accountLink.url;
                await newUser.save();

                console.log("Stripe Onboarding Link:", accountLink.url);

                return res.status(201).json({
                    message: "Account created successfully",
                    success: true,
                    newUser,
                    userId: newUser._id,
                    stripeAccountId,
                    onboardingLink: accountLink.url
                });
            } catch (error) {
                console.error("Stripe Account Creation Failed:", error);
            }
        }

        return res.status(201).json({
            message: "Account created successfully",
            success: true,
            newUser,
            userId: newUser._id
        });

    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({
            message: "An error occurred while creating the account",
            success: false,
        });
    }
};

//upload documents
export const uploadDocuments = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required",
                success: false,
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        let addressDocumentUrl = null;
        let cnicDocumentUrl = null;
        let policeDocumentUrl = null;

        if (req.files.addressDocument) {
            const addressDocumentUri = getDataUri(req.files.addressDocument[0]);
            const cloudResponse = await cloudinary.uploader.upload(addressDocumentUri.content, {
                folder: 'HFM/userAddressDocuments',
            });
            addressDocumentUrl = cloudResponse.secure_url;
        }

        if (req.files.cnicDocument) {
            const cnicDocumentUri = getDataUri(req.files.cnicDocument[0]);
            const cloudResponse = await cloudinary.uploader.upload(cnicDocumentUri.content, {
                folder: 'HFM/userCnicDocuments',
            });
            cnicDocumentUrl = cloudResponse.secure_url;
        }

        if (req.files.policeDocument) {
            const policeDocumentUri = getDataUri(req.files.policeDocument[0]);
            const cloudResponse = await cloudinary.uploader.upload(policeDocumentUri.content, {
                folder: 'HFM/userPoliceCertificates',
            });
            policeDocumentUrl = cloudResponse.secure_url;
        }

        user.addressProofDocument = addressDocumentUrl;
        user.CNIC = cnicDocumentUrl;
        user.policeDocument = policeDocumentUrl;

        await user.save();

        return res.status(200).json({
            message: "Documents uploaded successfully",
            success: true,
        });
    } catch (error) {
        console.error("Error uploading documents:", error);
        return res.status(500).json({
            message: "An error occurred while uploading documents",
            success: false,
        });
    }
};

//Business logic for sending OTP for resend OTP
export const resendOTP = async (req, res) => {
    const { email, verificationCode, fullName } = req.body;
    console.log("Resend OTP request:", email, fullName); // Log the incoming request
    try {
        //Update in database first
        await User.updateOne({ email }, { verificationCode });
        await sendVerificationCode(email, verificationCode, fullName);

        return res.status(200).json({ success: true, message: 'Verification email resend successfully' });
    } catch (error) {
        console.error("Error sending verification email:", error);
        return res.status(500).json({ success: false, message: 'Failed to send verification email' });
    }
}

//Business logic for verifying OTP code for email
export const VerifyEmail = async (req, res) => {
    try {
        const { code } = req.body;
        console.log(code)
        const user = await User.findOne({ verificationCode: code })

        if (!user) {
            console.log("User not found!")
            return res.status(400).json({ success: false, message: "Invalid or expired code" })
        }
        console.log("User found")
        //else
        user.isEmailVerified = true
        user.verificationCode = undefined
        await user.save()
        await WelcomeEmail(user?.email, user?.fullName)
        return res.status(200).json({ success: true, message: "Email verified Successfully" })

    } catch (error) {
        return res.status(500).json({ success: false, message: "internal server error" })
    }
}

export const login = async (req, res) => {
    try {
        //Checking for empty fields
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }
        //If email is not valid while login in.
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            })
        }
        //Comparing passwords
        const isPasswordMatch = await bcrypt.compare(password, user.password) //user.password is the schema value which is stored in the database
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            })
        }
        //Checking role is correct or not , means koi student glti se recruiter ko select kr k agar login krta h and vice versa
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesnot exists with current role",
                success: false
            })
        }
        //Gernerating jwt Token
        const tokenData = {
            userID: user._id
        }
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' })

        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            area: user.area,
            city: user.city,
            isEmailVerified: user.isEmailVerified,
            isDocVerified: user.isDocVerified,
            profile: user.profile
        }
        if (token) {
            res.status(200).json({
                message: `Welcome back ${user.fullName}`,
                user,
                token, // Explicitly include token in the response payload
                success: true
            });
        }
    }
    catch (error) {
        res.send(error)
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, role, city, area, bio } = req.body;
        const file = req.file; // Handle file upload
        const userID = req.id; // Comes from middleware authentication

        let user = await User.findById(userID);

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false,
            });
        }

        // Update user fields if provided
        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (role) user.role = role;
        if (city) user.city = city;
        if (area) user.area = area;
        if (bio) user.profile.bio = bio;

        // If a file is provided, upload it to Cloudinary
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            user.profile.profilePic = cloudResponse.secure_url; // Save the Cloudinary URL
        }

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            updatedUser: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                city: user.city,
                area: user.area,
                bio: user.profile.bio,
                isEmailVerified: user.isEmailVerified,
                isDocVerified: user.isDocVerified,
                profile: user.profile,
            },
            success: true,
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const getUser = async (req, res) => {
    try {
        const userId = req.params.userId; // Get user ID from request parameters

        // Fetch user data by ID, excluding password, and populate 'userId' inside 'reviews'
        const user = await User.findById(userId)
            .select("-password")
            .populate({
                path: "reviews.userId", // Populate 'userId' inside 'reviews'
                select: "fullName profile.profilePic", // Select only necessary fields
            });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({
            message: "An error occurred while fetching the user profile",
            success: false,
        });
    }
};