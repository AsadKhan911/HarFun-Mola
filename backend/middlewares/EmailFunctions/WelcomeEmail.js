import {  Welcome_Email_Template } from "../../libs/EmailTemplate/WelcomeEmail.js"
import { transporter } from "../emailConfig.js"

export const WelcomeEmail = async (email , name) => {
    try {
        const response = await transporter.sendMail({
            from: '"HarFunMola ⚒" <kidsgardenus@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Email verified succcessfully ✔", // Subject line
            text: "Email verified succcessfully ✔", // plain text body
            html: Welcome_Email_Template.replace("{name}" , name), // html body
          })
        console.log("Email send succcessfully" , response)
    } catch (error) {
        console.log("Email error")
    }
}