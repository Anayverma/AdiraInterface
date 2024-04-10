import React from "react";
import { AnimatedTooltip } from "./animated-tooltip";

export default function ContactUs() {
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

  return (
    <div className="relative flex flex-col items-center justify-center h-screen  text-white">
      <div className="text-center">
        <h2
          className="text-[100px] font-bold"
          style={{
            background: "linear-gradient(to bottom, #8c8c8c, #000000)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Contact{" "}
          <span
            style={{
              background: "linear-gradient(to right, blue,red,yellow )",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Us
          </span>
        </h2>
      </div>
      <div className="flex justify-center mb-12">
        <AnimatedTooltip items={items} />
      </div>

      <div className="text-center text-gray-300 mb-8 max-w-2xl">
        <p className="text-lg leading-relaxed">
         {` We're thrilled to introduce Adira, our advanced AI chatbot dedicated
          to women's safety. With Adira, we've crafted a trustworthy companion
          that's always ready to lend a helping hand. Whether you need expert
          advice, emergency support, or simply a friendly ear, Adira is here for
          you.`}
        </p>
        <p className="text-lg leading-relaxed mt-4">
          {`Stay empowered and secure with Adira!`}
        </p>
        <p className="text-lg leading-relaxed mt-4">
          {`Warm regards,`}
          <br />
          {`Team ADIRA ❤️`}
        </p>
      </div>

      <div className="text-center text-gray-300">
        <p className="text-lg">
          {`Contact us at:`}{" "}
          <a
            href="mailto:adira@gmail.com"
            className="text-blue-500 hover:underline"
          >
            {`adira@gmail.com`}
          </a>
        </p>
      </div>
      <footer className="text-center text-gray-500 text-sm mt-4">
        {`© 2024 Adira. All rights reserved.`}
      </footer>
    </div>
  );
}
