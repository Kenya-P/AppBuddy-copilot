import Header from "./Header";

function Layout({ children }) {
    return (
        <div className="app">
            <Header />
            <main className="app-content">
                {children}
            </main>
        </div>
    );
}

export default Layout;