import React from 'react';

const menuItems = [
    { name: 'Home', link: '/' },
    { name: 'Blog', link: '/blog' },
    { name: 'About', link: '/about' },
    { name: 'Contact', link: '/contact' },
];

const Header: React.FC = () => (
    <header style={{ padding: '1rem', background: '#f5f5f5' }}>
        <nav>
            <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
                {menuItems.map(item => (
                    <li key={item.name} style={{ marginRight: '2rem' }}>
                        <a href={item.link} style={{ textDecoration: 'none', color: '#333' }}>
                            {item.name}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    </header>
);

export default Header;