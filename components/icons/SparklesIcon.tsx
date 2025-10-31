
import React from 'react';

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-7.19c0-.868.351-1.666.935-2.251z"
      clipRule="evenodd"
    />
    <path d="M6.913 9.182c1.06-1.06 2.149-1.833 3.218-2.404a.75.75 0 01.964 1.254c-.751.57-1.48 1.259-2.213 2.018-1.06 1.06-1.833 2.149-2.404 3.218a.75.75 0 01-1.254-.964c.57-.751 1.259-1.48 2.018-2.213zM2.25 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zM12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM3.75 3.75a.75.75 0 011.06 0l1.591 1.591a.75.75 0 11-1.06 1.06L3.75 4.81a.75.75 0 010-1.06z" />
  </svg>
);

export default SparklesIcon;
