import React from 'react'
import { Outlet } from 'react-router-dom'

export const Layout = () => {
    return (

        <div>
            <p>
                this is the layout
            </p>
            <Outlet />
        </div>
    )
}
