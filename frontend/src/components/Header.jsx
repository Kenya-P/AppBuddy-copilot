function Header() {
  return (
    <header className="header">
      <h2>AppBuddy</h2>

      <nav>
        <a href="/dashboard">Dashboard</a>
        <a href="/applications">Applications</a>
        <a href="/resume">Resume</a>
        <a href="/analyze">Analyze</a>
        <a href="/profile">Profile</a>
      </nav>
    </header>
  );
}

export default Header;