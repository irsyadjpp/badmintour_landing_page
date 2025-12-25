'use client';

import { 
    ShieldCheck, 
    AlertTriangle, 
    Server, 
    Users, 
    Activity,
    Lock,
    Cpu,
    Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export default function SuperAdminDashboard() {
  return (
    <main>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#ffbe00]/10 text-[#ffbe00] border border-[#ffbe00]/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Lock className="w-3 h-3" /> God Mode Active
                    </span>
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Session ID: #SUP-8821</span>
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter">
                    Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffbe00] to-orange-500">Center</span>
                </h1>
            </div>
            
            <div className="flex gap-3">
                 <Button variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-400 font-bold rounded-xl h-12 px-6">
                    <AlertTriangle className="w-4 h-4 mr-2" /> Emergency Stop
                 </Button>
            </div>
        </div>

        {/* System Health Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Server Status */}
            <div className="bg-[#151515] p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-50 transition">
                    <Server className="w-12 h-12 text-[#ffbe00]" />
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">System Status</p>
                <h3 className="text-3xl font-black text-[#ffbe00] mb-1">ONLINE</h3>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> All Systems Operational
                </div>
            </div>

            {/* Admin Count */}
            <div className="bg-[#151515] p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-50 transition">
                    <Users className="w-12 h-12 text-blue-500" />
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total Admins</p>
                <h3 className="text-3xl font-black text-white mb-1">8</h3>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                    2 Active Sessions Now
                </div>
            </div>

            {/* CPU Load (Mock) */}
            <div className="bg-[#151515] p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-50 transition">
                    <Cpu className="w-12 h-12 text-purple-500" />
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Server Load</p>
                <h3 className="text-3xl font-black text-white mb-1">12%</h3>
                <div className="w-full bg-white/5 rounded-full h-1.5 mt-2">
                    <div className="bg-purple-500 h-full rounded-full w-[12%]"></div>
                </div>
            </div>

            {/* Database Size */}
            <div className="bg-[#151515] p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-50 transition">
                    <Database className="w-12 h-12 text-green-500" />
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Database Size</p>
                <h3 className="text-3xl font-black text-white mb-1">2.4 GB</h3>
                <p className="text-[10px] font-bold text-gray-400">Last Backup: 2h ago</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Quick Config */}
            <div className="lg:col-span-2 bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Activity className="w-6 h-6 text-[#ffbe00]" />
                    <h3 className="text-xl font-black text-white">Global Configuration</h3>
                </div>

                <div className="space-y-4">
                    {/* Config Item 1 */}
                    <div className="flex items-center justify-between p-4 bg-[#121212] rounded-2xl border border-white/5">
                        <div>
                            <p className="font-bold text-white text-sm">Maintenance Mode</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Matikan akses publik sementara</p>
                        </div>
                        <Switch className="data-[state=checked]:bg-[#ffbe00]" />
                    </div>
                    
                    {/* Config Item 2 */}
                    <div className="flex items-center justify-between p-4 bg-[#121212] rounded-2xl border border-white/5">
                        <div>
                            <p className="font-bold text-white text-sm">Force HTTPS Redirect</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Keamanan enkripsi SSL</p>
                        </div>
                        <Switch defaultChecked className="data-[state=checked]:bg-green-500" />
                    </div>

                    {/* Config Item 3 */}
                    <div className="flex items-center justify-between p-4 bg-[#121212] rounded-2xl border border-white/5">
                        <div>
                            <p className="font-bold text-white text-sm">Allow New Member Registration</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Buka/Tutup pendaftaran user baru</p>
                        </div>
                        <Switch defaultChecked className="data-[state=checked]:bg-blue-500" />
                    </div>
                </div>
            </div>

            {/* Audit Logs */}
            <div className="lg:col-span-1 bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                    <ShieldCheck className="w-6 h-6 text-gray-400" />
                    <h3 className="text-xl font-black text-white">Recent Audit Logs</h3>
                </div>
                
                <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                    {[1,2,3,4].map((i) => (
                        <div key={i} className="relative pl-6 pb-4 border-l border-white/10 last:pb-0">
                            <div className="absolute top-0 left-[-5px] w-2.5 h-2.5 rounded-full bg-[#1A1A1A] border-2 border-gray-600"></div>
                            <p className="text-[10px] font-bold text-gray-500 mb-1">Today, 10:4{i} AM</p>
                            <p className="text-xs text-gray-300"><span className="text-[#ffbe00] font-bold">Admin Kevin</span> mengubah harga sesi mabar rutin.</p>
                        </div>
                    ))}
                </div>

                <Button variant="ghost" className="w-full mt-4 text-xs font-bold text-gray-500 hover:text-white">View Full Logs</Button>
            </div>
        </div>
    </main>
  );
}
