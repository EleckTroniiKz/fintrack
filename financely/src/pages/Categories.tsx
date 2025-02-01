import { useEffect, useState } from "react";
import { Table } from 'antd'
import type { TableProps } from 'antd';
import { Category } from "../VO/Category";


export function Categories() {
    const [categories, setCategories] = useState([]);
    
    useEffect(() => {
        fetch("http://localhost:8081/category").then((response) => {
            if(!response.ok){
                throw new Error("Failed to Fetch Payment Methods")
            }
            return response.json();
        }).then((data) => {
            setCategories(data);
        })
    }, [])

    const columns : TableProps<Category>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'ID',
            key: 'ID',
        },
        {
            title: 'NAME',
            dataIndex: 'NAME',
            key: 'Name',
        },
    ]

    return (
    <div>
        <Table<Category> columns={columns} dataSource={categories} />
    </div>
    )
}