import React, { useState } from 'react'
import '../styles/Home.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Home() {

    const [activeTab, setActiveTab] = useState('student')

    const [details, setDetails] = useState({
        uname: '',
        password: ''
    })

    const [std, setStd] = useState("")

    const navigate = useNavigate()
    const handleChange = (e) => {
        const { name, value } = e.target
        if (name === "student_id")
            setStd(value)
        else
            setDetails({ ...details, [name]: value })
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:4000/login', { details })
                .then((res) => {
                    const { token } = res.data
                    localStorage.setItem('token', token)
                    navigate('/admin/dashboard')
                })
                .catch((err) => {
                    console.log(err)
                })
        } catch (err) {
            console.log(err)
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault()
        console.log("Searching for student ID:", e.target.student_id.value);
        const student_id = e.target.student_id.value;
        console.log(student_id)
        navigate(`/student/${student_id}`)
    }

    return (
        <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">

                <div className="bg-gradient-left p-8 md:p-12 text-white flex flex-col justify-center h-[400px]">
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold leading-tight">Campus Fine Track</h1>
                        <p className="text-blue-100 text-lg">Smart College Fines Management System</p>
                        <div className="pt-4">
                            <div className="h-1 w-16 bg-blue-400 rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12">
                    <div className="max-w-md mx-auto form-container">
                        <div className="slider-tabs">
                            <div
                                className="slider-highlight"
                                style={{ left: activeTab === 'student' ? '0px' : '100px' }}
                            />
                            <button
                                className="slider-tab"
                                id="student-tab"
                                role="tab"
                                aria-selected={activeTab === 'student'}
                                tabIndex={activeTab === 'student' ? 0 : -1}
                                onClick={() => setActiveTab('student')}
                            >
                                Student
                            </button>
                            <button
                                className="slider-tab"
                                id="admin-tab"
                                role="tab"
                                aria-selected={activeTab === 'admin'}
                                tabIndex={activeTab === 'admin' ? 0 : -1}
                                onClick={() => setActiveTab('admin')}
                            >
                                Admin
                            </button>
                        </div>

                        {activeTab === 'student' ? (
                            <div className="form-content" id="student_form">
                                <form className="space-y-6" onSubmit={(e) => handleSearch(e)}>
                                    <div>
                                        <label htmlFor="student_id" className="label">Student ID</label>
                                        <input
                                            type="text"
                                            name="student_id"
                                            id="student_id"
                                            value={std}
                                            placeholder="Enter your Roll No"
                                            className="form-input"
                                            onChange={(e) => { handleChange(e) }}
                                        />
                                    </div>
                                    <div>
                                        <button type="submit" className="submit-btn">View Fines</button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="form-content" id="admin_form">
                                <form className="space-y-6" onSubmit={(e) => handleLogin(e)}>
                                    <div>
                                        <label htmlFor="uname" className="label">Username</label>
                                        <input
                                            type="text"
                                            name="uname"
                                            id="uname"
                                            value={details.uname}
                                            placeholder="Enter your username"
                                            className="form-input"
                                            onChange={(e) => { handleChange(e) }}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="label">Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            value={details.password}
                                            placeholder="Enter your password"
                                            className="form-input"
                                            onChange={(e) => { handleChange(e) }}
                                        />
                                    </div>
                                    <div>
                                        <button type="submit" className="submit-btn">Login</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
