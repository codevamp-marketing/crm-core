'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FreshLeads from './FreshLeads';
import MyLeads from './MyLeads';
import { Inbox, UserCircle } from 'lucide-react';

export default function LeadsContainer() {
    return (
        <div className="space-y-6">
            {/* Tabs Orchestrator */}
            <Tabs defaultValue="fresh" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1">
                    <TabsTrigger value="fresh" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm rounded-lg px-4 py-2 text-sm font-medium transition-all cursor-pointer">
                        <Inbox className="w-4 h-4" />
                        Fresh Leads
                    </TabsTrigger>
                    <TabsTrigger value="my_leads" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm rounded-lg px-4 py-2 text-sm font-medium transition-all cursor-pointer">
                        <UserCircle className="w-4 h-4" />
                        My Leads
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="fresh" className="mt-0 outline-none">
                    <FreshLeads />
                </TabsContent>
                
                <TabsContent value="my_leads" className="mt-0 outline-none">
                    <MyLeads />
                </TabsContent>
            </Tabs>
        </div>
    );
}
