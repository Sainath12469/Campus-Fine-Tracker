import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { FaFileInvoiceDollar, FaSearch, FaChevronDown, FaCalendar, FaFilter, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

function ViewFinesUI() {
    const [filters, setFilters] = useState({
        batch: "",
        due_date: ""
    })

    const [batches, setBatches] = useState([])
    const [studentId, setStudentId] = useState("")
    const [fines, setFines] = useState([])
    const [filteredFines, setFilteredFines] = useState([])
    const [students, setStudents] = useState([])
    const navigate = useNavigate()
    const [deleted, setDeleted] = useState(false)

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    };

    useEffect(() => {

        let d = new Date().toISOString()
        let curr_batch = Number(d.substring(2, 4))
        let batches = []
        for (let i = 0; i <= 5; i++) {
            batches.push("20" + (curr_batch - i))
        }
        setBatches(batches)


        async function fetchData() {
            try {
                await axios.get('http://localhost:4000/admin/getFines', getAuthHeaders())
                    .then((res) => {
                        setFines(res.data)
                        setFilteredFines(res.data)
                        console.log(res.data)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            } catch (err) {
                console.log("Error fetching data:", err);
            }
        }
        fetchData()
        const getStudents = async () => {
            try {
                axios.get('http://localhost:4000/admin/getStudentsDetails', getAuthHeaders())
                    .then((res) => {
                        // console.log(res.data);
                        setStudents(res.data);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            } catch (err) {
                console.log(err)
            }
        }
        getStudents()
    }, [deleted])

    const handleSubmit = (e) => {
        e.preventDefault()

        const searchValue = studentId.trim().toLowerCase();
        const batchValue = filters.batch;
        const dueDateValue = filters.due_date;

        let temp = [...fines];

        if (searchValue) {
            temp = temp.filter(f => String(f.studentId).toLowerCase().includes(searchValue));
        }

        if (batchValue) {
            temp = temp.filter(f => String(f.studentId).substring(0, 2) === batchValue.toString());
        }

        if (dueDateValue) {
            temp = temp.filter(f => f.due_date && f.due_date.toString().split('T')[0] === dueDateValue);
        }

        setFilteredFines(temp);
    }

    const handleFilters = (e) => {
        const { name, value } = e.target
        setFilters({ ...filters, [name]: value })
        console.log(name, value)
    }

    const handleDelete = async (fid, stdId) => {
        try {
            await axios.post('http://localhost:4000/admin/deleteFine', { fid, stdId }, getAuthHeaders())
                .then(res => {
                    toast.success('Fine deleted sucessfully')
                    setDeleted(!deleted)
                })
                .catch(err => {
                    toast.error(err)
                    console.log(err)
                })
        } catch (error) {
            toast.error(error)
            console.log(error)
        }
    }

    return (
        <div className="flex-1 overflow-auto bg-gray-50 py-4 px-6">
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        <FaFileInvoiceDollar className="inline-block mr-2" />
                        View Fines
                    </h2>
                    <div className="flex items-center space-x-2">
                        <form className="flex items-center space-x-2" onSubmit={e => handleSubmit(e)}>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="student_id"
                                    value={studentId}
                                    onChange={e => setStudentId(e.target.value)}
                                    placeholder="Search by Student ID"
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                                />
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                            >
                                Search
                            </button>
                            <button
                                type="button"
                                onClick={() => { setStudentId(""); setFilters({ batch: "", due_date: "" }); setFilteredFines(fines); }}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                            >
                                Clear
                            </button>
                        </form>
                    </div>
                </div>

                <form className="space-y-4 mb-6" onSubmit={e => handleSubmit(e)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                        <div className="filter-group relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                            <select name="batch" value={filters.batch} onChange={e => handleFilters(e)} className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                                <option value="">All Batches</option>
                                {
                                    batches.map((batch, i) => (
                                        <option key={i} value={batch.substring(2, 4)}>{batch}</option>
                                    ))
                                }
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center p-2 text-gray-700">
                                <FaChevronDown />
                            </div>
                        </div>
                        <div className="filter-group relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                            <input
                                type="date"
                                name="due_date"
                                value={filters.due_date}
                                onChange={e => handleFilters(e)}
                                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <FaCalendar />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                            >
                                <FaFilter className="mr-2" />
                                Apply
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
                            <button
                                type="button"
                                onClick={() => { setStudentId(""); setFilters({ batch: "", due_date: "" }); setFilteredFines(fines); }}
                                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center"
                            >
                                <FaTimes className="mr-2" />
                                Clear
                            </button>
                        </div>
                    </div>
                </form>

                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-3 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Student ID
                                </th>
                                <th className="px-3 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Student Name
                                </th>
                                <th className="px-3 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Fine Details
                                </th>
                                <th className="px-3 py-3 border-b-2 border-gray-200 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-3 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Issued
                                </th>
                                <th className="px-3 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Due Date
                                </th>
                                <th className="px-3 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Transaction ID
                                </th>
                                <th className="px-3 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-3 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {/* {console.log("Table: ", filteredFines)} */}
                            {
                                filteredFines.map((fine, i) => (
                                    <tr key={i}>
                                        <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">{fine.studentId}</td>
                                        <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">{students.find(std => std.id === fine.studentId)?.name || 'Unknown'}</td>
                                        <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-800">{fine.category}</span>
                                                <span className="text-gray-600 text-sm mt-1">{fine.reason}</span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm text-right">₹{fine.amount}</td>
                                        <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">{fine.issue_date?.toString().split("T")[0]}</td>
                                        <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">{fine.due_date?.toString().split("T")[0]}</td>
                                        <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">{fine.txnId || ""}</td>
                                        <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm text-green-600 font-semibold">
                                            {fine.status}
                                        </td>
                                        <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm text-center">
                                            {fine.status === 'pending_approval' ?
                                                (<button
                                                    type="button"
                                                    onClick={() => { navigate('/admin/paymentApprovals') }}
                                                    className="text-red-600 hover:text-red-800 text-xs font-bold py-1 px-2 rounded">
                                                    Review
                                                </button>) : fine.status === 'pending' ?
                                                    (<button
                                                        type="button"
                                                        onClick={() => { handleDelete(fine.id, fine.studentId) }}
                                                        className="text-red-600 hover:text-red-800 text-xs font-bold py-1 px-2 rounded">
                                                        Delete
                                                    </button>) : (<p className="text-xs">No Actions</p>)
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ViewFinesUI;