// components/AnimatedMenuButton.tsx


import React from 'react';

interface AnimatedMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MenuButton: React.FC<AnimatedMenuButtonProps> = ({ isOpen, onToggle }) => {
  const genericHamburgerLine = `h-1 w-8 my-1 rounded-full bg-gray-900 dark:bg-white transition ease transform duration-300`;

  return (
    <button
      className="flex cursor-pointer flex-col h-12 w-12 justify-center items-center group"
      onClick={onToggle}
      aria-label="Toggle menu"
    >
      <div
        className={`${genericHamburgerLine} ${
          isOpen ? 'rotate-45 translate-y-3 opacity-50 group-hover:opacity-100' : 'group-hover:opacity-100'
        }`}
      />
      <div
        className={`${genericHamburgerLine} ${
          isOpen ? 'opacity-0' : 'group-hover:opacity-100'
        }`}
      />
      <div
        className={`${genericHamburgerLine} ${
          isOpen ? '-rotate-45 -translate-y-3 opacity-50 group-hover:opacity-100' : 'group-hover:opacity-100'
        }`}
      />
    </button>
  );
};

export default MenuButton;