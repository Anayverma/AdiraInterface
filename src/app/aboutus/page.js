import React from "react";
import { FloatingNav } from "../components/ui/fl";
import ContactUs from "../components/ui/contactus";

export default function Home() {
  const navItems = [
    { name: "Home", link: "/" },
    { name: "Try Adira", link: "/adira" },
    { name: "F&Q", link: "/f&q" },
  ];

  const items = [
    {
      id: 1,
      name: "Dr. Shipha Suman",
      designation: "Project Head",
      message: "Leading the team to innovate and create impactful solutions.",
      image: "https://shorturl.at/noUWX", // Replace with the path to your image
    },
    {
      id: 2,
      name: "Himanshi Raghav",
      designation: "Machine Learning Engineer",
      message: "Applying cutting-edge AI techniques to solve complex problems.",
      image: "https://shorturl.at/dJMX3", // Replace with the path to your image
    },
    {
      id: 3,
      name: "Debadrita Dey",
      designation: "Machine Learning Engineer",
      message: "Passionate about leveraging AI for social good and impact.",
      image: "https://shorturl.at/cgvJ2", // Replace with the path to your image
    },
    {
      id: 4,
      name: "Aadyaa Sundriyal",
      designation: "Front End Developer",
      message: "Crafting user-friendly interfaces with creativity and precision.",
      image: "https://shorturl.at/bjFN6", // Replace with the path to your image
    },
    {
      id: 5,
      name: "Pratap Bahadur Singh",
      designation: "Backend Developer",
      message: "Building robust and scalable backend systems for seamless performance.",
      image:
        "https://shorturl.at/gNT69", // Replace with the path to your image
    },
    {
      id: 6,
      name: "Anay Verma",
      designation: "Backend Developer",
      message: "Passionate about backend development and creating scalable solutions.",
      image:
        "https://media.licdn.com/dms/image/D4D35AQGtB8cSGBYyPQ/profile-framedphoto-shrink_400_400/0/1705809413959?e=1711976400&v=beta&t=EtIchbl0sIcy7RJYAHwiDn7QXa1tjAc8T5EPoibp_iw", // Replace with the path to your image
    },
    // Add more items as needed
  ];

  return (
    <>
      <FloatingNav navItems={navItems} />
        {/* <BackgroundBeams/> */}


      {/* About Us section */}
      <div className="text-center ">
        <h1
          className="text-[10rem] font-bold mb-4 relative"
          style={{
            background: "linear-gradient(to right, #8c8c8c, #000000)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          About Us
          <span className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-transparent to-gray-400"></span>
        </h1>
        <div className="mx-auto max-w-4xl">
        {/* <BackgroundBeams/> */}

          {items.map((item, index) => (
            <div
              key={item.id}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center justify-between mb-8`}
            >
              <div className="w-full lg:w-1/2 mb-4 lg:mb-0 lg:pr-4">
                <h2 className="text-3xl font-bold text-blue-400">{item.name}</h2>
                <p className="text-xl font-semibold">{item.designation}</p>
                <p className="text-lg">{item.message}</p>
              </div>
              <div className="w-full lg:w-1/2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="mx-auto lg:ml-auto lg:mr-0 h-48 w-48 rounded-full mb-4 lg:mb-0"
                />
              </div>
              <hr className="w-1/2 border-t border-gray-400 mx-auto" />
            </div>
          ))}
        </div>
      </div>
      <div class="border-t border-white my-8 "></div>

      <ContactUs/>
    </>
  );
}
