'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Video, Sparkles, Zap, Shield, ChevronRight, Play } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Se já estiver logado, redireciona para o studio
  useEffect(() => {
    if (session) {
      router.push('/studio/video');
    }
  }, [session, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Video className="h-8 w-8 text-purple-500" />
            <span className="text-2xl font-bold">Kylo</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="#features" className="hover:text-purple-400 transition">
              Features
            </Link>
            <Link href="#pricing" className="hover:text-purple-400 transition">
              Pricing
            </Link>
            <Link href="#about" className="hover:text-purple-400 transition">
              About
            </Link>
            <Link href="#contact" className="hover:text-purple-400 transition">
              Contact
            </Link>
            <Button asChild>
              <Link href="/login">
                Login
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Create Stunning AI Videos
          <br />
          <span className="text-purple-500">In Seconds</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Transform your ideas into professional videos using advanced AI models.
          No video editing skills required.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild className="bg-purple-600 hover:bg-purple-700">
            <Link href="/register">
              Start Free <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#demo">
              Watch Demo <Play className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Get 300 free credits when you sign up!
        </p>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Kylo?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
            <p className="text-gray-400">
              State-of-the-art AI models including Luma and Kling for amazing results
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-400">
              Generate videos in minutes, not hours. Perfect for rapid content creation
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-400">
              Your data and videos are encrypted and secure. Full privacy protection
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-purple-900/20 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Amazing Videos?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of creators using Kylo to bring their ideas to life
          </p>
          <Button size="lg" asChild className="bg-purple-600 hover:bg-purple-700">
            <Link href="/register">
              Get Started Free
            </Link>
          </Button>
        </div>
      </section>

      {/* Simple About Section */}
      <section id="about" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-8">About Kylo</h2>
        <p className="text-center text-gray-400 max-w-2xl mx-auto">
          Kylo is a cutting-edge AI video generation platform that empowers creators 
          to produce professional-quality videos effortlessly. Our mission is to 
          democratize video creation through advanced AI technology.
        </p>
      </section>

      {/* Simple Contact Section */}
      <section id="contact" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
        <p className="text-center text-gray-400">
          Have questions? We&apos;re here to help!<br />
          Email us at: <a href="mailto:support@kylo.video" className="text-purple-400 hover:text-purple-300">support@kylo.video</a>
        </p>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-800">
        <div className="text-center text-gray-500">
          <p>&copy; 2025 Kylo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}