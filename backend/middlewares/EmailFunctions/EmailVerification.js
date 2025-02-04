import { Verification_Email_Template } from "../../libs/EmailTemplate/EmailVerification.js"
import { transporter } from "../emailConfig.js"

//Verification email function
export const sendVerificationCode = async (email , verificationCode, name) => {
    try {
        const response = await transporter.sendMail({
            from: '"HarFunMola ⚒" <kidsgardenus@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Verify your email", // Subject line
            text: "Verify your email", // plain text body
            html: Verification_Email_Template.replace("{verificationCode}" , verificationCode).replace("{name}" , name), // html body
          })
        console.log("Email send succcessfully" , response)
    } catch (error) {
        console.log("Email error")
    }
}