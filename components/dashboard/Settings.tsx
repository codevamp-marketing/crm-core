'use client';

import React, { useState } from 'react';
import { Save, Bell, Shield, Palette, Building2 } from 'lucide-react';
import { clsx } from 'clsx';

type Tab = 'general' | 'notifications' | 'security' | 'appearance';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
];

function ToggleSwitch({ defaultChecked = false }: { defaultChecked?: boolean }) {
    const [on, setOn] = useState(defaultChecked);
    return (
        <button
            type="button"
            onClick={() => setOn(!on)}
            className={clsx(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20',
                on ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-200 dark:bg-zinc-700'
            )}
        >
            <span className={clsx(
                'inline-block h-5 w-5 transform rounded-full bg-white dark:bg-zinc-900 shadow transition-transform duration-200',
                on ? 'translate-x-5' : 'translate-x-0.5'
            )} />
        </button>
    );
}

export default function Settings() {
    const [activeTab, setActiveTab] = useState<Tab>('general');

    return (
        <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Settings</h1>
                <p className="text-[var(--text-secondary)] mt-1">Manage your account settings and preferences.</p>
            </div>

            <div className="flex gap-8">
                {/* Tab Sidebar */}
                <nav className="w-48 shrink-0 space-y-0.5">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={clsx(
                                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left',
                                activeTab === id
                                    ? 'bg-zinc-100 dark:bg-zinc-800 text-[var(--text-primary)]'
                                    : 'text-[var(--text-secondary)] hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-[var(--text-primary)]'
                            )}
                        >
                            <Icon className={clsx('w-4 h-4 shrink-0', activeTab === id ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-400')} />
                            {label}
                        </button>
                    ))}
                </nav>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {activeTab === 'general' && (
                        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] shadow-sm divide-y divide-[var(--border-subtle)]">
                            <div className="p-8">
                                <h2 className="text-base font-bold text-[var(--text-primary)] mb-6">General Settings</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Company Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2.5 border border-[var(--border-subtle)] rounded-xl text-sm bg-zinc-50 dark:bg-zinc-900 text-[var(--text-primary)] focus:bg-[var(--bg-card)] focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-zinc-100/5 focus:border-zinc-400 dark:focus:border-zinc-600 transition-all outline-none"
                                            defaultValue="Invertis University"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Timezone</label>
                                        <select className="w-full px-3 py-2.5 border border-[var(--border-subtle)] rounded-xl text-sm bg-zinc-50 dark:bg-zinc-900 text-[var(--text-primary)] focus:bg-[var(--bg-card)] focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-zinc-100/5 transition-all outline-none">
                                            <option>India Standard Time (IST)</option>
                                            <option>Pacific Time (US &amp; Canada)</option>
                                            <option>UTC</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Default Currency</label>
                                        <select className="w-full px-3 py-2.5 border border-[var(--border-subtle)] rounded-xl text-sm bg-zinc-50 dark:bg-zinc-900 text-[var(--text-primary)] focus:bg-[var(--bg-card)] focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-zinc-100/5 transition-all outline-none">
                                            <option>INR (₹)</option>
                                            <option>USD ($)</option>
                                            <option>EUR (€)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Language</label>
                                        <select className="w-full px-3 py-2.5 border border-[var(--border-subtle)] rounded-xl text-sm bg-zinc-50 dark:bg-zinc-900 text-[var(--text-primary)] focus:bg-[var(--bg-card)] focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-zinc-100/5 transition-all outline-none">
                                            <option>English (India)</option>
                                            <option>Hindi</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8">
                                <h2 className="text-base font-bold text-[var(--text-primary)] mb-6">Automation Rules</h2>
                                <div className="space-y-6">
                                    {[
                                        { label: 'Auto-assign leads', desc: 'Automatically assign new leads to sales reps based on round-robin.' },
                                        { label: 'Stale lead alerts', desc: "Notify owner if a lead hasn't been contacted in 7 days." },
                                        { label: 'AI campaign suggestions', desc: 'Let AI suggest budget reallocation when a campaign underperforms.' },
                                    ].map(({ label, desc }, i) => (
                                        <div key={i} className="flex items-center justify-between gap-6">
                                            <div>
                                                <p className="font-semibold text-[var(--text-primary)] text-sm">{label}</p>
                                                <p className="text-xs text-[var(--text-secondary)] mt-0.5">{desc}</p>
                                            </div>
                                            <ToggleSwitch defaultChecked={i !== 1} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 flex justify-end">
                                <button className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg shadow-zinc-900/20 flex items-center gap-2">
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] shadow-sm divide-y divide-[var(--border-subtle)]">
                            <div className="p-8">
                                <h2 className="text-base font-bold text-[var(--text-primary)] mb-6">Notification Preferences</h2>
                                <div className="space-y-6">
                                    {[
                                        { label: 'New lead assigned', desc: 'Get notified when a lead is assigned to you.' },
                                        { label: 'Lead stage change', desc: 'Alert when a lead moves to the next stage.' },
                                        { label: 'Campaign performance alerts', desc: 'Notify when ROI drops below threshold.' },
                                        { label: 'Weekly digest', desc: 'Receive a weekly summary of your pipeline metrics.' },
                                        { label: 'AI insights', desc: 'Get AI-generated insights and recommendations.' },
                                    ].map(({ label, desc }, i) => (
                                        <div key={i} className="flex items-center justify-between gap-6">
                                            <div>
                                                <p className="font-semibold text-[var(--text-primary)] text-sm">{label}</p>
                                                <p className="text-xs text-[var(--text-secondary)] mt-0.5">{desc}</p>
                                            </div>
                                            <ToggleSwitch defaultChecked={i < 3} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-6 flex justify-end">
                                <button className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg shadow-zinc-900/20 flex items-center gap-2">
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] shadow-sm divide-y divide-[var(--border-subtle)]">
                            <div className="p-8">
                                <h2 className="text-base font-bold text-[var(--text-primary)] mb-6">Change Password</h2>
                                <div className="space-y-4 max-w-md">
                                    {['Current Password', 'New Password', 'Confirm New Password'].map((label) => (
                                        <div key={label}>
                                            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">{label}</label>
                                            <input
                                                type="password"
                                                className="w-full px-3 py-2.5 border border-[var(--border-subtle)] rounded-xl text-sm bg-zinc-50 dark:bg-zinc-900 text-[var(--text-primary)] focus:bg-[var(--bg-card)] focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-zinc-100/5 transition-all outline-none"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-8">
                                <h2 className="text-base font-bold text-[var(--text-primary)] mb-6">Two-Factor Authentication</h2>
                                <div className="flex items-center justify-between gap-6">
                                    <div>
                                        <p className="font-semibold text-[var(--text-primary)] text-sm">Enable 2FA</p>
                                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">Add an extra layer of security to your account.</p>
                                    </div>
                                    <ToggleSwitch defaultChecked={false} />
                                </div>
                            </div>
                            <div className="p-6 flex justify-end">
                                <button className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg shadow-zinc-900/20 flex items-center gap-2">
                                    <Save className="w-4 h-4" />
                                    Update Security
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] shadow-sm divide-y divide-[var(--border-subtle)]">
                            <div className="p-8">
                                <h2 className="text-base font-bold text-[var(--text-primary)] mb-6">Theme & Display</h2>
                                <div className="space-y-4">
                                    <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Color Mode</p>
                                    <div className="flex gap-3">
                                        {['Light', 'Dark', 'System'].map((mode) => (
                                            <button
                                                key={mode}
                                                className={clsx(
                                                    'px-4 py-2 rounded-xl text-sm font-medium border transition-colors',
                                                    mode === 'System'
                                                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                                                        : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-zinc-50 dark:hover:bg-zinc-900'
                                                )}
                                            >
                                                {mode}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 flex justify-end">
                                <button className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg shadow-zinc-900/20 flex items-center gap-2">
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
