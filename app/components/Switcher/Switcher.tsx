import React, { useState } from "react";
import type { ReactNode } from "react";
import { Tabbar } from "@telegram-apps/telegram-ui";

interface SwitcherProps {
  defaultActiveTab?: number;
  children: ReactNode;
  className?: string;
}

interface SwitcherItemProps {
  title: string;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

// Define the SwitcherItem component
const SwitcherItem: React.FC<SwitcherItemProps> = ({
  title,
  icon,
  label,
  selected,
  onClick,
  children,
}) => {
  // Only use the text prop if no custom label is provided
  // This prevents duplication of the title when custom content is used
  return (
    <Tabbar.Item
      selected={selected}
      onClick={onClick}
      text={label ? undefined : title}
      aria-label={title} // Keep title for accessibility
    >
      {icon || label}
    </Tabbar.Item>
  );
};

// Define the Switcher component with a proper type definition that includes the Item property
interface ISwitcher extends React.FC<SwitcherProps> {
  Item: React.FC<SwitcherItemProps>;
}

// Create the Switcher component
const Switcher: ISwitcher = ({
  defaultActiveTab = 0,
  children,
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  // Filter and get only SwitcherItem children
  const tabs = React.Children.toArray(children).filter(
    (child) =>
      React.isValidElement(child) &&
      (child as React.ReactElement).type === SwitcherItem
  );

  // Get the content of the active tab
  const activeContent = tabs[activeTab]
    ? React.isValidElement(tabs[activeTab])
      ? (tabs[activeTab] as React.ReactElement).props.children
      : null
    : null;

  // Render the Tabbar and content
  return (
    <div className="switcher-container">
      <div className="switcher-content">{activeContent}</div>
      <Tabbar className={className}>
        {tabs.map((tab, index) =>
          React.cloneElement(tab as React.ReactElement, {
            key: index,
            selected: activeTab === index,
            onClick: () => setActiveTab(index),
          })
        )}
      </Tabbar>
    </div>
  );
};

// Properly attach Item as a static property to Switcher
Switcher.Item = SwitcherItem;

export { Switcher };
export default Switcher;
