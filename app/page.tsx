export default function Home() {
    return (
        <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
            <section className="max-w-3xl w-full rounded-2xl bg-slate-900 border border-slate-700
p-8 shadow-xl">
                <p className="text-sm text-cyan-400 font-semibold mb-2">
                    AI Application Development
                </p>
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                    My First AI Web Application
                </h1>
                <p className="text-slate-300 text-lg mb-6">
                    This project is the starting point for building an AI-powered
                    Progressive Web Application using Next.js.
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl bg-slate-800 p-4 border border-slate-700">
                        <h2 className="font-semibold text-cyan-300">Frontend</h2>
                        <p className="text-sm text-slate-400 mt-2">
                            Build user interfaces with Next.js and Tailwind CSS.
                        </p>
                    </div>
                    <div className="rounded-xl bg-slate-800 p-4 border border-slate-700">
                        <h2 className="font-semibold text-cyan-300">Database</h2>
                        <p className="text-sm text-slate-400 mt-2">
                            Connect to PostgreSQL, MongoDB, and Vector Database.
                        </p>
                    </div>
                    <div className="rounded-xl bg-slate-800 p-4 border border-slate-700">
                        <h2 className="font-semibold text-cyan-300">AI Model</h2>
                        <p className="text-sm text-slate-400 mt-2">
                            Integrate AI models or AI APIs for intelligent features.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}