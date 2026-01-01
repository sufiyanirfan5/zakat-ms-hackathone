import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Zap, Globe } from 'lucide-react';

export default function Home() {
    return (
        <div className="space-y-20 pb-20">
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-secondary">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary/80" />
                    <img
                        src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                        alt="Hero Background"
                        className="w-full h-full object-cover mix-blend-overlay opacity-40"
                    />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-6">
                        <Heart className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium">Zakat Connect - Transparency in Giving</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                        Transformed Giving for <br />
                        <span className="text-accent italic">Better Impact</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto font-light">
                        An automated Zakat and Donation platform. Fast, secure, and fully transparent.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/signup" className="bg-primary text-white text-lg px-10 py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-xl shadow-primary/20">
                            Start Donating
                        </Link>
                        <Link to="/campaigns" className="bg-white/10 backdrop-blur-md text-white border border-white/30 text-lg px-10 py-4 rounded-xl font-bold hover:bg-white/20 transition-all">
                            Active Campaigns
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: ShieldCheck, title: "Secure Payments", desc: "Your donations are protected with industry-standard security protocols.", color: "text-blue-500" },
                    { icon: Globe, title: "Global Reach", desc: "Helping thousands across Pakistan through medical, food, and education.", color: "text-green-500" },
                    { icon: Zap, title: "Instant Receipts", desc: "Download professional PDF receipts as soon as your donation is verified.", color: "text-accent" },
                ].map((feat, i) => (
                    <div key={i} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
                        <div className={`w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <feat.icon className={`w-8 h-8 ${feat.color}`} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{feat.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{feat.desc}</p>
                    </div>
                ))}
            </section>

            {/* Categories */}
            <section className="bg-gray-50 py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-secondary mb-4">Donation Categories</h2>
                        <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Zakat', 'Sadqah', 'Fitra', 'General'].map((cat, i) => (
                            <div key={i} className="aspect-square bg-white rounded-3xl flex flex-col items-center justify-center p-6 shadow-sm hover:shadow-md border border-gray-100 transition-all cursor-pointer group hover:-translate-y-1">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                                    {cat[0]}
                                </div>
                                <span className="mt-4 font-bold text-gray-700">{cat}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
