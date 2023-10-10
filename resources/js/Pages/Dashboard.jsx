import App from "@/Layouts/App";
import { Head } from "@inertiajs/react";

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="">
                <div className="mx-auto">
                    <div className="overflow-hidden bg-white border rounded">
                        <div className="p-6 text-gray-900">
                            You're logged in!
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
Dashboard.layout = (page) => <App children={page} />;
