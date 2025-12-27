'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface MobileContextType {
    showServerSidebar: boolean;
    showChannelSidebar: boolean;
    showMemberList: boolean;
    toggleServerSidebar: () => void;
    toggleChannelSidebar: () => void;
    toggleMemberList: () => void;
    closeAll: () => void;
}

const MobileContext = createContext<MobileContextType | undefined>(undefined);

export function MobileProvider({ children }: { children: ReactNode }) {
    const [showServerSidebar, setShowServerSidebar] = useState(false);
    const [showChannelSidebar, setShowChannelSidebar] = useState(false);
    const [showMemberList, setShowMemberList] = useState(false);

    const toggleServerSidebar = () => {
        setShowServerSidebar(!showServerSidebar);
        setShowChannelSidebar(false);
        setShowMemberList(false);
    };

    const toggleChannelSidebar = () => {
        setShowChannelSidebar(!showChannelSidebar);
        setShowServerSidebar(false);
        setShowMemberList(false);
    };

    const toggleMemberList = () => {
        setShowMemberList(!showMemberList);
        setShowServerSidebar(false);
        setShowChannelSidebar(false);
    };

    const closeAll = () => {
        setShowServerSidebar(false);
        setShowChannelSidebar(false);
        setShowMemberList(false);
    };

    return (
        <MobileContext.Provider
            value={{
                showServerSidebar,
                showChannelSidebar,
                showMemberList,
                toggleServerSidebar,
                toggleChannelSidebar,
                toggleMemberList,
                closeAll,
            }}
        >
            {children}
        </MobileContext.Provider>
    );
}

export function useMobile() {
    const context = useContext(MobileContext);
    if (context === undefined) {
        throw new Error('useMobile must be used within a MobileProvider');
    }
    return context;
}
