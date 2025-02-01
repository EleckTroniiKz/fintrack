import { Category } from "../VO/Category";
import { Payment } from "../VO/Payment";
import { Ref, RefObject, useRef } from "react";

interface MonthEntryFormItem {
    itemName: string;
    price: string;
    count: string;
    date: string;
    categoryID: string;
    paymentID: string;
    seller: string;
}

interface EntryLoggerProps {
    handleAddEntry: (e: React.FormEvent, itemRef: RefObject<HTMLInputElement>) => void;
    setNewEntry: (item: MonthEntryFormItem) => void;
    newEntry: MonthEntryFormItem;
    categories: Category[];
    payments: Payment[];
}


export default function EntryLogger(props: EntryLoggerProps) {
    const {handleAddEntry, setNewEntry, newEntry, categories, payments} = props;

    const itemNameRef = useRef<HTMLInputElement>(null);

    return (
        <div style={{backgroundColor: '#ffffff', border: '1px solid ', padding: '5px', paddingLeft: '15px', borderRadius: '15px', marginTop: '15px'}}>
            <form onSubmit={(e) => handleAddEntry(e, itemNameRef)}>
                <input
                type="text"
                ref={itemNameRef}
                style={{borderRadius: '5px', border: '1px solid #737373'}}
                placeholder="Item Name"
                value={newEntry.itemName}
                onChange={(e) => setNewEntry({ ...newEntry, itemName: e.target.value })}
                required
                />
                <input
                type="number"
                placeholder="Price"
                value={newEntry.price}
                onChange={(e) => setNewEntry({ ...newEntry, price: e.target.value })}
                required
                />
                <input
                type="number"
                placeholder="Count"
                value={newEntry.count}
                onChange={(e) => setNewEntry({ ...newEntry, count: e.target.value })}
                required
                />
                <input
                type="date"
                value={newEntry.date}
                onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                required
                />
                <select value={newEntry.categoryID} onChange={(e) => setNewEntry({ ...newEntry, categoryID: e.target.value })} required>
                <option value="">Select Category</option>
                {categories.map((category) => (
                    <option key={category.ID} value={category.ID}>{category.NAME}</option>
                ))}
                </select>
                <select value={newEntry.paymentID} onChange={(e) => setNewEntry({ ...newEntry, paymentID: e.target.value })} required>
                <option value="">Select Payment Method</option>
                {payments.map((payment) => (
                    <option key={payment.ID} value={payment.ID}>{payment.Name}</option>
                ))}
                </select>
                <input 
                type="text"
                value={newEntry.seller}
                onChange={(e) => setNewEntry({ ...newEntry, seller: e.target.value})}
                placeholder="Seller"
                defaultValue={""}
                />
                <button type="submit">Add Entry</button>
            </form>
        </div>
    )
}