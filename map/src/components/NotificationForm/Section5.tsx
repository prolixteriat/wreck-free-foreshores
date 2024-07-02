
import { getInputTextAreaClass, IFormSectionProps } from './funcs';
import { FormLabelError } from './common';

// -----------------------------------------------------------------------------

export function Section5(props: IFormSectionProps): React.JSX.Element {
  const { errors, formData, setFormData } = props;
  
    return (
      <div className='mb-4'>
         <h2 className='font-bold text-lg'>Other Information</h2>
        <p className='label-text text-right'><b>*</b>  Required</p>

        <div className='form-control'>
          <label className='label'  htmlFor='sect5_additional'>
              <span className='label-text font-bold'>Please add anything else that might be useful, but do not provide any personal information</span>
              <FormLabelError text={errors.additional} />
          </label>
          <textarea id='sect5_additional' 
              placeholder='Your answer' 
              className={getInputTextAreaClass(errors.additional)}
              defaultValue={formData.additional}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
              setFormData({ ...formData, additional: e.target.value})} />
        </div>
      </div>
    );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
