'use client';

import React from 'react';
import LeadsTable from './LeadsTable';

export default function FreshLeads() {
    return (
        <LeadsTable 
            mode="fresh" 
            title="Fresh Leads" 
            subtitle="Explore unassigned leads to build your pipeline. Pick leads to start working on them."
            isPicked={false}
            pickedBy={undefined}
        />
    );
}
