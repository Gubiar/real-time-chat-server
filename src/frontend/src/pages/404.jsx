export default function PageNotFound() {
    return (
        <div className="flex flex-col min-h-[100vh] items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Page not found</h1>
                <p className="max-w-[600px] mx-auto text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Desculpe, não conseguimos encontrar a página que você procura.
                </p>
            </div>
            <a
                className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-black text-white px-4 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                href="/dashboard"
            >
                Voltar para a dashboard
            </a>
        </div>
    );
}
