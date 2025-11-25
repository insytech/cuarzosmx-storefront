import { Label, RadioGroup, clx } from "@medusajs/ui"

type FilterRadioGroupProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: any
  handleChange: (...args: any[]) => void
  "data-testid"?: string
}

const FilterRadioGroup = ({
  title,
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: FilterRadioGroupProps) => {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-200">{title}</h4>
      <RadioGroup data-testid={dataTestId} onValueChange={handleChange}>
        <div className="flex flex-col gap-2">
          {items?.map((i) => (
            <div
              key={i.value}
              className="flex items-center"
            >
              <RadioGroup.Item
                checked={i.value === value}
                className="hidden peer"
                id={i.value}
                value={i.value}
              />
              <Label
                htmlFor={i.value}
                className={clx(
                  "flex items-center gap-2 text-sm cursor-pointer py-2 px-3 rounded-lg transition-all duration-200 w-full",
                  {
                    "bg-main-color text-white font-medium": i.value === value,
                    "text-gray-600 hover:bg-gray-100": i.value !== value,
                  }
                )}
                data-testid="radio-label"
                data-active={i.value === value}
              >
                <div className={clx(
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                  {
                    "border-white": i.value === value,
                    "border-gray-300": i.value !== value,
                  }
                )}>
                  {i.value === value && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                {i.label}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}

export default FilterRadioGroup
