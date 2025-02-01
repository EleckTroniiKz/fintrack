
interface ListFiltererProps {
    month: number;
    setMonth: (month: number) => void;
    year: number;
    setYear: (year: number) => void;
}


export default function ListFilterer(props: ListFiltererProps) {
    const {month, setMonth, year, setYear} = props;
    
    return (
        <div>
            <h2>Entries for {month}/{year}</h2>

            {/* Month & Year Selectors */}
            <label>Month: </label>
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
                ))}
            </select>

            <label> Year: </label>
            <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                min="2000"
                max="2100"
            />
        </div>
    )
}