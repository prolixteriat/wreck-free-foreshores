import { getInputTextClass, IFormSectionProps } from './funcs';
import { FormLabelError, RadioGroup } from './common';

// -----------------------------------------------------------------------------

const sortOptions: string[] = [
  'Canoe or small personal watercraft',
  'Sailing dingy, tender, punt, small outboard boat',
  'Yacht - fin keel',
  'Yacht - bilge/twin keels',
  'Yacht - long keel',
  'Trimaran or catarmaran',
  'Motor yacht',
  'Fishing boat',
  'Other (describe in Section 5)',
];

const hullOptions: string[] = [
  'Fibreglass/GRP',
  'Wood',
  'Steel',
  'Aluminium',
  'Plastic',
  'Other (describe in Section 5)',
];

const engineOptions: string[] = [
  'No engine',
  'Inboard engine',
  'Outboard engine',
];

// -----------------------------------------------------------------------------

export function Section2(props: IFormSectionProps): React.JSX.Element {
  const { errors, formData, setFormData } = props;
  
  return (
    <div className='mb-4'>
      <h2 className='font-bold text-lg'>Vessel Details</h2>
      <p className='label-text text-right'><b>*</b>  Required</p>

      <div className='form-control'>
        <label className='label'  htmlFor='sect2_name'>
          <span className='label-text font-bold'>Name, if known</span>
          <FormLabelError text={errors.name} />
        </label>
        <input type='text' id='sect1_name' 
              placeholder='Your answer' 
              className={getInputTextClass(errors.name)}
              defaultValue={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setFormData({ ...formData, name: e.target.value})} />
      </div>

      <div className='form-control'>
        <label className='label'  htmlFor='sect2_make'>
          <span className='label-text font-bold'>Make and model, if known</span>
          <FormLabelError text={errors.make} />
        </label>
        <input type='text' id='sect2_make' 
              placeholder='Your answer' 
              className={getInputTextClass(errors.make)}
              defaultValue={formData.make}
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setFormData({ ...formData, make: e.target.value})} />
      </div>

      <div className='form-control'>
        <label className='label'  htmlFor='sect2_length'>
          <span className='label-text font-bold'>Length (feet) <b>*</b></span>
          <FormLabelError text={errors.length} />
        </label>
        <input type='number' id='sect2_length' 
              placeholder='Your answer' 
              className={getInputTextClass(errors.length)}
              defaultValue={formData.length}
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setFormData({ ...formData, length: e.target.value})} />
      </div>      

      <div className='form-control'>
        <label className='label' htmlFor='sect2_sort'>
          <span className='label-text font-bold'>What sort of boat is it? <b>*</b></span>
          <FormLabelError text={errors.sort} />
        </label>
        <RadioGroup options={sortOptions} 
              group={'sect2_sort'}
              defaultSelected={formData.sort}
              onChange={(e: string) => 
                        setFormData({ ...formData, sort: e})} />
      </div>    

      <div className='form-control'>
        <label className='label' htmlFor='sect2_hull'>
          <span className='label-text font-bold'>What is the hull of the boat made of? <b>*</b></span>
          <FormLabelError text={errors.hull} />
        </label>
        <RadioGroup options={hullOptions} 
              group={'sect2_hull'}
              defaultSelected={formData.hull}
              onChange={(e: string) => 
                        setFormData({ ...formData, hull: e})} />
      </div>    

      <div className='form-control'>
        <label className='label' htmlFor='sect2_engine'>
          <span className='label-text font-bold'>Does it have an engine? <b>*</b></span>
          <FormLabelError text={errors.engine} />
        </label>
        <RadioGroup options={engineOptions} 
              group={'sect2_engine'}
              defaultSelected={formData.engine}
              onChange={(e: string) => 
                        setFormData({ ...formData, engine: e})} />
      </div>  
           
  </div>
  );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
