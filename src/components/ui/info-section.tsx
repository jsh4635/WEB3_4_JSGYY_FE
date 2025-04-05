import { ReactNode } from "react";

import { H3, SmallText, Text } from "./typography";

interface InfoItemProps {
  label: string;
  value: string | number;
}

export function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="flex justify-between items-center">
      <SmallText className="text-gray-600">{label}</SmallText>
      <Text>{value}</Text>
    </div>
  );
}

interface InfoSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function InfoSection({
  title,
  children,
  className = "",
}: InfoSectionProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <H3 className="mb-4">{title}</H3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
