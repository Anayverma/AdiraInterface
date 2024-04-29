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




const userImage="https://shorturl.at/noqS3";
const adiraImage="https://shorturl.at/bCIX1";
const navItems = [
  // { name: (user!=null)?"Sign Out":"Sign In", link: "/" },
  { name: "Try Adira↗ ", link: "/adira" },
  { name: "About Us", link: "/aboutus" },
  { name: "F&Q", link: "/f&q" },
];
const items = [
  {
    id: 1,
    name: "Dr. Shipha Suman",
    designation: "Project Head  ",
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
          {`Implement AI-powered systems in workplaces to monitor and prevent
            instances of harassment or discrimination, analyzing employee
            interactions, language patterns, and feedback to identify potential
            issues and promote a safe and inclusive environment.`}
        </p>
      </>
    ),
    className: " ",
    thumbnail: "https://shorturl.at/cruDT",
  },
  {
    id: 2,
    content: (
      <>
        <h3 className=" relative  font-bold text-2xl mb-4">
          Educational Outreach Program
        </h3>
        <p className=" relative text-lg">
          {` Develop an AI-based educational program aimed at raising awareness
            about women's safety issues, providing information on rights,
            consent, and healthy relationships through interactive modules,
            quizzes, and chatbot support.`}
        </p>
      </>
    ),
    className: "",
    thumbnail: "https://shorturl.at/FIZ08",
  },
  {
    id: 3,
    content: (
      <>
        <h3 className="relative font-bold text-2xl mb-4">
          Virtual Self-Defense Trainer
        </h3>
        <p className="text-lg">
          {`Create a virtual self-defense training program powered by AI,
            offering personalized tutorials and simulations tailored to
            individual skill levels and physical abilities.`}
        </p>
      </>
    ),
    className: " ",
    thumbnail: "https://shorturl.at/goRW7",
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
          {`Integrate AI technology into home security systems to enhance
            protection against intruders and domestic violence, with features
            such as facial recognition, activity monitoring, and emergency
            response capabilities linked to law enforcement or trusted contacts.`}
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
          {`Develop an AI-driven platform to assist women in navigating the
            legal system, providing guidance on filing restraining orders,
            accessing legal aid services, and understanding their rights in
            cases of harassment, assault, or intimate partner violence.
          `}
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
          {`Create AI tools and algorithms to detect and mitigate online threats
            such as stalking, cyberbullying, and revenge porn, providing women
            with privacy settings, content moderation tools, and legal support
            to safeguard their digital identities and personal information.`}
        </p>
      </>
    ),
    className: " ",
    thumbnail:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_i_28IWikUcD4zK92xt1qy4iShdipacRRBSDMJsFGqA&s", // Replace with the URL of the thumbnail image
  },
];
export {sentences,cards,items,navItems,userImage,adiraImage}