"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext(): TabsContextValue {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value,
  onValueChange,
  className,
  children,
  ...props
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const activeTab = value ?? internalValue;

  const setActiveTab = React.useCallback(
    (id: string) => {
      if (onValueChange) {
        onValueChange(id);
      } else {
        setInternalValue(id);
      }
    },
    [onValueChange]
  );

  const contextValue = React.useMemo(
    () => ({ activeTab, setActiveTab }),
    [activeTab, setActiveTab]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn("flex flex-col gap-3", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};
Tabs.displayName = "Tabs";

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

const TabsList: React.FC<TabsListProps> = ({ className, ...props }) => (
  <div
    role="tablist"
    className={cn(
      "inline-flex items-center gap-1 rounded-xl bg-muted p-1",
      className
    )}
    {...props}
  />
);
TabsList.displayName = "TabsList";

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  className,
  children,
  ...props
}) => {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`tab-panel-${value}`}
      className={cn(
        "relative inline-flex min-h-[44px] items-center justify-center rounded-lg px-4 py-2 text-sm font-bold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        isActive
          ? "text-primary-foreground"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {isActive && (
        <motion.span
          layoutId="active-tab-pill"
          className="absolute inset-0 rounded-lg bg-primary shadow-sm"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
};
TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent: React.FC<TabsContentProps> = ({
  value,
  className,
  children,
}) => {
  const { activeTab } = useTabsContext();
  if (activeTab !== value) return null;

  return (
    <motion.div
      id={`tab-panel-${value}`}
      role="tabpanel"
      aria-labelledby={value}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("focus-visible:outline-none", className)}
    >
      {children}
    </motion.div>
  );
};
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
