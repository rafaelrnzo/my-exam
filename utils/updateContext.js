import React, { createContext, useState, useContext } from 'react';

const UpdateContext = createContext();

export const useUpdate = () => useContext(UpdateContext);

export const UpdateProvider = ({ children }) => {
    const [updateTrigger, setUpdateTrigger] = useState(false);

    const triggerUpdate = () => {
        setUpdateTrigger(prev => !prev);
        // console.log(updateTrigger);
    };

    return (
        <UpdateContext.Provider value={{ updateTrigger, triggerUpdate }}>
            {children}
        </UpdateContext.Provider>
    );
};
