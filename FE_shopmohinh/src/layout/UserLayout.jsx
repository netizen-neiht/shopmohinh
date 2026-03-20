import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

function UserLayout() {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default UserLayout