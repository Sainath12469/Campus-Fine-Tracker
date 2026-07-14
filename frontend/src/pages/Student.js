import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const FinePaymentPage = () => {
    const { studentId } = useParams()
    const [updated, setUpdated] = useState(false);
    const [fines, setFines] = useState([])
    const [txnId, SetTxnId] = useState("")
    const [studentData, setStudentData] = useState([]);

    const [selectedFines, setSelectedFines] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate()

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    };

    useEffect(() => {
        const getFines = async () => {
            try {
                await axios.post('http://localhost:4000/student/getFines', { studentId }, getAuthHeaders())
                    .then((res) => {
                        console.log(res)
                        if (typeof (res.data) == 'string') {
                            toast.error(res.data)
                            navigate('/')
                        }
                        setFines(res.data.data)
                        setStudentData(res.data.studentData)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            } catch (err) {
                console.log(err)
            }
        }
        if (! /[0-9]{2}B81A[0-9]{2}[0-9A-Z]{2}/.test(studentId)) {
            navigate("/")
            toast.error("Invalid Roll Number")
        }
        getFines()
    }, [updated, studentId, navigate])

    const toggleFineSelection = (fineId) => {
        setSelectedFines((prevSelected) =>
            prevSelected.includes(fineId)
                ? prevSelected.filter((id) => id !== fineId)
                : [...prevSelected, fineId]
        );
    };

    const selectedTotal = selectedFines.reduce((sum, id) => {
        const fine = fines.find((f) => f.id === id);
        return fine ? sum + fine.amount : sum;
    }, 0);

    const handlePaymentConfirm = (e) => {
        e.preventDefault()
        const SetTxnId = async () => {
            console.log(txnId)
            try {
                await axios.post('http://localhost:4000/student/paidFines', { txnId, selectedFines }, getAuthHeaders())
                    .then((res) => {
                        console.log(res.data)
                        toast.success('Payment Proof submitted Successfully!')
                        setUpdated(!updated)
                    })
                    .catch((err) => {
                        toast.error(err.response.data)
                    })
            } catch (err) {

            }
        }
        if (txnId.trim().length > 0) {
            SetTxnId()
            console.log('Processing payment for selected fines:', selectedFines);
            setShowModal(false);
            setSelectedFines([]);
        } else
            toast.error('Empty UTR number')
    };

    return (
        < div className="w-screen h-screen bg-gray-100" >
            <div className="flex flex-col h-full">
                <div className="bg-gradient-to-r from-blue-900 to-blue-600 text-white text-center p-6 border-b-4 border-amber-400">
                    <h1 className="text-2xl font-semibold">
                        Fines for <span className="font-bold">{studentData?.name}</span>{' '}
                        <span className="font-normal">({studentId})</span>
                    </h1>
                </div>

                <div className="flex-1 overflow-auto flex w-full px-4 py-6">
                    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="p-3 text-center w-10">✓</th>
                                        <th className="p-3">Category</th>
                                        <th className="p-3">Reason</th>
                                        <th className="p-3 text-right">Amount</th>
                                        <th className="p-3">Issued</th>
                                        <th className="p-3">Due Date</th>
                                        <th className="p-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fines?.map((fine) => (
                                        <tr key={fine.id} className="border-t">
                                            <td className="text-center p-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFines.includes(fine.id)}
                                                    onChange={() => toggleFineSelection(fine.id)}
                                                    disabled={fine.status !== 'pending'}
                                                />
                                            </td>
                                            <td className="p-3">{fine.category}</td>
                                            <td className="p-3">{fine.reason}</td>
                                            <td className="p-3 text-right font-mono">₹ {fine.amount.toFixed(2)}</td>
                                            <td className="p-3">{fine.issue_date.toString().split('T')[0]}</td>
                                            <td className="p-3">{fine.due_date.toString().split('T')[0]}</td>
                                            <td className="p-3">{fine.status}</td>
                                        </tr>
                                    )) || <tr><td className="p-3 text-center" colSpan="7">No Fines to display</td></tr>}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-gray-100 p-4 flex justify-between items-center">
                            <span className="text-lg font-semibold">
                                Selected Total: ₹ <span className="font-mono">{selectedTotal.toFixed(2)}</span>
                            </span>
                            <button
                                className={`font-bold py-2 px-4 rounded text-white ${selectedFines.length > 0
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                                disabled={selectedFines.length === 0}
                                onClick={() => setShowModal(true)}
                            >
                                Proceed to Pay
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xl mx-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Payment Details</h2>
                                <button onClick={() => setShowModal(false)} className="text-gray-500 text-2xl">
                                    &times;
                                </button>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Selected Fines:</h3>
                                <ul className="list-disc list-inside text-sm text-gray-600 max-h-24 overflow-y-auto border p-2 rounded-md">
                                    {selectedFines?.map((fineId) => {
                                        const fine = fines.find((f) => f.id === fineId);
                                        return fine ? (
                                            <li key={fine.id}>{fine.category}: ₹ {fine.amount.toFixed(2)}</li>
                                        ) : null;
                                    })}
                                </ul>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-1">Total Amount:</label>
                                <input
                                    type="text"
                                    value={`₹ ${selectedTotal.toFixed(2)}`}
                                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 bg-gray-100"
                                    readOnly
                                />
                            </div>

                            <div className="mb-4 text-center">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Scan QR Code to Pay:</label>
                                <img
                                    className="mx-auto h-40"
                                    src="path_to_your_qr_code_image"
                                    alt="Payment QR Code"
                                />
                                <p className="text-xs text-gray-500 mt-1">Scan using your UPI app</p>
                            </div>

                            {/* <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Upload Payment Screenshot:</label>
                                <input
                                    type="file"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    required
                                />
                            </div> */}

                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-1">Enter UTR:</label>
                                <input
                                    type="text"
                                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700"
                                    value={txnId}
                                    onChange={(e) => { SetTxnId(e.target.value) }}
                                    pattern="[0-9]{12}"
                                    placeholder="Enter the 12-digit UTR number"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Find this ID in your payment app after successful transaction.</p>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    onClick={handlePaymentConfirm}
                                >
                                    Submit Payment Proof
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default FinePaymentPage;