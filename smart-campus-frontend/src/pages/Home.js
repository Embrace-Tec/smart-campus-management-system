import React from "react";
import Navbar from "../components/Navbar";

const Home = () => {
    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <h1>Welcome to Smart Campus</h1>
                <p>Manage your campus activities efficiently.</p>
            </div>
        </div>
    );
};

export default Home;