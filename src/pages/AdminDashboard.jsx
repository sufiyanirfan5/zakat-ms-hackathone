import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Heart, CheckCircle, Search, Filter, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
    const [donations, setDonations] = useState([]);
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const API_URL = 'https://zakat-ms-backend-t43v.onrender.com/api';

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            // Fetch all donations
            const donationsRes = await fetch(`${API_URL}/admin/donations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const donationsData = await donationsRes.json();
            if (donationsRes.ok) setDonations(donationsData);

            // Fetch all users/donors
            const usersRes = await fetch(`${API_URL}/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const usersData = await usersRes.json();
            if (usersRes.ok) setDonors(usersData);
        } catch (err) {
            console.error('Error fetching admin data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const verifyDonation = async (donationId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/donations/${donationId}/verify`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                fetchData();
            } else {
                const data = await response.json();
                alert(`Verification failed: ${data.error}`);
            }
        } catch (err) {
            console.error('Verification failed', err);
        }
    };

    const filteredDonations = donations.filter(d => {
        const matchesStatus = filterStatus === 'All' || d.status === filterStatus;
        const matchesSearch = d.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.type?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
    const verifiedAmount = donations.filter(d => d.status === 'Verified').reduce((sum, d) => sum + d.amount, 0);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
                    <LayoutDashboard className="text-primary" />
                    Admin Overview
                </h2>
                <button onClick={fetchData} className="text-sm bg-white px-4 py-2 border rounded-lg hover:bg-gray-50 transition-all font-medium">
                    Refresh Data
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-sm font-medium">Total Collection</p>
                    <div className="flex items-center justify-between mt-2">
                        <h3 className="text-2xl font-bold">Rs. {totalAmount.toLocaleString()}</h3>
                        <span className="p-2 bg-green-50 text-green-600 rounded-lg"><TrendingUp className="w-4 h-4" /></span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-sm font-medium">Verified Amount</p>
                    <div className="flex items-center justify-between mt-2">
                        <h3 className="text-2xl font-bold text-primary">Rs. {verifiedAmount.toLocaleString()}</h3>
                        <span className="p-2 bg-blue-50 text-blue-600 rounded-lg"><CheckCircle className="w-4 h-4" /></span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-sm font-medium">Total Donors</p>
                    <div className="flex items-center justify-between mt-2">
                        <h3 className="text-2xl font-bold">{donors.length}</h3>
                        <span className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Users className="w-4 h-4" /></span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-sm font-medium">Pending Verification</p>
                    <div className="flex items-center justify-between mt-2">
                        <h3 className="text-2xl font-bold text-amber-600">{donations.filter(d => d.status === 'Pending').length}</h3>
                        <span className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Heart className="w-4 h-4" /></span>
                    </div>
                </div>
            </div>

            {/* All Donations Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-xl font-bold text-gray-800">Donation Records</h3>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search donor or type..."
                                className="pl-10 pr-4 py-2 bg-gray-50 border rounded-lg text-sm w-64 outline-none focus:ring-2 focus:ring-primary"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-2 bg-gray-50 border rounded-lg text-sm outline-none cursor-pointer"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Verified">Verified</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4">Donor Name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Method</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading records...</td></tr>
                            ) : filteredDonations.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No matching records found.</td></tr>
                            ) : (
                                filteredDonations.map((d) => (
                                    <tr key={d._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{d.donorId?.name || 'Unknown'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{d.type}</td>
                                        <td className="px-6 py-4 font-bold text-gray-900">Rs. {d.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{d.paymentMethod}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${d.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {d.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {d.status === 'Pending' && (
                                                <button
                                                    onClick={() => verifyDonation(d._id)}
                                                    className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all font-bold"
                                                >
                                                    Verify Now
                                                </button>
                                            )}
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
