import axios from 'axios';
import { useEffect, useState } from 'react';
import {
    FaCheckCircle,
    FaCheck,
    FaTimes,
    FaChevronDown,
    FaCheckDouble,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const PaymentApprovals = () => {

    const [approvals, setApprovals] = useState([])
    const [approved, setApproved] = useState(false)

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    };

    useEffect(() => {
        const get = async () => {
            try {
                await axios.get('http://localhost:4000/admin/toapprove', getAuthHeaders())
                    .then((res) => {
                        const data = res.data && typeof res.data === 'object' ? Object.values(res.data) : [];
                        setApprovals(data);
                    })
                    .catch((err) => {
                        toast.error(err.response.data)
                    })
            } catch (error) {
                toast.error(error.response.data)
            }
        }
        get()
    }, [approved])

    const toggleDetails = (id) => {
        const el = document.getElementById(id);
        if (el.classList.contains('hidden')) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    };

    const handleApprove = (id, txnId) => {
        try {
            axios.post('http://localhost:4000/admin/approve', { id, txnId }, getAuthHeaders())
                .then((res) => {
                    toast.success(res)
                    setApproved(!approved)
                })
                .catch((res) => {
                    toast.error(res)
                })
        } catch (err) {
            toast.error(err)
        }
    }

    const handleReject = (id) => {
        console.log(id)
    }

    return (
        <div className="w-full">
            <header className="bg-white py-4 px-6 shadow-md sticky top-0">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    <FaCheckCircle className="mr-2 w-6 inline-block text-center" /> Payment Approvals
                </h2>
            </header>
            <div className="flex-1 overflow-auto bg-gray-50 py-4 px-6">
                <div className="bg-white shadow rounded-lg p-6">
                    {(Object.keys(approvals).length > 0) ? (
                        <div className="space-y-6">
                            {approvals?.map((approval) => (
                                <div
                                    key={approval.txnId}
                                    className="border border-gray-200 rounded-md overflow-hidden"
                                >
                                    <div className="bg-gray-50 p-4 border-b border-gray-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <div>
                                                    <span className="font-semibold text-gray-700 block text-sm">
                                                        Student:
                                                    </span>
                                                    <span className="text-gray-900">
                                                        {approval.studentName} ({approval.studentId})
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-gray-700 block text-sm">
                                                        Transaction ID:
                                                    </span>
                                                    <span className="text-gray-900 font-mono">
                                                        {approval.txnId}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-gray-700 block text-sm">
                                                        Total Amount:
                                                    </span>
                                                    <span className="text-gray-900 font-semibold">
                                                        ₹ {approval.totalAmount?.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col justify-between">
                                                <div className="mb-4">
                                                    {/* <span className="font-semibold text-gray-700 block text-sm mb-2">
                                                        Payment Screenshot:
                                                    </span>
                                                    {approval.screenshot_id ? (
                                                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-4 rounded focus:outline-none text-sm">
                                                            <FaImage className="mr-1 inline" /> View Screenshot
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-500 text-sm">No screenshot provided</span>
                                                    )} */}
                                                </div>

                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleApprove(approval.studentId, approval.txnId)}
                                                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-1.5 px-4 rounded text-sm">
                                                        <FaCheck className="mr-1 inline" /> Approve
                                                    </button>
                                                    <button
                                                        onClick={handleReject}
                                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1.5 px-4 rounded text-sm">
                                                        <FaTimes className="mr-1 inline" /> Reject
                                                    </button>
                                                    <button
                                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1.5 px-4 rounded text-sm"
                                                        onClick={() =>
                                                            toggleDetails(`details-${approval.txnId}`)
                                                        }
                                                    >
                                                        <FaChevronDown className="inline" /> Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        id={`details-${approval.txnId}`}
                                        className="hidden p-4 bg-white"
                                    >
                                        <h4 className="text-md font-semibold mb-2 text-gray-700">
                                            Fines in this Transaction:
                                        </h4>
                                        <table className="w-full text-left border-collapse text-sm">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="border-b border-gray-200 p-2 font-semibold text-gray-600">
                                                        Fine Category
                                                    </th>
                                                    <th className="border-b border-gray-200 p-2 font-semibold text-gray-600">
                                                        Reason
                                                    </th>
                                                    <th className="border-b border-gray-200 p-2 font-semibold text-gray-600 text-right">
                                                        Amount
                                                    </th>
                                                    <th className="border-b border-gray-200 p-2 font-semibold text-gray-600">
                                                        Due Date
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {approval.fines?.map((fine, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50">
                                                        <td className="border-b border-gray-200 p-2 text-gray-800">
                                                            {fine.category}
                                                        </td>
                                                        <td className="border-b border-gray-200 p-2 text-gray-800">
                                                            {fine.reason}
                                                        </td>
                                                        <td className="border-b border-gray-200 p-2 text-gray-800 text-right">
                                                            ₹ {fine.amount?.toFixed(2)}
                                                        </td>
                                                        <td className="border-b border-gray-200 p-2 text-gray-800">
                                                            {fine.due_date.toString().split('T')[0]}
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr className="bg-gray-50 font-semibold">
                                                    <td className="border-b border-gray-200 p-2 text-right text-gray-700" colSpan="2">
                                                        Total
                                                    </td>
                                                    <td className="border-b border-gray-200 p-2 text-gray-700 text-right">
                                                        ₹ {approval.totalAmount.toFixed(2)}
                                                    </td>
                                                    <td className="border-b border-gray-200 p-2"></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <FaCheckDouble className="text-green-400 text-3xl mb-4 mx-auto" />
                            <p className="text-gray-500">No payments currently awaiting approval.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentApprovals;