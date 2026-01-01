import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';

export default function Signup() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }
        try {
            setError('');
            setLoading(true);
            await signup(formData.email, formData.password, formData.firstName, formData.lastName, formData.phone);
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to create account. ' + (err.message || ''));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-primary p-8 text-center bg-gradient-to-br from-primary to-secondary">
                    <UserPlus className="w-12 h-12 text-white mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-white">Join Zakat Connect</h2>
                    <p className="text-white/80 mt-2">Start your journey of giving today</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 text-sm">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">First Name</label>
                            <div className="relative">
                                <User className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    name="firstName"
                                    required
                                    className="input-premium pl-12 font-bold text-slate-700"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Last Name</label>
                            <div className="relative">
                                <User className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    name="lastName"
                                    required
                                    className="input-premium pl-12 font-bold text-slate-700"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="input-premium pl-12 font-bold text-slate-700"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Phone Protocol</label>
                            <div className="relative">
                                <Phone className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    className="input-premium pl-12 font-bold text-slate-700"
                                    placeholder="+92 3XX XXXXXXX"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Security Key</label>
                            <div className="relative">
                                <Lock className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    className="input-premium pl-12 font-bold text-slate-700"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Verify Key</label>
                            <div className="relative">
                                <Lock className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    className="input-premium pl-12 font-bold text-slate-700"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary !py-4 shadow-2xl hover:shadow-primary/30 flex items-center justify-center gap-3 mt-4"
                    >
                        {loading ? 'Synchronizing Profile...' : 'Authorize Registration'}
                        <UserPlus className="w-5 h-5" />
                    </button>

                    <p className="text-center text-gray-600 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-secondary font-bold hover:underline">Log in here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
