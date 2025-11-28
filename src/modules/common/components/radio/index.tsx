const Radio = ({ checked, 'data-testid': dataTestId }: { checked: boolean, 'data-testid'?: string }) => {
  return (
    <>
      <button
        type="button"
        role="radio"
        aria-checked="true"
        data-state={checked ? "checked" : "unchecked"}
        className="group relative flex h-5 w-5 items-center justify-center outline-none"
        data-testid={dataTestId || 'radio-button'}
      >
        <div className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 transition-all ${checked ? 'border-main-color bg-main-color' : 'border-gray-300 bg-white group-hover:border-main-color/50'}`}>
          {checked && (
            <span
              data-state={checked ? "checked" : "unchecked"}
              className="group flex items-center justify-center"
            >
              <div className="bg-white rounded-full h-1.5 w-1.5" />
            </span>
          )}
        </div>
      </button>
    </>
  )
}

export default Radio
