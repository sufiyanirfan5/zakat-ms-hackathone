import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebaseConfig';
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { PlusCircle, History, DollarSign, Download, Clock, CheckCircle, Package, Heart, GraduationCap, Stethoscope, Loader2 } from 'lucide-react';
import logo from '../assets/logo.png';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Dashboard() {
    const { user } = useAuth();
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        amount: '',
        type: 'Zakat',
        category: 'General',
        paymentMethod: 'Online',
        campaignId: 'General',
        campaignName: 'General'
    });

    const fetchDonations = async () => {
        try {
            const q = query(
                collection(db, 'donations'),
                where('userId', '==', user.uid),
                orderBy('date', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDonations(data);
        } catch (err) {
            console.error('Error fetching donations', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'donations'), {
                userId: user.uid,
                userName: user.displayName,
                amount: parseFloat(formData.amount),
                type: formData.type,
                category: formData.category,
                paymentMethod: formData.paymentMethod,
                campaignId: formData.campaignId,
                campaignName: formData.campaignName,
                date: serverTimestamp(),
                status: 'Pending'
            });
            setShowForm(false);
            setFormData({ ...formData, amount: '' });
            fetchDonations();
            alert('Donation submitted successfully! It will appear in your history soon.');
        } catch (err) {
            console.error('Donation failed', err);
        }
    };

    const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);

    const generateReceipt = async (donation) => {
        const doc = new jsPDF();

        // Convert logo to base64 for PDF
        const getBase64Image = (imgUrl) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);
                    resolve(canvas.toDataURL("image/png"));
                };
                img.src = imgUrl;
            });
        };

        const logoBase64 = await getBase64Image(logo);

        // Header
        doc.setFillColor(6, 78, 59); // Zakat Connect Emerald
        doc.rect(0, 0, 210, 45, 'F');

        doc.addImage(logoBase64, 'PNG', 15, 7, 30, 30);

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text('ZAKAT CONNECT', 105, 22, { align: 'center' });
        doc.setFontSize(10);
        doc.text('GIVING REINVENTED - OFFICIAL RECEIPT', 105, 30, { align: 'center' });

        doc.setTextColor(30, 41, 59);
        doc.setFontSize(10);
        doc.text(`Receipt ID: ${donation.id.toUpperCase()}`, 20, 60);
        doc.text(`Date: ${donation.date?.toDate ? donation.date.toDate().toLocaleDateString() : 'Pending'}`, 150, 60);

        doc.setDrawColor(226, 232, 240);
        doc.line(20, 65, 190, 65);

        doc.setFontSize(11);
        doc.text(`Donor: ${donation.userName}`, 20, 75);
        doc.text(`Email: ${user.email}`, 20, 82);

        const tableData = [
            ['Description', 'Details'],
            ['Type', donation.type],
            ['Category', donation.category],
            ['Campaign', donation.campaignName || 'General'],
            ['Payment', donation.paymentMethod],
            ['Status', donation.status],
            ['Amount', `PKR ${donation.amount.toLocaleString()}`]
        ];

        autoTable(doc, {
            startY: 90,
            head: [tableData[0]],
            body: tableData.slice(1),
            theme: 'grid',
            headStyles: { fillColor: [6, 78, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
            styles: { fontSize: 10, cellPadding: 5 },
            columnStyles: { 0: { fontStyle: 'bold', width: 60 } }
        });

        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184);
        doc.text('Thank you for your generous contribution. May it bring blessings to you and those you help.', 105, doc.lastAutoTable.finalY + 25, { align: 'center' });
        doc.text('Zakat Connect - System Generated Official Document', 105, doc.lastAutoTable.finalY + 30, { align: 'center' });

        doc.save(`Zakat-Connect-Receipt-${donation.id.substring(0, 8)}.pdf`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-primary via-emerald-900 to-primary p-10 rounded-[2.5rem] text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
                    <Heart className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5 group-hover:scale-110 transition-transform duration-700" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                                <DollarSign className="w-8 h-8" />
                            </div>
                            <div className="text-right">
                                <p className="text-white/70 font-bold uppercase tracking-widest text-[10px]">Total Impact</p>
                                <h3 className="text-4xl font-black mt-1 tracking-tight">PKR {totalDonated.toLocaleString()}</h3>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            <span className="text-xs font-bold text-white/60 tracking-wide uppercase">Verified across {donations.length} acts of kindness</span>
                        </div>
                    </div>
                </div>

                <div className="card-premium p-10 flex flex-col justify-between group">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-xl font-black text-slate-800 tracking-tight">Contribution</h4>
                        <div className="bg-orange-50 p-3 rounded-2xl transition-transform group-hover:rotate-12">
                            <PlusCircle className="text-secondary w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm mb-8">Quickly secure your donation to help those in need.</p>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 ${showForm ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'btn-secondary'}`}
                    >
                        {showForm ? 'Minimize Form' : 'Start New Donation'}
                    </button>
                </div>

                <div className="card-premium p-10">
                    <h4 className="text-xl font-black text-slate-800 tracking-tight mb-8">Impact Areas</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="space-y-3 group/item">
                            <div className="w-full aspect-square bg-orange-50 rounded-2xl flex items-center justify-center transition-all group-hover/item:bg-orange-100">
                                <Package className="text-orange-600 w-8 h-8 transition-transform group-hover/item:scale-110 shadow-sm" />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Food</span>
                        </div>
                        <div className="space-y-3 group/item">
                            <div className="w-full aspect-square bg-blue-50 rounded-2xl flex items-center justify-center transition-all group-hover/item:bg-blue-100">
                                <GraduationCap className="text-blue-600 w-8 h-8 transition-transform group-hover/item:scale-110 shadow-sm" />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Edu</span>
                        </div>
                        <div className="space-y-3 group/item">
                            <div className="w-full aspect-square bg-red-50 rounded-2xl flex items-center justify-center transition-all group-hover/item:bg-red-100">
                                <Stethoscope className="text-red-600 w-8 h-8 transition-transform group-hover/item:scale-110 shadow-sm" />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Health</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Donation Form */}
            {showForm && (
                <div className="card-premium overflow-hidden animate-in fade-in slide-in-from-top-12 duration-700">
                    <div className="bg-gradient-to-r from-primary to-emerald-800 p-8 text-white relative">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black flex items-center gap-3 tracking-tight">
                                <Heart className="w-6 h-6 fill-accent text-accent" />
                                Secure Donation Form
                            </h3>
                            <p className="text-white/60 text-sm mt-1">Your contribution is encrypted and directly improves lives.</p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Amount (PKR)</label>
                                <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rs.</span>
                                    <input
                                        type="number"
                                        required
                                        className="input-premium pl-12 font-black text-lg text-slate-700"
                                        placeholder="5,000"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Donation Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Zakat', 'Sadqah', 'Fitra', 'General'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type })}
                                            className={`py-3 rounded-2xl font-bold border-2 transition-all ${formData.type === type ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Impact Category</label>
                                <select
                                    className="input-premium font-bold text-slate-600 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%2364748b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1.25rem_center] bg-no-repeat"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option>General Fund</option>
                                    <option>Food Assistance</option>
                                    <option>Education Support</option>
                                    <option>Medical Relief</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Payment Method</label>
                                <div className="flex gap-3">
                                    {['Online', 'Bank', 'Cash'].map(method => (
                                        <button
                                            key={method}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, paymentMethod: method })}
                                            className={`flex-1 py-3 rounded-2xl font-bold border-2 transition-all ${formData.paymentMethod === method ? 'bg-secondary/5 border-secondary text-secondary shadow-sm' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                        >
                                            {method}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 pt-4">
                            <button type="submit" className="w-full btn-primary py-5 rounded-[1.5rem] shadow-2xl hover:shadow-primary/40">
                                Complete Donation Protocol
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* History Table */}
            <div className="card-premium overflow-hidden border-none shadow-2xl shadow-slate-200">
                <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <History className="w-6 h-6 text-slate-300" />
                        Transaction Ledger
                    </h3>
                    <div className="bg-white px-5 py-2 rounded-2xl shadow-sm border border-slate-100">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{donations.length} Acts recorded</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em]">
                            <tr>
                                <th className="px-10 py-5">Timestamp</th>
                                <th className="px-10 py-5">classification</th>
                                <th className="px-10 py-5">Financial Value</th>
                                <th className="px-10 py-5">Lifecycle Status</th>
                                <th className="px-10 py-5 text-right">Verification</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="5" className="px-10 py-20 text-center"><Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" /><p className="mt-4 text-slate-400 font-bold">Synchronizing ledger...</p></td></tr>
                            ) : donations.length === 0 ? (
                                <tr><td colSpan="5" className="px-10 py-20 text-center text-slate-400 font-bold">No historical data available. Start your legacy today.</td></tr>
                            ) : (
                                donations.map((d) => (
                                    <tr key={d.id} className="hover:bg-slate-50/80 transition-all duration-300 group">
                                        <td className="px-10 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-slate-100 p-2 rounded-xl group-hover:bg-white transition-colors">
                                                    <Clock className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <span className="text-sm font-bold text-slate-600 tracking-tight">
                                                    {d.date?.toDate ? d.date.toDate().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Processing...'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="px-4 py-1.5 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                                                {d.type}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 font-black text-slate-800 text-lg tracking-tight">
                                            PKR {d.amount.toLocaleString()}
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${d.status === 'Verified' ? 'bg-accent/10 text-accent' : 'bg-orange-50 text-secondary'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${d.status === 'Verified' ? 'bg-accent' : 'bg-secondary animate-pulse'}`} />
                                                {d.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <button
                                                onClick={() => generateReceipt(d)}
                                                className="p-3 text-slate-300 hover:text-primary hover:bg-white rounded-2xl shadow-none hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
                                                title="Secure Download"
                                            >
                                                <Download className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
