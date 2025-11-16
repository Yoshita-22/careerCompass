import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, Target, TrendingUp, Award, Zap, BarChart3, Map, FileCheck, User, Gauge, ChevronDown, Menu, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser, UserButton } from "@clerk/clerk-react";
export default function CareerCompassLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [counters, setCounters] = useState({ users: 0, resumes: 0, rate: 0, companies: 0 });
  const [isVisible, setIsVisible] = useState({});
  const observerRefs = useRef({});
 const { isSignedIn, user } = useUser();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.dataset.section]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(observerRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible.metrics) {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;

      const targets = { users: 50000, resumes: 125000, rate: 94, companies: 2500 };
      
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        
        setCounters({
          users: Math.floor(targets.users * progress),
          resumes: Math.floor(targets.resumes * progress),
          rate: Math.floor(targets.rate * progress),
          companies: Math.floor(targets.companies * progress)
        });

        if (step >= steps) clearInterval(timer);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isVisible.metrics]);

  const formatNumber = (num) => num.toLocaleString();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 font-sans">
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Navigation */}
       <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CareerCompass</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition">Features</a>
            <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition">Testimonials</a>
            <a href="#faq" className="text-gray-600 hover:text-blue-600 transition">FAQ</a>

            {/* Conditional Rendering */}
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <>
                <Link to="/login">
                  <button className="px-5 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition">
                    Sign In
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition">
                    Get Started
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-blue-100">
          <div className="px-4 py-4 space-y-3">
            <a href="#features" className="block py-2 text-gray-600">Features</a>
            <a href="#testimonials" className="block py-2 text-gray-600">Testimonials</a>
            <a href="#faq" className="block py-2 text-gray-600">FAQ</a>

            {/* Conditional Rendering for Mobile */}
            {isSignedIn ? (
              <div className="flex justify-center">
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <>
                <Link to="/login">
                  <button className="w-full px-5 py-2 text-blue-600 border border-blue-200 rounded-lg">
                    Sign In
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="w-full px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg">
                    Get Started
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                🎯 Your Career Journey Starts Here
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
                Build Your Dream Career with
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent"> AI-Powered</span> Tools
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Create professional resumes, discover perfect job matches, and accelerate your career growth with intelligent insights tailored just for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-xl transition transform hover:-translate-y-1">
                  Start Building Free
                </button>
                <button className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-medium hover:border-blue-300 hover:shadow-lg transition">
                  Watch Demo
                </button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white" />
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <div className="font-semibold text-gray-900">50,000+ active users</div>
                  <div>Join professionals worldwide</div>
                </div>
              </div>
            </div>

            <div className="relative lg:block">
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-4">
                  <div className="h-4 bg-gradient-to-r from-blue-500 to-blue-300 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                  <div className="h-3 bg-gray-200 rounded w-4/6" />
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg" />
                    <div className="h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg" />
                  </div>
                </div>
                
                <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-4 border border-blue-100 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">ATS Score</div>
                      <div className="text-lg font-bold text-gray-900">98%</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-4 border border-blue-100 animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">AI Optimized</div>
                      <div className="text-sm font-semibold text-gray-900">Real-time</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Metrics Counter */}
      <section 
        ref={(el) => (observerRefs.current.metrics = el)}
        data-section="metrics"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-500 to-blue-600"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: User, label: 'Active Users', value: counters.users, suffix: '+' },
              { icon: FileCheck, label: 'Resumes Created', value: counters.resumes, suffix: '+' },
              { icon: TrendingUp, label: 'Success Rate', value: counters.rate, suffix: '%' },
              { icon: Briefcase, label: 'Partner Companies', value: counters.companies, suffix: '+' }
            ].map((metric, idx) => (
              <div key={idx} className="text-center text-white">
                <metric.icon className="w-8 h-8 mx-auto mb-3 opacity-80" />
                <div className="text-4xl sm:text-5xl font-bold mb-2">
                  {formatNumber(metric.value)}{metric.suffix}
                </div>
                <div className="text-blue-100 text-sm sm:text-base">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 Cards Feature Section */}
      <section 
        id="features"
        ref={(el) => (observerRefs.current.features = el)}
        data-section="features"
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful tools and insights designed to accelerate your career growth and land your dream job faster.
            </p>
          </div>

          <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 ${isVisible.features ? 'animate-fade-in' : 'opacity-0'}`}>
            {[
              {
                icon: Zap,
                title: 'AI Resume Builder',
                description: 'Create stunning, ATS-optimized resumes in minutes with intelligent suggestions and real-time feedback.',
                gradient: 'from-blue-500 to-blue-600'
              },
              {
                icon: Target,
                title: 'Job Recommendations',
                description: 'Get personalized job matches based on your skills, experience, and career goals using advanced AI.',
                gradient: 'from-purple-500 to-purple-600'
              },
              {
                icon: Map,
                title: 'Skill Roadmaps',
                description: 'Follow curated learning paths to master in-demand skills and advance your career strategically.',
                gradient: 'from-green-500 to-green-600'
              },
              {
                icon: FileCheck,
                title: 'ATS Score Analysis',
                description: 'Optimize your resume with instant ATS compatibility scoring and detailed improvement recommendations.',
                gradient: 'from-orange-500 to-orange-600'
              },
              {
                icon: BarChart3,
                title: 'Profile Insights',
                description: 'Track your career progress with analytics on profile views, application success rates, and engagement.',
                gradient: 'from-pink-500 to-pink-600'
              },
              {
                icon: Gauge,
                title: 'Career Dashboard',
                description: 'Monitor applications, interviews, and offers all in one place with an intuitive, powerful dashboard.',
                gradient: 'from-indigo-500 to-indigo-600'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vertical Timeline */}
      <section 
        ref={(el) => (observerRefs.current.timeline = el)}
        data-section="timeline"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Your Path to Success
            </h2>
            <p className="text-xl text-gray-600">
              Four simple steps to transform your career journey
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300" />
            
            {[
              { step: '01', title: 'Create Your Profile', desc: 'Sign up and build your professional profile in under 5 minutes with our guided setup.' },
              { step: '02', title: 'Build Your Resume', desc: 'Use AI-powered tools to craft a compelling, ATS-optimized resume that stands out.' },
              { step: '03', title: 'Discover Opportunities', desc: 'Get personalized job recommendations and apply with one click to thousands of positions.' },
              { step: '04', title: 'Land Your Dream Job', desc: 'Track applications, prepare for interviews, and celebrate your success with our community.' }
            ].map((item, idx) => (
              <div 
                key={idx}
                className={`relative pl-24 pb-16 ${isVisible.timeline ? 'animate-slide-in-left' : 'opacity-0'}`}
                style={{ animationDelay: `${idx * 0.2}s` }}
              >
                <div className="absolute left-4 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{item.step}</span>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section 
        id="testimonials"
        ref={(el) => (observerRefs.current.testimonials = el)}
        data-section="testimonials"
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Loved & Trusted by Millions
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of professionals who transformed their careers
            </p>
          </div>

          <div className="overflow-x-auto pb-8 hide-scrollbar">
            <div className="flex gap-6 min-w-min px-4">
              {[
                { name: 'Sarah Johnson', role: 'Software Engineer at Google', quote: 'CareerCompass helped me land my dream job in just 3 weeks. The AI resume builder is incredibly powerful!' },
                { name: 'Michael Chen', role: 'Product Manager at Amazon', quote: 'The job recommendations were spot-on. I received 5 interview calls within the first week of using the platform.' },
                { name: 'Emily Rodriguez', role: 'Data Scientist at Meta', quote: 'The ATS score analysis feature saved me so much time. My resume went from 60% to 98% compatibility!' },
                { name: 'David Kim', role: 'Marketing Director at Spotify', quote: 'Best career platform I have ever used. The skill roadmaps helped me transition into a leadership role.' },
                { name: 'Jessica Lee', role: 'UX Designer at Apple', quote: 'The career dashboard keeps me organized and motivated. I can track everything in one beautiful interface.' }
              ].map((testimonial, idx) => (
                <div 
                  key={idx}
                  className="flex-shrink-0 w-80 bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full" />
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{testimonial.quote}</p>
                  <div className="flex gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-5 h-5 text-yellow-400">⭐</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section 
        id="faq"
        ref={(el) => (observerRefs.current.faq = el)}
        data-section="faq"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about CareerCompass
            </p>
          </div>

          <div className="space-y-4">
            {[
              { q: 'Is CareerCompass really free to use?', a: 'Yes! Our core features including resume building, job search, and basic analytics are completely free. We also offer premium plans with advanced AI features and priority support.' },
              { q: 'How does the AI resume builder work?', a: 'Our AI analyzes your experience, skills, and target roles to generate optimized resume content. It provides real-time suggestions, ATS scoring, and formatting recommendations to maximize your chances.' },
              { q: 'What is an ATS score and why does it matter?', a: 'ATS (Applicant Tracking System) score measures how well your resume passes through automated screening software used by employers. A higher score means better visibility to recruiters.' },
              { q: 'Can I apply to jobs directly through the platform?', a: 'Absolutely! We partner with thousands of companies and job boards. You can apply with one click using your CareerCompass profile and track all applications in your dashboard.' },
              { q: 'How accurate are the job recommendations?', a: 'Our AI matching algorithm considers your skills, experience, preferences, and career goals to provide highly relevant matches. Users report a 90%+ satisfaction rate with our recommendations.' },
              { q: 'Do you offer career coaching or interview prep?', a: 'Yes! Premium members get access to one-on-one career coaching, mock interviews, and personalized feedback from industry experts.' },
              { q: 'Is my data secure and private?', a: 'Security is our top priority. We use bank-level encryption and never share your personal information without explicit consent. You have full control over your data visibility.' }
            ].map((faq, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 transition"
              >
                <button
                  onClick={() => setActiveAccordion(activeAccordion === idx ? null : idx)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                      activeAccordion === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    activeAccordion === idx ? 'max-h-48' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-12 sm:p-16 shadow-2xl">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join 50,000+ professionals who are already building their dream careers with CareerCompass.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl transition transform hover:-translate-y-1">
                Start Free Today
              </button>
              <button className="px-8 py-4 bg-blue-700 text-white border-2 border-blue-400 rounded-xl font-semibold hover:bg-blue-800 transition">
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">CareerCompass</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering professionals to build exceptional careers with AI-powered tools and insights.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-blue-400 transition">Resume Builder</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Job Search</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Career Tools</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-blue-400 transition">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Career Guides</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Templates</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Success Stories</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-blue-400 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 CareerCompass. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">Facebook</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}