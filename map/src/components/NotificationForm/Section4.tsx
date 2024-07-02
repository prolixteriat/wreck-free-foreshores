import { IFormSectionProps } from './funcs';
import { FormLabelError, RadioGroup } from './common';

// -----------------------------------------------------------------------------

const positionOptions: string[] = [
  'Foreshore - above high water springs mark',
  'Foreshore - below high water springs mark',
  'On dry land',
];

const floatOptions: string[] = [
  'Yes',
  'No',
  'Maybe',
];

const conditionOptions: string[] = [
  'It could probably float and be towed away',
  'It could probably float with buoyancy bags and be towed away',
  'Total wreck - will need to be dismantled in place',
  'Could be removed by land',
  'Other (describe in Section 5)',
];

// -----------------------------------------------------------------------------

export function Section4(props: IFormSectionProps): React.JSX.Element {
  const { errors, formData, setFormData } = props;
  
  return (
    <div className='mb-4'>
      <h2 className='font-bold text-lg'>Hazards</h2>
      <p className='label-text text-right'><b>*</b>  Required</p>

      <div className='form-control'>
        <label className='label' htmlFor='sect4_position'>
          <span className='label-text font-bold'>Position of the vessel <b>*</b></span>
          <FormLabelError text={errors.position} />
        </label>
        <RadioGroup options={positionOptions} 
              group={'sect4_position'}
              defaultSelected={formData.position}
              onChange={(e: string) => 
              setFormData({ ...formData, position: e})} />
      </div>    

      <div className='form-control'>
        <label className='label' htmlFor='sect4_float'>
          <span className='label-text font-bold'>Does the vessel float? <b>*</b></span>
          <FormLabelError text={errors.floating} />
        </label>
        <RadioGroup options={floatOptions} 
              group={'sect4_float'}
              defaultSelected={formData.floating}
              onChange={(e: string) => 
              setFormData({ ...formData, floating: e})} />
      </div>    

      <div className='form-control'>
        <label className='label' htmlFor='sect4_condition'>
          <span className='label-text font-bold'>Condition of the vessel <b>*</b></span>
          <FormLabelError text={errors.vessel_condition} />
        </label>
        <RadioGroup options={conditionOptions} 
              group={'sect4_condition'}
              defaultSelected={formData.vessel_condition}
              onChange={(e: string) => 
              setFormData({ ...formData, vessel_condition: e})} />
      </div>                
    </div>
  );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
