import React from "react";
import { Select } from "antd";
import { useIntl } from "umi";
import styles from "./index.module.css";

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const intl = useIntl();
  const currentLocale = intl.locale;

  const handleLanguageChange = (value: string) => {
    // Save language preference to localStorage
    localStorage.setItem("selectedLanguage", value);
    // Reload page to apply language change
    window.location.search = `?locale=${value}`;
  };

  return (
    <Select
      value={currentLocale}
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
