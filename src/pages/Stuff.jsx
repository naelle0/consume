import React, { useState, useEffect } from "react";
import Case from "../components/Case";
import Table from "../components/Table";
import axios from "axios"
import { useNavigate } from "react-router-dom";

export default function Stuff () {
    const [stuffs, setStuffs] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        getStuffs()

    }, []);



    function getStuffs() {
        axios.get('http://localhost:8000/stuff/data', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })
        .then(res => {
            setStuffs(res.data.data);
        })
        .catch(err => {
            console.log(err)
            if (err.response.status == 401) {
                navigate('/login?message=' + encodeURIComponent('Anda Belum Login!'));
            }
        })
    }
    const headers = [
        "#",
        "Name",
        "Category",
        "Total Available",
        "Total Defec"
    ]

    const endPointModal = {
        "data_detail": "http://localhost:8000/stuff/{id}",
        "delete":  "http://localhost:8000/stuff/{id}",
        "update":  "http://localhost:8000/stuff/{id}",
        "store" :  "http://localhost:8000/stuff/store",
       
    }

    const inputData = {
        "name" : {
            "tag":  "input",
            "type": "text",
            "option": null
    },
        "category" : {
            "tag": "select",
            "type": "select",
            "option": ["KLN", "HTL", "Teknisi/Sarpras"]
        },
    }

    const buttons = [
        "create",
        "trash",
        "edit",
        "delete"
    ] 

    const tdcolumn = {
        "name": null,
        "category": null,
        "stuff_stock": "total_available",
        "stuff_stock*": "total_defect"
    }
    const title = 'Stuff';

    const columnIdentitasDelete = 'name';
    return (
        <Case>
        <Table headers={headers} data={stuffs} endpoint={endPointModal} inputData={inputData}
        titleModal={title} identitasColumn={columnIdentitasDelete} opsiButton={buttons} columnForTd={tdcolumn}> </Table>
        </Case>
    );
}