import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Layout from "../components/Layout";

function Dashboard () {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('user') == null) {
            navigate("/");
        }
    }, []);

    const handleSave = () => {
        var user = JSON.parse(localStorage.getItem("user"));
        const headers = {
            'Accept': 'application/json',
            'Authorization': `Bearer ${user.data.authorization}`,
        }

        axios.post('http://localhost:8000/api/v1/logout', [], {headers : headers})
          .then(function (response) {
                // Handle the successful response here
                localStorage.removeItem("user");
                navigate("/");
          })
          .catch(function (error) {
            // 
          });
    }

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card border-0 shadow rounded-3 my-5">
                            <div className="card-body p-4 p-sm-5">
                                <h5 className="card-title text-center mb-5 fw-light fs-5">Dashboard</h5>
                                <div className="d-grid">
                                    <button
                                        onClick={handleSave} 
                                        className="btn btn-primary btn-login text-uppercase fw-bold" 
                                        type="button">
                                            Sign out
                                        </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Dashboard;