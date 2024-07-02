import { IFormSectionProps } from './funcs';
import { FormLabelError, CheckGroup } from './common';

// -----------------------------------------------------------------------------

const environmentalOptions: string[] = [
  'Fuel tanks',
  'Oil in engine',
  'Containers of paint or chemicals',
  'Netting or things wildlife could get caught in',
  'Degrading plastics',
  'Other (describe in Section 5)',
];

const safetyOptions: string[] = [
  'Boat unstable and could fall over',
  'Boat not properly secured',
  'Boat in poor condition and would be a risk to people boarding it',
  'Other (describe in Section 5)',
];

// -----------------------------------------------------------------------------

export function Section3(props: IFormSectionProps): React.JSX.Element {
  const { errors, formData, setFormData } = props;

  return (
    <div className='mb-4'>
      <h2 className='font-bold text-lg'>Hazards</h2>
      <p className='label-text text-right'><b>*</b>  Required</p>

      <div className='form-control'>
      <label className='label' htmlFor='sect3_environmental'>
        <span className='label-text font-bold'>Environmental hazards</span>
        <FormLabelError text={errors.environmental} />
      </label>
      <CheckGroup options={environmentalOptions} 
            group={'sect3_environmental'}
            defaultSelected={formData.environmental}
            onChange={(e: string[]) => 
            setFormData({ ...formData, environmental: e})} />
    </div>    

      <div className='form-control'>
        <label className='label' htmlFor='sect3_safety'>
          <span className='label-text font-bold'>Safety hazards</span>
          <FormLabelError text={errors.safety} />
        </label>
        <CheckGroup options={safetyOptions} 
            group={'sect3_safety'}
            defaultSelected={formData.safety}
            onChange={(e: string[]) => 
            setFormData({ ...formData, safety: e})} />
      </div>  
    </div>
  );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
