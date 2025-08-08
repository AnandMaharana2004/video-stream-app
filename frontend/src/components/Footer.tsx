// "use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PenTool, Sparkles, Send, Twitter, Linkedin, Github, Facebook, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-gray-300 py-12 px-4 sm:px-6 lg:px-8 mt-auto"> {/* Added mt-auto to push to bottom */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Column 1: Logo and Description */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <PenTool className="w-6 h-6 text-blue-400" />
                            <Sparkles className="w-3 h-3 text-purple-300 absolute -top-1 -right-1" />
                        </div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            BlogAI
                        </h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Revolutionizing content creation with AI-powered tools for writers, marketers, and businesses.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="https://www.linkedin.com/in/anand-maharana" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                            <Linkedin className="w-5 h-5" />
                        </a>
                        <a href="https://www.github.com/Anandmaharana2004" className="text-gray-400 hover:text-gray-100 transition-colors duration-200">
                            <Github className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors duration-200">
                            <Instagram className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                {/* Column 2: Quick Links - Company */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-white transition-colors duration-200">About Us</a></li>
                        <li><a href="#" className="hover:text-white transition-colors duration-200">Careers</a></li>
                        <li><a href="#" className="hover:text-white transition-colors duration-200">Press</a></li>
                        <li><a href="#" className="hover:text-white transition-colors duration-200">Partnerships</a></li>
                    </ul>
                </div>

                {/* Column 3: Quick Links - Resources */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-white transition-colors duration-200">Blog</a></li>
                        <li><a href="#" className="hover:text-white transition-colors duration-200">Help Center</a></li>
                        <li><a href="#" className="hover:text-white transition-colors duration-200">Tutorials</a></li>
                        <li><a href="#" className="hover:text-white transition-colors duration-200">API Documentation</a></li>
                    </ul>
                </div>

                {/* Column 4: Newsletter */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Stay Updated</h4>
                    <p className="text-sm text-gray-400 mb-4">
                        Subscribe to our newsletter for the latest articles and updates.
                    </p>
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Input type="email" placeholder="Your email" className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500" />
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Bottom Footer Section: Copyright */}
            <div className="border-t border-gray-700 mt-10 pt-8 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} BlogAI. All rights reserved.
            </div>
        </footer>
    );
}