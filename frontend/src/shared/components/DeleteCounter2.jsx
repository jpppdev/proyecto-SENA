import { useState } from "react";

export default function DeleteCounter2() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>Contador: {count}</p>
            <button type="button" onClick={() => setCount((value) => value + 1)} className="border p-6 rounded-md bg-yellow-500">
                Incrementar
            </button>
        </div>
    );
}
