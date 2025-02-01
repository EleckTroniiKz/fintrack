import { Category } from "../VO/Category";
import { Payment } from "../pages/Monthly";

interface MonthEntryFormItem {
    itemName: string;
    price: string;
    count: string;
    date: string;
    categoryID: string;
    paymentID: string;
}

interface EntryLoggerProps {
    handleAddEntry: (e: React.FormEvent) => void;
    setNewEntry: (item: MonthEntryFormItem) => void;
    newEntry: MonthEntryFormItem;
    categories: Category[];
    payments: Payment[];
}


export default function EntryLogger(props: EntryLoggerProps) {
    const {handleAddEntry, setNewEntry, newEntry, categories, payments} = props;
    return (
        <div>
            <h3>Add New Entry</h3>
            <form onSubmit={handleAddEntry}>
                <input
                type="text"
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
                <button type="submit">Add Entry</button>
            </form>
        </div>
    )
}