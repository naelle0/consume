import React, { useEffect, useState } from "react";
import axios from "axios";
import Case from "../components/Case";
import { useNavigate } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, Tooltip, XAxis, YAxis } from "recharts";

export default function Dashboard() {
    const [isLogin, setIsLogin] = useState(true);
    const [authUser, setAuthUser] = useState([]);
    const [stuffStock, setStuffStock] = useState([]);
    const [stuffs, setStuffs] = useState([]);
    const [users, setUsers] = useState([]);
    const [lendingGrouped, setLendingGrouped] = useState([]);
    const [checkProses, setCheckProses] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8000/profile", {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
        })
        .then(res => {
            setIsLogin(true);
            setAuthUser(res.data.data);
            if (location.pathname === '/login') {
                navigate('/profile');
            }
        })
        .catch(err => {
            setIsLogin(false);
            if (err.response.status === 401 && location.pathname !== '/login' && location.pathname !== '/') {
                navigate('/login?message=' + encodeURIComponent('Anda belum login!'));
            }
        });

        getDataStuffs();
        getDataUsers();
        getDataLendings();
        getDataStuffStock();
    }, [checkProses]);

    function getDataStuffStock() {
        axios.get('http://localhost:8000/stuff-stock', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
        })
        .then(res => {
            setStuffStock(res.data.data);
        })
        .catch(err => {
            if (err.response.status === 401) {
                navigate('/login?message=' + encodeURIComponent('Anda Belum Login!'));
            }
        });
    }

    function getDataStuffs() {
        axios.get('http://localhost:8000/stuff/data', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
        })
        .then(res => {
            setStuffs(res.data.data);
        })
        .catch(err => {
            if (err.response.status === 401) {
                navigate('/login?message=' + encodeURIComponent('Anda Belum Login!'));
            }
        });
    }

    function getDataUsers() {
        axios.get('http://localhost:8000/users', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })
        .then(res => {
            setUsers(res.data.data);
        })
        .catch(err => {
            if (err.response.status === 401) {
                navigate('/login?message=' + encodeURIComponent('Anda Belum Login!'));
            }
        });
    }

    function getDataLendings() {
        axios.get('http://localhost:8000/Lending', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })
        .then(res => {
            const data = res.data.data;
            const groupedData = {};
            data.forEach((entry) => {
                const date = new Date(entry.date_time);
                const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
                if (!groupedData[formattedDate]) {
                    groupedData[formattedDate] = [];
                }
                groupedData[formattedDate].push(entry);
            });
            const processedData = Object.keys(groupedData).map((date) => ({
                date,
                totalStuff: groupedData[date].reduce((acc, entry) => acc + entry.total_stuff, 0)
            }));
            setLendingGrouped(processedData);
            setCheckProses(true);
        })
        .catch(err => {
            if (err.response.status === 401) {
                navigate('/login?message=' + encodeURIComponent('Anda Belum Login!'));
            }
        });
    }

    const totalAvailable = stuffStock.reduce((sum, item) => sum + item.total_available, 0);
    const totalDefect = stuffStock.reduce((sum, item) => sum + item.total_defect, 0);

    return (
        <Case>
            <div className="flex flex-wrap justify-center m-10">
                {isLogin ? authUser['role'] === 'admin' ? (
                    <>
                        <div className="p-4 w-1/2">
                            <div className="flex rounded-lg h-full dark:bg-gray-800 bg-teal-400 p-8 flex-col">
                                <div className="flex items-center mb-3">
                                    <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full dark:bg-indigo-500 bg-indigo-500 text-white flex-shrink-0">
                                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                            strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                        </svg>
                                    </div>
                                    <h2 className="text-white dark:text-white text-lg font-medium">Data Stuff</h2>
                                </div>
                                <div className="flex flex-col justify-between flex-grow">
                                    <h1 className="text-white dark:text-white text-lg font-medium">{stuffs.length}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 w-1/2">
                            <div className="flex rounded-lg h-full dark:bg-gray-800 bg-teal-400 p-8 flex-col">
                                <div className="flex items-center mb-3">
                                    <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full dark:bg-indigo-500 bg-indigo-500 text-white flex-shrink-0">
                                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                            strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                        </svg>
                                    </div>
                                    <h2 className="text-white dark:text-white text-lg font-medium">Data yang dipinjam</h2>
                                </div>
                                <div className="flex flex-col justify-between flex-grow">
                                    <h1 className="text-white dark:text-white text-lg font-medium">{lendingGrouped.length}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 w-1/2">
                            <div className="flex rounded-lg h-full dark:bg-gray-800 bg-teal-400 p-8 flex-col">
                                <div className="flex items-center mb-3">
                                    <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full dark:bg-indigo-500 bg-indigo-500 text-white flex-shrink-0">
                                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                            strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                        </svg>
                                    </div>
                                    <h2 className="text-white dark:text-white text-lg font-medium">Data User</h2>
                                </div>
                                <div className="flex flex-col justify-between flex-grow">
                                    <h1 className="text-white dark:text-white text-lg font-medium">{users.length}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 w-1/2">
                            <div className="flex rounded-lg h-full dark:bg-gray-800 bg-teal-400 p-8 flex-col">
                                <div className="flex items-center mb-3">
                                    <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full dark:bg-indigo-500 bg-indigo-500 text-white flex-shrink-0">
                                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                            strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                        </svg>
                                    </div>
                                    <h2 className="text-white dark:text-white text-lg font-medium">Available</h2>
                                </div>
                                <div className="flex flex-col justify-between flex-grow">
                                    <h1 className="text-white dark:text-white text-lg font-medium">{totalAvailable}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 w-1/2">
                            <div className="flex rounded-lg h-full dark:bg-gray-800 bg-teal-400 p-8 flex-col">
                                <div className="flex items-center mb-3">
                                    <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full dark:bg-indigo-500 bg-indigo-500 text-white flex-shrink-0">
                                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                            strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                        </svg>
                                    </div>
                                    <h2 className="text-white dark:text-white text-lg font-medium">Defec</h2>
                                </div>
                                <div className="flex flex-col justify-between flex-grow">
                                    <h1 className="text-white dark:text-white text-lg font-medium">{totalDefect}</h1>
                                </div>
                            </div>
                        </div>
                        <BarChart
                            width={500}
                            height={300}
                            data={lendingGrouped}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="totalStuff" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                        </BarChart>
                    </>
                ) : (
                    <>
                        <div className="p-4 w-1/2">
                            <div className="flex rounded-lg h-full dark:bg-gray-800 bg-teal-400 p-8 flex-col">
                                <div className="flex items-center mb-3">
                                    <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full dark:bg-indigo-500 bg-indigo-500 text-white flex-shrink-0">
                                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                            strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                        </svg>
                                    </div>
                                    <h2 className="text-white dark:text-white text-lg font-medium">Data User</h2>
                                </div>
                                <div className="flex flex-col justify-between flex-grow">
                                    <h1 className="text-white dark:text-white text-lg font-medium">{users.length}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 w-1/2">
                            <div className="flex rounded-lg h-full dark:bg-gray-800 bg-teal-400 p-8 flex-col">
                                <div className="flex items-center mb-3">
                                    <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full dark:bg-indigo-500 bg-indigo-500 text-white flex-shrink-0">
                                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                            strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                        </svg>
                                    </div>
                                    <h2 className="text-white dark:text-white text-lg font-medium">Data Stuff</h2>
                                </div>
                                <div className="flex flex-col justify-between flex-grow">
                                    <h1 className="text-white dark:text-white text-lg font-medium">{stuffs.length}</h1>
                                </div>
                            </div>
                        </div>
                    </>
                ) : ''}
            </div>
        </Case>
    );
}
