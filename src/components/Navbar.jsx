import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
    const navItems = [
        { path: '/', label: 'Home' },
        { path: '/data', label: 'Data' },
        { path: '/line-chart', label: 'Line Chart' },
        { path: '/pie-chart', label: 'Pie Chart' },
    ];
    return (
        <nav className={styles.navbar}>
            <ul className={styles.navList}>
                {navItems.map((item) => (
                    <li>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
                        >
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;