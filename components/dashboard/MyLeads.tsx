'use client';

import React, { useEffect, useState } from 'react';
import LeadsTable from './LeadsTable';
import { getAuthToken } from '@/lib/http-client';
import { decodeJwt } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function MyLeads() {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const token = getAuthToken();
        const decoded = decodeJwt(token);
        if (decoded?.sub) {
            setUserId(decoded.sub as string);
        }
    }, []);

    if (!userId) {
        return (
            <div className="flex justify-center p-20 text-sm text-zinc-500">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Loading your profile...
            </div>
        );
    }

    return (
        <LeadsTable 
            mode="my_leads" 
            title="My Leads" 
            subtitle="Manage and track all the leads currently assigned to you."
            isPicked={undefined}
            pickedBy={userId} 
        />
    );
}
