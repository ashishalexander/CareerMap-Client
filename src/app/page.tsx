"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Users, Building2, Network, MessageCircle, VideoIcon } from "lucide-react";

// Live Writing Component with selective typing
const LiveWritingText:React.FC<{text: string; 
  speed?: number; 
  delay?: number; 
  fullText?: boolean; }> = ({ text, speed = 50, delay = 0, fullText = false }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      if (fullText) {
        setDisplayedText(text);
        setIsComplete(true);
        return;
      }

      let currentText = '';
      let index = 0;

      const typeWriter = () => {
        if (index < text.length) {
          currentText += text.charAt(index);
          if (isMounted) {
            setDisplayedText(currentText);
            index++;
            setTimeout(typeWriter, speed);
          }
        } else {
          setIsComplete(true);
        }
      };

      typeWriter();
    }, delay);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [text, speed, delay, fullText]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayedText}
      {!isComplete && !fullText && <motion.span 
        animate={{ 
          opacity: [1, 0],
          transition: { 
            duration: 0.7, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }
        }} 
        className="inline-block w-1 h-5 bg-slate-600 ml-1"
      />}
    </motion.span>
  );
};

export default function HomePage() {
  // Simplified Animation Variants
  const fadeInVariants = {
    initial: { 
      opacity: 0,
      y: 20
    },
    animate: { 
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardHoverVariants = {
    rest: { 
      scale: 1,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    },
    hover: { 
      scale: 1.02,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { 
        type: "tween", 
        duration: 0.2
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-hidden"
    >
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Hero Section */}
        <motion.div 
          {...fadeInVariants}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Connect. Grow. Succeed.
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            <LiveWritingText 
              text="Your comprehensive platform for professional networking, job hunting, and career development." 
              speed={50}
              delay={1000}
              fullText={false}
            />
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="candidates" className="w-full max-w-3xl mx-auto">
          <motion.div
            {...fadeInVariants}
            transition={{ delay: 0.3 }}
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="candidates">For Users</TabsTrigger>
              <TabsTrigger value="employers">For Admins</TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="candidates" className="space-y-4">
            <motion.div
              variants={cardHoverVariants}
              whileHover="hover"
              {...fadeInVariants}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-slate-200 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-500" />
                    <LiveWritingText 
                      text="Your Professional Network" 
                      speed={100}
                      delay={150}
                      fullText={true}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                  <p className="text-slate-600">
                    Create your profile, connect with professionals, apply to jobs, and expand your network. Engage through posts, comments, and direct messaging.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button asChild variant="default" className="bg-indigo-600 hover:bg-indigo-700">
                    <Link href="/user/signIn">Sign In</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/user/signup" className="flex items-center gap-1">
                      Create Account <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="employers" className="space-y-4">
            <motion.div
              variants={cardHoverVariants}
              whileHover="hover"
              {...fadeInVariants}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-slate-200 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-emerald-500" />
                    <LiveWritingText 
                      text="Admin Dashboard" 
                      speed={100}
                      delay={150}
                      fullText={true}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                  <p className="text-slate-600">
                    Manage users, track subscriptions, monitor platform activities, and handle content moderation with comprehensive admin tools.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button asChild variant="default" className="bg-emerald-600 hover:bg-emerald-700">
                    <Link href="/admin/signIn">Sign In</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Platform Highlights */}
        <div className="mt-20">
          <motion.h2 
            {...fadeInVariants}
            transition={{ delay: 0.5 }}
            className="text-2xl font-semibold text-center mb-10"
          >
            Platform Highlights
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Network className="h-10 w-10 text-indigo-500" />,
                title: "Professional Networking",
                description: "Connect with professionals, view profiles, send connection requests, and build meaningful professional relationships."
              },
              {
                icon: <MessageCircle className="h-10 w-10 text-emerald-500" />,
                title: "Interactive Communication",
                description: "Like, comment, and engage with posts. Enjoy live notifications for interactions and connection requests."
              },
              {
                icon: <VideoIcon className="h-10 w-10 text-amber-500" />,
                title: "Premium Features",
                description: "Access exclusive features like direct messaging, video calls, and premium networking tools with secure Razorpay payments."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                {...fadeInVariants}
                transition={{ delay: 0.6 + index * 0.2 }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <Card className="border-slate-200 h-full">
                  <CardContent className="pt-6 h-full">
                    <div className="flex flex-col items-center text-center h-full">
                      <div className="mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="font-medium text-lg mb-2">{feature.title}</h3>
                      <p className="text-slate-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div 
          {...fadeInVariants}
          transition={{ delay: 0.9 }}
          className="mt-20"
        >
          <Card className="bg-slate-900 text-white border-none">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-medium mb-4">Your Professional Journey Starts Here</h3>
              <p className="mb-6 text-slate-300">
                Join our platform and unlock a world of professional opportunities and connections.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button asChild variant="default" size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                    <Link href="/user/signIn">
                      Get Started
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.footer 
          {...fadeInVariants}
          transition={{ delay: 1.1 }}
          className="mt-20 text-center text-slate-500 py-6"
        >
          <p>© {new Date().getFullYear()} JobConnect. All rights reserved.</p>
        </motion.footer>
      </div>
    </motion.div>
  );
}