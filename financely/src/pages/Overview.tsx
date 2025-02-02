import { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement);

// TypeScript Interfaces
interface SpendingProgress {
    Date: string;
    Payment: string;
    TotalSpent: number;
}

interface CategorySpending {
    Category: string;
    TotalSpent: number;
}

export function Overview() {
    const [spendingProgress, setSpendingProgress] = useState<SpendingProgress[]>([]);
    const [categorySpending, setCategorySpending] = useState<CategorySpending[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSpendingProgress();
        fetchCategorySpending();
    }, []);

    // Fetch Spending Progress
    const fetchSpendingProgress = async () => {
        try {
            const response = await fetch("http://localhost:8081/spending-progress");
            const data = await response.json();
            setSpendingProgress(data);
        } catch (error) {
            console.error("Error fetching spending progress:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch Category Spending
    const fetchCategorySpending = async () => {
        try {
            const response = await fetch("http://localhost:8081/category-spending");
            const data = await response.json();
            setCategorySpending(data);
        } catch (error) {
            console.error("Error fetching category spending:", error);
        }
    };

    // Prepare Data for Line Chart (Spending Progress)
    const lineChartData = {
        labels: Array.from(new Set(spendingProgress.map((entry) => entry.Date))), // Unique Dates
        datasets: Array.from(
            new Set(spendingProgress.map((entry) => entry.Payment))
        ).map((payment) => ({
            label: payment,
            data: spendingProgress
                .filter((entry) => entry.Payment === payment)
                .map((entry) => entry.TotalSpent),
            borderColor: "#" + Math.floor(Math.random() * 16777215).toString(16), // Random color
            fill: false,
        })),
    };

    // Prepare Data for Bar Chart (Category Spending)
    const barChartData = {
        labels: categorySpending.map((entry) => entry.Category),
        datasets: [
            {
                label: "Total Spent",
                data: categorySpending.map((entry) => entry.TotalSpent),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
        ],
    };

    return (
        <div>
            <h2>Overview</h2>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {/* Line Chart: Spending Progress */}
                    <div style={{ width: "80%", margin: "20px auto" }}>
                        <h3>Spending Progress by Payment</h3>
                        <Line data={lineChartData} />
                    </div>

                    {/* Bar Chart: Category Spending */}
                    <div style={{ width: "80%", margin: "20px auto" }}>
                        <h3>Total Spending by Category</h3>
                        <Bar data={barChartData} />
                    </div>
                </>
            )}
        </div>
    );
}
