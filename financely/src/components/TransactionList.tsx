import { Space, Table } from 'antd'
import type { TableProps } from 'antd';
import { Category } from '../VO/Category';
import { Payment } from '../VO/Payment';

interface MonthEntryItem {
    ID: number;
    ItemName: string;
    Price: number;
    Count: number;
    Date: string;
}

interface TransactionListProps {
    isLoading: boolean;
    errorMessage: string | null;
    monthEntries: MonthEntryItem[];
    deleteEntryHandler: (id: number) => void;
    payments: Payment[];
    categories: Category[];
}

export function TransactionList(props: TransactionListProps) { 

    const {isLoading, errorMessage = null, monthEntries, deleteEntryHandler, categories, payments} = props;

    const columns : TableProps<MonthEntryItem>['columns'] = [
      {
          title: 'ID',
          dataIndex: 'ID',
          key: 'itemName',
      },
      {
          title: 'ItemName',
          dataIndex: 'ItemName',
          key: 'itemName'
      },
      {
          title: 'Price',
          dataIndex: 'Price',
          key: 'price',
          render: (text) => {
            let color = "#000000"
            if(parseFloat(text) < 0){
              color = "#eb4034"
            }
            else if(parseFloat(text) > 0){
              color = "#40eb34"
            }
            return <p style={{color: color}}>{text}</p>
          }
      },
      {
          title: 'Count',
          dataIndex: 'Count',
          key: 'count'
      },
      {
          title: 'Date',
          dataIndex: 'Date',
          key: 'date',
          showSorterTooltip: {target: 'full-header'},
          sorter: (a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime(),
          sortDirections: ['descend'],
          render: (text) => {
            const date = new Date(text);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth()+1).padStart(2, '0');
            const year = date.getFullYear();

            return `${day}.${month}.${year}`;
          }
      },
      {
        title: 'Category',
        dataIndex: 'CategoryID',
        key: 'CategoryID',
        render: (text) => <p>{categories.find((item) => item.ID == parseInt(text))?.NAME}</p>
      },
      {
        title: 'Seller',
        dataIndex: 'Seller',
        key: 'Seller',
        render: (text) => text !== null ? <p>{text}</p> : "-"
      },
      {
        title: 'Payment',
        dataIndex: 'PaymentID',
        key: 'PaymentID',
        render: (text) => <p>{payments.find((item) => item.ID == parseInt(text))?.Name}</p>
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Space size="middle">
            <button onClick={() => {deleteEntryHandler(record.ID)}}>Delete</button>
          </Space>
        )
      }
  ]

    return (
        <div>
            {isLoading ? <p>Loading...</p> : errorMessage ? <p>Error: {errorMessage}</p> : (<Table<MonthEntryItem> columns={columns} dataSource={monthEntries} />)}
          </div>
    )
}