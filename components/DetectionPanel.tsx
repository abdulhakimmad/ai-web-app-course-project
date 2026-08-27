"use client";
export function DetectionPanel() {
    return (
        <section>
            <h2>
                Object Detection
            </h2>
            <button
                onClick={() =>
                    alert(
                        "Prepare object detection"
                    )
                }
            >
                Prepare Detection
            </button>
        </section>
    );
}
