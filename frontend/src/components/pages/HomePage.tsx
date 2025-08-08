"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sparkles, Brain, Zap, ArrowRight, Bot, PenTool } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Homepage() {
    const [isHovered, setIsHovered] = useState(false)
    const navigate = useRouter()
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4 overflow-hidden relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute top-40 right-20 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
            </div>

            {/* Floating AI Icons */}
            <div className="absolute inset-0 pointer-events-none">
                <Brain
                    className="absolute top-1/4 left-1/4 w-6 h-6 text-blue-300 animate-bounce opacity-60"
                    style={{ animationDelay: "0s", animationDuration: "3s" }}
                />
                <Sparkles
                    className="absolute top-1/3 right-1/4 w-5 h-5 text-purple-300 animate-bounce opacity-60"
                    style={{ animationDelay: "1s", animationDuration: "4s" }}
                />
                <Zap
                    className="absolute bottom-1/3 left-1/3 w-4 h-4 text-pink-300 animate-bounce opacity-60"
                    style={{ animationDelay: "2s", animationDuration: "3.5s" }}
                />
                <Bot
                    className="absolute bottom-1/4 right-1/3 w-5 h-5 text-indigo-300 animate-bounce opacity-60"
                    style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}
                />
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                {/* Hero Section */}
                <div className="space-y-8">
                    {/* Logo/Brand */}
                    <div className="flex items-center justify-center space-x-2 mb-8">
                        <div className="relative">
                            <PenTool className="w-8 h-8 text-blue-600" />
                            <Sparkles className="w-4 h-4 text-purple-500 absolute -top-1 -right-1 animate-pulse" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            BlogAI
                        </h1>
                    </div>

                    {/* Main Headline */}
                    <div className="space-y-4">
                        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                            Write Smarter,
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                                Not Harder
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Harness the power of AI to create compelling blog content that resonates with your audience. From ideation
                            to publication, we have got you covered.
                        </p>
                    </div>

                    {/* Feature Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
                        <div className="group p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 hover:bg-white/70 transition-all duration-300 hover:scale-105">
                            <Brain className="w-8 h-8 text-blue-500 mx-auto mb-3 group-hover:animate-pulse" />
                            <h3 className="font-semibold text-gray-800 mb-2">AI-Powered Writing</h3>
                            <p className="text-sm text-gray-600">Generate high-quality content with advanced AI assistance</p>
                        </div>
                        <div className="group p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 hover:bg-white/70 transition-all duration-300 hover:scale-105">
                            <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-3 group-hover:animate-pulse" />
                            <h3 className="font-semibold text-gray-800 mb-2">Smart Optimization</h3>
                            <p className="text-sm text-gray-600">Automatically optimize for SEO and engagement</p>
                        </div>
                        <div className="group p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 hover:bg-white/70 transition-all duration-300 hover:scale-105">
                            <Zap className="w-8 h-8 text-pink-500 mx-auto mb-3 group-hover:animate-pulse" />
                            <h3 className="font-semibold text-gray-800 mb-2">Lightning Fast</h3>
                            <p className="text-sm text-gray-600">Publish content 10x faster than traditional methods</p>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onClick={() => {
                                navigate.push("/sign-in")
                            }}
                        >
                            Get Started Free
                            <ArrowRight
                                className={`ml-2 w-5 h-5 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}
                            />
                        </Button>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-2 border-gray-300 hover:border-gray-400 px-8 py-3 rounded-full text-lg font-semibold bg-white/70 backdrop-blur-sm hover:bg-white transition-all duration-300"
                                >
                                    Learn More
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold text-center mb-4">About BlogAI</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 text-gray-700">
                                    <p>
                                        BlogAI is revolutionizing content creation by combining cutting-edge artificial intelligence with
                                        intuitive design. Our platform empowers writers, marketers, and businesses to create exceptional
                                        blog content that drives engagement and results.
                                    </p>
                                    <p>
                                        Founded by a team of AI researchers and content strategists, we understand the challenges of
                                        consistent, high-quality content creation. Our mission is to democratize great writing by making
                                        AI-powered tools accessible to everyone.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 mt-6">
                                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-600">50K+</div>
                                            <div className="text-sm text-gray-600">Articles Generated</div>
                                        </div>
                                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                                            <div className="text-2xl font-bold text-purple-600">10K+</div>
                                            <div className="text-sm text-gray-600">Happy Writers</div>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <p className="text-sm text-gray-500 mb-4">Trusted by content creators worldwide</p>
                        <div className="flex justify-center items-center space-x-8 opacity-60">
                            <div className="w-20 h-8 bg-gray-300 rounded flex items-center justify-center text-xs font-semibold">
                                BRAND
                            </div>
                            <div className="w-20 h-8 bg-gray-300 rounded flex items-center justify-center text-xs font-semibold">
                                BRAND
                            </div>
                            <div className="w-20 h-8 bg-gray-300 rounded flex items-center justify-center text-xs font-semibold">
                                BRAND
                            </div>
                            <div className="w-20 h-8 bg-gray-300 rounded flex items-center justify-center text-xs font-semibold">
                                BRAND
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    )
}
