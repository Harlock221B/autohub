import React from 'react';

export default function AutoHubLogo({ className = "w-8 h-8", colorClass = "text-red-500" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Círculo de fundo/brilho */}
      <circle cx="12" cy="12" r="10" className="fill-red-500/10 dark:fill-red-500/20" />
      
      {/* Contorno principal do carro estilizado (Shield/Carro fundidos) */}
      <path 
        d="M4.5 10.5C4.5 9 6.5 6 9.5 5H14.5C17.5 6 19.5 9 19.5 10.5V16.5C19.5 17 19 17.5 18.5 17.5H17.5C17 17.5 16.5 17 16.5 16.5V15.5H7.5V16.5C7.5 17 7 17.5 6.5 17.5H5.5C5 17.5 4.5 17 4.5 16.5V10.5Z" 
        className={colorClass}
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Para-brisas / Janela */}
      <path 
        d="M6.5 10.5C7 8.5 8.5 7 12 7C15.5 7 17 8.5 17.5 10.5H6.5Z" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={colorClass}
      />
      
      {/* Faróis */}
      <path d="M7.5 13.5H8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={colorClass} />
      <path d="M15.5 13.5H16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={colorClass} />
      
      {/* Ponto central (HUB) */}
      <circle cx="12" cy="13.5" r="1.5" fill="currentColor" className={colorClass} />
    </svg>
  );
}

