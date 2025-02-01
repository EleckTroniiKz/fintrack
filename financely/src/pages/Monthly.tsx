import { RefObject, useEffect, useState } from "react";
import { TransactionList } from "../components/TransactionList";
import EntryLogger from "../components/EntryLogger";
import ListFilterer from "../components/ListFilterer";
import { Payment } from "../VO/Payment";

interface Entry {
  ID: number;
  ItemName: string;
  Price: number;
  Count: number;
  Date: string;
  CategoryID: number;
  PaymentID: number;
}

interface Category {
  ID: number;
  NAME: string;
}

export function Monthly() {
  const currentDate = new Date();
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [monthEntries, setMonthEntries] = useState<Entry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [availableMonths, setAvailableMonths] = useState<{ month: Number; year: number}[]>([])

  // Form state
  const [newEntry, setNewEntry] = useState({
    itemName: "",
    price: "",
    count: "",
    date: new Date().toISOString().split("T")[0], // Default to today
    categoryID: "",
    paymentID: "",
    seller: ""
  });

  const handleDeleteEntryClicked = (id: number) => {
    fetch(`http://localhost:8081/entries/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete entry");
        }
        return response.json();
      })
      .then(() => {
        setMonthEntries((prevEntries) => prevEntries.filter((entry) => entry.ID !== id));
      })
      .catch((err) => alert(err.message));
  }
  

  useEffect(() => {
    fetchEntries();
    fetchCategories();
    fetchPayments();
    fetchAvailableMonths();
  }, [month, year]);

  const fetchAvailableMonths = () => {
    fetch("http://localhost:8081/entries/available-months")
      .then((response) => response.json())
      .then((data) => setAvailableMonths(data))
      .catch((err) => console.error("Error fetching available months:", err));
  };

  const fetchEntries = () => {
    setLoading(true);
    fetch(`http://localhost:8081/entries/month?month=${month}&year=${year}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch monthly entries");
        }
        return response.json();
      })
      .then((data) => {
        setMonthEntries(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const fetchCategories = () => {
    fetch("http://localhost:8081/category")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  };

  const fetchPayments = () => {
    fetch("http://localhost:8081/payment")
      .then((response) => response.json())
      .then((data) => setPayments(data))
      .catch((err) => console.error("Error fetching payments:", err));
  };

  const handleAddEntry = (e: React.FormEvent, itemRef: RefObject<HTMLInputElement>) => {
    e.preventDefault();
    itemRef.current?.focus()

    fetch("http://localhost:8081/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newEntry,
        price: parseFloat(newEntry.price),
        count: parseInt(newEntry.count),
        categoryID: parseInt(newEntry.categoryID),
        paymentID: parseInt(newEntry.paymentID),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add entry");
        }
        return response.json();
      })
      .then(() => {
        setNewEntry({ itemName: "", price: "", count: "", date: newEntry.date, categoryID: "", paymentID: "", seller: "" });
        fetchEntries(); // Refresh entries after adding
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div>
      <EntryLogger handleAddEntry={handleAddEntry} setNewEntry={setNewEntry} newEntry={newEntry} categories={categories} payments={payments} />
      <ListFilterer month={month} setMonth={setMonth} year={year} setYear={setYear} />
      <TransactionList isLoading={loading} errorMessage={error} monthEntries={monthEntries} deleteEntryHandler={handleDeleteEntryClicked} payments={payments} categories={categories}/>
      
    </div>
  );
}

export default Monthly;
