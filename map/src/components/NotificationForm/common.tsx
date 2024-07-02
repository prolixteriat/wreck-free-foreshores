import { useState } from 'react';

// -----------------------------------------------------------------------------

interface IButtonProps {
  text: string;
  onClick: () => void;
}
// -----------------  

export const FormButton = ({text, onClick}: IButtonProps): React.JSX.Element => {
  return (
    <button className='btn btn-primary' onClick={onClick}>
      {text}
    </button>
  );
}
// -----------------------------------------------------------------------------

interface ILabelProps {
  text?: string;
}
// -----------------  

export const FormLabelError = ({ text }: ILabelProps): React.JSX.Element => {
  return (
    <>
    {(text) ? 
      <span className='label-text text-red-500'>{text}</span> :
      null
    }
    </>
  );
}
// -----------------------------------------------------------------------------

interface ICheckGroupProps {
  group: string;
  options: string[];
  defaultSelected?: string[]; 
  onChange: (selectedValue: string[]) => void; 
}
// -----------------  

export function CheckGroup (props: ICheckGroupProps): React.JSX.Element {
  const { group, options, defaultSelected, onChange } = props;
  
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultSelected || []);

  const handleOptionChange = (value: string) => {
    let newSelectedValues = [];
    if (selectedValues.includes(value)) {
      newSelectedValues = selectedValues.filter(item => item !== value);
    } else {
      newSelectedValues = [...selectedValues, value];
    }
    setSelectedValues(newSelectedValues);
    onChange(newSelectedValues);
  };

  return (
    <div className='max-w bg-zinc-50 p-2 rounded-lg border'>
      {options.map((option, index) => (
        <div key={index} className='mb-1'>
        <label className='flex label-text items-center cursor-pointer' htmlFor={group + index.toString()}>
          <input
            type='checkbox'
            className='checkbox checkbox-sm checkbox-primary mr-2'
            id={group + index.toString()}
            name={group}
            value={option}
            checked={selectedValues.includes(option)}
            onChange={() => handleOptionChange(option)}
          />
          {option}
        </label>
        </div>
      ))}
    </div>
  );
}
// -----------------------------------------------------------------------------

interface IRadioGroupProps {
  group: string;
  options: string[];
  defaultSelected?: string; 
  onChange: (selectedValue: string) => void; 
}
// -----------------  

export function RadioGroup (props: IRadioGroupProps): React.JSX.Element {
  const { group, options, defaultSelected, onChange } = props;
  
  const [selectedValue, setSelectedValue] = useState<string>(defaultSelected || '');

  const handleOptionChange = (value: string) => {
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <div className='max-w bg-zinc-50 p-2 rounded-lg border'>
      {options.map((option, index) => (
        <div key={index} className='mb-1'>
        <label className='flex label-text items-center cursor-pointer' htmlFor={group + index.toString()}>
          <input
            type='radio'
            className='radio radio-sm radio-primary mr-2'
            id={group + index.toString()}
            name={group}
            value={option}
            checked={selectedValue === option}
            onChange={() => handleOptionChange(option)}
          />
          {option}
        </label>
        </div>
      ))}
    </div>
  );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
