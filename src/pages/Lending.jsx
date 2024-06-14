import React, { useEffect, useState } from "react";
import Case from "../components/Case";
import axios from "axios";
import Table from "../components/Table";
import { Link, useNavigate } from "react-router-dom";

export default function Lendings() {
    const [Lendings, setLendings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8000/Lending", {
            headers: {  
                "Authorization": "Bearer " + localStorage.getItem("access_token"),
            }
        })
        .then(res => {
            setLendings(res.data.data);
        })
        .catch(err => {
            console.log(err);
            if (err.response && err.response.status === 401) {
                navigate('/login?message=' + encodeURIComponent('Anda belum login !!'));
            }
        })
    }, []);

    const headers = [
        "#",
        "stuff_id",
        "date_time",
        "name",
        "user_id",
        "notes",
        "total_stuff",
    ];
    
    const endpointModal = {
        "createLending": "http://localhost:8000/lendings/store",
        // "UserDelete":"http://localhost:8000/user/{id}",
        // "UserDetail":"http://localhost:8000/user/{id}"
    };

  
    const title = "Lending";

    const columnIdentitasDelete = 'stuff_id'; // Adjust according to your data

    const buttons = [
        "createLending",
        // "UserDelete",
        // "UserDetail"
    ];

    const tdColumn = {
        "stuff_id": null,
        "date_time": null,
        "name": null,
        "user_id": null,
        "notes": null,
        "total_stuff": null
    };
    

    // const UrlImage = "http://localhost:8000/upload-images"

    return (
        <Case>
            <Table headers={headers} data={Lendings} endpoint={endpointModal}  titleModal={title}
                identitasColumn={columnIdentitasDelete} opsiButton={buttons} columnForTd={tdColumn}>
            </Table>
            
        </Case>
        
    );
}