import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function AdminLayout({ children, title }) {
    const { auth } = usePage().props;
    const [isDark, setIsDark] = useState(
        localStorage.getItem('darkMode') === 'true' || 
        (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false); // State baru untuk mobile

    React.useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    }, [isDark]);

    // Tambahkan useEffect untuk menangani perubahan ukuran layar
    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                // Di layar desktop, pastikan sidebar terbuka
                setSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Setel kondisi awal saat komponen dimuat

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Head title={title} />
            
            {/* Sidebar Mobile Overlay */}
            <div 
                className={`fixed inset-0 z-40 md:hidden bg-gray-900 bg-opacity-50 transition-opacity duration-300 ease-in-out ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            {/* Sidebar */}
            <div 
                className={`fixed z-50 md:static bg-white dark:bg-gray-800 shadow-lg transition-transform md:transition-all duration-300 ease-in-out h-screen ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${sidebarExpanded ? 'w-64' : 'w-20'} md:translate-x-0`}
            >
                {/* ... (Konten sidebar tetap sama) ... */}
                 <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                    <h1 className={`text-xl font-bold text-indigo-500 dark:text-indigo-400 ${sidebarExpanded ? '' : 'hidden'}`}>Admin</h1>
                    <div className={`w-10 h-10 flex items-center justify-center ${sidebarExpanded ? 'hidden' : ''}`}>
                        <span className="text-2xl font-bold text-indigo-500 dark:text-indigo-400">A</span>
                    </div>
                    <div className="flex space-x-1">
                        <button 
                            onClick={() => setSidebarExpanded(true)} 
                            className={`p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${sidebarExpanded ? 'hidden' : ''}`}
                            title="Expand sidebar"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        </button>
                        <button 
                            onClick={() => setSidebarExpanded(false)} 
                            className={`p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${sidebarExpanded ? '' : 'hidden'}`}
                            title="Collapse sidebar"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                </div>
                
                <nav className="p-4">
                    <ul className="space-y-2">
                        <li>
                            <Link href={route('dashboard')} className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                                <span className={`ml-3 ${sidebarExpanded ? '' : 'hidden'}`}>Dashboard</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <header className="bg-white dark:bg-gray-800 shadow-sm">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center">
                            {/* Tombol menu untuk mobile */}
                            <button 
                                onClick={() => setSidebarOpen(true)} 
                                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 mr-2 md:hidden"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                            </button>
                            <h2 className="text-lg font-semibold">Dashboard</h2>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                <svg className={`h-5 w-5 ${isDark ? 'hidden' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                                <svg className={`h-5 w-5 ${isDark ? '' : 'hidden'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
                            </button>
                            
                            <div className="relative">
                                <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>
                                <div className={`absolute right-0 mt-2 w-64 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-50 ${notificationsOpen ? '' : 'hidden'}`}>
                                    <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600">New message</a>
                                    <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600">System update</a>
                                    <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600">New user registered</a>
                                </div>
                            </div>
                            
                            <div className="relative">
                                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500 dark:bg-indigo-400 flex items-center justify-center text-white">
                                        <span>{auth.user.name.slice(0, 2).toUpperCase()}</span>
                                    </div>
                                    <span className="hidden md:inline">{auth.user.name}</span>
                                </button>
                                <div className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-50 ${profileOpen ? '' : 'hidden'}`}>
                                    <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600">Your Profile</a>
                                    <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600">Settings</a>
                                    <Link href={route('logout')} method="post" as="button" className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600">
                                        Log Out
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}