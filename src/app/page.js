"use client";
import React, { useState, useEffect } from "react";
import { FloatingNav } from "./components/ui/floating-navbar";
import { BackgroundBeams } from "./components/ui/background-beams";
import { TextGenerateEffect } from "./components/ui/text-generate-effect";
import { AnimatedTooltip } from "./components/ui/animated-tooltip";
import { LayoutGrid } from "./components/ui/layout-grid";
import ContactUs from "./components/ui/contactus";
import Lottie from "lottie-react";
import ws from "../../public/ws.json";
import connect from "../../public/connect.json";
import vr from "../../public/vr.json";
export default function Home() {
  const navItems = [
    { name: "Sign In", link: "/" },
    { name: "Try Adira", link: "/adira" },
    { name: "About Us", link: "/aboutus" },
    { name: "F&Q", link: "/f&q" },
  ];

  const sentences = [
    "1 in 3 women globally has experienced physical or sexual violence in their lifetime (WHO). ",
    "On average, there are about 433,648 victims of rape and sexual assault each year in the US  ",
    "1 in 6 women in the US has experienced stalking victimization ",
    "Globally, about 30% of women have experienced physical and/or sexual violence by their intimate partner (WHO). ",
    "Women and girls represent 71% of human trafficking victims globally (UNODC). ",
    "Approximately 25 million unsafe abortions occur each year, with serious health risks for women (WHO). ",
    "21% of women aged 18 to 29 report being sexually harassed online (Pew Research Center) ",
    "Globally, 12 million girls are married before the age of 18 each year (UNICEF). ",
    "1 in 3 women worldwide has experienced physical or sexual violence in the workplace (ILO). ",
    "Only 52% of women globally believe they have access to justice (UNDP).",
  ];

  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSentenceIndex((prevIndex) =>
        prevIndex === sentences.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Example items array for the AnimatedTooltip component
  const items = [
    {
      id: 1,
      name: "Dr. Shipha Suman",
      designation: "Project Head",
      image: "https://shorturl.at/noUWX", // Replace with the path to your image
    },
    {
      id: 2,
      name: "Himanshi Raghav",
      designation: "Machine Learning Engineer",
      image: "https://shorturl.at/dJMX3", // Replace with the path to your image
    },
    {
      id: 3,
      name: "Debadrita Dey",
      designation: "Machine Learning Engineer",
      image: "https://shorturl.at/cgvJ2", // Replace with the path to your image
    },
    {
      id: 4,
      name: "Aadyaa Sundriyal",
      designation: "Front End Developer",
      image: "https://shorturl.at/bjFN6", // Replace with the path to your image
    },
    {
      id: 5,
      name: "Pratap Bahadur Singh",
      designation: "Backend Developer",
      image: "https://shorturl.at/gNT69", // Replace with the path to your image
    },
    {
      id: 6,
      name: "Anay Verma",
      designation: "Backend Developer",
      image:
        "https://media.licdn.com/dms/image/D4D35AQGtB8cSGBYyPQ/profile-framedphoto-shrink_400_400/0/1705809413959?e=1711976400&v=beta&t=EtIchbl0sIcy7RJYAHwiDn7QXa1tjAc8T5EPoibp_iw", // Replace with the path to your image
    },
    // Add more items as needed
  ];
  const cards = [
    {
      id: 1,
      content: (
        <>
          <h3 className="relative  font-bold text-2xl mb-4">
            Workplace Safety Solutions
          </h3>
          <p className="text-lg">
            {" "}
            Implement AI-powered systems in workplaces to monitor and prevent
            instances of harassment or discrimination, analyzing employee
            interactions, language patterns, and feedback to identify potential
            issues and promote a safe and inclusive environment.
          </p>
        </>
      ),
      className: " ",
      thumbnail: "https://shorturl.at/cruDT", // Replace with the URL of the thumbnail image
    },
    {
      id: 2,
      content: (
        <>
          <h3 className=" relative  font-bold text-2xl mb-4">
            Educational Outreach Program
          </h3>
          <p className=" relative text-lg">
            Develop an AI-based educational program aimed at raising awareness
            about women's safety issues, providing information on rights,
            consent, and healthy relationships through interactive modules,
            quizzes, and chatbot support.
          </p>
        </>
      ),
      className: "",
      thumbnail: "https://shorturl.at/FIZ08", // Replace with the URL of the thumbnail image
    },
    {
      id: 3,
      content: (
        <>
          <h3 className="relative font-bold text-2xl mb-4">
            Virtual Self-Defense Trainer
          </h3>
          <p className="text-lg">
            Create a virtual self-defense training program powered by AI,
            offering personalized tutorials and simulations tailored to
            individual skill levels and physical abilities.
          </p>
        </>
      ),
      className: " ",
      thumbnail: "https://shorturl.at/goRW7", // Replace with the URL of the thumbnail image
    },
    {
      id: 4,
      content: (
        <>
          <h3 className="relative font-bold text-2xl mb-4">
            Home Security Solutions
          </h3>
          <p className="text-lg">
            {" "}
            Integrate AI technology into home security systems to enhance
            protection against intruders and domestic violence, with features
            such as facial recognition, activity monitoring, and emergency
            response capabilities linked to law enforcement or trusted contacts.
          </p>
        </>
      ),
      className: " ",
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH8FBE2__ebr72VbmeTRZyeTXyozxjhU7cx9cVnV1zCw&s", // Replace with the URL of the thumbnail image
    },
    {
      id: 5,
      content: (
        <>
          <h3 className=" relative  font-bold text-2xl mb-4">
            Legal Aid Navigator
          </h3>
          <p className="text-lg">
            {" "}
            Develop an AI-driven platform to assist women in navigating the
            legal system, providing guidance on filing restraining orders,
            accessing legal aid services, and understanding their rights in
            cases of harassment, assault, or intimate partner violence.
          </p>
        </>
      ),
      className: " ",
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlgdJEo5Y3T98g0Qzt08mr3PKR8G7T_vvHhduEUzk3pA&s", // Replace with the URL of the thumbnail image
    },
    {
      id: 5,
      content: (
        <>
          <h3 className=" relative  font-bold text-2xl mb-4">
            Online Privacy Protection
          </h3>
          <p className="text-lg">
            {" "}
            Create AI tools and algorithms to detect and mitigate online threats
            such as stalking, cyberbullying, and revenge porn, providing women
            with privacy settings, content moderation tools, and legal support
            to safeguard their digital identities and personal information.
          </p>
        </>
      ),
      className: " ",
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_i_28IWikUcD4zK92xt1qy4iShdipacRRBSDMJsFGqA&s", // Replace with the URL of the thumbnail image
    },
  ];

  return (
    <>
      <FloatingNav navItems={navItems} />

      {/* home section */}
      <div className="relative h-screen flex items-center justify-center">
        <BackgroundBeams className="h-screen w-screen" />
        <div className="text-center">
          <p className="text-xl font-bold text-gray-400 mb-6">
            INDIA's First AI for Women{" "}
          </p>
          <p
            className="text-sm text-gray-600 mb-6"
            style={{ wordSpacing: "30px" }}
          >
            I N T R O D U C I N G{" "}
          </p>

          <h1
            className="text-[10rem] font-bold mb-4"
            style={{
              background: "linear-gradient(to bottom, #8c8c8c, #000000)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            ADIRA
          </h1>
          <TextGenerateEffect
            className="text-x text-gray-300 mb-6"
            words={sentences[currentSentenceIndex]}
          />
          <button
            className="bg-slate-500 text-white py-3 px-6 rounded-full hover:bg-gray-300 transition duration-300 ease-in-out"
            style={{
              background: "linear-gradient(to bottom, #8c8c8c, #000000)",
            }}
          >
            Explore
          </button>
        </div>
      </div>
      <div class="border-t border-white my-8 "></div>

      <div className="text-center">
        <h2
          className="text-[100px] font-bold"
          style={{
            background: "linear-gradient(to bottom, #8c8c8c, #000000)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Top{" "}
          <span
            style={{
              background: "linear-gradient(to right, pink, yellow, red, blue)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            FEATURES
          </span>
        </h2>
      </div>

      {/* Feature section */}
      <div>
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* <!-- Feature 1 --> */}
            <div className="bg-gray-800 rounded-lg text-whiteX">
              <h3 className="relative font-bold text-2xl mb-4">
                Women Safety AL Chatbot
              </h3>
              <Lottie animationData={ws} />

              <p className="text-lg">
                With cutting-edge Artificial Intelligence technology, our
                chatbot provides a safe and confidential space for women to seek
                assistance, access resources, and receive support in moments of
                need.
              </p>
            </div>

            {/* <!-- Feature 2 --> */}
            <div className="bg-gray-800 rounded-lg text-whiteX">
              <h3 className="relative font-bold text-2xl mb-4">
                Voice Commands...
              </h3>
              <Lottie animationData={vr} />

              <p className="text-lg">
                Introducing our cutting-edge AI-powered voice recording feature!
                Experience seamless, hands-free recording with unparalleled
                accuracy and clarity.
              </p>
            </div>

            {/* <!-- Feature 3 --> */}
            <div className="bg-gray-800 rounded-lg text-whiteX">
              <h3 className="relative font-bold text-2xl mb-4">
                Connect to Advocates
              </h3>
              <Lottie animationData={connect} />

              <p className="text-lg">
                Whether you're fighting for justice, championing causes, or
                amplifying voices that need to be heard, our technology ensures
                that every word is captured with precision and clarity.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-white my-8 "></div>

      <div className="text-center">
        <h2
          className="text-[100px] font-bold"
          style={{
            background: "linear-gradient(to bottom, #8c8c8c, #000000)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Our{" "}
          <span
            style={{
              background: "linear-gradient(to right, blue,red,yellow,pink )",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            PRIVILEGES
          </span>
        </h2>
      </div>

      {/* Feedback section */}
      <div className="relative flex h-screen">
        {/* Add content for the feedback section */}
        <LayoutGrid cards={cards} />
      </div>
      <div class="border-t border-white my-8 "></div>

      {/* footer section */}
      {/* footer section */}

      <ContactUs />
    </>
  );
}
