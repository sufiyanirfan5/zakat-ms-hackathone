import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, User, LogOut, Menu } from 'lucide-react';

import logo from '../assets/logo.png';

export default function Navbar() {
    const { user, userRole, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <nav className="sticky top-0 z-50 glass border-b border-white/20 shadow-lg shadow-primary/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 duration-300">
                            <div className="bg-primary/5 p-1.5 rounded-2xl">
                                <img src={logo} alt="Zakat Connect" className="w-12 h-12 object-contain rounded-xl" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-extrabold tracking-tight text-primary leading-none">
                                    Zakat<span className="text-secondary">Connect</span>
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    Giving Reinvented
                                </span>
                            </div>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/campaigns" className="text-slate-600 hover:text-primary font-semibold transition-colors relative group py-2">
                            Campaigns
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                        </Link>

                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-slate-600 hover:text-primary font-semibold transition-colors relative group py-2">
                                    Dashboard
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                                </Link>
                                {userRole === 'admin' && (
                                    <Link to="/admin" className="text-slate-600 hover:text-secondary font-semibold transition-colors relative group py-2">
                                        Admin Panel
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full"></span>
                                    </Link>
                                )}
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-2xl border border-slate-200/50 shadow-sm transition-all hover:bg-white hover:shadow-md">
                                        <div className="bg-primary/10 p-1.5 rounded-full">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{user.displayName || 'Donor'}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm transition-all hover:shadow-md hover:scale-110 active:scale-90"
                                        title="Logout Protocol"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-slate-600 hover:text-primary font-semibold transition-colors">
                                    Login
                                </Link>
                                <Link to="/signup" className="btn-primary">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button className="p-2 text-slate-600">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
