import React from "react";

interface SocialLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export const SocialLink: React.FC<SocialLinkProps> = ({ href, label, icon }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="hover:text-white hover:italic transition-all duration-150 cursor-pointer flex items-center justify-end gap-2 group"
    >
      <span>{label}</span>
      {icon}
    </a>
  );
};
