import React, { useEffect } from 'react';
import {
    FaPlus
} from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function NewFineEntry() {
    const [studentsData, setStudentsData] = React.useState([]);
    const [fineCategories, setFineCategories] = React.useState([]);
    const navigate = useNavigate();
    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Add 7 days
        .toISOString()
        .split('T')[0];

    const [details, setDetails] = React.useState({
        student_id: '',
        student_email: '',
        fine_category: '',
        amount: 0,
        due_date: dueDate,
        reason: ''
    })

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    };

    useEffect(() => {
        const students = () => {
            try {
                axios.get('http://localhost:4000/admin/getStudentsDetails', getAuthHeaders())
                    .then((res) => {
                        console.log(res.data);
                        setStudentsData(res.data);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            } catch (err) {
                console.log(err)
            }
        }
        const fineCategory = () => {
            try {
                axios.get('http://localhost:4000/getFineCategories', getAuthHeaders())
                    .then((res) => {
                        console.log(res.data);
                        setFineCategories(res.data);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            } catch (err) {
                console.log(err)
            }
        }
        students();
        fineCategory();
    }, [])


    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    }

    const search = (e) => {
        const { name, value } = e.target;
        if (name === "student_id") {

            const matchedStudent = studentsData.find((std) => std.id === value);
            const email = matchedStudent?.email || '';

            console.log("Student ID: ", value);
            console.log("Email: ", email);

            setDetails(prevDetails => ({
                ...prevDetails,
                student_id: value,
                student_email: email
            }));
        } else if (name === "fine_category") {
            const amt = fineCategories.find(category => category.type === value)?.amount || 0

            console.log("Fine Category: ", value);
            console.log("Fine Amount: ", amt);

            setDetails(prevDetails => ({
                ...prevDetails,
                amount: amt,
                fine_category: value
            }))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            details: {
                student_id: details.student_id,
                student_email: details.student_email,
                fine_category: details.fine_category,
                amount: Number(details.amount),
                due_date: details.due_date,
                reason: details.reason
            }
        };

        console.log('Submitting payload:', payload);

        try {
            axios.post('http://localhost:4000/admin/createFine', payload, getAuthHeaders())
                .then((res) => {
                    console.log(res.data)
                    toast.success(`Fine imposed on ${details.student_id}`)
                    navigate('/admin/viewFines');
                })
                .catch((err) => {
                    console.log(err)
                    toast.error(err?.response?.data?.message || 'Failed to create fine')
                })
        } catch (err) {
            console.log(err);
            toast.error('Failed to create fine');
        }
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <header className="bg-white py-4 px-6 shadow-md sticky top-0">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    <FaPlus className="mr-2 inline-block" /> New Fine Entry
                </h2>
            </header>
            <div className="overflow-auto bg-gray-50 py-4 px-6">
                <div className="bg-white shadow rounded-lg p-6 mb-8 max-w-4xl mx-auto">
                    <form id="newFineForm" onSubmit={(e) => handleSubmit(e)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="student_id">Student ID</label>
                                <input
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    id="student_id"
                                    name="student_id"
                                    value={details.student_id}
                                    onChange={(e) => { handleChange(e); search(e) }}
                                    type="text"
                                    pattern="[0-9]{2}B81A[0-9]{2}[A-Z0-9]{2}"
                                    title="Enter valid Student ID in caps (e.g., 23B81A67A1)"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="student_email">Student Email</label>
                                <input
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 focus:outline-none sm:text-sm"
                                    id="student_email"
                                    name="student_email"
                                    value={details.student_email}
                                    onChange={(e) => handleChange(e)}
                                    type="email"
                                    readOnly
                                    tabIndex="-1"
                                />
                                <p id="student_email_status" className="mt-1 text-sm text-red-600 hidden">Student not found.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fine_category">Fine Category</label>
                                <select
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    id="fine_category"
                                    name="fine_category"
                                    onChange={(e) => { handleChange(e); search(e); }}
                                    required
                                >
                                    <option value="">Select Category...</option>
                                    {fineCategories.map((category) => (
                                        <option key={category.type} value={category.type}>{category.type}</option>
                                    ))}
                                </select>
                                <p className="mt-1 text-sm text-red-600 hidden" id="fineCategoryError">
                                    Fine category not found or amount mismatch.
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="amount">Fine Amount</label>
                                <input
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    id="amount"
                                    name="amount"
                                    value={details.amount}
                                    onChange={(e) => { handleChange(e); search(e); }}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="due_date">Due Date</label>
                                <input
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    id="due_date"
                                    name="due_date"
                                    value={details.due_date}
                                    onChange={(e) => handleChange(e)}
                                    type="date"
                                    defaultValue={dueDate}
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reason">Reason</label>
                                <textarea
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    id="reason"
                                    name="reason"
                                    value={details.reason}
                                    onChange={(e) => handleChange(e)}
                                    aria-describedby="charCount"
                                    rows="3"
                                    maxLength="200"
                                ></textarea>
                                <p className="text-sm text-gray-500 text-right" id="charCount">
                                    {details.reason.length} / 200 characters
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                type="submit"
                            // onClick={(e) => handleSubmit(e)}
                            >
                                Create Fine
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default NewFineEntry;