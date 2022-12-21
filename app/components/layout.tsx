import React from "react";
import { Header } from "./header";

export function Layout({ children }: { children: React.ReactNode }) {
    return <div className="h-screen w-full bg-no-repeat bg-center bg-cover	 font-mono flex justify-center items-center flex-col gap-y-4 z-5" >
        <Header />
        {children}
        <div className="bg-zoom  h-screen w-full bg-[url('../Images/sitebg.jpg')] bg-no-repeat bg-center bg-cover absolute t-0 overflow-hidden z-0">

        </div>
    </div>
}