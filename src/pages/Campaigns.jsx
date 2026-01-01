import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Heart, Target, Calendar, Plus, Loader2, Search, Filter, ArrowRight } from 'lucide-react';

export default function Campaigns() {
    const { user, userRole } = useAuth();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newCampaign, setNewCampaign] = useState({
        title: '',
        description: '',
        goalAmount: '',
        deadline: '',
        raisedAmount: 0,
        category: 'General'
    });

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const q = query(collection(db, 'campaigns'), orderBy('createdAt', 'desc'));
            const snap = await getDocs(q);
            setCampaigns(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (err) {
            console.error('Error fetching campaigns', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'campaigns'), {
                ...newCampaign,
                goalAmount: parseFloat(newCampaign.goalAmount),
                createdAt: serverTimestamp()
            });
            setShowCreate(false);
            setNewCampaign({ title: '', description: '', goalAmount: '', deadline: '', raisedAmount: 0, category: 'General' });
            fetchCampaigns();
        } catch (err) {
            console.error('Create campaign failed', err);
        }
    };

    const filteredCampaigns = campaigns.filter(camp =>
        camp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camp.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen pb-20 bg-slate-50/50">
            {/* Premium Header */}
            <div className="relative overflow-hidden bg-primary py-24 px-4 sm:px-6 lg:px-8 mb-12">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-20 -top-20 w-96 h-96 bg-accent rounded-full blur-3xl" />
                    <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-secondary rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="flex justify-center mb-8 animate-in fade-in zoom-in duration-1000">
                        <div className="bg-white/10 p-4 rounded-[3rem] backdrop-blur-xl border border-white/20">
                            <img src={logo} alt="Zakat Connect" className="w-24 h-24 object-contain" />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
                        Empower <span className="text-accent underline decoration-accent/30 underline-offset-8">Change</span>
                    </h1>
                    <p className="text-xl text-emerald-100/80 max-w-2xl mx-auto font-medium leading-relaxed">
                        Join Zakat Connect in our mission to bridge the gap between generosity and necessity. Every contribution ripples through time.
                    </p>

                    {userRole === 'admin' && (
                        <button
                            onClick={() => setShowCreate(!showCreate)}
                            className="mt-10 btn-secondary !px-10 !py-4 !rounded-2xl"
                        >
                            {showCreate ? <Plus className="rotate-45" /> : <Plus />}
                            {showCreate ? 'Stop Creation' : 'Engineer New Campaign'}
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-16 -mt-24 relative z-20">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Identify mission target..."
                            className="w-full pl-16 pr-6 py-6 card-premium !rounded-3xl border-none text-lg font-bold text-slate-700 focus:ring-4 focus:ring-primary/10 transition-all outline-none shadow-2xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {showCreate && (
                    <div className="card-premium p-10 max-w-2xl mx-auto mb-16 animate-in slide-in-from-top-4 duration-500">
                        <h3 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">Campaign Metadata</h3>
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Campaign Identity</label>
                                    <input
                                        type="text" required
                                        className="input-premium font-bold text-slate-700"
                                        placeholder="Humanitarian Title"
                                        value={newCampaign.title}
                                        onChange={e => setNewCampaign({ ...newCampaign, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Target Goal (PKR)</label>
                                    <input
                                        type="number" required
                                        className="input-premium font-bold text-slate-700"
                                        placeholder="1,000,000"
                                        value={newCampaign.goalAmount}
                                        onChange={e => setNewCampaign({ ...newCampaign, goalAmount: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Resource Allocation Goal (Deadline)</label>
                                <input
                                    type="date" required
                                    className="input-premium font-bold text-slate-700"
                                    value={newCampaign.deadline}
                                    onChange={e => setNewCampaign({ ...newCampaign, deadline: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="w-full btn-primary !py-5 shadow-2xl hover:shadow-primary/30">Deploy Campaign to Registry</button>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <p className="mt-4 text-slate-400 font-black uppercase tracking-widest text-xs">Synchronizing active missions...</p>
                    </div>
                ) : filteredCampaigns.length === 0 ? (
                    <div className="text-center py-24 card-premium border-dashed border-2 border-slate-200 bg-transparent">
                        <p className="text-slate-400 font-bold text-xl">No active campaigns matched your query.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredCampaigns.map((camp) => {
                            const progress = Math.min((camp.raisedAmount / camp.goalAmount) * 100, 100);
                            return (
                                <div key={camp.id} className="card-premium group overflow-hidden flex flex-col hover:border-primary/20">
                                    <div className="h-48 bg-slate-50 relative overflow-hidden">
                                        <Heart className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-200 group-hover:text-primary/5 group-hover:scale-110 transition-all duration-700" />
                                        <div className="absolute inset-0 p-8">
                                            <div className="inline-flex px-4 py-1.5 bg-white/80 backdrop-blur-md rounded-xl text-[10px] font-black tracking-widest text-primary shadow-sm mb-4">
                                                {new Date(camp.deadline).getTime() > Date.now() ? 'TACTICAL' : 'CONCLUDED'}
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-800 line-clamp-2 tracking-tight group-hover:text-primary transition-colors">{camp.title}</h3>
                                        </div>
                                    </div>

                                    <div className="p-8 space-y-8 flex-1 flex flex-col">
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                                                <span className="text-slate-400">Progression</span>
                                                <span className="text-primary">{progress.toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 p-[2px]">
                                                <div
                                                    className="h-full bg-gradient-to-r from-primary via-emerald-600 to-accent rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-100 rounded-xl group-hover:bg-primary/5 transition-colors">
                                                    <Target className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Target</p>
                                                    <p className="text-sm font-black text-slate-700 tracking-tight">PKR {camp.goalAmount.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-100 rounded-xl group-hover:bg-primary/5 transition-colors">
                                                    <Calendar className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Limit</p>
                                                    <p className="text-sm font-black text-slate-700 tracking-tight">
                                                        {camp.deadline?.toDate ? camp.deadline.toDate().toLocaleDateString('en-US', { day: '2-digit', month: 'short' }) : camp.deadline}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => window.location.href = '/dashboard'}
                                            className="mt-auto w-full group/btn flex items-center justify-center gap-3 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-500 font-black uppercase tracking-widest text-[11px] hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm hover:shadow-primary/20"
                                        >
                                            Commit Support
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
