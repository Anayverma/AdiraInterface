"use client";
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
