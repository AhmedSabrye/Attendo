interface SummaryCard {
  label: string;
  value: string;
  Icon: React.ElementType | null;
  bgColor: string;
  textColor: string;
}

export default function SummaryCards({ summaryCards }: { summaryCards: SummaryCard[] }) {
  return (
    <div className="grid grid-cols-4 gap-4">
            {summaryCards.map(({ label, value, Icon, bgColor, textColor }) => (
              <div key={label} className={`text-center p-3 ${bgColor} rounded-lg`}>
                <div className={`flex items-center justify-center gap-1 ${textColor} mb-1`}>
                  {Icon && <Icon className="text-lg" />}
                  <span className="font-semibold">{value}</span>
                </div>
                <p className="text-xs text-gray-600">{label}</p>
              </div>
            ))}
        </div>
  )
}
