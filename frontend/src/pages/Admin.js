import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import {
    FaHome,
    FaPlus,
    FaFileInvoiceDollar,
    FaSignOutAlt,
    FaCheckCircle
} from "react-icons/fa";
import AdminDashboard from './AdminDashboard';
import NewFineEntry from './NewFineEntry';
import ViewFines from './ViewFines';
import PaymentApprovals from './Approvals';

function Admin() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/", { replace: true });
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
        window.location.reload();
    };

    return (
        // <div className="bg-gray-50 h-screen">
        <div style={{ display: "flex", minHeight: "100vh", width: "100%" }} className="bg-gray-50">
            <main className="flex w-full">
                <aside className="bg-blue-600 text-white shadow-md w-64 py-4 px-4">
                    <div className="text-2xl font-semibold mb-8">Admin Menu</div>
                    <nav className="space-y-2">
                        <NavLink
                            to="/admin/dashboard"
                            className={({ isActive }) =>
                                `flex items-center rounded px-3 py-2 font-semibold text-white transition-colors duration-200 hover:bg-blue-800 ${isActive ? 'bg-blue-800' : ''}`
                            }
                        >
                            <FaHome className="mr-2 w-6 text-center" /> Home
                        </NavLink>
                        <NavLink
                            to="/admin/newFineEntry"
                            className={({ isActive }) =>
                                `flex items-center rounded px-3 py-2 font-semibold text-white transition-colors duration-200 hover:bg-blue-800 ${isActive ? 'bg-blue-800' : ''}`
                            }
                        >
                            <FaPlus className="mr-2 w-6 text-center" /> New Fine Entry
                        </NavLink>
                        <NavLink
                            to="/admin/viewFines"
                            className={({ isActive }) =>
                                `flex items-center rounded px-3 py-2 font-semibold text-white transition-colors duration-200 hover:bg-blue-800 ${isActive ? 'bg-blue-800' : ''}`
                            }
                        >
                            <FaFileInvoiceDollar className="mr-2 w-6 text-center" /> View Fines
                        </NavLink>
                        <NavLink
                            to="/admin/paymentApprovals"
                            className={({ isActive }) =>
                                `flex items-center rounded px-3 py-2 font-semibold text-white transition-colors duration-200 hover:bg-blue-800 ${isActive ? 'bg-blue-800' : ''}`
                            }
                        >
                            <FaCheckCircle className="mr-2 w-6 text-center" /> Payment Approvals
                        </NavLink>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="mt-4 flex w-full items-center rounded px-3 py-2 text-left font-semibold text-white transition-colors duration-200 hover:bg-blue-800"
                        >
                            <FaSignOutAlt className="mr-2 w-6 text-center" /> Logout
                        </button>
                    </nav>
                </aside>

                {/* <div className="flex-1 flex flex-col overflow-auto"> */}
                <div style={{ flex: 1, background: "#f5f5f5", padding: "0px" }}>
                    <Routes>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="newFineEntry" element={<NewFineEntry />} />
                        <Route path="viewFines" element={<ViewFines />} />
                        <Route path="paymentApprovals" element={<PaymentApprovals />} />
                    </Routes>
                </div>
            </main >
        </div >
    );
}

export default Admin;