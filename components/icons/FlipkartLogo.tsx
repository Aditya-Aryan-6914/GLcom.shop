
import React from 'react';

const FlipkartLogo: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="Flipkart logo">
        <path fill="#2874F0" d="M22.42 8.75h-3.9c.28.69.45 1.43.45 2.2s-.17 1.51-.45 2.2h3.9c.29-.68.46-1.42.46-2.2s-.17-1.52-.46-2.2z"/>
        <path fill="#F9A825" d="M16.92 3.32h-3.37L12 6.57l1.54 3.25h3.37v-6.5z"/>
        <path fill="#2874F0" d="M12 14.2h3.37v6.5H12z"/>
        <path fill="#F9A825" d="m10.63 3.32-1.55 3.25-1.55-3.25h-3.9v6.5h3.9c.28.69.45 1.43.45 2.2s-.17 1.51-.45 2.2h-3.9v6.5h3.37l1.55-3.25 1.55 3.25h3.9v-6.5h-3.9c-.28-.69-.45-1.43-.45-2.2s.17-1.51.45-2.2h3.9v-6.5h-3.37L12 6.57 10.63 3.32z"/>
    </svg>
);

export default FlipkartLogo;
