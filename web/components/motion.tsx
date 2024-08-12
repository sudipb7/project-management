"use client";

import React from "react";
import {
  motion,
  AnimatePresence as FramerMotionPresence,
  AnimatePresenceProps as FramerMotionPresenceProps,
} from "framer-motion";

export const MotionDiv = motion.div;
export const MotionSection = motion.section;
export const MotionP = motion.p;
export const MotionButton = motion.button;
export const MotionSpan = motion.span;

export interface AnimatePresenceProps extends FramerMotionPresenceProps {
  children: React.ReactNode;
}

export const AnimatePresence = ({ children, ...props }: AnimatePresenceProps) => {
  return <FramerMotionPresence {...props}>{children}</FramerMotionPresence>;
};
