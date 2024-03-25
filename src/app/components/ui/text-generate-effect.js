"use client";
// import { useEffect } from "react";
// import { motion, stagger, useAnimate } from "framer-motion";
// import { cn } from "../../utils/cn.js"; // Assuming the correct path to cn utility function
// // import { cn } from "@/utils/cn";

// export const TextGenerateEffect = ({
//   words,
//   className,
// }) => {
//   const [scope, animate] = useAnimate();
//   let wordsArray = words.split(" ");
//   useEffect(() => {
//     animate(
//       "span",
//       {
//         opacity: 1,
//       },
//       {
//         duration: 2,
//         delay: stagger(0.2),
//       }
//     );
//   }, [scope.current]);

//   const renderWords = () => {
//     return (
//       <motion.div ref={scope}>
//         {wordsArray.map((word, idx) => {
//           return (
//             <motion.span
//               key={word + idx}
//               className="dark:text-white text-black opacity-0"
//             >
//               {word}{" "}
//             </motion.span>
//           );
//         })}
//       </motion.div>
//     );
//   };

//   return (
//     <div className={cn("font-bold", className)}>
//       <div className="mt-4">
//         <div className=" dark:text-white text-black text-2xl leading-snug tracking-wide">
//           {renderWords()}
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export const TextGenerateEffect = ({ words, className }) => {
  const wordsArray = words.split(" ");
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const spans = containerRef.current.querySelectorAll("span");
    spans.forEach((span, index) => {
      setTimeout(() => {
        span.style.opacity = 1;
      }, index * 200); // Delay each span by 200 milliseconds
    });
  }, [words]);

  const renderWords = () => {
    return wordsArray.map((word, idx) => (
      <motion.span
        key={word + idx}
        className="dark:text-white text-black opacity-0"
      >
        {word}{" "}
      </motion.span>
    ));
  };

  return (
    <div className={`font-bold ${className}`}>
      <div className="mt-4">
        <div
          className="dark:text-white text-black text-2xl leading-snug tracking-wide"
          ref={containerRef}
        >
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
    