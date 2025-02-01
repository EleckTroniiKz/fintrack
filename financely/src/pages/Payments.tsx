import { useEffect, useState } from "react"
import { Table } from 'antd'
import type { TableProps } from 'antd';
import { Payment } from "../VO/Payment";

export function Payments() {

    const [payments, setPayments] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8081/payment").then((response) => {
            if(!response.ok){
                throw new Error("Failed to Fetch Payment Methods")
            }
            return response.json();
        }).then((data) => {
            setPayments(data);
        })
    }, [])

    const columns : TableProps<Payment>['columns'] = [
            {
                title: 'ID',
                dataIndex: 'ID',
                key: 'ID',
            },
            {
                title: 'Name',
                dataIndex: 'Name',
                key: 'Name',
            },
            {
                title: 'Balance',
                dataIndex: 'Balance',
                key: 'Balance',
                render: (text) => <p>{text}€</p>
            },
        ]

    return (
    <div>
        <Table<Payment> columns={columns} dataSource={payments} />
    </div>
    )
}