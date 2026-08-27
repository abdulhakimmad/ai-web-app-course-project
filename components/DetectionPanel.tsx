"use client";
import { useState } from "react";
export function DetectionPanel() {
    const [status, setStatus] = useState("Waiting");
    useState
    return (
        <section>
            <h2>
                Object Detection
            </h2>
            <br></br>
            <p>
                statis;{status}
            </p>
            <button
                onClick={() =>
                    setStatus("Ready")
                }
            >

                Prepare Detection
            </button>
        </section>
    );
}
