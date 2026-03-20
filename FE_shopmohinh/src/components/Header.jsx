import { Link } from 'react-router-dom'


function Header() {
  return (
    <header className="header">
   {/*tìm kiêm*/}
      <div className="top-bar">
        <input 
          className="search"
          type="text" 
          placeholder="Tìm sản phẩm..." 
        />
      </div>

      {}
      <nav className="nav-bar">
        <ul className="menu">
          <li><Link className="text-4xl font-bold text-red-600" to="/">Home</Link></li>
          <li><Link className="text-lg text-slate-700" to="/products">Products</Link></li>
          <li><Link className="text-lg text-slate-700" to="/contact">Contact</Link></li>
        </ul>
      </nav>  
      <p className="welcome-message">Welcome to our shop!</p>
    </header>
  )
}

export default Header