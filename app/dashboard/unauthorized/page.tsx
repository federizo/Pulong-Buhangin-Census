export default function Unauthorized() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Unauthorized Access</h1>
                <p className="text-lg">You do not have permission to view this page.</p>
                <a href="/auth" className="mt-5 inline-block text-blue-500 underline">
                    Go to Login
                </a>
            </div>
        </div>
    );
}
