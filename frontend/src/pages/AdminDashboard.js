import { useState, useEffect } from "react";
import {
    FaHome,
    FaUsers,
    FaRupeeSign,
    FaHourglassHalf,
    FaListOl
} from "react-icons/fa";
import axios from "axios";

function AdminDashboard() {
    const [data, setData] = useState({
        total_collected: 0,
        total_pending: 0,
        total_fines: 0,
        total_batches: 0,
        batches: []
    })

    const [load, setLoad] = useState({
        total_collected: 0,
        total_pending: 0,
        total_fines: 0,
        total_batches: 0,
        batches: []
    })

    useEffect(() => {
        async function func() {
            let d = new Date().toISOString()
            let curr_batch = Number(d.toString().substring(2, 4))
            let batches = [];
            for (let i = 5; i >= 0; i--) {
                batches.push({
                    batch: curr_batch - i,
                    total_fines: 0,
                    total_amount: 0
                });
            }
            const initialState = {
                total_collected: 0,
                total_pending: 0,
                total_fines: 0,
                total_batches: 0,
                batches
            };

            setData(initialState)
            setLoad(initialState)
        }
        func()
    }, [])

    useEffect(() => {
        if (!load.batches || load.batches.length === 0) return;
        const fetchData = async () => {
            try {
                await axios.post("http://localhost:4000/admin/getAnalysis", { load }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                    .then(res => {
                        setData(res.data)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [load])


    return (
        <div className="w-full">
            <header className="bg-white py-4 px-6 shadow-md sticky top-0">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    <FaHome className="mr-2 inline-block" /> Home
                </h2>
            </header>

            <div className="flex-1 overflow-auto bg-gray-50 py-4 px-6 space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
                        <div className="bg-green-100 p-3 rounded-full">
                            <FaRupeeSign className="fa-2x text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Amount Collected</p>
                            <p className="text-2xl font-bold text-gray-800">₹ {data.total_collected}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
                        <div className="bg-orange-100 p-3 rounded-full">
                            <FaHourglassHalf className="fa-2x text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Pending Fines</p>
                            <p className="text-2xl font-bold text-gray-800">{data.total_pending}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <FaListOl className="fa-2x text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Fines Issued</p>
                            <p className="text-2xl font-bold text-gray-800">{data.total_fines}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
                        <div className="bg-indigo-100 p-3 rounded-full">
                            <FaUsers className="fa-2x text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Batches with Fines</p>
                            <p className="text-2xl font-bold text-gray-800">{data.total_batches}</p>
                        </div>
                    </div>
                </div>

                {/* Batch-wise Fines Table */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Batch-wise Analysis</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Fines</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.batches.map((batch, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">20{batch.batch}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{batch.total_fines}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹ {Number(batch.total_amount).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AdminDashboard;