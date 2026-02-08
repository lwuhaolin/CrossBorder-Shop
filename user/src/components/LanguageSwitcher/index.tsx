import React from "react";
import { Select } from "antd";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (value: string) => {
    // Save language preference to localStorage
    localStorage.setItem("selectedLanguage", value);
    // Change language
    i18n.changeLanguage(value);
  };

  return (
    <Select
      value={i18n.language}
      onChange={handleLanguageChange}
      className={className || styles.switcher}
      style={{ width: 120 }}
      options={[
        { label: "中文", value: "zh-CN" },
        { label: "English", value: "en-US" },
      ]}
    />
  );
};

export default LanguageSwitcher;
