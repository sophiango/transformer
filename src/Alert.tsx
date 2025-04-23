function Alert() {
    return (
        <div role="alert" className="rounded-md border border-gray-300 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
                </svg>

                <div className="flex-1">
                    <strong className="font-medium text-gray-900"> Changes available </strong>

                    <p className="mt-0.5 text-sm text-gray-700">Thers'a change in the file you are working on</p>

                    <div className="mt-3 flex items-center gap-2">
                        <button
                            type="button"
                            className="rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100"
                        >
                            Ignore
                        </button>

                        <button
                            type="button"
                            className="rounded border border-transparent px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
                        >
                            Preview
                        </button>
                    </div>
                </div>

                <button
                    className="-m-3 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
                    type="button"
                    aria-label="Dismiss alert"
                >
                    <span className="sr-only">Dismiss popup</span>

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default Alert;