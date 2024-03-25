"use client";
import React from "react";
import { FloatingNav } from "../components/ui/ffq";
import { BackgroundBeams } from "../components/ui/background-beams";
import ContactUs from "../components/ui/contactus";

export default function Home() {
  const navItems = [
    { name: "Home", link: "/" },
    { name: "Try Adira", link: "/adira" },
    { name: "About Us", link: "/aboutus" },
  ];

  // Define FAQ data
  const faqData = [
    {
      question: "What is Adira?",
      answer:
        "Adira is an AI-powered women's safety application designed to provide assistance and support in various situations.",
    },
    {
      question: "How does Adira ensure women's safety?",
      answer:
        "Adira uses advanced AI algorithms to analyze user data and provide real-time alerts, emergency assistance, and resources for women's safety.",
    },
    {
      question:
        "Is Adira available for download on both Android and iOS devices?",
      answer:
        "Yes, Adira is available for download on both Android and iOS devices. You can find it on the Google Play Store for Android devices and the App Store for iOS devices.",
    },
    {
      question: "Can Adira be used without an internet connection?",
      answer:
        "While some features of Adira may require an internet connection to function fully, basic functionality such as sending emergency alerts and accessing stored safety information can work offline.",
    },
    {
      question: "How can I contact Adira support?",
      answer:
        "You can contact Adira support by emailing support@adiraapp.com or by calling our toll-free support line at 1-800-ADIRA-SAFE.",
    },
    {
      question: "Does Adira offer real-time location tracking?",
      answer:
        "Yes, Adira offers real-time location tracking as part of its safety features. This allows designated contacts to monitor your location in real-time during an emergency.",
    },
    {
      question: "Is Adira available in multiple languages?",
      answer:
        "Yes, Adira supports multiple languages to cater to diverse users. You can change the app's language preferences in the settings menu.",
    },
    {
      question: "Can I add custom emergency contacts to Adira?",
      answer:
        "Yes, you can add custom emergency contacts to Adira. Simply go to the settings menu and select the 'Emergency Contacts' option to add or edit contacts.",
    },
    {
      question: "What happens when I trigger an emergency alert on Adira?",
      answer:
        "When you trigger an emergency alert on Adira, it immediately notifies your designated emergency contacts with your location information. It also provides them with instructions on how to assist you.",
    },
    {
      question: "Does Adira offer safety tips and resources?",
      answer:
        "Yes, Adira provides a wide range of safety tips and resources to help users stay informed and prepared for various situations. You can access these resources in the app's safety center.",
    },
    {
      question: "Is my personal data secure on Adira?",
      answer:
        "Yes, Adira takes user privacy and data security seriously. We use industry-standard encryption and security measures to protect your personal data.",
    },
    {
      question:
        "Can I use Adira to report incidents of harassment or violence?",
      answer:
        "Yes, Adira allows users to report incidents of harassment or violence directly through the app. These reports are handled with utmost confidentiality and are forwarded to appropriate authorities if necessary.",
    },
    {
      question: "Does Adira offer safety recommendations based on my location?",
      answer:
        "Yes, Adira uses geolocation data to provide personalized safety recommendations based on your current location. These recommendations may include information about nearby safe zones, emergency services, and more.",
    },
    {
      question: "Can I customize the types of alerts I receive on Adira?",
      answer:
        "Yes, you can customize the types of alerts you receive on Adira. Simply go to the settings menu and select the 'Alert Preferences' option to customize your alert settings.",
    },
    {
      question:
        "Does Adira offer a premium subscription with additional features?",
      answer:
        "Yes, Adira offers a premium subscription option with additional features such as unlimited emergency alerts, access to premium safety resources, and priority support.",
    },
    {
      question: "Is Adira free to use?",
      answer:
        "Yes, Adira offers a free version with basic safety features available to all users. However, some advanced features may require a premium subscription.",
    },
    {
      question:
        "Can I use Adira to request emergency services such as medical assistance or police intervention?",
      answer:
        "Yes, Adira allows users to request emergency services such as medical assistance or police intervention directly through the app. Your designated emergency contacts will also be notified of the request.",
    },
    {
      question: "Does Adira offer safety training or workshops?",
      answer:
        "Yes, Adira partners with local organizations and experts to offer safety training workshops and educational sessions. You can check the app's events calendar for upcoming sessions in your area.",
    },
    {
      question: "Is Adira suitable for people of all ages?",
      answer:
        "Yes, Adira is designed to be user-friendly and accessible to people of all ages. However, we recommend parental supervision for younger users.",
    },
    {
      question:
        "How often is Adira updated with new features and improvements?",
      answer:
        "Adira is regularly updated with new features, improvements, and bug fixes to enhance user experience and address emerging safety needs. We strive to provide the best possible service to our users.",
    },
    // Add more FAQ items as needed
  ];

  return (
    <>
      <FloatingNav navItems={navItems} />
      <BackgroundBeams />

      <div className="text-center ">
        <h1
          className="text-[10rem] font-bold mb-4 relative"
          style={{
            background: "linear-gradient(to right, #8c8c8c, #000000)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Common F&Qs
          <span className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-transparent to-gray-400"></span>
        </h1>

        <div className="max-w-4xl mx-auto">
          {faqData.map((item, index) => (
            <div key={index} className="mb-4">
              <div className="font-semibold">{item.question}</div>
              <div className="px-4 py-2 bg-gray-100 rounded-b-lg text-black">
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white my-8 "></div>
      <ContactUs />
    </>
  );
}
